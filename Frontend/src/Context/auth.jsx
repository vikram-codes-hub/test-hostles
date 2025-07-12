import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

const AuthContextProvider = ({ children }) => {
  const [token, settoken] = useState(localStorage.getItem("token"));
  const [authuser, setauthuser] = useState(null);

  // Set token to axios default if already present
  if (token) {
    axios.defaults.headers.common["token"] = token;
  }

  // Check auth status
  const checkauth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setauthuser(data.user);
      }
    } catch (error) {
      toast.error("Session expired. Please log in again.");
      setauthuser(null);
      settoken(null);
      localStorage.removeItem("token");
    }
  };

  // Login / Signup
  const Login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        axios.defaults.headers.common["token"] = data.token;
        settoken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.msg || "Login successful");

        // ✅ Call checkauth manually after token is set
        await checkauth();
      } else {
        toast.error(data.msg || "Something went wrong");
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.msg || error.message);
      return { success: false };
    }
  };

  const Logout = () => {
    localStorage.removeItem("token");
    settoken(null);
    setauthuser(null);
    delete axios.defaults.headers.common["token"];
    toast.success("Logged out successfully");
  };

  const UpdateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setauthuser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch saved liked hostels
  const getSavedHostels = async (body) => {
    try {
      const { data } = await axios.post("/api/like/getliked", body);
      if (data.success) {
        return data.hostels;
      } else {
        toast.error(data.mssg || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addLike = async (body) => {
    try {
      const { data } = await axios.post("/api/like/addlike", body);
      if (data.success) {
        toast.success(data.mssg || "Hostel liked successfully");
      } else {
        toast.error(data.mssg || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeLike = async (body) => {
    try {
      const { data } = await axios.post("/api/like/removelike", body);
      if (data.success) {
        toast.success(data.mssg || "Hostel removed from liked list");
      } else {
        toast.error(data.mssg || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Only run checkauth if token exists AND user is not already loaded
  useEffect(() => {
    if (token && !authuser) {
      axios.defaults.headers.common["token"] = token;
      checkauth();
    }
  }, [token]);

  const values = {
    token,
    authuser,
    Login,
    Logout,
    UpdateProfile,
    addLike,
    removeLike,
    getSavedHostels,
  };

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
