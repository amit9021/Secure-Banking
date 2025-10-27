const user = require("../../models/user_models");
const balance = require("../../models/balance_model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { getUserByEmail, userMiddleware } = require("../../utils/user_utils");

module.exports = {
  GetDashboard: async (req, res) => {
    const User = req.user;
    const Balance = req.balance;
    try {
      res.status(200).json({
        Balance: Balance.Balance,
        Transactions: Balance.Transactions,
      });
    } catch (err) {
      res.status(404).json({ message: "Not Found" });
    }
  },
};
