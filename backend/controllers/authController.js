const User = require("../models/User");
const bcrypt =require("bcryptjs");

// ── Token response helper ──
const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id:     user._id,
      name:   user.name,
      email:  user.email,
      role:   user.role,
      avatar: user.avatar,
    },
  });
};

// ── Register ──
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const user = await User.create({ name, email, password });
    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// ── Login ──
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }


    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};
// ── Get Profile ──
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// Password Forgot
 
 const crypto       = require("crypto");
// const User         = require("../models/User");
const sendEmail    = require("../utils/sendEmail");

// ── Forgot Password ──
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your email",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    // ── Random token generate karo ──
    const resetToken = crypto.randomBytes(32).toString("hex");

    // ── Token hash karke DB mein save karo ──
    user.resetPasswordToken  = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save({ validateBeforeSave: false });

    // ── Reset URL banao ──
    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;

    // ── Email bhejo ──
    const html = `
      <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <div style="text-align: center; padding: 30px 0; background: linear-gradient(135deg, #c8610a, #3b0a0a); border-radius: 12px; margin-bottom: 24px;">
          <h1 style="color: #fff; font-size: 28px; margin: 0;">🛕 Tirthstal</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Sacred Temples, Divine Journey</p>
        </div>

        <h2 style="color: #1a1a1a; font-size: 22px;">Reset Your Password</h2>
        
        <p style="color: #666; line-height: 1.7;">
          Namaste ${user.name}! 🙏<br/>
          We received a request to reset your Tirthstal account password.
          Click the button below to reset it.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}"
            style="display: inline-block; padding: 14px 32px; background: #c8610a; color: #fff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">
            Reset Password
          </a>
        </div>

        <p style="color: #888; font-size: 13px; line-height: 1.6;">
          ⏰ This link will expire in <strong>15 minutes</strong>.<br/>
          If you didn't request a password reset, please ignore this email.
          Your password will remain unchanged.
        </p>

        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #f0ede8; text-align: center;">
          <p style="color: #aaa; font-size: 12px;">
            © 2024 Tirthstal. All rights reserved.<br/>
            Ujjain, Madhya Pradesh, India
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to:      user.email,
      subject: "🛕 Tirthstal — Password Reset Request",
      html,
    });

    res.status(200).json({
      success: true,
      message: `Password reset email sent to ${user.email}`,
    });

  } catch (error) {
    // Email fail hone pe token hata do
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      user.resetPasswordToken  = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    }
    next(error);
  }
};

// ── Reset Password ──
exports.resetPassword = async (req, res, next) => {
  try {
    const { token }    = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // ── Token hash karo aur DB mein dhundo ──
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken:  hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // expired nahi hona chahiye
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token. Please request a new one.",
      });
    }

    // ── New password save karo ──
    user.password            = password;
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // ── Auto login karo ──
    // const jwtToken = user.getJwtToken();

    res.status(200).json({
      success: true,
      message: "Password reset successful!",
      token:   token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });

  } catch (error) {
    next(error);
  }
};



// ── Update Profile ──
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, language } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, language },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// ── Logout ──
exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
};