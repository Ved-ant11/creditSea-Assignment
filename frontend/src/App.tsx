import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchReports, uploadXml } from "./api";
import AccountsTable from "./components/AccountsTable";
import BasicDetailsSection from "./components/BasicDetailsSection";
import ReportSelector from "./components/ReportSelector";
import SummaryGrid from "./components/SummaryGrid";
import UploadForm from "./components/UploadForm";
import type { Report } from "./types";

const App = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const loadReports = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      try {
        const payload = await fetchReports(signal);
        setReports(payload.data);
        if (
          payload.data.length &&
          !payload.data.find((item) => item._id === selectedId)
        ) {
          setSelectedId(payload.data[0]._id);
        }
        setError(null);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message || "Unable to load reports");
        }
      } finally {
        setLoading(false);
      }
    },
    [selectedId]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadReports(controller.signal);
    return () => controller.abort();
  }, [loadReports]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      await uploadXml(file);
      setToast("Report uploaded successfully");
      setError(null);
      await loadReports();
      window.setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setError((err as Error).message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const selectedReport = useMemo(
    () => reports.find((report: Report) => report._id === selectedId) ?? null,
    [reports, selectedId]
  );

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              CreditSea Soft Pull Reports
            </h1>
            <p className="text-sm text-slate-500">
              Upload Experian XML and review credit insights instantly.
            </p>
          </div>
          <div className="w-full max-w-sm">
            <UploadForm onUpload={handleUpload} uploading={uploading} />
          </div>
        </div>
      </header>

      <main className="mx-auto mt-8 flex max-w-6xl flex-col gap-8 px-6">
        {toast && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {toast}
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {error}
          </div>
        )}

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Reports</h2>
            {loading && (
              <span className="text-sm text-slate-500">Loading...</span>
            )}
          </div>
          <ReportSelector
            reports={reports}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </section>

        {selectedReport && (
          <>
            <BasicDetailsSection details={selectedReport.basicDetails} />
            <SummaryGrid summary={selectedReport.summary} />
            <AccountsTable accounts={selectedReport.creditAccounts} />
          </>
        )}
      </main>
    </div>
  );
};

export default App;
