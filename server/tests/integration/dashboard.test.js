const request = require("supertest");
const app = require("../../index");
const User = require("../../models/user_models");
const otpDB = require("../../models/otp_models");
const jwt = require("jsonwebtoken");
const Balance = require("../../models/balance_model");
require("dotenv").config({ path: ".env.test" });

describe("Dashboard Route", () => {
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
  test("should get user balance", async () => {
    const response = await request(app)
      .get("/dashboard")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.Balance).toBe(100);
  });
});

describe("Transfer Route", () => {
  let senderAuthToken;
  let receiverAuthToken;
  let senderUser;
  let receiverUser;

  const SenderUser = {
    name: "Sender User",
    email: "sender.user@example.com",
    phone: "12345678901",
    password: "password123",
  };
  const ReceiverUser = {
    name: "Receiver User",
    email: "receiver.user@example.com",
    phone: "12345678902",
    password: "password123",
  };
  beforeEach(async () => {
    // Create a test user and get token
    await User.deleteMany({});
    await Balance.deleteMany({});

    senderUser = new User(SenderUser);
    await senderUser.save();
    const balance = new Balance({
      UserId: senderUser._id,
      Balance: 100,
      Transactions: [],
    });
    await balance.save();

    receiverUser = new User(ReceiverUser);
    await receiverUser.save();
    const receiverBalance = new Balance({
      UserId: receiverUser._id,
      Balance: 0,
      Transactions: [],
    });
    await receiverBalance.save();

    senderAuthToken = jwt.sign(
      { email: SenderUser.email },
      process.env.JWT_TOKEN
    );
    receiverAuthToken = jwt.sign(
      { email: ReceiverUser.email },
      process.env.JWT_TOKEN
    );
  });
  test("should transfer funds", async () => {
    const response = await request(app)
      .post("/transfer")
      .set("Authorization", `Bearer ${senderAuthToken}`)
      .send({
        email: ReceiverUser.email,
        amount: 50,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Transfer successful");

    const senderBalance = await Balance.findOne({ UserId: senderUser._id });
    const receiverBalance = await Balance.findOne({
      UserId: receiverUser._id,
    });

    expect(senderBalance.Balance).toBe(50);
    expect(receiverBalance.Balance).toBe(50);
  });
});
