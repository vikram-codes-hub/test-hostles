
import mongoose from "mongoose";
import Roommate from "../modules/Roommate.js";


// Logic for creating new roommate post
export const createRoommatePost = async (req, res) => {
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

    if (!type || !title || !description || !location?.area || !location?.city || !contact?.phone) {
     return res.status(400).json({
       success: false,
       message: "Required fields missing: type, title, description, location (area, city), and contact phone"
     });
   }

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

   const existingActivePost=await Roommate.findOne({
    userId,type,isActive:true,  expiresAt: { $gt: new Date() }
   })

    if (existingActivePost) {
     return res.status(400).json({
       success: false,
       message: `You already have an active ${type.replace('_', ' ')} post. Please deactivate it first.`
     });
   }
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
     images: images || []
   });

   const newpost=await newRoommatePost.save()
      const populatedPost = await Roommate.findById(newpost._id).populate('userId', 'name email');

         res.status(201).json({
     success: true,
     message: "Roommate post created successfully",
     data: populatedPost
   });
 } catch (error) {
     console.error("Error creating roommate post:", error);
   
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
      expiresAt: { $gt: new Date() } // Only active and non-expired posts
    };

    // Add filters based on query parameters
    if (type && ['looking_for_roommate', 'room_available'].includes(type)) {
      filter.type = type;
    }

    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' }; // Case insensitive
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

    // Execute query with your exact schema fields
    const posts = await Roommate.find(filter)
      .populate('userId', 'name email phone') // Populate user details
      .populate('interested.userId', 'name') // Populate interested users
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean(); // Use lean() for better performance

    // Get total count for pagination
    const totalPosts = await Roommate.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limitNum);

    // Add calculated fields based on your schema
    const postsWithStats = posts.map(post => ({
      ...post,
      isExpiringSoon: new Date(post.expiresAt) - new Date() < 7 * 24 * 60 * 60 * 1000, // Expires in 7 days
      daysLeft: Math.ceil((new Date(post.expiresAt) - new Date()) / (24 * 60 * 60 * 1000)),
      interestedCount: post.interested ? post.interested.length : 0,
      // Hide interested users list from public view (only show count)
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
   const post =await Roommate.findById(id).populate('userId', 'name email phone createdAt').populate('interested.userId', 'name email').lean()

   if(!post){
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
     // Hide full contact details for non-owners, show only preferred contact method
     postWithStats.contact = {
       preferredContact: post.contact.preferredContact,
       // Only show contact if user has shown interest or it's public policy
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

    // Prepare update object - ONLY include fields that are provided
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
    if (images !== undefined) updateData.images = images;

    // Validate required fields only if they're being updated
    const finalType = type || existingPost.type;
    const finalTitle = title || existingPost.title;
    const finalDescription = description || existingPost.description;
    const finalLocation = location || existingPost.location;
    const finalContact = contact || existingPost.contact;

    if (!finalType || !finalTitle || !finalDescription || !finalLocation?.area || !finalLocation?.city || !finalContact?.phone) {
      return res.status(400).json({
        success: false,
        message: "Cannot remove required fields: type, title, description, location (area, city), and contact phone"
      });
    }

    // Type-specific validation
    const finalRent = rent !== undefined ? rent : existingPost.rent;
    const finalBudget = budget !== undefined ? budget : existingPost.budget;

    if (finalType === 'room_available' && !finalRent) {
      return res.status(400).json({
        success: false,
        message: "Rent is required for room_available posts"
      });
    }

    if (finalType === 'looking_for_roommate' && (!finalBudget?.min && !finalBudget?.max)) {
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
        return res.status(400).json({
          success: false,
          message: `You already have an active ${type.replace('_', ' ')} post. Please deactivate it first.`
        });
      }
    }

    // Update the post (only provided fields)
    const updatedPost = await Roommate.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true,
        runValidators: true
      }
    ).populate('userId', 'name email phone');

    res.status(200).json({
      success: true,
      message: "Roommate post updated successfully",
      data: updatedPost
    });

  } catch (error) {
    console.error("Error updating roommate post:", error);
    
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

    // Find and delete the post
    const deletedPost = await Roommate.findByIdAndDelete(id);

    // Check if post existed
    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        message: "Roommate post not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Roommate post deleted successfully",
      data: {
        deletedPostId: id,
        deletedPost: deletedPost
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
      .populate('userId', 'name email phone')
      .populate('interested.userId', 'name email')
      .sort({ createdAt: -1 }) // Sort by creation date, most recent first
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
        user: posts[0]?.userId // User details from first post
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
      .populate('userId', 'name email phone')
      .populate('interested.userId', 'name email');

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
      .populate('userId', 'name email phone')
      .populate('interested.userId', 'name email phone createdAt');

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
      name: interest.userId.name,
      email: interest.userId.email,
      phone: interest.userId.phone,
      interestedAt: interest.interestedAt
    }));
    res.status(200).json({
      success: true,
      data: {
        postId: id,
        interestedCount: interestedUsers.length,
        interestedUsers
      }
    })  ;
  
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
      .populate('userId', 'name email phone')
      .populate('interested.userId', 'name email');

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
