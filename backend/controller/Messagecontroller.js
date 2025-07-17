import Message from "../modules/message.js";
import userModel from "../modules/User.js";

// For admin: get users who have sent messages
export const getUsersForSidebar = async (req, res) => {
  try {
    // Get admin from database
    const admin = await userModel.findOne({ role: "admin" });
    if (!admin) {
      return res.status(404).json({ success: false, mssg: "Admin not found" });
    }

    const adminId = admin._id; 

    // Fetch messages where the admin is the receiver
    const messages = await Message.find({ receiverId: adminId }).sort({ createdAt: -1 });

    const userMap = new Map();

    for (const msg of messages) {
      const senderId = msg.senderId.toString();

      if (!userMap.has(senderId)) {
        // Count unseen messages from this user to admin
        const unseenCount = await Message.countDocuments({
          senderId,
          receiverId: adminId,
          seen: false,
        });

        userMap.set(senderId, {
          userId: senderId,
          lastMessage: msg.text,
          lastMessageTime: msg.createdAt,
          unseenCount,
        });
      }
    }

    const users = Array.from(userMap.values());

    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, mssg: "Failed to fetch users" });
  }
};

//get all messages between admin and user

export const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;

         const admin = await userModel.findOne({ role: "admin" });
    if (!admin) {
      return res.status(404).json({ success: false, mssg: "Admin not found" });
    }

    const adminId = admin._id;

    //get all messages between admin and user

    const messages = await Message.find({
            $or: [
                { sender: adminId, receiver: userId },
                { sender: userId, receiver: adminId }
            ]
        }).sort({ createdAt: 1  });

        res.json({ success: true, messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, mssg: "Failed to fetch messages" });
    }
}

//mark message as seen using messgageId


export const markMessagesAsSeen = async (req, res) => {
  try {
    const { userId } = req.params;

   
    const admin = await userModel.findOne({ role: "admin" });
    if (!admin) {
      return res.status(404).json({ success: false, mssg: "Admin not found" });
    }

    const adminId = admin._id;

    // Update all unseen messages from user to admin
    await Message.updateMany(
      {
        senderId: userId,
        receiverId: adminId,
        seen: false
      },
      {
        $set: { seen: true }
      }
    );

    res.json({ success: true, mssg: "Messages marked as seen" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, mssg: "Failed to update messages" });
  }
};


//send message from user to admin or from admin to user

export const sendMessage = async (req, res) => {
    try {
         const { senderId, receiverId, text } = req.body;

         if (!senderId || !receiverId || !text) {
      return res.status(400).json({ success: false, mssg: "Missing required fields" });
    }
    
     const message = new Message({
      senderId,
      receiverId,
      text,
      seen: false,
      createdAt: Date.now()
    });
     await message.save();

    res.json({ success: true, mssg: "Message sent", message });


    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, mssg: "Failed to send message" });
    }



}