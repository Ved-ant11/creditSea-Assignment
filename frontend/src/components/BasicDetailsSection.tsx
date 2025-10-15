import type { BasicDetails } from "../types";
import React from "react";
interface Props {
  details: BasicDetails;
}

const BasicDetailsSection = ({ details }: Props) => (
  <section className="rounded-xl bg-white p-6 shadow-sm">
    <header className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-slate-900">Basic Details</h2>
      {details.creditScore !== null && (
        <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
          Credit Score: {details.creditScore}
        </span>
      )}
    </header>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article className="rounded-lg border border-slate-200 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">Name</p>
        <p className="mt-2 text-lg font-medium text-slate-900">
          {details.name || "—"}
        </p>
      </article>
      <article className="rounded-lg border border-slate-200 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">Mobile</p>
        <p className="mt-2 text-lg font-medium text-slate-900">
          {details.mobilePhone || "—"}
        </p>
      </article>
      <article className="rounded-lg border border-slate-200 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">PAN</p>
        <p className="mt-2 text-lg font-medium text-slate-900">
          {details.pan || "—"}
        </p>
      </article>
      <article className="rounded-lg border border-slate-200 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Credit Score
        </p>
        <p className="mt-2 text-lg font-medium text-slate-900">
          {details.creditScore !== null ? details.creditScore : "Unavailable"}
        </p>
      </article>
    </div>
  </section>
);

export default BasicDetailsSection;
