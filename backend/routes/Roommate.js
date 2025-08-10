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
  removeInterestFromPost

} from '../controller/Roommatecontroller.js' 
import { isLoggedin } from '../middelwares/auth.js'; 

const roommaterfinder = express.Router();

// Public Routes (no authentication required)
roommaterfinder.get('/posts', getRoommatePosts); // Get all posts
roommaterfinder.get('/posts/:id', getRoommatePostById); // Get single post
// roommaterfinder.put('/posts/:id/views', incrementPostViews); // Commented out - not implemented

// Protected Routes (authentication required)
roommaterfinder.post('/posts', isLoggedin, createRoommatePost); // Create post
roommaterfinder.put('/posts/:id', isLoggedin, updateRoommatePost); // Update post
roommaterfinder.delete('/posts/:id', isLoggedin, deleteRoommatePost); // Delete post
roommaterfinder.get('/my-posts', isLoggedin, getUserRoommatePosts); // Get user's posts
roommaterfinder.post('/posts/:id/interest', isLoggedin, showInterestInPost); // Show interest
roommaterfinder.delete('/posts/:id/interest', isLoggedin, removeInterestFromPost); // Remove interest
roommaterfinder.get('/posts/:id/interested-users', isLoggedin, getInterestedUsers); // Get interested users

export default roommaterfinder;