import mongoose from "mongoose";
import Like from "../modules/Like.js";
import Product from "../modules/Product.js";

// Add Like
export const addLike = async (req, res) => {
  try {
    const userId = req.user._id; // Get from auth middleware
    const { hostelId } = req.body;

    // Validate hostel ID
    if (!mongoose.Types.ObjectId.isValid(hostelId)) {
      return res.status(400).json({ success: false, message: "Invalid hostel ID" });
    }

    // Check if hostel exists
    const hostel = await Product.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ success: false, message: "Hostel not found" });
    }

    // Check if already liked
    const existingLike = await Like.findOne({ userId, hostelId });
    if (existingLike) {
      return res.status(400).json({ success: false, message: "Hostel already liked" });
    }

    // Create new like
    const like = new Like({ userId, hostelId });
    await like.save();

    res.json({ success: true, message: "Hostel liked successfully" });
  } catch (error) {
    console.error("Add like error:", error);
    
    // Handle duplicate key error from database unique index
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Hostel already liked" });
    }
    
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove Like
export const removeLike = async (req, res) => {
  try {
    const userId = req.user._id; // Get from auth middleware
    const { hostelId } = req.body;

    // Validate hostel ID
    if (!mongoose.Types.ObjectId.isValid(hostelId)) {
      return res.status(400).json({ success: false, message: "Invalid hostel ID" });
    }

    // Remove like
    const like = await Like.findOneAndDelete({ userId, hostelId });

    if (!like) {
      return res.status(404).json({ success: false, message: "Like not found" });
    }

    res.json({ success: true, message: "Hostel removed from liked list" });
  } catch (error) {
    console.error("Remove like error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Liked Hostels
export const getLiked = async (req, res) => {
  try {
    const userId = req.user._id; // Get from auth middleware

    // Get all likes for the user with populated hostel data
    const likes = await Like.find({ userId })
      .populate({
        path: 'hostelId',
        model: 'Product'
      })
      .sort({ likedAt: -1 }); // Most recent likes first

    // Filter out likes where hostel might have been deleted and extract hostel data
    const likedHostels = likes
      .filter(like => like.hostelId)
      .map(like => ({
        ...like.hostelId.toObject(),
        likedAt: like.likedAt // Include when it was liked
      }));

    res.json({ 
      success: true, 
      hostels: likedHostels,
      count: likedHostels.length 
    });
  } catch (error) {
    console.error("Get liked error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Check if hostel is liked (useful for frontend)
export const checkLikeStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { hostelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(hostelId)) {
      return res.status(400).json({ success: false, message: "Invalid hostel ID" });
    }

    const like = await Like.findOne({ userId, hostelId });
    
    res.json({ 
      success: true, 
      isLiked: !!like 
    });
  } catch (error) {
    console.error("Check like status error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};