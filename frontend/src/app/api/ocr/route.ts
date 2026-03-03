import { NextRequest, NextResponse } from "next/server";

const PY_URL = process.env.PY_OCR_URL || "http://localhost:8000/analyze";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ ok: false, error: "missing file" }, { status: 400 });
  }

  const pyForm = new FormData();
  pyForm.append("file", file, file.name);

  try {
    const res = await fetch(PY_URL, { method: "POST", body: pyForm });
    const data = await res.json();

    if (!res.ok) {
      const errorMessage =
        (data && (data.detail || data.error)) || `Upstream OCR error (${res.status})`;
      return NextResponse.json({ ok: false, error: errorMessage }, { status: res.status });
    }

    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Unexpected error calling OCR service" },
      { status: 500 },
    );
  }
}