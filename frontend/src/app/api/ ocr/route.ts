import { NextRequest, NextResponse } from "next/server";

const PY_URL = process.env.PY_OCR_URL || "http://localhost:8000/analyze";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ ok: false, error: "missing file" }, { status: 400 });

  const pyForm = new FormData();
  pyForm.append("file", file, file.name);

  const res = await fetch(PY_URL, { method: "POST", body: pyForm });
  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}