const express = require("express");
const router = express.Router();

const registerController = require("../../controllers/public/register_controller");
const { userMiddleware } = require("../../utils/user_utils");

/**
 * @swagger
 * /register:
 *   get:
 *     summary: Get user name
 *     responses:
 *       200:
 *         description: User name retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", userMiddleware, registerController.GetUserName);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post("/", registerController.sendRegistration);

/**
 * @swagger
 * /register:
 *   delete:
 *     summary: Delete a user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/", registerController.deleteUser);

/**
 * @swagger
 * /register/otp_validator:
 *   post:
 *     summary: Validate OTP
 *     responses:
 *       200:
 *         description: OTP validated successfully
 *       400:
 *         description: Bad request
 */
router.post("/otp_validator", registerController.OtpValidator);

/**
 * @swagger
 * /register/reset_balance:
 *   put:
 *     summary: Reset user balance
 *     responses:
 *       200:
 *         description: Balance reset successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/reset_balance", userMiddleware, registerController.resetBalance);

module.exports = router;
