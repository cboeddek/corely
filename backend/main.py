from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile, shutil, json, os, pathlib

from analyzeReceipt import analyze_local_invoice_to_json  # reuses your Azure logic

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing filename")

    suffix = pathlib.Path(file.filename).suffix or ".pdf"

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        out_path = analyze_local_invoice_to_json(tmp_path, out_dir="out")
        with open(out_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    finally:
        try:
            os.remove(tmp_path)
        except OSError:
            pass