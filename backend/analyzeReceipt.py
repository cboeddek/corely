# extract_mvp.py
import os, json, uuid, pathlib, mimetypes, datetime as dt
from typing import Any, Dict, List, Optional
from dotenv import load_dotenv, find_dotenv
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient

# --- Setup ---
load_dotenv(find_dotenv())
ENDPOINT = os.getenv("AZURE_DOCINTEL_ENDPOINT")
KEY = os.getenv("AZURE_DOCINTEL_KEY")
if not ENDPOINT or not KEY:
    raise RuntimeError("Missing AZURE_DOCINTEL_ENDPOINT or AZURE_DOCINTEL_KEY in .env")

client = DocumentIntelligenceClient(endpoint=ENDPOINT, credential=AzureKeyCredential(KEY))

# --- Helpers to read DocumentField safely ---
def df_val(df) -> Any:
    """Return a sensible Python value from a DocumentField (scalar/currency) or fallback to content."""
    if not df:
        return None
    for attr in ("value_string","value_number","value_integer","value_date","value_boolean"):
        v = getattr(df, attr, None)
        if v is not None:
            if attr == "value_date":
                return v.isoformat()
            return v
    cur = getattr(df, "value_currency", None)
    if cur is not None:
        return cur.amount
    return getattr(df, "content", None)



# --- Helpers to read DocumentField safely ---
def df_object(df) -> Optional[Dict[str, Any]]:
    return getattr(df, "value_object", None) if df else None

def df_array(df) -> Optional[List[Any]]:
    return getattr(df, "value_array", None) if df else None

# --- Normalizer to MVP fields ---
def normalize_invoice_mvp(doc, source_json: Dict[str, Any], original_filename: str) -> Dict[str, Any]:
    """Map Azure 'prebuilt-invoice' result into your MVP schema (facts-only)."""
    f = doc.fields  # dict[str, DocumentField]

    # Parties (seller/buyer)
    seller_name = df_val(f.get("VendorName"))
    seller_addr = df_val(f.get("VendorAddress"))
    seller_vatid = df_val(f.get("VendorTaxId"))  # EU VAT ID if present
    buyer_name = df_val(f.get("CustomerName"))
    buyer_addr = df_val(f.get("CustomerAddress"))

    # Amounts, dates
    issue_date = df_val(f.get("InvoiceDate"))
    service_start = df_val(f.get("ServiceStartDate"))
    service_end = df_val(f.get("ServiceEndDate"))
    # Choose a single service_date if both are present
    service_date = service_start or service_end
    total_gross = df_val(f.get("InvoiceTotal"))
    total_vat = df_val(f.get("TotalTax"))
    subtotal_net = df_val(f.get("SubTotal"))
    # Currency: try InvoiceTotal currency first
    currency = None
    total_field = f.get("InvoiceTotal")
    if total_field and getattr(total_field, "value_currency", None):
        currency = total_field.value_currency.currency_code

    # VAT breakdown:
    vat_breakdown = []
    tax_details = f.get("TaxDetails")
    if tax_details and df_array(tax_details):
        for td in tax_details.value_array:
            obj = df_object(td) or {}
            rate = df_val(obj.get("TaxRate"))
            amount = df_val(obj.get("Amount"))
            # If we have subtotal, we can approximate net per rate (optional)
            vat_breakdown.append({
                "rate": rate,
                "net": None,
                "vat": amount,
                "gross": None
            })

    # Lines (if present)
    lines = []
    items = f.get("Items")
    if items and df_array(items):
        for it in items.value_array:
            obj = df_object(it) or {}
            lines.append({
                "description": df_val(obj.get("Description")),
                "quantity": df_val(obj.get("Quantity")),
                "unit": df_val(obj.get("Unit")),
                "unit_price": df_val(obj.get("UnitPrice")),
                "net": df_val(obj.get("Amount")) if df_val(obj.get("Amount")) is not None else None,
                "vat": df_val(obj.get("Tax")),       # may be None if not per-line
                "gross": None,                       # often not provided per-line
                "vat_rate": df_val(obj.get("TaxRate"))
            })

    # Extraction confidence: simple average of available field confidences
    confidences = []
    for name, field in f.items():
        c = getattr(field, "confidence", None)
        if isinstance(c, float):
            confidences.append(c)
    extraction_conf = round(sum(confidences) / len(confidences), 3) if confidences else None

    # Country: not reliably separate in model; keep None or infer later
    seller_country = None

    # Build record
    record = {
        "doc_id": str(uuid.uuid4()),
        "doc_type": "INVOICE",
        "issue_date": issue_date,
        "service_date": service_date,
        "currency": currency,                 # e.g., "EUR" or None
        "original_filename": original_filename,
        "source_json": source_json,
        "extraction_confidence": extraction_conf,

        "seller": {
            "name": seller_name,
            "address": seller_addr,
            "country": seller_country,
            "vat_id": seller_vatid
        },
        "buyer": {
            "name": buyer_name,
            "address": buyer_addr
        },

        "totals": {
            "gross": total_gross,
            "net": subtotal_net,
            "vat": total_vat
        },

        "vat_breakdown": vat_breakdown,
        "lines": lines
    }
    return record

# --- Runner: analyze a local file and write /out/<name>.json ---
def analyze_local_invoice_to_json(path: str, out_dir: str = "out") -> str:
    path_obj = pathlib.Path(path)
    if not path_obj.exists():
        raise FileNotFoundError(f"File not found: {path}")
    content_type, _ = mimetypes.guess_type(path_obj.name)
    if not content_type:
        # default to PDF; adjust if you pass images
        content_type = "application/pdf"

    with open(path_obj, "rb") as f:
        poller = client.begin_analyze_document(
            "prebuilt-invoice",
            body=f,  # for your SDK version, use 'body=' for local bytes
            content_type=content_type,
        )
    result = poller.result()

    if not result.documents:
        raise RuntimeError("Azure did not return any documents for this file.")

    doc = result.documents[0]
    source = {
        "model_id": result.model_id if hasattr(result, "model_id") else "prebuilt-invoice",
        "fields_present": list(doc.fields.keys()),
        "api_version": getattr(result, "api_version", None),
    }
    mvp = normalize_invoice_mvp(doc, source_json=source, original_filename=path_obj.name)

    # write out
    pathlib.Path(out_dir).mkdir(parents=True, exist_ok=True)
    out_path = pathlib.Path(out_dir) / f"{path_obj.stem}.json"
    with open(out_path, "w", encoding="utf-8") as w:
        json.dump(mvp, w, ensure_ascii=False, indent=2, default=str)

    return str(out_path)



# --- CLI test ---
if __name__ == "__main__":
    # Change this to your local file path
    INPUT_FILE = "invoices_raw/Rechnung_Kundennr_00000041_Rechnungsnr_007908.PDF"
    out_file = analyze_local_invoice_to_json(INPUT_FILE, out_dir="out")
    print(f"Saved MVP JSON → {out_file}")
