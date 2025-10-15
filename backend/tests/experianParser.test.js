const fs = require("fs");
const path = require("path");

const { parseExperianXml } = require("../src/services/experianParser");

describe("Experian parser", () => {
  const sampleXml = fs.readFileSync(
    path.resolve(__dirname, "../../samples/Sagar_Ugle1.xml"),
    "utf8"
  );

  it("parses mandatory fields from the XML", async () => {
    const result = await parseExperianXml(sampleXml);

    expect(result.basicDetails).toMatchObject({
      name: "Sagar Ugle",
      mobilePhone: "9819137672",
      pan: "AOZPB0247S",
      creditScore: 719,
    });

    expect(result.summary).toMatchObject({
      totalAccounts: 4,
      activeAccounts: 3,
      closedAccounts: 1,
      currentBalanceAmount: 245000,
      securedAccountsAmount: 85000,
      unsecuredAccountsAmount: 160000,
      last7DaysCreditEnquiries: 0,
    });

    expect(result.creditAccounts).toHaveLength(4);
    expect(result.creditAccounts[0]).toMatchObject({
      bank: "icicibank",
      accountNumber: "ICIVB20994",
      currentBalance: 80000,
    });
  });

  it("requires a payload", async () => {
    await expect(parseExperianXml(undefined)).rejects.toThrow(/payload/i);
  });
});
