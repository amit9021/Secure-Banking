/**
 * Database Seed Script
 * Creates demo users, accounts, and transactions for testing and development
 *
 * Usage:
 *   node scripts/seed.js
 *
 * Environment:
 *   Requires MONGODB_URI environment variable
 */

const mongoose = require("mongoose");
const path = require("path");

// Load environment variables from server/.env
require("dotenv").config({ path: path.join(__dirname, "../server/.env") });

// Import models
const User = require("../models/user_models");
const Balance = require("../models/balance_model");
const OTP = require("../models/otp_models");

// Demo users data
const demoUsers = [
  {
    name: "Demo User",
    email: "demo@bank.com",
    phone: "+1234567890",
    password: "password123",
    initialBalance: 1000.0
  },
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1234567891",
    password: "password123",
    initialBalance: 5000.0
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "+1234567892",
    password: "password123",
    initialBalance: 2500.0
  },
  {
    name: "Charlie Brown",
    email: "charlie@example.com",
    phone: "+1234567893",
    password: "password123",
    initialBalance: 750.0
  }
];

// Sample transactions for demo accounts
const demoTransactions = [
  { userEmail: "demo@bank.com", transactions: [100, -50, 200, -75, 150] },
  { userEmail: "alice@example.com", transactions: [500, -200, 1000, -300] },
  { userEmail: "bob@example.com", transactions: [250, -100, 50] },
  { userEmail: "charlie@example.com", transactions: [-50, -25, 100] }
];

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
 * Clear existing data
 */
async function clearDatabase() {
  try {
    await User.deleteMany({});
    await Balance.deleteMany({});
    await OTP.deleteMany({});
    console.log("🗑️  Cleared existing data");
  } catch (error) {
    console.error("❌ Error clearing database:", error.message);
    throw error;
  }
}

/**
 * Seed users and balances
 */
async function seedUsers() {
  try {
    console.log("🌱 Seeding users and balances...");

    for (const userData of demoUsers) {
      // Create user
      const user = new User({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password // NOTE: In production, this should be hashed!
      });
      await user.save();

      // Find transactions for this user
      const userTrans = demoTransactions.find((t) => t.userEmail === userData.email);
      const transactions = userTrans ? userTrans.transactions : [];

      // Create balance with transactions
      const balance = new Balance({
        UserId: user._id,
        Balance: userData.initialBalance,
        Transactions: transactions
      });
      await balance.save();

      console.log(`   ✓ Created user: ${userData.email} (Balance: $${userData.initialBalance})`);
    }

    console.log("✅ Successfully seeded all users and balances");
  } catch (error) {
    console.error("❌ Error seeding users:", error.message);
    throw error;
  }
}

/**
 * Display summary
 */
async function displaySummary() {
  try {
    const userCount = await User.countDocuments();
    const balanceCount = await Balance.countDocuments();

    console.log("\n📊 Database Summary:");
    console.log(`   Users: ${userCount}`);
    console.log(`   Balances: ${balanceCount}`);
    console.log("\n🔐 Demo Credentials:");
    console.log("   Email: demo@bank.com");
    console.log("   Password: password123");
    console.log("\n💡 All demo users have the same password: password123\n");
  } catch (error) {
    console.error("❌ Error displaying summary:", error.message);
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log("🚀 Starting database seed...\n");

    await connectDB();
    await clearDatabase();
    await seedUsers();
    await displaySummary();

    console.log("✨ Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seed failed:", error.message);
    process.exit(1);
  }
}

// Run the seed script
main();
