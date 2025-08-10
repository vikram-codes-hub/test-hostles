import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "./authcontext";

export const ChatContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

const ChatContextProvider = ({ children }) => {
  const [selecteduser, setSelectedUser] = useState(null);
  const [users, setusers] = useState([]);
  const [messages, setmessages] = useState([]);
  const [unseenmessages, setunseenmessages] = useState({});
  const [loading, setLoading] = useState(false);

  // Use isAuthReady to wait for AuthContext initialization
  const { socket, token, authUser, isAuthReady } = useContext(AuthContext);

  // Fetch users who have messaged admin
  const fetchUser = async () => {
    try {
      setLoading(true);
      
      const currentToken = token || localStorage.getItem("token");
      
      if (!currentToken) {
        toast.error("No authentication token found. Please login again.");
        return;
      }

    
      const response = await axios({
        method: 'GET',
        url: '/api/message/getusers',
        headers: {
          'authorization': currentToken,  
          'token': currentToken,          
          'Content-Type': 'application/json'
        }
      });
      
      const data = response.data;
    console.log("Fetched users:", data);
      if (data.success) {
        setusers(data.users);
        
        // Build unseen messages map
        const unseenMap = {};
        data.users.forEach(user => {
          unseenMap[user.userId] = user.unseenCount || 0;
        });
        setunseenmessages(unseenMap);
      } else {
        toast.error(data.mssg || "Failed to fetch users");
      }
    } catch (error) {      
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 403) {
        toast.error("Access denied. Admin only.");
      } else {
        toast.error("Failed to fetch users. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages between admin and selected user
  const fetchMessages = async (userId) => {
    try {
      if (!userId) {
        toast.error("Invalid user selected");
        return [];
      }
      
      const currentToken = token || localStorage.getItem("token");
      
      if (!currentToken) {
        toast.error("Please login to view messages");
        return [];
      }
      
      setLoading(true);
      
      const response = await axios({
        method: 'GET',
        url: `/api/message/getmessages/${userId}`,
        headers: {
          'authorization': currentToken,  // For isLoggedin middleware
          'token': currentToken,          // For adminauth middleware (if used)
          'Content-Type': 'application/json'
        }
      });
      
      const data = response.data;
      
      if (data.success) {
        setmessages(data.messages || []);
        
        // Update unseen messages count to 0 for this user
        setunseenmessages((prev) => ({
          ...prev,
          [userId]: 0
        }));
        
        return data.messages || [];
      } else {
        toast.error(data.mssg || "Failed to fetch messages");
        setmessages([]);
        return [];
      }
    } catch (error) {      
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 403) {
        toast.error("Access denied. You don't have permission to view these messages.");
      } else {
        toast.error("Failed to fetch messages. Please check your connection.");
      }
      
      setmessages([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async (message) => {
    try {
      if (!message || !message.receiverId || !message.message?.trim()) {
        toast.error("Invalid message data");
        return;
      }

      const currentToken = token || localStorage.getItem("token");

      const response = await axios({
        method: 'POST',
        url: '/api/message/send',
        headers: {
          'authorization': currentToken,  // For isLoggedin middleware
          'token': currentToken,          // For adminauth middleware (if used)
          'Content-Type': 'application/json'
        },
        data: message
      });
      
      const data = response.data;
      
      if (data.success) {
        setmessages((prev) => [...prev, data.message]);
        
        // Emit to socket for real-time updates
        if (socket) {
          socket.emit("sendMessage", data.message);
        }
      } else {
        toast.error(data.mssg || "Failed to send message");
      }
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  // Mark messages from user as seen
  const markMessagesAsSeen = async (userId) => {
    try {
      const currentToken = token || localStorage.getItem("token");

      const response = await axios({
        method: 'PATCH',
        url: `/api/message/seen/${userId}`,
        headers: {
          'authorization': currentToken,  // For isLoggedin middleware
          'token': currentToken,          // For adminauth middleware (if used)
          'Content-Type': 'application/json'
        },
        data: {}
      });
      
      const data = response.data;
      
      if (data.success) {
        setunseenmessages((prev) => ({ ...prev, [userId]: 0 }));
      } else {
        toast.error(data.mssg || "Failed to mark messages as seen");
      }
    } catch (error) {
      toast.error("Failed to mark messages as seen");
    }
  };

  // Set selected user and auto-fetch messages + mark as seen
  const openChatWithUser = async (user) => {
    setSelectedUser(user);
    
    const userId = user.userId || user._id;
    if (userId) {
      await fetchMessages(userId);
      await markMessagesAsSeen(userId);
    }
  };

  // Listen for real-time incoming messages from users
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {      
      const senderId = message.senderId?._id || message.senderId;

      // If currently chatting with this user, add message to current chat
      if (selecteduser && (senderId === selecteduser._id || senderId === selecteduser.userId)) {
        setmessages((prev) => [...prev, message]);
        // Auto-mark as seen since admin is viewing the conversation
        markMessagesAsSeen(senderId);
      } else {
        // Update unseen count for other users
        setunseenmessages((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1
        }));
        
        // Refresh users list to show new conversation
        fetchUser();
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, selecteduser]);

  
  useEffect(() => {    
 
    if (isAuthReady && token && authUser) {
      fetchUser();
    }
  }, [token, authUser, isAuthReady]); 

  const values = {
    selecteduser,
    setSelectedUser: openChatWithUser,
    users,
    messages,
    unseenmessages,
    loading,
    fetchUser,
    fetchMessages,
    sendMessage,
    markMessagesAsSeen,
  };

  return (
    <ChatContext.Provider value={values}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;