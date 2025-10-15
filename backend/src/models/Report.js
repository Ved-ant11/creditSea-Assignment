const { Schema, model } = require("mongoose");

const creditAccountSchema = new Schema(
  {
    product: String,
    bank: String,
    accountNumber: String,
    address: String,
    amountOverdue: Number,
    currentBalance: Number,
    status: String,
    isCreditCard: Boolean,
  },
  { _id: false }
);

const reportSchema = new Schema(
  {
    source: {
      type: String,
      default: "experian",
    },
    basicDetails: {
      name: String,
      mobilePhone: String,
      pan: String,
      creditScore: Number,
    },
    summary: {
      totalAccounts: Number,
      activeAccounts: Number,
      closedAccounts: Number,
      currentBalanceAmount: Number,
      securedAccountsAmount: Number,
      unsecuredAccountsAmount: Number,
      last7DaysCreditEnquiries: Number,
    },
    creditAccounts: [creditAccountSchema],
    raw: String,
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ "basicDetails.pan": 1, createdAt: -1 });

module.exports = model("Report", reportSchema);
