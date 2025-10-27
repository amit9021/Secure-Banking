// Load environment variables first
require("dotenv").config({ path: __dirname + "/.env" });

// Debug: Log environment variable loading
console.log("Environment variables loaded:");
console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`  MONGODB_URI: ${process.env.MONGODB_URI}`);
console.log(`  JWT_TOKEN: ${process.env.JWT_TOKEN ? '****' + process.env.JWT_TOKEN.slice(-4) : 'NOT SET'}`);

const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/Bank-api-swagger.json");
const cors = require("cors");
const users = require("./models/user_models");

const DB = require("mongoose");

const mongoUri =
  process.env.NODE_ENV === "test"
    ? process.env.MONGODB_URI || "mongodb://localhost:27017/test_db" // Use env var or fallback for test
    : process.env.MONGODB_URI || "mongodb://mongodb:27017/bank_users"; // Use env var or fallback for dev/prod

console.log("Attempting to connect to MongoDB...");
console.log(`Connection URL: ${mongoUri}`);
console.log(`Current NODE_ENV: ${process.env.NODE_ENV}`);

DB.connect(mongoUri, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    console.error("Full error details:", JSON.stringify(error, null, 2));
    process.exit(1); // Exit the process if unable to connect
  });

const PORT = 5000;

const loginRoutes = require("./routes/public/login");
const registerRoutes = require("./routes/public/register");

const dashboardRoutes = require("./routes/authenticated/dashboard");
const transferRoutes = require("./routes/authenticated/transfer");
const { userMiddleware } = require("./utils/user_utils");

app.use(express.json());
app.use(cors());

/**
 * @swagger
 * /:
 *   get:
 *     summary: Check if the user is authenticated
 *     responses:
 *       200:
 *         description: User is authenticated
 *       401:
 *         description: Unauthorized
 */
app.get("/", userMiddleware, (req, res) => {
  console.log("Auth route hit");
  if (req.user) {
    console.log("User authenticated");
    res.status(200).json({ message: "Authenticated" });
  } else {
    console.log("User not authenticated");
    res.status(401).send("Unauthorized");
  }
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
app.use("/register", registerRoutes);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */
app.use("/login", loginRoutes);

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get user dashboard
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
app.use("/dashboard", dashboardRoutes);

/**
 * @swagger
 * /transfer:
 *   post:
 *     summary: Transfer funds
 *     responses:
 *       200:
 *         description: Transfer successful
 *       400:
 *         description: Bad request
 */
app.use("/transfer", transferRoutes);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
}

module.exports = app;
