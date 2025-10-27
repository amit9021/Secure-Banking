require("dotenv").config();

module.exports = {
  otpGenerator: () => {
    const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
    let OTP = "";
    const len = digits.length;
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * len)];
    }
    return OTP;
  },
  SendSms: (phone, otp) => {
    const accountSid = process.env.TWILIO_ACOUNT_ID;
    const authToken = process.env.TWILIO_TOKEN;
    console.log(accountSid);
    const client = require("twilio")(accountSid, authToken);
    client.messages
      .create({
        body: `your otp is: ${otp}`,
        messagingServiceSid: process.env.TWILIO_SERVICE,
        to: "+972" + phone,
      })
      .then((message) => console.log(message.errorCode));
  },
};
