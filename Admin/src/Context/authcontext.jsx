import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

export const AuthContext = createContext();
const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;

const AuthContextProvider = ({ children }) => {
  const [token, settoken] = useState(localStorage.getItem("token"));
  const [socket, setsocket] = useState(null);
  const [authuser, setauthuser] = useState(null);
  const [onlineuser, setonlineuser] = useState([]);

  // ✅ CONNECT SOCKET.IO
  const connectsocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
    });

    newSocket.on("getOnlineUsers", (ids) => {
      console.log("🔵 Online users:", ids);
      setonlineuser(ids);
    });

    setsocket(newSocket);
  };

  // ✅ LOGIN
  const login = async (credentials) => {
    try {
      const { data } = await axios.post("/api/auth/login", credentials);
      if (data.success) {
        axios.defaults.headers.common["token"] = data.token;
        settoken(data.token);
        localStorage.setItem("token", data.token);

        if (data.user) {
          setauthuser(data.user);
          connectsocket(data.user);
        }

        toast.success(data.mssg || "Login successful");
        return data;
      } else {
        toast.error(data.mssg || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.mssg || error.message);
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    settoken(null);
    setauthuser(null);
    setonlineuser([]);
    socket?.disconnect();
    setsocket(null);
    delete axios.defaults.headers.common["token"];
    toast.success("Logged out successfully");
  };

  // ✅ REGISTER
  const register = async (payload) => {
    try {
      const { data } = await axios.post("/api/auth/register", payload);
      if (data.success) {
        axios.defaults.headers.common["token"] = data.token;
        settoken(data.token);
        localStorage.setItem("token", data.token);

        if (data.user) {
          setauthuser(data.user);
          connectsocket(data.user);
        }

        toast.success("Registration successful");
        return data;
      } else {
        toast.error(data.mssg || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.mssg || error.message);
    }
  };


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/api/auth/check-auth", {
          headers: { token: localStorage.getItem("token") },
        });

        if (data.success) {
          setauthuser(data.user);
          connectsocket(data.user);
        }
      } catch (err) {
        logout();
      }
    };

    if (token) {
      axios.defaults.headers.common["token"] = token;
      fetchUser();
    }
  }, [token]);

  // ✅ HOSTEL CONTROLLERS
  const addproduct = async (payload) => {
    try {
      const { data } = await axios.post("/api/hostel/addhostel", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: localStorage.getItem("token"),
        },
      });
      if (data.success) {
        toast.success("Hostel added successfully");
      } else {
        toast.error(data.mssg || "Something went wrong");
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.mssg || error.message);
    }
  };

  const removeHostel = async (id) => {
    try {
      const { data } = await axios.post("/api/hostel/remove", { id });
      if (data.success) {
        toast.success("Hostel removed successfully");
      } else {
        toast.error(data.mssg || "Something went wrong");
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.mssg || error.message);
    }
  };

  const listHostels = async () => {
    try {
      const { data } = await axios.get("/api/hostel/listhostels");
      if (data.success) {
        return data.hostel;
      } else {
        toast.error(data.mssg || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.mssg || error.message);
    }
  };

  const getSingleHostelInfo = async (id) => {
    try {
      const { data } = await axios.get(`/api/hostel/singelhostelinfo/${id}`);
      if (data.success) {
        return data;
      } else {
        toast.error(data.mssg || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.mssg || error.message);
    }
  };

  const edithostel = async (id, payload) => {
    try {
      const { data } = await axios.put(`/api/hostel/edithostel/${id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: localStorage.getItem("token"),
        },
      });

      if (data.success) {
        toast.success("Hostel updated successfully");
      } else {
        toast.error(data.mssg || "Something went wrong");
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.mssg || error.message);
    }
  };

  const values = {axios,
    token,
    login,
    register,
    logout,
    authuser,
    socket,
    onlineuser,
    connectsocket,
    addproduct,
    removeHostel,
    listHostels,
    getSingleHostelInfo,
    edithostel,
  };

  return (
    <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
