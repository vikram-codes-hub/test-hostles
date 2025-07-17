import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "./authcontext";

export const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {
  const [selecteduser, setSelectedUser] = useState(null);
  const [users, setusers] = useState([]);
  const [messages, setmessages] = useState([]);
  const [unseenmessages, setunseenmessages] = useState({});
  const [loading, setLoading] = useState(false);

  const { socket, axios: authAxios } = useContext(AuthContext); // renaming to avoid conflict with imported axios

  // fetch all users
  const fetchUser = async () => {
    try {
      const { data } = await authAxios.get("/api/message/getusers");
      if (data.success) {
        setusers(data.users);
        setunseenmessages(data.unseenMessages);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to fetch users");
    }
  };

  // fetch messages between admin and user
  const fetchMessages = async (userId) => {
    try {
      const { data } = await authAxios.get(`/api/message/getmessages/${userId}`);
      if (data.success) {
        setmessages(data.messages);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      toast.error("Failed to fetch messages");
    }
  };

  // send message
  const sendMessage = async (message) => {
    try {
      const { data } = await authAxios.post('/api/message/send', message);
      if (data.success) {
        setmessages((prev) => [...prev, data.message]);
        socket.emit("sendMessage", data.message);
        toast.success("Message sent successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  // mark messages as seen
  const markMessagesAsSeen = async (userId) => {
    try {
      const { data } = await authAxios.patch(`/api/message/seen/${userId}`);
      if (data.success) {
        setunseenmessages((prev) => ({ ...prev, [userId]: 0 }));
        toast.success("Messages marked as seen");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Failed to mark messages as seen:", error);
      toast.error("Failed to mark messages as seen");
    }
  };

  const values = {
    selecteduser,
    setSelectedUser,
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
