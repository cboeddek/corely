## Corely – Digital Bookkeeping Assistant (MVP)

Corely is a prototype **digital bookkeeping assistant** for creative solo entrepreneurs. It as created in the course of an academic internship in cooperation with CSE. 
The main focus of this MVP is a smooth **receipt upload** flow with **automatic OCR** using Azure Document Intelligence.

---

### What the App Does

- **Receipt upload** for PDF / image files (**“Beleg hochladen”**)
- Sends receipts to a Python backend that uses **Azure Document Intelligence**
- Extracts:
  - Vendor, date, totals (gross/net/VAT)
  - Line items (description, net amounts, VAT rate)
- Shows results in a clean React / Next.js UI (Dashboard, Belege overview)

---

### Tech Stack (Short)

- **Frontend**: Next.js (React, App Router), Tailwind-style UI
- **Backend**: Python, FastAPI, Uvicorn
- **OCR**: Azure AI Document Intelligence 

---

### 1. Start the Backend (OCR API)

1. In a terminal:

   ```bash
   cd corely/backend
   python -m venv .venv
   source .venv/bin/activate        # macOS/Linux
   # .venv\Scripts\activate         # Windows
   pip install -r requirements.txt
   ```

2. Create `backend/.env`:

   ```bash
   AZURE_DOCINTEL_ENDPOINT=YOUR_ENDPOINT
   AZURE_DOCINTEL_KEY=YOUR_KEY
   ```

   The concrete endpoint and key can be provided on request.

3. Start the API:

   ```bash
   uvicorn main:app --reload --port 8000
   ```

   OCR endpoint: `POST http://localhost:8000/analyze`

---

### 2. Start the Frontend (Web App)

1. In another terminal:

   ```bash
   cd corely/frontend
   npm install
   ```

2. Create `frontend/.env.local`:

   ```bash
   PY_OCR_URL=http://localhost:8000/analyze
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

   App URL: `http://localhost:3000`


