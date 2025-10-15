export interface BasicDetails {
  name: string;
  mobilePhone: string;
  pan: string;
  creditScore: number | null;
}

export interface Summary {
  totalAccounts: number;
  activeAccounts: number;
  closedAccounts: number;
  currentBalanceAmount: number;
  securedAccountsAmount: number;
  unsecuredAccountsAmount: number;
  last7DaysCreditEnquiries: number;
}

export interface CreditAccount {
  product: string;
  bank: string;
  accountNumber: string;
  address: string;
  amountOverdue: number;
  currentBalance: number;
  status: string;
  isCreditCard: boolean;
}

export interface Report {
  _id: string;
  basicDetails: BasicDetails;
  summary: Summary;
  creditAccounts: CreditAccount[];
  createdAt: string;
}

export interface PaginatedResponse {
  data: Report[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
