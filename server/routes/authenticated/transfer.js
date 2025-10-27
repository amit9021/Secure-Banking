const express = require("express");
const router = express.Router();
const { userMiddleware } = require("../../utils/user_utils");

const TransferController = require("../../controllers/authenticated/transfer_controller");

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
 *       401:
 *         description: Unauthorized
 *       402:
 *         description: Payment required - Insufficient funds
 */
router.post("/", userMiddleware, TransferController.TransferMony);

module.exports = router;
