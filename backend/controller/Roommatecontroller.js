import mongoose from "mongoose";
import Roommate from "../modules/Roommate.js";
import cloudinary from "../config/cloudinary.js";

// Helper function to upload images to Cloudinary
const uploadImagesToCloudinary = async (images) => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return [];
  }

  try {
    // Filter only base64 images
    const base64Images = images.filter(img => 
      typeof img === 'string' && img.startsWith('data:image/')
    );

    if (base64Images.length === 0) {
      return [];
    }

    // Limit to 10 images maximum
    const imagesToUpload = base64Images.slice(0, 10);
    
    const uploadPromises = imagesToUpload.map(async (image, index) => {
      try {
        const result = await cloudinary.uploader.upload(image, {
          folder: 'roommate-finder',
          public_id: `roommate-${Date.now()}-${index}`,
          resource_type: 'image',
          // Optimization settings
          quality: 'auto:good',
          format: 'webp',
          transformation: [
            {
              width: 1200,
              height: 800,
              crop: 'limit'
            }
          ]
        });

        return result.secure_url;
      } catch (error) {
        console.error(`Failed to upload image ${index}:`, error);
        return null;
      }
    });

    const uploadResults = await Promise.all(uploadPromises);
    
    // Filter out failed uploads
    return uploadResults.filter(url => url !== null);

  } catch (error) {
    console.error('Error uploading images to Cloudinary:', error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

// Helper function to delete images from Cloudinary
const deleteImagesFromCloudinary = async (imageUrls) => {
  if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
    return;
  }

  try {
    const deletePromises = imageUrls.map(async (url) => {
      try {
        // Extract public_id from Cloudinary URL
        const matches = url.match(/\/roommate-finder\/([^\.]+)/);
        if (matches && matches[1]) {
          const publicId = `roommate-finder/${matches[1]}`;
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (error) {
        console.error('Failed to delete image:', url, error);
      }
    });

    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting images from Cloudinary:', error);
  }
};

// Helper function to get time ago
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

// Logic for creating new roommate post
export const createRoommatePost = async (req, res) => {
  let uploadedImageUrls = [];
  
  try {
    const {
      type,
      title,
      description,
      budget,
      rent,
      location,
      preferences,
      roomDetails,
      contact,
      images
    } = req.body;
    
    const userId = req.user.id || req.user._id;

    // Basic validation
    if (!type || !title || !description || !location?.area || !location?.city || !contact?.phone) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing: type, title, description, location (area, city), and contact phone"
      });
    }

    // Type-specific validation
    if (type === 'room_available' && !rent) {
      return res.status(400).json({
        success: false,
        message: "Rent is required for room_available posts"
      });
    }

    if (type === 'looking_for_roommate' && (!budget?.min && !budget?.max)) {
      return res.status(400).json({
        success: false,
        message: "Budget range is required for looking_for_roommate posts"
      });
    }

    // Check for existing active post
    const existingActivePost = await Roommate.findOne({
      userId,
      type,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (existingActivePost) {
      return res.status(400).json({
        success: false,
        message: `You already have an active ${type.replace('_', ' ')} post. Please deactivate it first.`
      });
    }

    // Upload images to Cloudinary if provided
    if (images && Array.isArray(images) && images.length > 0) {
      try {
        uploadedImageUrls = await uploadImagesToCloudinary(images);
      } catch (imageError) {
        return res.status(400).json({
          success: false,
          message: imageError.message
        });
      }
    }

    // Create new roommate post
    const newRoommatePost = new Roommate({
      userId,
      type,
      title,
      description,
      budget,
      rent,
      location,
      preferences,
      roomDetails,
      contact,
      images: uploadedImageUrls
    });

    const savedPost = await newRoommatePost.save();
    
    // Populate user details for response
    const populatedPost = await Roommate.findById(savedPost._id)
      .populate('userId', 'fullName email');

    res.status(201).json({
      success: true,
      message: "Roommate post created successfully",
      data: populatedPost,
      imageStats: {
        totalImagesProvided: images?.length || 0,
        imagesUploadedSuccessfully: uploadedImageUrls.length
      }
    });

  } catch (error) {
    console.error("Error creating roommate post:", error);
    
    // Cleanup uploaded images on error
    if (uploadedImageUrls.length > 0) {
      await deleteImagesFromCloudinary(uploadedImageUrls);
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

//logic for fething all the posts
export const getmyposts= async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const {
      page = 1,
      limit = 10,
      type,
      status = 'all', // 'all', 'active', 'inactive', 'expired'
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    const filter={ userId };
    if (type && ['looking_for_roommate', 'room_available'].includes(type)) {
      filter.type = type;
    }

    //add status filter
     const currentDate = new Date();
    switch (status) {
      case 'active':
        filter.isActive = true;
        filter.expiresAt = { $gt: currentDate };
        break;
      case 'inactive':
        filter.isActive = false;
        break;
      case 'expired':
        filter.expiresAt = { $lte: currentDate };
        break;
      case 'all':
      default:
        // No additional filter for 'all'
        break;
    }
 const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const posts = await Roommate.find(filter)
      .populate('userId', 'fullName email')
      .populate('interested.userId', 'fullName email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const totalPosts = await Roommate.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limitNum);

    // Calculate stats
    const allUserPosts = await Roommate.find({ userId }).lean();
    const stats = {
      totalPosts: allUserPosts.length,
      activePosts: allUserPosts.filter(post => 
        post.isActive && new Date(post.expiresAt) > currentDate
      ).length,
      inactivePosts: allUserPosts.filter(post => !post.isActive).length,
      expiredPosts: allUserPosts.filter(post => 
        new Date(post.expiresAt) <= currentDate
      ).length,
      totalViews: allUserPosts.reduce((sum, post) => sum + (post.views || 0), 0),
      totalInterested: allUserPosts.reduce((sum, post) => 
        sum + (post.interested ? post.interested.length : 0), 0
      ),
      roomAvailablePosts: allUserPosts.filter(post => post.type === 'room_available').length,
      lookingForRoommatePosts: allUserPosts.filter(post => post.type === 'looking_for_roommate').length
    };

    // Add calculated fields to posts
    const postsWithStats = posts.map(post => {
      const isExpired = new Date(post.expiresAt) <= currentDate;
      const daysLeft = isExpired ? 0 : Math.ceil((new Date(post.expiresAt) - currentDate) / (24 * 60 * 60 * 1000));
      
      return {
        ...post,
        isExpired,
        isExpiringSoon: !isExpired && daysLeft <= 7,
        daysLeft,
        interestedCount: post.interested ? post.interested.length : 0,
        timeAgo: getTimeAgo(post.createdAt),
        status: isExpired ? 'expired' : (post.isActive ? 'active' : 'inactive')
      };
    });

    res.status(200).json({
      success: true,
      data: {
        posts: postsWithStats,
        stats,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalPosts,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
          limit: limitNum
        },
        filters: {
          type,
          status,
          sortBy,
          sortOrder
        }
      }
    });

  } catch (error) {
    console.error("Error getting user's posts:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving your posts",
      error: error.message
    });
  }
};

// Logic for getting all roommate posts with pagination
export const getRoommatePosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      city,
      area,
      minBudget,
      maxBudget,
      gender,
      roomType,
      occupation,
      furnishing,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {
      isActive: true,
      expiresAt: { $gt: new Date() }
    };

    // Add filters based on query parameters
    if (type && ['looking_for_roommate', 'room_available'].includes(type)) {
      filter.type = type;
    }

    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }

    if (area) {
      filter['location.area'] = { $regex: area, $options: 'i' };
    }

    if (gender && ['male', 'female', 'any'].includes(gender)) {
      filter['preferences.gender'] = gender;
    }

    if (occupation && ['student', 'working_professional', 'any'].includes(occupation)) {
      filter['preferences.occupation'] = occupation;
    }

    if (roomType && ['single', 'shared', '1bhk', '2bhk', '3bhk'].includes(roomType)) {
      filter['roomDetails.roomType'] = roomType;
    }

    if (furnishing && ['fully_furnished', 'semi_furnished', 'unfurnished'].includes(furnishing)) {
      filter['roomDetails.furnishing'] = furnishing;
    }

    // Budget filtering
    if (minBudget || maxBudget) {
      const budgetConditions = [];
      
      if (minBudget) {
        budgetConditions.push(
          { 'budget.min': { $gte: parseInt(minBudget) } },
          { 'budget.max': { $gte: parseInt(minBudget) } },
          { 'rent': { $gte: parseInt(minBudget) } }
        );
      }
      
      if (maxBudget) {
        budgetConditions.push(
          { 'budget.min': { $lte: parseInt(maxBudget) } },
          { 'budget.max': { $lte: parseInt(maxBudget) } },
          { 'rent': { $lte: parseInt(maxBudget) } }
        );
      }
      
      if (budgetConditions.length > 0) {
        filter.$or = budgetConditions;
      }
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const posts = await Roommate.find(filter)
      .populate('userId', 'fullName email')
      .populate('interested.userId', 'fullName')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const totalPosts = await Roommate.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limitNum);

    // Add calculated fields
    const postsWithStats = posts.map(post => ({
      ...post,
      isExpiringSoon: new Date(post.expiresAt) - new Date() < 7 * 24 * 60 * 60 * 1000,
      daysLeft: Math.ceil((new Date(post.expiresAt) - new Date()) / (24 * 60 * 60 * 1000)),
      interestedCount: post.interested ? post.interested.length : 0,
      timeAgo: getTimeAgo(post.createdAt),
      // Hide interested users list from public view
      interested: undefined
    }));

    res.status(200).json({
      success: true,
      data: {
        posts: postsWithStats,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalPosts,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
          limit: limitNum
        },
        filters: {
          type,
          city,
          area,
          minBudget,
          maxBudget,
          gender,
          roomType,
          occupation,
          furnishing
        }
      }
    });

  } catch (error) {
    console.error("Error getting roommate posts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Logic for getting single roommate post by ID
export const getRoommatePostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format"
      });
    }

    const post = await Roommate.findById(id)
      .populate('userId', 'fullName email createdAt')
      .populate('interested.userId', 'fullName email')
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Roommate post not found"
      });
    }

    const isExpired = new Date(post.expiresAt) < new Date();

    const postWithStats = {
      ...post,
      isExpired,
      isExpiringSoon: !isExpired && (new Date(post.expiresAt) - new Date() < 7 * 24 * 60 * 60 * 1000),
      daysLeft: isExpired ? 0 : Math.ceil((new Date(post.expiresAt) - new Date()) / (24 * 60 * 60 * 1000)),
      interestedCount: post.interested ? post.interested.length : 0,
      timeAgo: getTimeAgo(post.createdAt)
    };

    const userId = req.user?.id || req.user?._id;
    const isOwner = userId && userId.toString() === post.userId._id.toString();
    const hasShownInterest = userId && post.interested?.some(interest => 
      interest.userId._id.toString() === userId.toString()
    );

    if (!isOwner) {
      // Hide full contact details for non-owners
      postWithStats.contact = {
        preferredContact: post.contact.preferredContact,
        ...(hasShownInterest && {
          phone: post.contact.phone,
          email: post.contact.email,
          whatsapp: post.contact.whatsapp
        })
      };
      
      // Hide detailed interested users list from non-owners
      postWithStats.interested = undefined;
    }

    res.status(200).json({
      success: true,
      data: {
        post: postWithStats,
        userRelation: {
          isOwner,
          hasShownInterest: hasShownInterest || false,
          canContact: isOwner || hasShownInterest
        }
      }
    });
   
  } catch (error) {
    console.error("Error getting roommate post by ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Logic for updating roommate post
export const updateRoommatePost = async (req, res) => {
  let newlyUploadedImages = [];
  let oldImages = [];
  
  try {
    const { id } = req.params;
    const {
      type,
      title,
      description,
      budget,
      rent,
      location,
      preferences,
      roomDetails,
      contact,
      images
    } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format"
      });
    }

    // Find the existing post
    const existingPost = await Roommate.findById(id);
    
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Roommate post not found"
      });
    }

    // Check if post is expired
    if (new Date(existingPost.expiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot update expired post"
      });
    }

    // Store old images for cleanup if needed
    oldImages = existingPost.images || [];

    // Prepare update object
    const updateData = {
      updatedAt: new Date()
    };

    // Only update fields that are provided
    if (type !== undefined) updateData.type = type;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (budget !== undefined) updateData.budget = budget;
    if (rent !== undefined) updateData.rent = rent;
    if (location !== undefined) updateData.location = location;
    if (preferences !== undefined) updateData.preferences = preferences;
    if (roomDetails !== undefined) updateData.roomDetails = roomDetails;
    if (contact !== undefined) updateData.contact = contact;

    // Handle images update
    if (images !== undefined) {
      if (Array.isArray(images) && images.length > 0) {
        // Upload new images to Cloudinary
        try {
          newlyUploadedImages = await uploadImagesToCloudinary(images);
          updateData.images = newlyUploadedImages;
        } catch (imageError) {
          return res.status(400).json({
            success: false,
            message: imageError.message
          });
        }
      } else {
        updateData.images = [];
      }
    }

    // Validate required fields
    const finalType = type || existingPost.type;
    const finalTitle = title || existingPost.title;
    const finalDescription = description || existingPost.description;
    const finalLocation = location || existingPost.location;
    const finalContact = contact || existingPost.contact;

    if (!finalType || !finalTitle || !finalDescription || !finalLocation?.area || !finalLocation?.city || !finalContact?.phone) {
      // Cleanup newly uploaded images if validation fails
      if (newlyUploadedImages.length > 0) {
        await deleteImagesFromCloudinary(newlyUploadedImages);
      }
      return res.status(400).json({
        success: false,
        message: "Cannot remove required fields: type, title, description, location (area, city), and contact phone"
      });
    }

    // Type-specific validation
    const finalRent = rent !== undefined ? rent : existingPost.rent;
    const finalBudget = budget !== undefined ? budget : existingPost.budget;

    if (finalType === 'room_available' && !finalRent) {
      if (newlyUploadedImages.length > 0) {
        await deleteImagesFromCloudinary(newlyUploadedImages);
      }
      return res.status(400).json({
        success: false,
        message: "Rent is required for room_available posts"
      });
    }

    if (finalType === 'looking_for_roommate' && (!finalBudget?.min && !finalBudget?.max)) {
      if (newlyUploadedImages.length > 0) {
        await deleteImagesFromCloudinary(newlyUploadedImages);
      }
      return res.status(400).json({
        success: false,
        message: "Budget range is required for looking_for_roommate posts"
      });
    }

    // Check for duplicate active posts if changing type
    if (type && type !== existingPost.type) {
      const userId = req.user.id || req.user._id;
      const duplicatePost = await Roommate.findOne({
        userId: userId,
        type: type,
        isActive: true,
        expiresAt: { $gt: new Date() },
        _id: { $ne: id }
      });

      if (duplicatePost) {
        if (newlyUploadedImages.length > 0) {
          await deleteImagesFromCloudinary(newlyUploadedImages);
        }
        return res.status(400).json({
          success: false,
          message: `You already have an active ${type.replace('_', ' ')} post. Please deactivate it first.`
        });
      }
    }

    // Update the post
    const updatedPost = await Roommate.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true,
        runValidators: true
      }
    ).populate('userId', 'fullName email');

    // Delete old images from Cloudinary if images were updated
    if (images !== undefined && oldImages.length > 0) {
      await deleteImagesFromCloudinary(oldImages);
    }

    res.status(200).json({
      success: true,
      message: "Roommate post updated successfully",
      data: updatedPost,
      imageStats: {
        oldImagesDeleted: images !== undefined ? oldImages.length : 0,
        newImagesUploaded: newlyUploadedImages.length
      }
    });

  } catch (error) {
    console.error("Error updating roommate post:", error);
    
    // Cleanup newly uploaded images on error
    if (newlyUploadedImages.length > 0) {
      await deleteImagesFromCloudinary(newlyUploadedImages);
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Logic for deleting roommate post
export const deleteRoommatePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format"
      });
    }

    // Find the post first to get images for cleanup
    const postToDelete = await Roommate.findById(id);

    if (!postToDelete) {
      return res.status(404).json({
        success: false,
        message: "Roommate post not found"
      });
    }

    // Delete images from Cloudinary
    if (postToDelete.images && postToDelete.images.length > 0) {
      await deleteImagesFromCloudinary(postToDelete.images);
    }

    // Delete the post from database
    const deletedPost = await Roommate.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Roommate post deleted successfully",
      data: {
        deletedPostId: id,
        imagesDeleted: postToDelete.images?.length || 0
      }
    });

  } catch (error) {
    console.error("Error deleting roommate post:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting roommate post",
      error: error.message
    });
  }
};

// Logic for getting posts by specific user
export const getUserRoommatePosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    const posts = await Roommate.find({ 
      userId, 
      isActive: true, 
      expiresAt: { $gt: new Date() } 
    })
      .populate('userId', 'fullName email')
      .populate('interested.userId', 'fullName email')
      .sort({ createdAt: -1 })
      .lean();

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No active roommate posts found for this user"
      });
    }

    // Add calculated fields
    const postsWithStats = posts.map(post => {
      const currentUserId = req.user?.id || req.user?._id;
      const isOwner = currentUserId && currentUserId.toString() === post.userId._id.toString();
      
      return {
        ...post,
        isExpired: new Date(post.expiresAt) < new Date(),
        isExpiringSoon: new Date(post.expiresAt) - new Date() < 7 * 24 * 60 * 60 * 1000,
        daysLeft: Math.ceil((new Date(post.expiresAt) - new Date()) / (24 * 60 * 60 * 1000)),
        interestedCount: post.interested ? post.interested.length : 0,
        timeAgo: getTimeAgo(post.createdAt),
        // Hide interested users list if not owner
        interested: isOwner ? post.interested : undefined
      };
    });

    res.status(200).json({
      success: true,
      data: {
        posts: postsWithStats,
        totalPosts: posts.length,
        user: posts[0]?.userId
      }
    });

  } catch (error) {
    console.error("Error getting user roommate posts:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving user roommate posts",
      error: error.message
    });
  }
};

// Logic for showing interest in a post
export const showInterestInPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format"
      });
    }

    // Find the post
    const post = await Roommate.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Roommate post not found"
      });
    }

    // Check if post is active and not expired
    if (!post.isActive || new Date(post.expiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot show interest in inactive or expired post"
      });
    }

    // Check if user is trying to show interest in their own post
    if (post.userId.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot show interest in your own post"
      });
    }

    // Check if user has already shown interest
    const hasAlreadyShownInterest = post.interested.some(
      interest => interest.userId.toString() === userId.toString()
    );

    if (hasAlreadyShownInterest) {
      return res.status(400).json({
        success: false,
        message: "You have already shown interest in this post"
      });
    }

    // Add user to interested list
    post.interested.push({
      userId: userId,
      interestedAt: new Date()
    });

    // Save the updated post
    const updatedPost = await post.save();

    // Populate the updated post for response
    const populatedPost = await Roommate.findById(updatedPost._id)
      .populate('userId', 'fullName email')
      .populate('interested.userId', 'fullName email');

    res.status(200).json({
      success: true,
      message: "Interest shown successfully",
      data: {
        postId: id,
        interestedCount: populatedPost.interested.length,
        post: {
          title: populatedPost.title,
          type: populatedPost.type,
          owner: populatedPost.userId
        }
      }
    });

  } catch (error) {
    console.error("Error showing interest in post:", error);
    res.status(500).json({
      success: false,
      message: "Error showing interest in post",
      error: error.message
    });
  }
};

// Logic for getting interested users for a post
export const getInterestedUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format"
      });
    }

    // Find the post with interested users populated
    const post = await Roommate.findById(id)
      .populate('userId', 'fullName email')
      .populate('interested.userId', 'fullName email createdAt');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Roommate post not found"
      });
    }

    // Check if post is active and not expired
    if (!post.isActive || new Date(post.expiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot get interested users for inactive or expired post"
      });
    }

    // Check if the current user is the owner of the post
    const isOwner = post.userId._id.toString() === userId.toString();

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view interested users for this post"
      });
    }

    // Return interested users only if the user is the owner
    const interestedUsers = post.interested.map(interest => ({
      userId: interest.userId._id,
      fullName: interest.userId.fullName,
      email: interest.userId.email,
      interestedAt: interest.interestedAt,
      timeAgo: getTimeAgo(interest.interestedAt)
    }));

    res.status(200).json({
      success: true,
      data: {
        postId: id,
        interestedCount: interestedUsers.length,
        interestedUsers
      }
    });
  
  } catch (error) {
    console.error("Error getting interested users:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving interested users",
      error: error.message
    });
  }
};

// Logic for removing interest from a post
export const removeInterestFromPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format"
      });
    }

    // Find the post
    const post = await Roommate.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Roommate post not found"
      });
    }

    // Check if post is active and not expired
    if (!post.isActive || new Date(post.expiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot remove interest from inactive or expired post"
      });
    }

    // Check if user has shown interest in this post
    const interestIndex = post.interested.findIndex(
      interest => interest.userId.toString() === userId.toString()
    );

    if (interestIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "You have not shown interest in this post"
      });
    }

    // Remove user from interested list
    post.interested.splice(interestIndex, 1);

    // Save the updated post
    const updatedPost = await post.save();

    // Populate the updated post for response
    const populatedPost = await Roommate.findById(updatedPost._id)
      .populate('userId', 'fullName email')
      .populate('interested.userId', 'fullName email');

    res.status(200).json({
      success: true,
      message: "Interest removed successfully",
      data: {
        postId: id,
        interestedCount: populatedPost.interested.length,
        post: {
          title: populatedPost.title,
          type: populatedPost.type,
          owner: populatedPost.userId
        }
      }
    });

  } catch (error) {
    console.error("Error removing interest from post:", error);
    res.status(500).json({
      success: false,
      message: "Error removing interest from post",
      error: error.message
    });
  }
};