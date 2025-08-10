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

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, mssg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, mssg: "Invalid credentials" });
    }

    // Check role from database (user.role === 'admin' or 'user')
    const isAdmin = user.role === "admin";

    const token = createToken({ id: user._id, role: user.role });

    res.json({
      success: true,
      token,
      isAdmin,
      user
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, mssg: error.message });
  }
};

// Register controller for user
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
      role: "user",  
    });

    const user = await newUser.save();
    const token = createToken({ id: user._id, role: user.role });

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

// Register for admin
export const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.json({ success: false, mssg: "Admin already exists" });
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

    const newAdmin = new userModel({
      fullName,
      email,
      password: hashedPass,
      role: "admin", 
    });

    const admin = await newAdmin.save();
    const token = createToken({ id: admin._id, role: admin.role });

    res.json({
      success: true,
      token,
      user: admin,
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      mssg: error.message,
    });
  }
};

// Check if authenticated 
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

// Update user profile - UPDATED TO HANDLE BIO
export const updateProfile = async (req, res) => {
  try {
    const { fullName, profilePic, bio } = req.body; 
    const userId = req.user._id;
    let updatedUser;

    // Prepare update object
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (bio !== undefined) updateData.bio = bio; 

    if (!profilePic) {
      // Update without changing profile picture
      updatedUser = await userModel.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      ).select('-password'); 
    } else {
      // Update with new profile picture
      const upload = await cloudinary.uploader.upload(profilePic);
      updateData.profilePic = upload.secure_url;
      
      updatedUser = await userModel.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      ).select('-password'); // Exclude password from response
    }
    // console.log("Updated user:", updatedUser);

    res.json({ 
      success: true, 
      user: updatedUser,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.log(error);
    res.json({ 
      success: false, 
      mssg: error.message 
    });
  }
};