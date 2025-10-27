const express = require("express");
const router = express.Router();
const { userMiddleware } = require("../../utils/user_utils");

const dashboardController = require("../../controllers/authenticated/dashboard_controller");

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
router.get("/", userMiddleware, dashboardController.GetDashboard);

module.exports = router;
