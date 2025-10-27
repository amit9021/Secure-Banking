const mongoose = require("mongoose");

const BalanceModel = new mongoose.Schema({
  UserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  Balance: { type: Number, required: true },
  Transactions: [{ type: Number, required: true }],
});

module.exports = mongoose.model("balances", BalanceModel);
