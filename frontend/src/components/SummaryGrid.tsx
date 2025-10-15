import type { Summary } from "../types";
import React from "react";
interface Props {
  summary: Summary;
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-IN").format(value);

const SummaryGrid = ({ summary }: Props) => {
  const items = [
    {
      label: "Total Accounts",
      value: formatNumber(summary.totalAccounts),
    },
    {
      label: "Active Accounts",
      value: formatNumber(summary.activeAccounts),
    },
    {
      label: "Closed Accounts",
      value: formatNumber(summary.closedAccounts),
    },
    {
      label: "Current Balance",
      value: currencyFormatter.format(summary.currentBalanceAmount),
    },
    {
      label: "Secured Exposure",
      value: currencyFormatter.format(summary.securedAccountsAmount),
    },
    {
      label: "Unsecured Exposure",
      value: currencyFormatter.format(summary.unsecuredAccountsAmount),
    },
    {
      label: "Last 7 Days Enquiries",
      value: formatNumber(summary.last7DaysCreditEnquiries),
    },
  ];

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">
        Report Summary
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.label}
            className="rounded-lg border border-slate-200 p-4"
          >
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {item.label}
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-900">
              {item.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default SummaryGrid;
