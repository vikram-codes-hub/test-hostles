import mongoose from "mongoose";
import Like from "../modules/Like.js";
import Product from "../modules/Product.js";
import userModel from "../modules/User.js";

// Add Like
export const addLike = async (req, res) => {
  try {
    const { userId, hostelId } = req.body;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(hostelId)) {
      return res.status(400).json({ success: false, mssg: "Invalid user or hostel ID" });
    }

    const user = await userModel.findById(userId);
    const hostel = await Product.findById(hostelId);
     console.log("userData:", user);
    console.log("hostelData:", hostel);

    if (!user || !hostel) {
      return res.status(404).json({ success: false, mssg: "User or hostel not found" });
    }

    // Prevent duplicate likes
    const existingLike = await Like.findOne({ userId, hostelId });
    if (existingLike) {
      return res.status(400).json({ success: false, mssg: "Already liked" });
    }

    const like = new Like({ userId, hostelId });
    await like.save();

    res.json({ success: true, mssg: "Hostel liked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, mssg: error.message });
  }
};

// Remove Like
export const removeLike = async (req, res) => {
  try {
    const { userId, hostelId } = req.body;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(hostelId)) {
      return res.status(400).json({ success: false, mssg: "Invalid user or hostel ID" });
    }

    const like = await Like.findOneAndDelete({ userId, hostelId });

    if (!like) {
      return res.status(404).json({ success: false, mssg: "Like not found" });
    }

    res.json({ success: true, mssg: "Hostel removed from liked list" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, mssg: error.message });
  }
};

// Get Liked Hostels
export const getLiked = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, mssg: "Invalid user ID" });
    }

    const likes = await Like.find({ userId });

    const hostelIds = likes
      .map((like) => like.hostelId)
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    const likedHostels = await Product.find({ _id: { $in: hostelIds } });

    res.json({ success: true, hostels: likedHostels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, mssg: error.message });
  }
};
