import express from "express";
import { getAdminId, getMessages, getUsersForSidebar, markMessagesAsSeen, sendMessage } from "../controller/Messagecontroller.js";
import adminauth from "../middelwares/adminauth.js";
import { isLoggedin } from "../middelwares/auth.js";

const MessageRoute = express.Router();

// Admin only routes
MessageRoute.get("/getusers", isLoggedin, adminauth, getUsersForSidebar);


// Routes for both users and admin  
MessageRoute.post('/send', isLoggedin, sendMessage);
MessageRoute.get("/getmessages/:userId", isLoggedin, getMessages);
MessageRoute.patch('/seen/:userId', isLoggedin, markMessagesAsSeen);
// Route for users to get admin ID
MessageRoute.get("/getadminid", isLoggedin, getAdminId);

export default MessageRoute;