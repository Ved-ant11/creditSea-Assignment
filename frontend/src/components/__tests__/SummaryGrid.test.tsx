import { render, screen } from "@testing-library/react";
import React from "react";
import SummaryGrid from "../SummaryGrid";
import type { Summary } from "../../types";

describe("SummaryGrid", () => {
  const summary: Summary = {
    totalAccounts: 4,
    activeAccounts: 3,
    closedAccounts: 1,
    currentBalanceAmount: 245000,
    securedAccountsAmount: 85000,
    unsecuredAccountsAmount: 160000,
    last7DaysCreditEnquiries: 0,
  };

  it("renders summary metrics", () => {
    render(<SummaryGrid summary={summary} />);

    expect(screen.getByText(/Total Accounts/i)).toBeInTheDocument();
    expect(screen.getByText(/4/)).toBeInTheDocument();
    expect(screen.getByText(/Current Balance/i)).toBeInTheDocument();
  });
});
