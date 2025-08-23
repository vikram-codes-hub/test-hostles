import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';
import { ChatContext } from './Chatcontext';

export const AuthContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AuthContextProvider = ({ children }) => {
  const [authuser, setauthuser] = useState(null);
  const [token, settoken] = useState('');
  const [socket, setsocket] = useState(null);
  const [onlineuser, setonlineuser] = useState([]);
  const [selecteduser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  axios.defaults.baseURL = backendUrl;

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          // Set the token for the request
          axios.defaults.headers.common['Authorization'] = storedToken;
          
          // Validate the token with your backend
          const res = await axios.get('/api/auth/check');
          
          if (res.data.success) {
            // Token is valid
            settoken(storedToken);
            setauthuser(res.data.user);
            connectsocket(res.data.user);
          } else {
            // Token is invalid
            throw new Error('Token validation failed');
          }
        } catch (error) {
          console.log('Token validation failed:', error);
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
          setauthuser(null);
          settoken('');
        }
      }
      
      setLoading(false); // Always set loading to false
    };

    initializeAuth();
  }, []);

  const Login = async (credentials, state) => {
    try {
      const res = await axios.post(`/api/auth/${state}`, credentials);

      const { token, user, isAdmin } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = token;

      if (isAdmin) {
        localStorage.removeItem("selectedUser");
        setSelectedUser(null);
      } else {
        localStorage.removeItem("selectedUser");
        setSelectedUser(null);
      }

      settoken(token);
      setauthuser(user);
      connectsocket(user); // Connect socket after login
      toast.success(`${state === 'login' ? 'Login' : 'Signup'} successful`);
      return res.data;

    } catch (err) {
      toast.error(
        err.response?.data?.message || `${state === 'login' ? 'Login' : 'Signup'} failed`
      );
      throw err;
    }
  };

  const Logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setauthuser(null);
    settoken('');
    delete axios.defaults.headers.common['Authorization'];
    if (socket) socket.disconnect();
    setsocket(null);
    toast.success('Logged out successfully');
  };

  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/auth/check');
      if (res.data.success) {
        setauthuser(res.data.user);
        connectsocket(res.data.user);
      }
    } catch (err) {
      Logout();
    }
  };

  const UpdateProfile = async (data) => {
    try {
      const res = await axios.put('/api/auth/update-profile', data);
      const updatedUser = res.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setauthuser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Profile update failed');
    }
  };

  const addLike = async (hostelId) => {
    try {
      const res = await axios.post(`/api/likes/add`, {
        hostelId: hostelId  
      });
      toast.success(res.data.message);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to like hostel');
      throw err;
    }
  };

  const removeLike = async (hostelId) => {
    try {
      const res = await axios.post(`/api/likes/remove`, {
        hostelId: hostelId 
      });
      toast.success(res.data.message);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to unlike hostel');
      throw err;
    }
  };

 const checkLikeStatus = async (hostelId) => {
  try {
    const res = await axios.get(`/api/likes/check/${hostelId}`);
  
    return res.data.isLiked; 
  } catch (error) {
    toast.error('Failed to check like status');
    return false;
  }
}


  const getSavedHostels = async () => {
    try {
      const res = await axios.get('/api/likes/');
      console.log(res.data)
      return res.data.hostels;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to get saved hostels');
      return [];
    }
  };

  const listHostels = async () => {
    try {
      const res = await axios.get('/api/hostel/listhostels');
      return res.data.hostel;
    } catch (err) {
      toast.error('Failed to fetch hostels');
      return [];
    }
  };

  const getSingleHostelInfo = async (id) => {
    try {
      const res = await axios.get(`/api/hostel/singelhostelinfo/${id}`);
      return res.data;
    } catch (err) {
      toast.error('Failed to fetch hostel info');
      return null;
    }
  };

  const connectsocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });

    newSocket.on('connect', () => {
 
    });

    newSocket.on('getOnlineUsers', (ids) => {
    
      setonlineuser(ids);
    });

    setsocket(newSocket);
  };

  const values = {
    axios,
    token,
    authuser,
    loading, // Add loading to the context value
    Login,
    Logout,
    checkAuth,
    UpdateProfile,
    addLike,
    removeLike,
    getSavedHostels,
    listHostels,
    getSingleHostelInfo,
    connectsocket,
    socket,
    onlineuser,
    selecteduser, 
    setSelectedUser,
    checkLikeStatus,
  };

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;