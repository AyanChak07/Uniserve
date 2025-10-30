const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP Email
const sendOTPEmail = async (email, otp, name = "User") => {
  const mailOptions = {
    from: `"uniServe" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Email Verification - uniServe",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 50px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
          .content { padding: 40px 30px; text-align: center; }
          .otp { font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; margin: 30px 0; padding: 20px; background: #f0f4ff; border-radius: 10px; display: inline-block; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Email Verification</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Thank you for registering with <strong>uniServe</strong>. Please use the OTP below to verify your email address:</p>
            <div class="otp">${otp}</div>
            <p style="color: #6c757d; margin-top: 20px;">This OTP is valid for 10 minutes.</p>
            <p style="color: #6c757d;">If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2025 uniServe. All rights reserved.</p>
            <p>KP - 6, School of Computer Engineering, KIIT University</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send OTP email");
  }
};

module.exports = { generateOTP, sendOTPEmail };
