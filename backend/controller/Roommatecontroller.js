// controllers/roommateController.js

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
      const populatedPost = await Roommate.findById(savedPost._id).populate('userId', 'name email');

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
};

export const deleteRoommatePost = async (req, res) => {
 // Logic for deleting roommate post
};

export const getUserRoommatePosts = async (req, res) => {
 // Logic for getting posts by specific user
};

// Search & Filter Functions
export const searchRoommatePosts = async (req, res) => {
 // Logic for searching posts with filters
};

// Interaction Functions
export const showInterestInPost = async (req, res) => {
 // Logic for showing interest in a post
};

export const getInterestedUsers = async (req, res) => {
 // Logic for getting interested users for a post
};

// Utility Functions
export const incrementPostViews = async (req, res) => {
 // Logic for incrementing post views
};