const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// ==========================================
// EMAIL CONFIGURATION - EMAILJS
// ==========================================

const EMAILJS_API_URL =
  "https://api.emailjs.com/api/v1.0/email/send";

// ==========================================
// GENERATE OTP
// ==========================================

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ==========================================
// SEND OTP EMAIL - EMAILJS
// ==========================================

const sendOTPEmail = async (
  email,
  otp,
  name = "User"
) => {
  if (
    !process.env.EMAILJS_SERVICE_ID ||
    !process.env.EMAILJS_TEMPLATE_ID ||
    !process.env.EMAILJS_PUBLIC_KEY
  ) {
    throw new Error(
      "EmailJS environment variables are missing"
    );
  }

  const response = await fetch(EMAILJS_API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID,

      template_id:
        process.env.EMAILJS_TEMPLATE_ID,

      user_id:
        process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,

      template_params: {
        email: email,
        name: name,
        otp: otp,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `EmailJS Error: ${errorText}`
    );
  }

  return true;
};

// ==========================================
// SIGNUP
// ==========================================

const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (
      existingUser &&
      existingUser.isVerified
    ) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    const otp = generateOTP();

    const otpExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    const hashedPassword =
      await bcrypt.hash(password, 10);

    let user;

    // Existing unverified user
    if (existingUser) {
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.role = role || "student";
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;

      user = await existingUser.save();
    } else {
      // New user
      user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || "student",
        isVerified: false,
        otp,
        otpExpires,
      });
    }

    // Send OTP
    await sendOTPEmail(
      user.email,
      otp,
      user.name
    );

    return res.status(201).json({
      success: true,
      message:
        "OTP sent successfully to your email",
      email: user.email,
    });
  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong during signup",
      error: error.message,
    });
  }
};

// ==========================================
// VERIFY SIGNUP OTP
// ==========================================

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message:
          "Email is already verified",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (
      !user.otpExpires ||
      user.otpExpires < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Please request a new OTP",
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Email verified successfully",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profileImage:
          user.profileImage || "",
      },
    });
  } catch (error) {
    console.error(
      "Verify OTP Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while verifying OTP",
      error: error.message,
    });
  }
};

// ==========================================
// LOGIN
// ==========================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email first",
        needsVerification: true,
      });
    }

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profileImage:
          user.profileImage || "",
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong during login",
      error: error.message,
    });
  }
};

// ==========================================
// RESEND SIGNUP OTP
// ==========================================

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message:
          "Email is already verified",
      });
    }

    const otp = generateOTP();

    const otpExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    user.otp = otp;
    user.otpExpires = otpExpires;

    await user.save();

    await sendOTPEmail(
      user.email,
      otp,
      user.name
    );

    return res.status(200).json({
      success: true,
      message:
        "New OTP sent successfully",
    });
  } catch (error) {
    console.error(
      "Resend OTP Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Could not resend OTP",
      error: error.message,
    });
  }
};

// ==========================================
// FORGOT PASSWORD - SEND OTP
// ==========================================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "No account found with this email",
      });
    }

    const otp = generateOTP();

    const otpExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    user.otp = otp;
    user.otpExpires = otpExpires;

    await user.save();

    await sendOTPEmail(
      user.email,
      otp,
      user.name
    );

    return res.status(200).json({
      success: true,
      message:
        "Password reset OTP sent successfully",
    });
  } catch (error) {
    console.error(
      "Forgot Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// ==========================================
// VERIFY RESET OTP
// ==========================================

const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message:
          "Email and OTP are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (
      !user.otpExpires ||
      user.otpExpires < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "OTP verified successfully",
    });
  } catch (error) {
    console.error(
      "Verify Reset OTP Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while verifying OTP",
      error: error.message,
    });
  }
};

// ==========================================
// RESET PASSWORD
// ==========================================

const resetPassword = async (req, res) => {
  try {
    const {
      email,
      otp,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !email ||
      !otp ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (
      !user.otpExpires ||
      user.otpExpires < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    user.password =
      await bcrypt.hash(newPassword, 10);

    user.otp = null;
    user.otpExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully",
    });
  } catch (error) {
    console.error(
      "Reset Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while resetting password",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE PROFILE
// ==========================================

const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const { name, profileImage } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.name = name.trim();

    if (typeof profileImage === "string") {
      user.profileImage = profileImage;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully.",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profileImage:
          user.profileImage || "",
      },
    });
  } catch (error) {
    console.error(
      "Update Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while updating profile.",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN USER STATISTICS
// ==========================================

const getAdminStats = async (req, res) => {
  try {
    const authHeader =
      req.headers.authorization || "";

    const token =
      authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
    } catch (error) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired token.",
      });
    }

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Admin access required.",
      });
    }

    const now = new Date();

    const sevenDaysAgo = new Date(
      now.getTime() -
        7 * 24 * 60 * 60 * 1000
    );

    const totalUsers =
      await User.countDocuments({
        role: "student",
      });

    const verifiedUsers =
      await User.countDocuments({
        role: "student",
        isVerified: true,
      });

    const admins =
      await User.countDocuments({
        role: "admin",
      });

    const newUsers7Days =
      await User.countDocuments({
        role: "student",
        createdAt: {
          $gte: sevenDaysAgo,
        },
      });

    const activeUsers =
      await User.countDocuments({
        role: "student",
        updatedAt: {
          $gte: sevenDaysAgo,
        },
      });

    const recentUsers =
      await User.find({
        role: "student",
      })
        .select(
          "name email role isVerified createdAt updatedAt"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .lean();

    const growth = [];

    for (
      let index = 5;
      index >= 0;
      index--
    ) {
      const start = new Date(
        now.getFullYear(),
        now.getMonth() - index,
        1
      );

      const end = new Date(
        now.getFullYear(),
        now.getMonth() - index + 1,
        1
      );

      const count =
        await User.countDocuments({
          role: "student",
          createdAt: {
            $gte: start,
            $lt: end,
          },
        });

      growth.push({
        label: start.toLocaleDateString(
          "en-IN",
          {
            month: "short",
          }
        ),
        users: count,
      });
    }

    return res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        verifiedUsers,
        activeUsers,
        newUsers7Days,
        admins,
        growth,
        recentUsers,
      },
    });
  } catch (error) {
    console.error(
      "Admin Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load admin statistics.",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  signup,
  verifyOTP,
  login,
  resendOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  updateProfile,
  getAdminStats,
};