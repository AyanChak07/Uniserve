const nodemailer = require('nodemailer');

// Create transporter with better configuration for production
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465, // Use 465 instead of 587 for better reliability
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  connectionTimeout: 10000, // 10 seconds
  socketTimeout: 10000, // 10 seconds
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 1000,
  rateLimit: 5,
});

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP Email with retry logic
const sendOTPEmail = async (email, otp, name = 'User') => {
  const mailOptions = {
    from: `"uniServe" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Email Verification - uniServe',
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

  let attempts = 0;
  const maxAttempts = 2;

  while (attempts < maxAttempts) {
    try {
      console.log(`Sending OTP email to ${email} (Attempt ${attempts + 1}/${maxAttempts})`);
      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      attempts++;
      console.error(`Email sending error (Attempt ${attempts}):`, error.message);
      
      if (attempts < maxAttempts) {
        // Wait 2 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        throw new Error('Failed to send OTP email after 2 attempts');
      }
    }
  }
};

module.exports = { generateOTP, sendOTPEmail };