const express = require("express");
const router = express.Router();

const loginController = require("../../controllers/public/login_controller");

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
router.post("/", loginController.verifiedLogin);

module.exports = router;
