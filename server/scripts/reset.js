/**
 * Database Reset Script
 * Clears all data from the database
 *
 * Usage:
 *   node scripts/reset.js
 *
 * Environment:
 *   Requires MONGODB_URI environment variable
 */

const mongoose = require("mongoose");
const path = require("path");
const readline = require("readline");

// Load environment variables from server/.env
require("dotenv").config({ path: path.join(__dirname, "../server/.env") });

// Import models
const User = require("../server/models/user_models");
const Balance = require("../server/models/balance_model");
const OTP = require("../server/models/otp_models");

/**
 * Prompt user for confirmation
 */
function confirmReset() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question("⚠️  Are you sure you want to reset the database? This will delete ALL data. (yes/no): ", (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "yes");
    });
  });
}

/**
 * Connect to MongoDB
 */
async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bank_users";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
}

/**
 * Reset database
 */
async function resetDatabase() {
  try {
    const userCount = await User.countDocuments();
    const balanceCount = await Balance.countDocuments();
    const otpCount = await OTP.countDocuments();

    console.log("\n📊 Current Database Status:");
    console.log(`   Users: ${userCount}`);
    console.log(`   Balances: ${balanceCount}`);
    console.log(`   OTPs: ${otpCount}\n`);

    await User.deleteMany({});
    await Balance.deleteMany({});
    await OTP.deleteMany({});

    console.log("✅ Database reset successfully");
    console.log("   Deleted all users, balances, and OTPs\n");
  } catch (error) {
    console.error("❌ Error resetting database:", error.message);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log("🔄 Database Reset Tool\n");

    await connectDB();

    const confirmed = await confirmReset();

    if (!confirmed) {
      console.log("❌ Reset cancelled");
      process.exit(0);
    }

    await resetDatabase();

    console.log("💡 To seed the database with demo data, run:");
    console.log("   node scripts/seed.js\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Reset failed:", error.message);
    process.exit(1);
  }
}

// Run the reset script
main();
