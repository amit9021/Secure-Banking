const request = require("supertest");
const app = require("../../index");
const User = require("../../models/user_models");
const otpDB = require("../../models/otp_models");
const jwt = require("jsonwebtoken");
const Balance = require("../../models/balance_model");
require("dotenv").config({ path: ".env.test" });

describe("Register Route", () => {
  test("should initiate registration successfully", async () => {
    const response = await request(app).post("/register").send({
      name: "New User",
      email: "new@example.com",
      phone: "9876543210",
      password: "newpassword123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("validUser", "user is valid");
  });

  test("should fail registration with existing email", async () => {
    // First create a user
    await User.create({
      name: "Existing User",
      email: "existing@example.com",
      phone: "1234567890",
      password: "password123",
    });

    // Try to register with same email
    const response = await request(app).post("/register").send({
      name: "New User",
      email: "existing@example.com",
      phone: "9876543210",
      password: "newpassword123",
    });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty(
      "error",
      "Email or phone is already in use"
    );
  });

  test("should validate OTP successfully", async () => {
    const testOtp = "123456";
    const testPhone = "9876543210";

    // Create OTP record
    await otpDB.deleteMany({});
    await otpDB.create({
      phone: testPhone,
      otp: testOtp,
    });

    const response = await request(app)
      .post("/register/otp_validator")
      .send({
        formData: {
          name: "New User",
          email: "new@example.com",
          phone: testPhone,
          password: "newpassword123",
        },
        otp: testOtp,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "OtpSuccess",
      "Otp Success validation"
    );
  });
});

describe("User Management", () => {
  let authToken;
  const testUser = {
    name: "Test User",
    email: "test.user@example.com",
    phone: "1234567890",
    password: "password123",
  };

  beforeEach(async () => {
    // Create a test user and get token
    await User.deleteMany({});
    await Balance.deleteMany({});

    const user = new User(testUser);
    await user.save();
    const balance = new Balance({
      UserId: user._id,
      Balance: 100,
      Transactions: [],
    });
    await balance.save();
    authToken = jwt.sign({ email: testUser.email }, process.env.JWT_TOKEN);
  });

  test("should get username successfully", async () => {
    const response = await request(app)
      .get("/register")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(testUser.name);
  });

  test("should fail to get username with invalid token", async () => {
    const response = await request(app)
      .get("/register")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
  });

  test("should delete user successfully", async () => {
    const response = await request(app)
      .delete("/register")
      .send({ email: testUser.email });

    expect(response.status).toBe(200);
    expect(response.body.UserDelete).toBe(
      "user and balance delete was successful"
    );
  });

  test("should fail to delete non-existent user", async () => {
    const response = await request(app)
      .delete("/register")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ email: "nonexistent@example.com" });

    expect(response.status).toBe(404);
  });

  test("should reset balance successfully", async () => {
    const user = new User({
      name: "New User",
      email: "new@example.com",
      phone: "9876543210",
      password: "newpassword123",
    });
    await user.save();
    const balance = new Balance({
      UserId: user._id,
      Balance: 100,
      Transactions: [],
    });
    await balance.save();

    const response = await request(app)
      .put("/register/reset_balance")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        email: user.email,
        balanceAmount: 500,
      });

    expect(response.status).toBe(200);
    expect(response.body.Update).toBe("Balance updated");
  }, 30000);

  test("should fail to reset balance for non-existent user", async () => {
    const response = await request(app)
      .put("/register/reset_balance")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        email: "nonexistent@example.com",
        balanceAmount: 500,
      });

    expect(response.status).toBe(404);
  }, 30000);
});
