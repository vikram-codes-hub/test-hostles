import express from 'express';
const LikeRoute = express.Router();
import { addLike, removeLike, getLiked } from '../controller/Likecontroller.js';

// Add a like
LikeRoute.post('/addlike', addLike);
// Remove a like
LikeRoute.post('/removelike', removeLike);  
// Get liked hostels
LikeRoute.post('/getliked', getLiked);
export default LikeRoute;