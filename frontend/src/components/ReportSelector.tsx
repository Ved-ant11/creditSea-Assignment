import type { Report } from "../types";
import React from "react";
interface Props {
  reports: Report[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const formatDate = (value: string) =>
  new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const ReportSelector = ({ reports, selectedId, onSelect }: Props) => {
  if (reports.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
        No reports yet. Upload an Experian XML file to generate the first one.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {reports.map((report) => {
        const isSelected = report._id === selectedId;
        return (
          <button
            key={report._id}
            onClick={() => onSelect(report._id)}
            className={`flex-1 min-w-[220px] rounded-lg border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              isSelected
                ? "border-sky-500 bg-sky-50 text-sky-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-sky-200"
            }`}
            type="button"
          >
            <p className="text-sm font-semibold">
              {report.basicDetails.name || "Unnamed applicant"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Uploaded {formatDate(report.createdAt)}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default ReportSelector;
