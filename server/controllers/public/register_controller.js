const User = require("../../models/user_models");
const jwt = require("jsonwebtoken");
const otpDB = require("../../models/otp_models");
const Balance = require("../../models/balance_model");
const Utils = require("../../utils/utils");
const {
  getUserByEmail,
  deleteUserByEmail,
  updateUserBalance,
} = require("../../utils/user_utils");

module.exports = {
  GetUserName: async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const DecodeToken = jwt.decode(token);
      console.log("Decoded token:", DecodeToken);

      if (!DecodeToken || !DecodeToken.email) {
        console.log("Invalid token structure");
        return res.status(400).json({ messege: "Invalid token" });
      }

      const User = await getUserByEmail(DecodeToken.email);
      console.log("Found user:", User);

      if (!User) {
        console.log("User not found for email:", DecodeToken.email);
        return res.status(404).json({ messege: "User not found" });
      }

      res.status(200).json({
        messege: "get data successfully",
        name: User.name,
      });
    } catch (err) {
      console.log("Error in GetUserName:", err);
      res.status(500).json({ messege: "Server error" });
    }
  },

  sendRegistration: async (req, res) => {
    const { name, email, phone, password } = req.body;
    console.log(`Registration data received: ${phone}`);
    const found_user = await User.find({
      $or: [{ email: email }, { phone: phone }],
    });
    if (found_user.length > 0) {
      console.log(" user exist");
      res.status(409).json({ error: "Email or phone is already in use" });
    } else {
      // send SMS logic
      try {
        const GenaratedOtp = Utils.otpGenerator();
        const new_otp = new otpDB({ phone: phone, otp: GenaratedOtp });
        await new_otp.save();
        console.log(`generated otp${GenaratedOtp}`);

        // Utils.SendSms(phone, GenaratedOtp);

        res.status(201).json({ validUser: "user is valid" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send SMS" });
        return;
      }
    }
  },

  deleteUser: async (req, res) => {
    console.log("Delete request received");
    console.log(`Request body: ${JSON.stringify(req.body)}`);
    const { email } = req.body;
    console.log(`email to delete ${email}`);
    try {
      const result = await deleteUserByEmail(email);
      if (result) {
        res.status(200).json({
          UserDelete: "user and balance delete was successful",
        });
      } else {
        res.status(404).json({ UserDelete: "user not found" });
      }
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ UserDelete: "something went wrong with delete user" });
    }
  },

  OtpValidator: async (req, res) => {
    const { formData, otp } = req.body;
    console.log(`otp phone ${formData.phone}`);
    const foundOtp = await otpDB.findOne({ phone: formData.phone });
    if (foundOtp) {
      if (foundOtp.otp === otp) {
        console.log("otp is ok");
        const new_user = new User({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
        console.log("user saved");
        console.log(`new user is: \n${new_user}`);
        await new_user.save(); // Ensure user is saved before creating balance

        const new_balance = new Balance({
          UserId: new_user._id,
          Balance: 100,
          Transactions: [],
        });

        console.log(`new Balance is: \n${new_balance}`);

        await new_balance.save(); // Ensure balance is saved

        await otpDB.findOneAndDelete({ phone: formData.phone });
        res.status(201).json({ OtpSuccess: "Otp Success validation" });
      }
    } else {
      res.status(409).json({ error: "otp phone not found" });
    }
  },

  resetBalance: async (req, res) => {
    const { email, balanceAmount } = req.body;
    console.log(email);
    try {
      const result = await updateUserBalance(email, balanceAmount);
      if (result) {
        res.status(200).json({
          Update: "Balance updated",
        });
      } else {
        res.status(404).json({ Update: "user or balance account not found" });
      }
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ Update: "something went wrong with reset balance" });
    }
  },
};
