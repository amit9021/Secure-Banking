const jwt = require("jsonwebtoken");
require("dotenv").config();
const { getUserByEmail } = require("../../utils/user_utils");

module.exports = {
  verifiedLogin: async (req, res) => {
    const { email, password } = req.body;
    console.log(password);
    try {
      const found_mail = await getUserByEmail(email);
      if (found_mail) {
        if (found_mail.password == password) {
          const token = jwt.sign({ email: email }, process.env.JWT_TOKEN, {
            algorithm: "HS256",
            expiresIn: "30m",
          });
          res.status(200).json({ token, user_found: "user found" });
        } else {
          res.status(401).json({ error: "Invalid password" });
        }
      } else {
        res.status(409).json({ message: "Invalid Email or Password" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
