// routes/roommateRoutes.js
import express from 'express';
import {
  createRoommatePost,
  getRoommatePosts,
  getRoommatePostById,
  updateRoommatePost,
  deleteRoommatePost,
  getUserRoommatePosts,
  showInterestInPost,
  getInterestedUsers,
  removeInterestFromPost,
  // Add these new imports
   getmyposts,
 
} from '../controller/Roommatecontroller.js';

import { isLoggedin } from '../middelwares/auth.js';

const roommaterfinder = express.Router();

// Public Routes (no authentication required)
roommaterfinder.get('/posts', getRoommatePosts); // Get all posts with filters and pagination
roommaterfinder.get('/posts/:id', getRoommatePostById); // Get single post by ID

// Protected Routes (authentication required)
roommaterfinder.post('/posts', isLoggedin, createRoommatePost); // Create new post with image upload
roommaterfinder.put('/posts/:id', isLoggedin, updateRoommatePost); // Update post with image handling
roommaterfinder.delete('/posts/:id', isLoggedin, deleteRoommatePost); // Delete post with image cleanup

// User-specific routes
roommaterfinder.get('/users/:userId/posts', getUserRoommatePosts); // Get posts by specific user ID

// Updated: Use dedicated getMyPosts function instead of redirect
roommaterfinder.get('/my-posts', isLoggedin,  getmyposts); // Get current user's posts with stats



// Interest management routes
roommaterfinder.post('/posts/:id/interest', isLoggedin, showInterestInPost); // Show interest in a post
roommaterfinder.delete('/posts/:id/interest', isLoggedin, removeInterestFromPost); // Remove interest from a post
roommaterfinder.get('/posts/:id/interested-users', isLoggedin, getInterestedUsers); // Get list of interested users (owner only)

export default roommaterfinder;