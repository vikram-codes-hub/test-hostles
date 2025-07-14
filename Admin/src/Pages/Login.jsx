import React, { useState,useContext } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { AuthContext } from "../Context/authcontext";
import { useNavigate } from "react-router-dom";

const Login = ({ settoken }) => {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');

  const navigate=useNavigate()

  const { login } = useContext(AuthContext);

  //Login functionn
  const onsubmithandeler = async (e) => {
    e.preventDefault();
    
    const payload = {
      email,password}

      try {
        const res = await login(payload);
        // console.log("Login response:", res);
        if(res.success){
          navigate('/'); // Redirect to the home page
        }
      } catch (error) {
         console.error("Login/Register failed", error);
      }
  };

return (
  <div className="h-170 flex items-center justify-center bg-gray-100 px-4">
    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Hostel Scouts Admin Login
      </h2>

      <form onSubmit={onsubmithandeler} className="flex flex-col gap-5">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="email">
            Email
          </label>
          <input
            onChange={(e) => setemail(e.target.value)}
            value={email}
            id="email"
            name="email"
            type="email"
            placeholder="admin@hostel.com"
            className="border border-gray-300 text-sm p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="password">
            Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="border border-gray-300 text-sm p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-black hover:scale-105 text-white py-2 rounded-xl transition duration-300 font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  </div>
);

};

export default Login;
