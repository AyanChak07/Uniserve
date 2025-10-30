const User = require('../models/User');
const { generateOTP, sendOTPEmail } = require('../services/emailService');

// @desc    Register user and send OTP
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      } else {
        // User exists but not verified, resend OTP
        const otp = generateOTP();
        existingUser.emailVerificationOTP = otp;
        existingUser.emailVerificationOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await existingUser.save();

        await sendOTPEmail(email, otp, name);

        return res.status(200).json({
          success: true,
          message: 'OTP resent to your email. Please verify to continue.',
          userId: existingUser._id
        });
      }
    }

    // Create new user
    const otp = generateOTP();
    const user = await User.create({
      name,
      email,
      password,
      phone,
      emailVerificationOTP: otp,
      emailVerificationOTPExpires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // Send OTP email
    await sendOTPEmail(email, otp, name);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for OTP verification.',
      userId: user._id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

// @desc    Verify email with OTP
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId).select('+emailVerificationOTP +emailVerificationOTPExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    // Check OTP expiry
    if (user.emailVerificationOTPExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Verify OTP
    if (user.emailVerificationOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationOTPExpires = undefined;
    await user.save();

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed'
    });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    user.emailVerificationOTP = otp;
    user.emailVerificationOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send OTP email
    await sendOTPEmail(user.email, otp, user.name);

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully to your email'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in',
        userId: user._id,
        needsVerification: true
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    }
  });
};