import express from "express";
import { getMessages, getUsersForSidebar, markMessagesAsSeen, sendMessage } from "../controller/Messagecontroller.js";
import adminauth from "../middelwares/adminauth.js";

const MessageRoute = express.Router();

MessageRoute.get("/getusers",adminauth, getUsersForSidebar);
MessageRoute.patch('/seen/:messageId',adminauth, markMessagesAsSeen);
MessageRoute.post('/send',adminauth, sendMessage);
MessageRoute.get("/getmessages/:userId",adminauth, getMessages);

export default MessageRoute;
