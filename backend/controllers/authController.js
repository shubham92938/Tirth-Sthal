const User      = require("../models/User");
const bcrypt    = require("bcryptjs");
const crypto    = require("crypto");
const sendEmail = require("../utils/sendEmail");

const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();
  res.status(statusCode).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!password || password.length < 6)
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: "Email already registered" });
    const user = await User.create({ name, email, password });
    sendToken(user, 201, res);
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password)
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    sendToken(user, 200, res);
  } catch (error) { next(error); }
};

// ── Google Login (Firebase — 100% free) ──
exports.googleLogin = async (req, res, next) => {
  try {
    const { name, email, avatar, googleId } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: "Email is required" });

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name, email, avatar, googleId,
        role: email === process.env.ADMIN_EMAIL ? "admin" : "user",
      });
    } else {
      if (email === process.env.ADMIN_EMAIL && user.role !== "admin") {
        user.role = "admin";
        await user.save();
      }
      if (avatar && user.avatar !== avatar) {
        user.avatar = avatar;
        await user.save();
      }
    }
    sendToken(user, 200, res);
  } catch (error) { next(error); }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.status(200).json({ success: true, user });
  } catch (error) { next(error); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, language } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, language }, { new: true, runValidators: true });
    res.status(200).json({ success: true, user });
  } catch (error) { next(error); }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: "Please provide your email" });
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "No account found with this email" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken  = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="text-align:center;padding:30px;background:linear-gradient(135deg,#c8610a,#3b0a0a);border-radius:12px;margin-bottom:24px;">
          <h1 style="color:#fff;margin:0;">🛕 Tirthstal</h1>
        </div>
        <h2>Reset Your Password</h2>
        <p>Namaste ${user.name}! 🙏<br/>Click below to reset your password.</p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${resetUrl}" style="padding:14px 32px;background:#c8610a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
            Reset Password
          </a>
        </div>
        <p style="color:#888;font-size:13px;">⏰ Expires in <strong>15 minutes</strong>.</p>
      </div>`;

    await sendEmail({ to: user.email, subject: "🛕 Tirthstal — Password Reset Request", html });
    res.status(200).json({ success: true, message: `Password reset email sent to ${user.email}` });
  } catch (error) {
    const user = await User.findOne({ email: req.body.email });
    if (user) { user.resetPasswordToken = undefined; user.resetPasswordExpire = undefined; await user.save({ validateBeforeSave: false }); }
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password || password.length < 6)
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpire: { $gt: Date.now() } });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(200).json({ success: true, message: "Password reset successful!" });
  } catch (error) { next(error); }
};

exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
};