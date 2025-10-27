const Utils = require("../../utils/utils");
const {
  getUserByEmail,
  deleteUserByEmail,
  updateUserBalance,
} = require("../../utils/user_utils");
const User = require("../../models/user_models");
const Balance = require("../../models/balance_model");

const app = require("../../index");
let server;

describe("Utils", () => {
  beforeAll(async () => {
    return new Promise((resolve) => {
      server = app.listen(0, () => resolve());
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Balance.deleteMany({});
    await new Promise((resolve) => server.close(resolve));
  });
  test("should generate OTP of correct length", () => {
    const otp = Utils.otpGenerator();
    expect(otp).toHaveLength(6);
  });
});

describe("User Utils", () => {
  const testUser = {
    name: "Test User",
    email: "test.utils@example.com",
    phone: "1234567890",
    password: "password123",
  };

  beforeEach(async () => {
    await User.deleteMany({});
    await Balance.deleteMany({});
  });

  test("should get user by email", async () => {
    const user = new User(testUser);
    await user.save();

    const foundUser = await getUserByEmail(testUser.email);
    expect(foundUser.email).toBe(testUser.email);
  });

  test("should return null for non-existent user", async () => {
    const foundUser = await getUserByEmail("nonexistent@example.com");
    expect(foundUser).toBeNull();
  });

  test("should delete user and associated balance", async () => {
    const user = new User(testUser);
    await user.save();

    const balance = new Balance({
      UserId: user._id,
      Balance: 100,
      Transactions: [],
    });
    await balance.save();

    const result = await deleteUserByEmail(testUser.email);
    expect(result._id.toString()).toBe(user._id.toString());

    const deletedUser = await User.findOne({ email: testUser.email });
    expect(deletedUser).toBeNull();

    const deletedBalance = await Balance.findOne({ UserId: user._id });
    expect(deletedBalance).toBeNull();
  });

  test("should update user balance", async () => {
    const user = new User(testUser);
    await user.save();

    const balance = new Balance({
      UserId: user._id,
      Balance: 100,
      Transactions: [],
    });
    await balance.save();

    const result = await updateUserBalance(testUser.email, 500);
    expect(result._id.toString()).toBe(balance._id.toString());

    const updatedBalance = await Balance.findOne({ UserId: user._id });
    expect(updatedBalance.Balance).toBe(500);
  });
});
