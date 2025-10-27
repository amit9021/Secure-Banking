const request = require("supertest");
const app = require("../../index");
const User = require("../../models/user_models");
const otpDB = require("../../models/otp_models");
let server;

describe("Login Route", () => {
  beforeAll(async () => {
    return new Promise((resolve) => {
      server = app.listen(0, () => resolve());
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await otpDB.deleteMany({});
    await new Promise((resolve) => server.close(resolve));
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await User.create({
      name: "Test User",
      email: "test@example.com",
      phone: "1234567890",
      password: "password123",
    });
  });

  test("should login successfully with valid credentials", async () => {
    const response = await request(app).post("/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user_found");
  });

  test("should fail with invalid password", async () => {
    const response = await request(app).post("/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Invalid password");
  });

  test("should fail with non-existent email", async () => {
    const response = await request(app).post("/login").send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid Email or Password"
    );
  });
});
