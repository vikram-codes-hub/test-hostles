import mongoose from "mongoose";
import userModel from "../modules/User.js";
import Message from "../modules/message.js";
export async function sendRoommateMessage(req, res) {

    try {
         const { receiverId, message } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !message?.trim()) {
      return res.status(400).json({ 
        success: false, 
        mssg: "Missing required fields: receiverId and message" 
      });
    }

    // Get sender details
    const sender = await userModel.findById(senderId);
    if (!sender) {
      return res.status(404).json({ success: false, mssg: "Sender not found" });
    }

    // Verify receiver exists
    const receiver = await userModel.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ success: false, mssg: "Receiver not found" });
    }

    
        const newMessage = new Message({
          senderId,
          receiverId,
          text: message.trim(),
          seen: false,
        });
    
        await newMessage.save();
 console.log(`Message sent from ${sender.role} ${senderId} to ${receiver.role} ${receiverId}`);

    res.json({ 
      success: true, 
      mssg: "Message sent successfully", 
      message: populatedMessage 
    });

  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ success: false, mssg: "Failed to send message" });
  }
};

 //chat history between two users
export async function getRoommateMessages(req, res) {

    try {
        const { userId } = req.params;
            const currentUserId = req.user.id;
        
           
        
            // Validate userId parameter
            if (!mongoose.Types.ObjectId.isValid(userId)) {
              return res.status(400).json({ success: false, mssg: "Invalid user ID" });
            }

            // Get current user details
            const currentUser = await userModel.findById(currentUserId);

             if (!currentUser) {
      return res.status(404).json({ success: false, mssg: "User not found" });
    }

    const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: userId },
                { senderId: userId, receiverId: currentUserId }
            ]
        }).sort({ createdAt: 1 });
    
       res.status(200).json({ success: true, messages });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, mssg: "Failed to get messages" });
    }
}



export async function markRoommateMessagesSeen(req, res) { 

    try {
            const { userId } = req.params;
    const currentUserId = req.user.id;

        const currentUser = await userModel.findById(currentUserId);
    if (!currentUser || currentUser.role !== "admin") {
      return res.status(403).json({ success: false, mssg: "Access denied. Admin only." });
    }

    const result = await Message.updateMany(
      {
        senderId: userId,
        receiverId: currentUserId,
        seen: false
      },
      {
        $set: { seen: true }
      }
    );

    res.json({ 
      success: true, 
      mssg: "Messages marked as seen",
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error("Error in markMessagesAsSeen:", error);
    res.status(500).json({ success: false, mssg: "Failed to update messages" });
  }
};

