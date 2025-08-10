import Message from "../modules/message.js";
import userModel from "../modules/User.js";
import mongoose from "mongoose";

// For admin: get users who have sent messages
export const getUsersForSidebar = async (req, res) => {
  try {
    const adminId = req.user.id;

    // Verify user is admin
    const admin = await userModel.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ success: false, mssg: "Access denied. Admin only." });
    }

    // Fetch messages where the admin is the receiver
    const messages = await Message.find({ receiverId: adminId }).sort({ createdAt: -1 });

    if (messages.length === 0) {
      return res.json({ success: true, users: [] });
    }

    const userMap = new Map();
    const userIds = [];

    // First pass: collect unique user IDs and build basic structure
    for (const msg of messages) {
      const senderId = msg.senderId.toString();

      if (!userMap.has(senderId)) {
        userIds.push(senderId);
        userMap.set(senderId, {
          userId: senderId,
          lastMessage: msg.text,
          lastMessageTime: msg.createdAt,
          unseenCount: 0,
        });
      }
    }

    // Batch fetch all users at once 
    const usersData = await userModel.find({ 
      _id: { $in: userIds } 
    }).select("fullName email profilePic");

    // Create a lookup map for users
    const userLookup = {};
    usersData.forEach(user => {
      userLookup[user._id.toString()] = user;
    });

    // Second pass: add user details and count unseen messages
    for (const [senderId, userData] of userMap) {
      const user = userLookup[senderId];
      
      // Add user details
      userData.fullName = user?.fullName || "Unknown User";
      userData.userEmail = user?.email || "";
      userData.profilePic = user?.profilePic || "";

      // Count unseen messages from this user to admin
      userData.unseenCount = await Message.countDocuments({
        senderId,
        receiverId: adminId,
        seen: false,
      }); 
      // console.log(`User ${userData.fullName} has ${userData.unseenCount} unseen messages`);
    }

    const users = Array.from(userMap.values());

    // Sort by last message time (newest first)
    users.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
    console.log(users)
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error);
    res.status(500).json({ success: false, mssg: "Failed to fetch users" });
  }
};

// FIXED: Get messages between admin and user (unique conversation)
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // console.log(`Getting messages - Current User: ${currentUserId}, Target User: ${userId}`);

    // Validate userId parameter
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, mssg: "Invalid user ID" });
    }

    // Get current user details
    const currentUser = await userModel.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ success: false, mssg: "User not found" });
    }

    let adminId, regularUserId;

    if (currentUser.role === "admin") {
      // Admin is viewing conversation with a regular user
      adminId = currentUserId;
      regularUserId = userId;
      
      // Verify the other user exists and is not admin
      const otherUser = await userModel.findById(userId);
      if (!otherUser) {
        return res.status(404).json({ success: false, mssg: "User not found" });
      }
      if (otherUser.role === "admin") {
        return res.status(400).json({ success: false, mssg: "Cannot view conversation between admins" });
      }

      // console.log(`Admin ${adminId} fetching messages with User ${regularUserId}`);
      
    } else {
      // Regular user is viewing conversation with specific admin
      regularUserId = currentUserId;
      
      // The userId in params should be the admin they want to chat with
      const targetAdmin = await userModel.findById(userId);
      if (!targetAdmin) {
        return res.status(404).json({ success: false, mssg: "Admin not found" });
      }
      if (targetAdmin.role !== "admin") {
        return res.status(403).json({ 
          success: false, 
          mssg: "You can only chat with admins" 
        });
      }
      
      adminId = userId; // The admin they want to chat with
      console.log(`User ${regularUserId} fetching messages with Admin ${adminId}`);
    }

   
    const messages = await Message.find({
      $or: [
        { senderId: adminId, receiverId: regularUserId },
        { senderId: regularUserId, receiverId: adminId }
      ]
    })
    .populate('senderId', 'name email role')
    .populate('receiverId', 'name email role')
    .sort({ createdAt: 1 });

    console.log(`Found ${messages.length} messages between Admin ${adminId} and User ${regularUserId}`);

    // If current user is admin, mark messages from regular user as seen
    if (currentUser.role === "admin") {
      const updateResult = await Message.updateMany(
        {
          senderId: regularUserId,
          receiverId: adminId,
          seen: false
        },
        {
          $set: { seen: true }
        }
      );
      console.log(`Marked ${updateResult.modifiedCount} messages as seen`);
    }

    res.json({ 
      success: true, 
      messages,
      adminId: adminId.toString(),
      userId: regularUserId.toString(),
      totalMessages: messages.length
    });

  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ success: false, mssg: "Failed to fetch messages" });
  }
};

// Mark messages as seen
export const markMessagesAsSeen = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // Verify current user is admin
    const currentUser = await userModel.findById(currentUserId);
    if (!currentUser || currentUser.role !== "admin") {
      return res.status(403).json({ success: false, mssg: "Access denied. Admin only." });
    }

    // Update all unseen messages from user to admin
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

// IMPROVED: Send message with better validation
export const sendMessage = async (req, res) => {
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

    // Validate chat rules: only admin-user conversations allowed
    if (sender.role === "admin" && receiver.role === "admin") {
      return res.status(400).json({ success: false, mssg: "Admins cannot chat with each other" });
    }
    
    if (sender.role !== "admin" && receiver.role !== "admin") {
      return res.status(400).json({ success: false, mssg: "Regular users can only chat with admins" });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: message.trim(),
      seen: false,
    });

    await newMessage.save();

    // Populate the message before sending response
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('senderId', 'name email role')
      .populate('receiverId', 'name email role');

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


//fetch admin ID 
export const getAdminId = async (req, res) => {
  try {
   
    res.status(400).json({ 
      success: false, 
      mssg: "This endpoint is deprecated. Please get admin ID from hostel data." 
    });
  } catch (error) {
    console.error("Error in getAdminId:", error);
    res.status(500).json({ success: false, mssg: "Failed to fetch admin ID" });
  }
};