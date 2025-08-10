import express from 'express';
import { addLike, removeLike, getLiked, checkLikeStatus } from '../controller/Likecontroller.js';
import { isLoggedin } from '../middelwares/auth.js';

const LikeRoute = express.Router();

// Add a like - POST /api/likes/add
LikeRoute.post('/add', isLoggedin, addLike);

// Remove a like - DELETE /api/likes/remove (or POST for consistency)
LikeRoute.post('/remove', isLoggedin, removeLike);
// Alternative: LikeRoute.delete('/remove', isLoggedin, removeLike);

// Get liked hostels - GET /api/likes
LikeRoute.get('/', isLoggedin, getLiked);

// Check if specific hostel is liked - GET /api/likes/check/:hostelId
LikeRoute.get('/check/:hostelId', isLoggedin, checkLikeStatus);

export default LikeRoute;