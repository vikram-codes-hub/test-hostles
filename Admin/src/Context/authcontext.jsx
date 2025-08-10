import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

export const AuthContext = createContext();
const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Proper initialization without backend verification
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["token"] = storedToken;
      
      // Decode token to get user info (without backend call)
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        
        // Check if token is expired
        if (payload.exp * 1000 < Date.now()) {
          logout();
        } else {
          // Create user object from token
          const userData = {
            _id: payload.id,
            role: payload.role,
            // Add other fields from your token if needed
          };
          setAuthUser(userData);
        }
      } catch (error) {
        logout();
      }
    }
    
    // Mark auth as ready
    setIsAuthReady(true);
  }, []);

  // Socket Connection 
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const currentToken = token || localStorage.getItem("token");
    
    if (!currentToken) {
      return;
    }

    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
        token: currentToken 
      },
    });

    newSocket.on("getOnlineUsers", (ids) => {
      setOnlineUsers(ids);
    });

    newSocket.on("connect_error", (error) => {
      if (error.message === "Authentication error") {
        toast.error("Authentication failed. Please login again.");
        logout();
      }
    });

    setSocket(newSocket);
  };

  // Connect socket when user is set
  useEffect(() => {
    if (authUser && isAuthReady) {
      connectSocket(authUser);
    }
  }, [authUser, isAuthReady]);

  // Common handler for login/register
  const handleAuthSuccess = (data) => {
    setToken(data.token);
    localStorage.setItem("token", data.token);
    axios.defaults.headers.common["token"] = data.token;

    if (data.user) {
      setAuthUser(data.user);
      connectSocket(data.user);
    }
  };

  // Login
  const login = async (credentials) => {
    try {
      const { data } = await axios.post("/api/auth/login", credentials);
      if (data.success) {
        handleAuthSuccess(data);
        toast.success(data.mssg || "Login successful");
        return data;
      } else {
        toast.error(data.mssg || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.mssg || "Login error");
    }
  };

  // Register Admin
  const registerAdmin = async (adminData) => {
    try {
      const { data } = await axios.post("/api/auth/registeradmin", adminData);

      if (data.success) {
        handleAuthSuccess(data);
        toast.success(data.mssg || "Admin registered successfully");
        return data;
      } else {
        toast.error(data.mssg || "Admin registration failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.mssg || "Admin registration error");
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    socket?.disconnect();
    setSocket(null);
    delete axios.defaults.headers.common["token"];
    toast.success("Logged out successfully");
  };

  // Hostel Controllers
  const addHostel = async (payload) => {
    try {
      const { data } = await axios.post("/api/admin/addhostel", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: token,
        },
      });
      if (data.success) toast.success("Hostel added successfully");
      else toast.error(data.mssg || "Add hostel failed");
      return data;
    } catch (error) {
      toast.error(error.response?.data?.mssg || "Add hostel error");
    }
  };

  const removeHostel = async (id) => {
    try {
      const { data } = await axios.post(
        "/api/admin/remove",
        { id },
        {
          headers: {
            token: token,
          },
        }
      );
      if (data.success) toast.success("Hostel removed");
      else toast.error(data.mssg || "Remove hostel failed");
      return data;
    } catch (error) {
      toast.error(error.response?.data?.mssg || "Remove hostel error");
    }
  };

  const listHostels = async () => {
    try {
      const { data } = await axios.get("/api/admin/listhostels", {
        headers: {
          "Content-Type": "multipart/form-data",
          token: token,
        },
      });
      if (data.success) return data.hostel;
      else toast.error(data.mssg || "Failed to fetch hostels");
    } catch (error) {
      toast.error(error.response?.data?.mssg || "Hostel list error");
    }
  };

  const getSingleHostelInfo = async (id) => {
    try {
      const { data } = await axios.get(`/api/hostel/singelhostelinfo/${id}`);
      if (data.success) return data;
      else toast.error(data.mssg || "Failed to fetch hostel info");
    } catch (error) {
      toast.error(error.response?.data?.mssg || "Get hostel info error");
    }
  };

  const edithostel = async (id, payload) => {
    try {
      const { data } = await axios.put(`/api/admin/edithostel/${id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: token,
        },
      });

      if (data.success) toast.success("Hostel updated");
      else toast.error(data.mssg || "Update hostel failed");
      return data;
    } catch (error) {
      toast.error(error.response?.data?.mssg || "Edit hostel error");
    }
  };

  const values = {
    axios,
    token,
    login,
    registerAdmin,
    logout,
    authUser,
    socket,
    onlineUsers,
    connectSocket,
    addHostel,
    removeHostel,
    listHostels,
    getSingleHostelInfo,
    edithostel,
    isAuthReady,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;