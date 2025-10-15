const { parseStringPromise } = require("xml2js");
const { toNumber, cleanText, asArray } = require("../utils/parsers");

const ACCOUNT_TYPE_LABELS = {
  "01": "Auto Loan",
  "02": "Mortgage",
  10: "Credit Card",
  11: "Charge Card",
  12: "Corporate Card",
  13: "Retail Credit Card",
  30: "Personal Loan",
  51: "Personal Loan",
  52: "Personal Loan",
  53: "Personal Loan",
  71: "Secured Loan",
};

const CREDIT_CARD_CODES = new Set(["10", "11", "12", "13"]);

const ACCOUNT_STATUS_LABELS = {
  0: "Not Reported",
  11: "Active",
  13: "Closed",
  53: "Suit Filed",
  71: "Written Off",
};

const pickFirstValue = (...values) => {
  for (const value of values) {
    if (
      value !== undefined &&
      value !== null &&
      String(value).trim().length > 0
    ) {
      return value;
    }
  }
  return "";
};

const toTitleCase = (value) => {
  const text = cleanText(value);
  if (!text) {
    return "";
  }

  return text
    .split(" ")
    .filter(Boolean)
    .map(
      (segment) =>
        segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()
    )
    .join(" ");
};

const buildAddress = (addressNode = {}) => {
  const parts = [
    addressNode.First_Line_Of_Address_non_normalized,
    addressNode.Second_Line_Of_Address_non_normalized,
    addressNode.Third_Line_Of_Address_non_normalized,
    addressNode.City_non_normalized,
    addressNode.State_non_normalized,
    addressNode.ZIP_Postal_Code_non_normalized,
  ]
    .map(cleanText)
    .filter(Boolean);

  return parts.join(", ");
};

const extractPan = (accounts) => {
  for (const account of accounts) {
    const holder = account.CAIS_Holder_Details || {};
    const idDetails = asArray(account.CAIS_Holder_ID_Details);

    const pan = pickFirstValue(
      holder.Income_TAX_PAN,
      ...idDetails.map((item) => item.Income_TAX_PAN)
    );
    if (cleanText(pan)) {
      return cleanText(pan).toUpperCase();
    }
  }
  return "";
};

const extractName = (applicantDetails, accounts) => {
  const primaryAccount = accounts[0] || {};
  const holder = primaryAccount.CAIS_Holder_Details || {};

  const segments = [
    pickFirstValue(
      applicantDetails.First_Name,
      holder.First_Name_Non_Normalized
    ),
    pickFirstValue(
      applicantDetails.Middle_Name1,
      holder.Middle_Name_1_Non_Normalized
    ),
    pickFirstValue(applicantDetails.Last_Name, holder.Surname_Non_Normalized),
  ]
    .map(toTitleCase)
    .filter(Boolean);

  return segments.join(" ");
};

const extractPhone = (applicantDetails, accounts) => {
  const applicantPhone = cleanText(applicantDetails.MobilePhoneNumber);
  if (applicantPhone) {
    return applicantPhone;
  }

  for (const account of accounts) {
    const phoneDetails = account.CAIS_Holder_Phone_Details || {};
    const phone = pickFirstValue(
      phoneDetails.Mobile_Telephone_Number,
      phoneDetails.Telephone_Number,
      phoneDetails.Telephone_Extension
    );
    if (cleanText(phone)) {
      return cleanText(phone);
    }
  }
  return "";
};

const extractCreditScore = (scoreNode) => {
  const score = toNumber(scoreNode?.BureauScore);
  return score > 0 ? score : null;
};

const mapAccount = (account) => {
  const accountType = cleanText(account.Account_Type);
  const statusCode = cleanText(account.Account_Status);

  const product = ACCOUNT_TYPE_LABELS[accountType] || "Credit Facility";
  const isCreditCard =
    CREDIT_CARD_CODES.has(accountType) ||
    cleanText(account.Portfolio_Type) === "R";

  return {
    product,
    bank: cleanText(account.Subscriber_Name),
    accountNumber: cleanText(account.Account_Number),
    address: buildAddress(account.CAIS_Holder_Address_Details),
    amountOverdue: toNumber(account.Amount_Past_Due),
    currentBalance: toNumber(account.Current_Balance),
    status: ACCOUNT_STATUS_LABELS[statusCode] || "Unknown",
    isCreditCard,
  };
};

const extractSummary = (summaryNode, capsNode) => {
  const creditAccountNode = summaryNode?.Credit_Account || {};
  const outstandingNode = summaryNode?.Total_Outstanding_Balance || {};

  const totalCaps = capsNode?.TotalCAPSLast7Days ?? capsNode?.CAPSLast7Days;

  return {
    totalAccounts: toNumber(creditAccountNode.CreditAccountTotal),
    activeAccounts: toNumber(creditAccountNode.CreditAccountActive),
    closedAccounts: toNumber(creditAccountNode.CreditAccountClosed),
    currentBalanceAmount: toNumber(outstandingNode.Outstanding_Balance_All),
    securedAccountsAmount: toNumber(
      outstandingNode.Outstanding_Balance_Secured
    ),
    unsecuredAccountsAmount: toNumber(
      outstandingNode.Outstanding_Balance_UnSecured
    ),
    last7DaysCreditEnquiries: toNumber(totalCaps),
  };
};

const parseExperianXml = async (xmlPayload) => {
  if (!xmlPayload) {
    throw Object.assign(new Error("XML payload is required"), { status: 400 });
  }

  const parsed = await parseStringPromise(xmlPayload, {
    explicitArray: false,
    ignoreAttrs: true,
    trim: true,
  });

  const root = parsed?.INProfileResponse;
  if (!root) {
    throw Object.assign(
      new Error("Invalid Experian XML: missing INProfileResponse"),
      { status: 400 }
    );
  }

  const currentApplication =
    root.Current_Application?.Current_Application_Details || {};
  const applicantDetails = currentApplication.Current_Applicant_Details || {};
  const caisAccount = root.CAIS_Account || {};
  const accounts = asArray(caisAccount.CAIS_Account_DETAILS);

  if (!accounts.length) {
    throw Object.assign(
      new Error("Experian XML does not contain CAIS accounts"),
      { status: 400 }
    );
  }

  const summary = extractSummary(
    caisAccount.CAIS_Summary,
    root.TotalCAPS_Summary || root.CAPS?.CAPS_Summary
  );
  const creditAccounts = accounts.map(mapAccount);

  const payload = {
    basicDetails: {
      name: extractName(applicantDetails, accounts),
      mobilePhone: extractPhone(applicantDetails, accounts),
      pan: extractPan(accounts),
      creditScore: extractCreditScore(root.SCORE),
    },
    summary,
    creditAccounts,
  };

  return payload;
};

module.exports = {
  parseExperianXml,
};
