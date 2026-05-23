import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/UserModel.js";
import { verifyGoogleToken } from "../utils/googleAuth.js";
import { generateOtpCode, sanitizeUser } from "../utils/helpers.js";
import { sendEmail } from "../utils/mailer.js";
import genToken from "../utils/token.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, mobile, password, role } = req.body;

    if (!fullName || !email || !mobile || !password) {
      return res.status(400).json({ message: "Full name, email, mobile and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    if (mobile.replace(/\D/g, "").length < 10) {
      return res.status(400).json({ message: "Mobile number must be at least 10 digits long" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      mobile: mobile.trim(),
      password: hashedPassword,
      role: role || "user",
      isEmailVerified: true,
    });

    const token = genToken(newUser._id);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = genToken(user._id);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    message: "Current user fetched successfully",
    user: sanitizeUser(req.user),
  });
};

export const googleLogin = async (req, res) => {
  try {
    const { credential, role } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    const payload = await verifyGoogleToken(credential);
    const email = payload.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Google account email is missing" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const generatedPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      user = await User.create({
        fullName: payload.name || "Google User",
        email,
        mobile: payload.phone_number || "0000000000",
        password: hashedPassword,
        role: role || "user",
        authProvider: "google",
        googleId: payload.sub || "",
        avatar: payload.picture || "",
        isEmailVerified: true,
      });
    } else {
      user.authProvider = "google";
      user.googleId = payload.sub || user.googleId;
      user.avatar = payload.picture || user.avatar;
      user.isEmailVerified = true;
      await user.save();
    }

    const token = genToken(user._id);

    return res.status(200).json({
      message: "Google login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Google login failed" });
  }
};

export const requestPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    const otp = generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.passwordResetOtp = {
      code: otp,
      expiresAt,
    };

    await user.save();

    const text = `Your Food Delivery password reset OTP is ${otp}. This OTP expires in 10 minutes.`;
    const html = `
      <div>
        <h2>Password Reset OTP</h2>
        <p>Your OTP is <strong>${otp}</strong>.</p>
        <p>This OTP expires in 10 minutes.</p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: "Food Delivery Password Reset OTP",
      text,
      html,
    });

    return res.status(200).json({ message: "Password reset OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to send OTP" });
  }
};

export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.passwordResetOtp?.code) {
      return res.status(400).json({ message: "OTP request not found" });
    }

    const isExpired = !user.passwordResetOtp.expiresAt || user.passwordResetOtp.expiresAt < new Date();

    if (isExpired) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (user.passwordResetOtp.code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetOtp = undefined;
    user.authProvider = "local";
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to reset password" });
  }
};
