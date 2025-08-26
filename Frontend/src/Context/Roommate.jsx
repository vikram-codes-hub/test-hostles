import React, { createContext, useContext, useCallback } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "./auth";

export const Roommatecontext = createContext();

const RoommateProvider = ({ children }) => {
   const { axios, socket, selecteduser: selectedUser, setSelectedUser, token, authuser } = useContext(AuthContext); 

  // Create Roommate Post with Image Upload Support
  const CreateRoommatepost = async (formData) => {
    try {
      const res = await axios.post("/api/roommate/posts", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (res.data.success) {
        toast.success("Roommate post created successfully");
        // Log image upload statistics if available
        if (res.data.imageStats) {
          console.log("Image upload stats:", res.data.imageStats);
        }
        return res.data.data;
      } else {
        toast.error(res.data.message || "Failed to create roommate post");
        // Show validation errors if available
        if (res.data.errors && Array.isArray(res.data.errors)) {
          res.data.errors.forEach(error => toast.error(error));
        }
        return null;
      }
    } catch (error) {
      console.error("Error creating roommate post:", error);
      toast.error(error.response?.data?.message || "Failed to create roommate post");
      return null;
    }
  };

  // Get All Roommate Posts with Filters and Pagination
  const getRoommatePosts = useCallback(async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add all filter parameters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });
      
      const queryString = queryParams.toString();
      const url = queryString ? `/api/roommate/posts?${queryString}` : "/api/roommate/posts";
      
      const res = await axios.get(url, {
        headers: { Authorization: token },
      });

      if (res.data.success) {
        console.log("Roommate posts fetched successfully:", res.data.data);
        return res.data.data; // Contains posts, pagination, and filters
      } else {
        toast.error(res.data.message || "Failed to fetch roommate posts");
        return { posts: [], pagination: null, filters: {} };
      }
    } catch (error) {
      console.error("Error fetching roommate posts:", error);
      toast.error(error.response?.data?.message || "Failed to fetch roommate posts");
      return { posts: [], pagination: null, filters: {} };
    }
  }, [axios, token]);

  // Get Roommate Post by ID
  const GetRoommatepostbyid = async (id) => {
    try {
      const res = await axios.get(`/api/roommate/posts/${id}`, {
        headers: { Authorization: token },
      });

      if (res.data.success) {
        return res.data.data; // Contains post and userRelation
      } else {
        toast.error(res.data.message || "Failed to fetch roommate post");
        return null;
      }
    } catch (error) {
      console.error("Error fetching roommate post by ID:", error);
      toast.error(error.response?.data?.message || "Failed to fetch roommate post by ID");
      return null;
    }
  };


  // Get My Posts with Stats and Filtering 
  const getMyPosts = useCallback(async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add all filter parameters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });
      
      const queryString = queryParams.toString();
      const url = queryString ? `/api/roommate/my-posts?${queryString}` : "/api/roommate/my-posts";
      
      const res = await axios.get(url, {
        headers: { Authorization: token },
      });

      if (res.data.success) {
        return res.data.data; // Contains posts, stats, pagination, and filters
      } else {
        toast.error(res.data.message || "Failed to fetch your posts");
        return { posts: [], stats: {}, pagination: null, filters: {} };
      }
    } catch (error) {
      console.error("Error fetching user's posts:", error);
      toast.error(error.response?.data?.message || "Failed to fetch your posts");
      return { posts: [], stats: {}, pagination: null, filters: {} };
    }
  }, [axios, token]);


  // Update Post with Image Handling
  const updatepost = async (id, formData) => {
    try {
      const res = await axios.put(`/api/roommate/posts/${id}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      
      if (res.data.success) {
        toast.success("Roommate post updated successfully");
        // Log image update statistics if available
        if (res.data.imageStats) {
          console.log("Image update stats:", res.data.imageStats);
        }
        return res.data.data;
      } else {
        toast.error(res.data.message || "Failed to update roommate post");
        // Show validation errors if available
        if (res.data.errors && Array.isArray(res.data.errors)) {
          res.data.errors.forEach(error => toast.error(error));
        }
        return null;
      }
    } catch (error) {
      console.error("Error updating roommate post:", error);
      toast.error(error.response?.data?.message || "Failed to update roommate post");
      return null;
    }
  };

  // Delete Post with Image Cleanup
  const Deletepost = async (id) => {
    try {
      const res = await axios.delete(`/api/roommate/posts/${id}`, {
        headers: { Authorization: token },
      });
      
      if (res.data.success) {
        toast.success("Roommate post deleted successfully");
        // Log image deletion info if available
        if (res.data.data.imagesDeleted) {
          console.log(`${res.data.data.imagesDeleted} images deleted from Cloudinary`);
        }
        return res.data.data;
      } else {
        toast.error(res.data.message || "Failed to delete roommate post");
        return null;
      }
    } catch (error) {
      console.error("Error deleting roommate post:", error);
      toast.error(error.response?.data?.message || "Failed to delete roommate post");
      return null;
    }
  };

  // Get current user's posts 
  const getUserRoommatePosts = useCallback(async () => {
    try {
      const res = await axios.get("/api/roommate/my-posts", {
        headers: { Authorization: token },
      });

      if (res.data.success) {
        return res.data.data; // Contains posts, totalPosts, and user info
      } else {
        toast.error(res.data.message || "Failed to fetch your roommate posts");
        return { posts: [], totalPosts: 0 };
      }
    } catch (error) {
      console.error("Error fetching user's roommate posts:", error);
      toast.error(error.response?.data?.message || "Failed to fetch your roommate posts");
      return { posts: [], totalPosts: 0 };
    }
  }, [axios, token]);

  // Get posts by specific user ID - FIXED URL PATH
  const getRoommatePostsByUserId = useCallback(async (userId) => {
    try {
      const res = await axios.get(`/api/roommate/users/${userId}/posts`, {
        headers: { Authorization: token },
      });

      if (res.data.success) {
        return res.data.data; // Contains posts, totalPosts, and user info
      } else {
        toast.error(res.data.message || "Failed to fetch user's roommate posts");
        return { posts: [], totalPosts: 0 };
      }
    } catch (error) {
      console.error("Error fetching user's roommate posts:", error);
      toast.error(error.response?.data?.message || "Failed to fetch user's roommate posts");
      return { posts: [], totalPosts: 0 };
    }
  }, [axios, token]);

  // Show interest in post
  const showInterestInPost = async (id) => {
    try {
      const res = await axios.post(`/api/roommate/posts/${id}/interest`, {}, {
        headers: { Authorization: token },
      });
      
      if (res.data.success) {
        toast.success("Interest shown in the post successfully");
        return res.data.data; // Contains postId, interestedCount, and post info
      } else {
        toast.error(res.data.message || "Failed to show interest in post");
        return null;
      }
    } catch (error) {
      console.error("Error showing interest in post:", error);
      toast.error(error.response?.data?.message || "Failed to show interest in post");
      return null;
    }
  };

  // Remove interest from post
  const removeInterest = async (id) => {
    try {
      const res = await axios.delete(`/api/roommate/posts/${id}/interest`, {
        headers: { Authorization: token },
      });
      
      if (res.data.success) {
        toast.success("Interest removed from the post successfully");
        return res.data.data; // Contains postId, interestedCount, and post info
      } else {
        toast.error(res.data.message || "Failed to remove interest from post");
        return null;
      }
    } catch (error) {
      console.error("Error removing interest from post:", error);
      toast.error(error.response?.data?.message || "Failed to remove interest from post");
      return null;
    }
  };

  // Get all interested users for a post (Owner only)
  const getAllInterestedUsers = async (id) => {
    try {
      const res = await axios.get(`/api/roommate/posts/${id}/interested-users`, {
        headers: { Authorization: token },
      });
      
      if (res.data.success) {
        return res.data.data; // Contains postId, interestedCount, and interestedUsers array
      } else {
        toast.error(res.data.message || "Failed to fetch interested users");
        return { interestedUsers: [], interestedCount: 0, postId: id };
      }
    } catch (error) {
      console.error("Error fetching interested users:", error);
      toast.error(error.response?.data?.message || "Failed to fetch interested users");
      return { interestedUsers: [], interestedCount: 0, postId: id };
    }
  };

  // Helper function to convert file to base64 (for image uploads)
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Helper function to convert multiple files to base64
  const filesToBase64 = async (files) => {
    try {
      const fileArray = Array.from(files);
      const base64Promises = fileArray.map(file => fileToBase64(file));
      return await Promise.all(base64Promises);
    } catch (error) {
      console.error("Error converting files to base64:", error);
      toast.error("Error processing images");
      return [];
    }
  };

  // ===== CHAT FUNCTIONS =====

  // Send message to selected user
  const sendMessageToSelectedUser = async (receiverId, message) => {
    try {
      if (!authuser) {
        toast.error("Please login to send messages");
        return null;
      }

      if (!receiverId || !message?.trim()) {
        toast.error("Receiver and message are required");
        return null;
      }

      const res = await axios.post("/api/roommate-chat/send", {
        receiverId,
        message: message.trim()
      }, {
        headers: { Authorization: token },
      });

      if (res.data.success) {
        // Don't show success toast for messages to avoid spam
        return res.data.message;
      } else {
        toast.error(res.data.mssg || "Failed to send message");
        return null;
      }
    } catch (error) {
      console.error("Error sending roommate message:", error);
      toast.error(error.response?.data?.mssg || "Failed to send message");
      return null;
    }
  };

  // Fetch messages with selected user
  const getMessagesWithSelectedUser = useCallback(async (userId) => {
    try {
      if (!authuser) {
        toast.error("Please login to view messages");
        return [];
      }

      if (!userId) {
        toast.error("User ID is required");
        return [];
      }

      const res = await axios.get(`/api/roommate-chat/messages/${userId}`, {
        headers: { Authorization: token },
      });

      if (res.data.success) {
        return res.data.messages || [];
      } else {
        toast.error(res.data.mssg || "Failed to fetch messages");
        return [];
      }
    } catch (error) {
      console.error("Error fetching roommate messages:", error);
      toast.error(error.response?.data?.mssg || "Failed to fetch messages");
      return [];
    }
  }, [axios, token, authuser]);

  // Mark messages as read
  const markRoommateMessagesSeen = async (userId) => {
    try {
      if (!authuser) {
        toast.error("Please login to mark messages as seen");
        return null;
      }

      if (!userId) {
        toast.error("User ID is required");
        return null;
      }

      const res = await axios.put(`/api/roommate-chat/messages/${userId}/seen`, {}, {
        headers: { Authorization: token },
      });

      if (res.data.success) {
        // Optional: show success message
        // toast.success(`${res.data.modifiedCount} messages marked as seen`);
        return res.data;
      } else {
        toast.error(res.data.mssg || "Failed to mark messages as seen");
        return null;
      }
    } catch (error) {
      console.error("Error marking roommate messages as seen:", error);
      toast.error(error.response?.data?.mssg || "Failed to mark messages as seen");
      return null;
    }
  };

  // Initialize chat with a user
  const initializeChat = async (userId) => {
    try {
      if (!authuser) {
        toast.error("Please login to start chatting");
        return false;
      }

      if (!userId) {
        toast.error("User ID is required to start chat");
        return false;
      }

      // Set the selected user for chat
      if (setSelectedUser) {
        setSelectedUser({ _id: userId });
      }

      return true;
    } catch (error) {
      console.error("Error initializing chat:", error);
      toast.error("Failed to initialize chat");
      return false;
    }
  };

  // Helper function to get latest message with a user
  const getLatestMessageWith = useCallback(async (userId) => {
    try {
      if (!authuser || !userId) return null;

      const messages = await getMessagesWithSelectedUser(userId);
      
      if (messages.length === 0) return null;

      // Return the latest message
      return messages[messages.length - 1];
    } catch (error) {
      console.error("Error getting latest message:", error);
      return null;
    }
  }, [getMessagesWithSelectedUser, authuser]);

  const value = {
    // Post functions
    CreateRoommatepost,
    getRoommatePosts,
    GetRoommatepostbyid,
    updatepost,
    Deletepost,
    getUserRoommatePosts,
    getRoommatePostsByUserId, 
    showInterestInPost,
    removeInterest,
    getAllInterestedUsers,
    getMyPosts,
    
    // Helper functions for image handling
    fileToBase64,
    filesToBase64,
    
    // Chat functions
    sendMessageToSelectedUser,
    getMessagesWithSelectedUser,
    markRoommateMessagesSeen,
    initializeChat,
    getLatestMessageWith
  };

  return (
    <Roommatecontext.Provider value={value}>
      {children}
    </Roommatecontext.Provider>
  );
};

export default RoommateProvider;