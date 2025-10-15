# CreditSea Soft Credit Pull Dashboard

This project implements the CreditSea full-stack assignment using the MERN stack. It processes Experian soft credit pull XML files, persists the extracted insights in MongoDB, and serves a React dashboard for review.

## Architecture Overview

- **Backend** (`backend/`): Node.js + Express API that accepts XML uploads, parses Experian CAIS reports, and stores normalized documents in MongoDB.
- **Database**: MongoDB collection `reports` managed through Mongoose. Each report embeds the structured credit summary plus the original XML string for auditability.
- **Frontend** (`frontend/`): React + Vite single-page app. Users can upload XML files, browse stored reports, and view breakdowns for basic details, summary metrics, and credit account insights.
- **Samples** (`samples/`): Contains the provided Experian XML fixtures for local testing.

## Backend

### Key Endpoints

| Method | Path                  | Description                                                                                           |
| ------ | --------------------- | ----------------------------------------------------------------------------------------------------- |
| `POST` | `/api/reports/upload` | Accepts a single Experian XML file (`file` field), parses the payload, and saves a report document.   |
| `GET`  | `/api/reports`        | Returns paginated reports sorted by newest first. Query params: `page`, `limit` (default 10, max 50). |
| `GET`  | `/api/reports/:id`    | Fetches a single report by MongoDB id.                                                                |

### Data Model

`Report` documents store:

- `basicDetails`: Name, mobile phone, PAN, and credit score.
- `summary`: Totals for accounts, balances, secured/unsecured exposure, and recent credit enquiries.
- `creditAccounts`: One entry per CAIS account with product labels, bank, address, account number, overdue/current balances, status, and a `isCreditCard` flag.
- `raw`: Original XML string for reference.

### Running the Backend

```bash
cd backend
npm install
cp .env.example .env   # adjust MONGODB_URI if needed
npm run dev             # starts on http://localhost:5000 by default
```

Tests (Jest + Supertest):

```bash
npm test
```

## Frontend

The React application offers:

- Drag-and-drop style XML uploader with progress feedback.
- Report selector listing recent uploads.
- Sections for basic applicant details, summary metrics, and a credit accounts table (highlighting credit cards when present).

### Running the Frontend

```bash
cd frontend
npm install
npm run dev             # starts Vite dev server on http://localhost:5173
```

Environment variables:

- `VITE_API_BASE_URL` (optional): Backend base URL. Defaults to `http://localhost:5000` through the Vite dev proxy.

Tests (Vitest + RTL):

```bash
npm test
```

### Build

```bash
npm run build
```

## Development Notes

- **XML Parsing**: `backend/src/services/experianParser.js` normalizes the CAIS structure (handles arrays/singletons, cleans text, classifies account types) and returns a typed payload for persistence.
- **Schema decisions**: The `Report` schema embeds credit accounts for fast reads while indexing `basicDetails.pan` for quick applicant lookups. Source XML is stored verbatim in `raw` to simplify audits and reprocessing.
- **Error handling**: Uploads validate file type/size, return structured error messages, and log failures server-side.
- **UI Styling**: Tailwind CSS powers layout/typography. Components live under `frontend/src/components` and are tested with Vitest.

## Sample Workflow

1. Start MongoDB locally (`mongod`).
2. Run the backend (`npm run dev` in `backend/`).
3. Run the frontend (`npm run dev` in `frontend/`).
4. Visit `http://localhost:5173`, upload `samples/Sagar_Ugle1.xml`, and inspect the rendered report.

## Project Scripts Summary

| Location   | Command         | Purpose                                |
| ---------- | --------------- | -------------------------------------- |
| `backend`  | `npm run dev`   | Start Express server with Nodemon      |
| `backend`  | `npm run start` | Start Express server (production mode) |
| `backend`  | `npm test`      | Execute Jest parser tests              |
| `frontend` | `npm run dev`   | Start Vite dev server                  |
| `frontend` | `npm run build` | Build production assets                |
| `frontend` | `npm test`      | Run Vitest component tests             |

## Future Enhancements

- Add authentication & multi-tenant controls.
- Surface additional CAIS metrics (DPD history, secured vs unsecured trends).
- Implement background job reprocessing and same-file deduplication.

---

For any clarifications or suggested improvements, feel free to reach out.
