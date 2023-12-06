const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const generateOTP = require("./generateOTP");

dotenv.config();

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  debug: true, // Enable debugging
});

const sendEmail = expressAsyncHandler(async (req, res) => {
  try {
    const otp = generateOTP();
    console.log('Generated OTP:', otp);

    const { email } = req.body;
    console.log('Recipient Email:', email);

    if (!email) {
      return res.status(400).json({ message: "Email address is required" });
    }

    var mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: "Test Email",
      text: `This is a test email. Your OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send test email. Please try again.", error: error.message });
      } else {
        console.log("Test email sent successfully!");
        return res.status(200).json({ message: "Test email sent successfully!", info });
      }
    });
  } catch (error) {
    console.error("Error in sendEmail:", error);
    return res.status(500).json({ message: "Failed to send test email. Please try again.", error: error.message });
  }
});

module.exports = { sendEmail };
