const User = require("../models/user_models");
const Balance = require("../models/balance_model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  getUserByEmail: async (email) => {
    try {
      return await User.findOne({ email: email });
    } catch (err) {
      console.error(`Error fetching user by email: ${email}`, err);
      throw err;
    }
  },
  getBalanceByID: async (id) => {
    try {
      return await Balance.findOne({ UserId: id });
    } catch (err) {
      console.error(`Error fetching Balance by ID: ${id}`, err);
      throw err;
    }
  },

  deleteUserByEmail: async (email) => {
    try {
      const user = await User.findOneAndDelete({ email: email });
      if (user) {
        await Balance.findOneAndDelete({ UserId: user._id });
      }
      return user;
    } catch (err) {
      console.error(`Error deleting user by email: ${email}`, err);
      throw err;
    }
  },

  updateUserBalance: async (email, balanceAmount) => {
    try {
      const user = await module.exports.getUserByEmail(email);
      if (user) {
        const balanceAccount = await Balance.findOne({ UserId: user._id });
        if (balanceAccount) {
          balanceAccount.Balance = balanceAmount;
          balanceAccount.Transactions = [];
          await balanceAccount.save();
          return balanceAccount;
        }
      }
      return null;
    } catch (err) {
      console.error(`Error updating balance for user: ${email}`, err);
      throw err;
    }
  },

  userMiddleware: async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (!process.env.JWT_TOKEN) {
      console.error("JWT secret is not defined");
      return res.status(500).json({ message: "Internal server error" });
    }
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_TOKEN); // Validate the token
      const user = await module.exports.getUserByEmail(decodedToken.email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const balance = await Balance.findOne({ UserId: user._id });
      console.log(`middle were user: ${user}`);
      req.user = user;
      req.balance = balance;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid or expired token" }); // Return 401 for invalid token
    }
  },
};
