import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "./auth";

export const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {
  // FIXED: Use authuser instead of user to match AuthContext
  const { axios, socket, selecteduser: selectedUser, setSelectedUser, token, authuser } = useContext(AuthContext); 

  // State management
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState({}); 
  const [unseenMessages, setUnseenMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentChatAdmin, setCurrentChatAdmin] = useState(null);
  const [chatInfo, setChatInfo] = useState(null); 

  // Get user role - FIXED: use authuser
  const isAdmin = authuser?.role === "admin";

  // Helper function to generate consistent conversation keys
  const getConversationKey = useCallback((userId1, userId2, isCurrentUserAdmin = isAdmin) => {
    if (isCurrentUserAdmin) {
      return `admin_${authuser?.id || authuser?._id}_user_${userId1 === (authuser?.id || authuser?._id) ? userId2 : userId1}`;
    } else {
      return `user_${authuser?.id || authuser?._id}_admin_${userId1 === (authuser?.id || authuser?._id) ? userId2 : userId1}`;
    }
  }, [isAdmin, authuser?.id, authuser?._id]);

  // NEW: Initialize chat from hostel page 
  const initializeChat = ({ adminId, userId, hostelInfo }) => {
    if (!authuser) {
      toast.error("Please login to start chatting");
      return false;
    }

    if (!adminId || !userId) {
      toast.error("Missing required chat information");
      return false;
    }

    // Set current chat admin
    setCurrentChatAdmin(adminId);
    
    // Set selected user for UI (this will fix your issue)
    setSelectedUser({
      userId: adminId,
      userName: hostelInfo?.ownerName || hostelInfo?.name || "Hostel Admin",
      userEmail: hostelInfo?.email || "",
      hostelName: hostelInfo?.name || "Hostel"
    });
    
    // Store hostel info for chat header
    setChatInfo(hostelInfo);
    
    // Clear previous messages and fetch new ones
    setMessages([]);
    fetchMessages(adminId);
    
    return true;
  };

  // Clear chat state
  const clearChat = () => {
    setCurrentChatAdmin(null);
    setSelectedUser(null);
    setMessages([]);
    setChatInfo(null);
  };

  // Clean up old conversations to prevent memory leaks
  const cleanupOldConversations = useCallback(() => {
    setConversations(prev => {
      const keys = Object.keys(prev);
      if (keys.length > 20) { 
        const sortedKeys = keys.sort();
        const keysToKeep = sortedKeys.slice(-20);
        const cleanedConversations = {};
        keysToKeep.forEach(key => {
          cleanedConversations[key] = prev[key];
        });
        return cleanedConversations;
      }
      return prev;
    });
  }, []);

  // Fetch messages between current user and specific admin/user
  const fetchMessages = async (targetUserId, hostelId = null) => {
    try {
      if (!targetUserId) {
        toast.error("Invalid user selected");
        return [];
      }

      if (!token || !authuser) {
        toast.error("Please login to view messages");
        return [];
      }

      setLoading(true);
      
      const { data } = await axios.get(`/api/message/getmessages/${targetUserId}`, {
        headers: {
          Authorization: token,
        },
      });
      
      if (data.success) {
        const fetchedMessages = data.messages || [];
        setMessages(fetchedMessages);
        
        // Store conversation with consistent key
        const conversationKey = getConversationKey(authuser._id || authuser.id, targetUserId);
        
        setConversations(prev => ({
          ...prev,
          [conversationKey]: fetchedMessages
        }));
        
        // Update unseen messages count to 0 for this user
        setUnseenMessages((prev) => ({
          ...prev,
          [targetUserId]: 0
        }));
        
        // Set current chat admin if user is chatting with admin
        if (!isAdmin) {
          setCurrentChatAdmin(targetUserId);
        }
        
        // Clean up old conversations
        cleanupOldConversations();
        
        return fetchedMessages;
      } else {
        toast.error(data.mssg || "Failed to fetch messages");
        setMessages([]);
        return [];
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 403) {
        toast.error("Access denied. You don't have permission to view these messages.");
      } else if (error.response?.status === 404) {
        toast.error("No messages found between users.");
        setMessages([]);
      } else if (error.response?.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Failed to fetch messages. Please check your connection.");
      }
      
      setMessages([]); 
      return [];
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: Start chat with specific hostel admin (kept for backward compatibility)
  const startChatWithHostelAdmin = async (hostelAdminId, hostelName = "") => {
    try {
      if (!hostelAdminId) {
        toast.error("Hostel admin not available");
        return false;
      }

      if (!authuser) {
        toast.error("Please login to start chat");
        return false;
      }
      
      // Use the new initializeChat function
      return initializeChat({
        adminId: hostelAdminId,
        userId: authuser._id,
        hostelInfo: {
          name: hostelName,
          ownerName: `${hostelName} Admin`
        }
      });
      
    } catch (error) {
      toast.error("Failed to start chat");
      return false;
    }
  };

  // Send a message
  const sendMessage = async (messageText, receiverId = null) => {
    try {
      if (!messageText?.trim()) {
        toast.error("Message cannot be empty");
        return false;
      }

      if (!authuser || !token) {
        toast.error("Please login to send messages");
        return false;
      }

      // For users: use current chat admin or provided receiverId
      // For admins: use selected user or provided receiverId
      const targetReceiverId = receiverId || 
        (isAdmin ? selectedUser?.userId : currentChatAdmin);
      
      if (!targetReceiverId) {
        toast.error(isAdmin ? "Please select a user to chat with" : "Admin not available");
        return false;
      }

      const messageData = {
        receiverId: targetReceiverId,
        message: messageText.trim()
      };

      const { data } = await axios.post("/api/message/send", messageData, {
        headers: {
          Authorization: token,
        },
      });

      if (data.success) {
        const newMessage = data.message;
        
        // Add message to current messages
        setMessages((prev) => [...prev, newMessage]);
        
        // Update conversation with consistent key
        const conversationKey = getConversationKey(authuser._id || authuser.id, targetReceiverId);
        
        setConversations(prev => ({
          ...prev,
          [conversationKey]: [...(prev[conversationKey] || []), newMessage]
        }));
        
        // Emit socket event if socket is available
        if (socket) {
          socket.emit("sendMessage", newMessage);
        }
        
        return true;
      } else {
        toast.error(data.mssg || "Failed to send message");
        return false;
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 404) {
        toast.error("Recipient not found");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
      return false;
    }
  };

  // Mark messages as seen (for admin use)
  const markMessagesAsSeen = async (userId) => {
    try {
      if (!isAdmin) {
        return false;
      }

      if (!token) {
        toast.error("Authentication required");
        return false;
      }

      const { data } = await axios.put(`/api/message/seen/${userId}`, {}, {
        headers: {
          Authorization: token,
        },
      });
      
      if (data.success) {
        setUnseenMessages((prev) => ({ ...prev, [userId]: 0 }));
        
        // Update messages in state to mark them as seen
        setMessages((prev) => 
          prev.map((msg) => 
            msg.senderId._id === userId ? { ...msg, seen: true } : msg
          )
        );
        
        return true;
      } else {
        toast.error(data.mssg || "Failed to mark messages as seen");
        return false;
      }
    } catch (error) {
      toast.error("Failed to mark messages as seen");
      return false;
    }
  };

  // Get users who have messaged admin (for admin sidebar)
  const fetchUsersForSidebar = async () => {
    try {
      if (!isAdmin) {
        return [];
      }

      if (!token) {
        toast.error("Authentication required");
        return [];
      }

      setLoading(true);
      const { data } = await axios.get("/api/message/users", {
        headers: {
          Authorization: token,
        },
      });
      
      if (data.success) {
        setUsers(data.users || []);
        
        // Update unseen messages count
        const unseenCounts = {};
        (data.users || []).forEach(user => {
          unseenCounts[user.userId] = user.unseenCount || 0;
        });
        setUnseenMessages(unseenCounts);
        
        return data.users || [];
      } else {
        toast.error(data.mssg || "Failed to fetch users");
        return [];
      }
    } catch (error) {
      toast.error("Failed to fetch users");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get conversation history for user
  const getUserConversations = useCallback(() => {
    if (isAdmin || !authuser) return {};
    
    const userConversations = {};
    Object.entries(conversations).forEach(([key, msgs]) => {
      if (key.includes(`user_${authuser._id || authuser.id}_admin_`)) {
        const adminId = key.split('_admin_')[1];
        userConversations[adminId] = msgs;
      }
    });
    return userConversations;
  }, [isAdmin, authuser, conversations]);

  // NEW: Debug function to check current state
  const getChatDebugInfo = () => ({
    authUser: authuser ? `${authuser.name || 'Unknown'} (${authuser._id})` : '❌ Not set',
    token: token ? '✅ Present' : '❌ Not set',
    currentChatAdmin: currentChatAdmin ? `✅ ${currentChatAdmin}` : '❌ Not set',
    selectedUser: selectedUser ? `✅ ${selectedUser.userName || selectedUser.userId}` : '❌ Not set',
    messagesCount: messages.length,
    chatInfo: chatInfo ? `✅ ${chatInfo.name}` : '❌ Not set'
  });

  // Socket event listeners
  useEffect(() => {
    if (!socket || !authuser) return;

    const handleNewMessage = (message) => {
      const isCurrentConversation = isAdmin
        ? (selectedUser?.userId === message.senderId || selectedUser?.userId === message.receiverId)
        : (currentChatAdmin === message.senderId || currentChatAdmin === message.receiverId);
      
      if (isCurrentConversation) {
        setMessages((prev) => {
          const messageExists = prev.some(msg => 
            msg._id === message._id || 
            (msg.createdAt === message.createdAt && msg.senderId === message.senderId)
          );
          return messageExists ? prev : [...prev, message];
        });
      }

      const otherUserId = message.senderId === (authuser._id || authuser.id) ? message.receiverId : message.senderId;
      const conversationKey = getConversationKey(authuser._id || authuser.id, otherUserId);
      
      setConversations(prev => ({
        ...prev,
        [conversationKey]: [...(prev[conversationKey] || []), message]
      }));

      if (message.senderId !== (authuser._id || authuser.id) && !isCurrentConversation) {
        setUnseenMessages((prev) => ({
          ...prev,
          [message.senderId]: (prev[message.senderId] || 0) + 1
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser, currentChatAdmin, isAdmin, authuser, getConversationKey]);

  // Auto-fetch users for admin on mount
  useEffect(() => {
    if (isAdmin && token && authuser) {
      fetchUsersForSidebar();
    }
  }, [isAdmin, token, authuser]);

  // FIXED: Loading state condition - check for authuser instead of user
  if (!authuser && token) {
    return (
      <ChatContext.Provider value={{
        loading: true,
        users: [],
        messages: [],
        conversations: {},
        unseenMessages: {},
        currentChatAdmin: null,
        chatInfo: null,
        isAdmin: false,
        initializeChat: () => false,
        clearChat: () => {},
        startChatWithHostelAdmin: () => Promise.resolve(false),
        getUserConversations: () => ({}),
        sendMessage: () => Promise.resolve(false),
        fetchMessages: () => Promise.resolve([]),
        markMessagesAsSeen: () => Promise.resolve(false),
        fetchUsersForSidebar: () => Promise.resolve([]),
        getChatDebugInfo: () => ({}),
        setUsers: () => {},
        setMessages: () => {},
        setLoading: () => {},
        setCurrentChatAdmin: () => {},
        setChatInfo: () => {}
      }}>
        {children}
      </ChatContext.Provider>
    );
  }

  const values = {
    // State
    users,
    messages,
    conversations,
    unseenMessages,
    loading,
    currentChatAdmin,
    chatInfo,
    isAdmin,
    
    // NEW: Chat initialization functions
    initializeChat,
    clearChat,
    getChatDebugInfo,
    
    // User conversation functions
    startChatWithHostelAdmin,
    getUserConversations,
    
    // General functions
    sendMessage,
    fetchMessages,
    
    // Admin functions
    markMessagesAsSeen,
    fetchUsersForSidebar,
    
    // Setters
    setUsers,
    setMessages,
    setLoading,
    setCurrentChatAdmin,
    setChatInfo
  };

  return (
    <ChatContext.Provider value={values}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;