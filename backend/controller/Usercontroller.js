import userModel from "../modules/User.js";
import bcrypt from "bcrypt";
import validator from "validator";
import cloudinary from "../config/cloudinary.js";
import jwt from "jsonwebtoken";

// Token generator
const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Admin login
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = createToken({ role: "admin" });
      return res.json({ success: true, token, isAdmin: true });
    }

    // Normal user login
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, mssg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken({ id: user._id });
      return res.json({ success: true, token, isAdmin: false, user });
    } else {
      return res.json({ success: false, mssg: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, mssg: error.message });
  }
};

// Register controller
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.json({ success: false, mssg: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, mssg: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        mssg: "Please enter a stronger password (min 8 chars)",
      });
    }

    const saltRounds = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, saltRounds);

    const newUser = new userModel({
      fullName,
      email,
      password: hashedPass,
    });

    const user = await newUser.save();
    const token = createToken({ id: user._id });

    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      mssg: error.message,
    });
  }
};

// Check if authenticated (middleware must set req.user)
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { fullName, profilePic } = req.body;
    const userId = req.user._id;
    let updatedUser;

    if (!profilePic) {
      // Only updating name
      updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { fullName },
        { new: true }
      );
    } else {
      // Upload image to Cloudinary and update name + profile pic
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { fullName, profilePic: upload.secure_url },
        { new: true }
      );
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error);
    res.json({ success: false, mssg: error.message });
  }
};
