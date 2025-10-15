import type { CreditAccount } from "../types";
import React from "react";
interface Props {
  accounts: CreditAccount[];
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const AccountsTable = ({ accounts }: Props) => {
  const creditCardAccounts = accounts.filter((account) => account.isCreditCard);
  const rows = creditCardAccounts.length > 0 ? creditCardAccounts : accounts;

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Credit Accounts
          </h2>
          <p className="text-sm text-slate-500">
            Showing {creditCardAccounts.length || accounts.length} account(s)
          </p>
        </div>
      </header>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">
          No credit accounts could be extracted from this report.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Bank
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Account Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Amount Overdue
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Current Balance
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.map((account) => (
                <tr key={account.accountNumber} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">
                    {account.product}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                    {account.bank || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                    {account.accountNumber || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {account.address || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-amber-600">
                    {currencyFormatter.format(account.amountOverdue)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-slate-900">
                    {currencyFormatter.format(account.currentBalance)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                    {account.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AccountsTable;
