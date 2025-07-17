import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';

export const AuthContext = createContext();

const backendUrl = 'http://localhost:8000';

const AuthContextProvider = ({ children }) => {
  const [authuser, setauthuser] = useState(null);
  const [token, settoken] = useState('');
  const [axiosready, setaxiosready] = useState(false);
  const [socket, setsocket] = useState(null);
  const [onlineuser, setonlineuser] = useState([]);

  axios.defaults.baseURL = backendUrl;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      axios.defaults.headers.common['Authorization'] = token;
      settoken(token);
      setauthuser(JSON.parse(user));
      setaxiosready(true);
    }
  }, []);

  const Login = async (data) => {
    try {
      const res = await axios.post('/api/user/login', data);
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      axios.defaults.headers.common['Authorization'] = token;
      settoken(token);
      setauthuser(user);
      setaxiosready(true);
      toast.success('Login successful');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  const Logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setauthuser(null);
    settoken('');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out');
  };

  const UpdateProfile = async (data) => {
    try {
      const res = await axios.patch('/api/user/update', data);
      const updatedUser = res.data.user;

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setauthuser(updatedUser);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const addLike = async (hostelId) => {
    try {
      const res = await axios.post(`/api/user/like/${hostelId}`);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to like hostel');
    }
  };

  const removeLike = async (hostelId) => {
    try {
      const res = await axios.delete(`/api/user/unlike/${hostelId}`);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to unlike hostel');
    }
  };

  const getSavedHostels = async () => {
    try {
      const res = await axios.get('/api/user/saved');
      return res.data.hostels;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to get saved hostels');
      return [];
    }
  };

  const listhostels = async () => {
    try {
      const res = await axios.get('/api/hostel/list');
      return res.data.hostels;
    } catch (err) {
      toast.error('Failed to fetch hostels');
      return [];
    }
  };

  const getSingleHostelInfo = async (id) => {
    try {
      const res = await axios.get(`/api/hostel/${id}`);
      return res.data.hostel;
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
      console.log('✅ Socket connected:', newSocket.id);
    });

    newSocket.on('getOnlineUsers', (ids) => {
      console.log('🔵 Online users:', ids);
      setonlineuser(ids);
    });

    setsocket(newSocket);
  };

  const values = {
    axios,
    token,
    authuser,
    Login,
    Logout,
    UpdateProfile,
    addLike,
    removeLike,
    getSavedHostels,
    listhostels,
    getSingleHostelInfo,
    socket,
    connectsocket,
    onlineuser,
  };

  return (
    <AuthContext.Provider value={values}>
      {axiosready && children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
