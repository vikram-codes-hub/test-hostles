import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/authcontext";

const AdminAuth = () => {
  const [formMode, setFormMode] = useState("login"); // "login" or "signup"
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, registerAdmin } = useContext(AuthContext); // ✅ include registerAdmin

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email,
      password,
      ...(formMode === "signup" && { fullName, role: "admin" }),
    };

    try {
      let res;
      if (formMode === "login") {
        res = await login(payload);
      } else {
        res = await registerAdmin(payload); // ✅ Admin signup
      }

      if (res?.success) {
        toast.success(`${formMode === "signup" ? "Signup" : "Login"} successful`);
        navigate("/");
      } else {
        toast.error(res?.mssg || `${formMode} failed`);
      }
    } catch (error) {
      console.error("Auth failed", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Hostel Scouts Admin {formMode === "login" ? "Login" : "Signup"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {formMode === "signup" && (
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border border-gray-300 text-sm p-2 rounded-xl"
                placeholder="Admin Name"
                required
              />
            </div>
          )}

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 text-sm p-2 rounded-xl"
              placeholder="admin@hostel.com"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 text-sm p-2 rounded-xl"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-black hover:scale-105 text-white py-2 rounded-xl transition duration-300 font-semibold"
          >
            {formMode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          {formMode === "login" ? "Don't have an account?" : "Already have an account?"}
          <button
            className="ml-2 text-blue-600 underline"
            onClick={() => setFormMode(formMode === "login" ? "signup" : "login")}
          >
            {formMode === "login" ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminAuth;
