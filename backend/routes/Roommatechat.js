// routes/roommateChatRoutes.js
import express from "express";
import { 
  sendRoommateMessage, 
  getRoommateMessages, 

  markRoommateMessagesSeen 
} from "../controller/Roommatechatconteoller.js"; 

import { isLoggedin } from "../middelwares/auth.js";

const roommateChatRouter = express.Router();

// Send a message to a roommate
roommateChatRouter.post("/send", isLoggedin, sendRoommateMessage);

// Get chat history between current user and a roommate
roommateChatRouter.get("/messages/:userId", isLoggedin, getRoommateMessages);



// Mark roommate messages as seen
roommateChatRouter.put("/messages/:userId/seen", isLoggedin, markRoommateMessagesSeen);

export default roommateChatRouter;
