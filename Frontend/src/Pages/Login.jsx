import React, { useState, useContext,useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import bgImage from "../assets/Manipal_University_Jaipur_54f94876cd.jpg";
import { AuthContext } from "../Context/auth";


export default function App() {
 const navigate = useNavigate()
  const [formmode, setformmode] = useState("login"); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { Login,authuser } = useContext(AuthContext); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isDataSubmitted) {
      setIsDataSubmitted(true);

      const payload = {
        email,
        password,
        ...(formmode === "signup" && { fullName: name }),
      };

      const endpoint = formmode === "signup" ? "signup" : "login";

      try {
        const res = await Login(payload, endpoint);
  
if(res.success) {

  navigate('/'); 
}


      } catch (err) {
        console.error("Login/Register failed", err);
      } finally {
        setIsDataSubmitted(false);
      }
    }
  };

  const isLogin = formmode === "login";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="backdrop-blur-md bg-white/30 p-8 rounded-2xl shadow-xl w-80 border border-white/40">
        <h2 className="text-2xl font-bold text-center text-white mb-2 drop-shadow">
          Hostel Scouts
        </h2>
        <h3 className="text-lg text-center text-white mb-4 drop-shadow">
          {isLogin ? "Login" : "Create Account"}
        </h3>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full mb-3 px-3 py-2 border rounded bg-white/80"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 px-3 py-2 border rounded bg-white/80"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-3 px-3 py-2 border rounded bg-white/80"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-white drop-shadow">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => {
              setformmode(isLogin ? "signup" : "login");
              setIsDataSubmitted(false); // allow switch to retry
            }}
            className="text-blue-200 ml-1 underline cursor-pointer"
          >
            {isLogin ? "Create Account" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}