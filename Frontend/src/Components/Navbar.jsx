import React, { useContext } from "react";

import { Link, NavLink } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { IoPersonOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { HostelsContext } from "../Context/Hostelss";
import { assets } from "../assets/Hostels";
import { AuthContext } from "../Context/auth";

const Navbar = () => {
  const {setshowSearch}=useContext(HostelsContext)
  const {Logout}=useContext(AuthContext)
  return (
    <div className="flex items-center justify-between px-8 py-4 shadow-lg bg-white">
      {/* Logo */}
      <Link to="/">
        <img className="h-20 w-20 object-contain" src={assets.logo} alt="Logo" />
      </Link>

      {/* Navigation Links */}
      <ul className="flex space-x-10 text-gray-700 font-medium text-base">
        <NavLink to="/" className="hover:text-blue-600 transition">Home</NavLink>
        <NavLink to="/Allhostels" className="hover:text-blue-600 transition">View All Hostels</NavLink>
        <NavLink to="/about-us" className="hover:text-blue-600 transition">About Us</NavLink>
        <NavLink to="/contact-us" className="hover:text-blue-600 transition">Contact Us</NavLink>
      </ul>

      {/* Right Icons */}
      <div className="flex items-center space-x-6">
        <CiSearch onClick={()=>setshowSearch(prev=>!prev)} className="w-6 h-6 text-gray-700 cursor-pointer hover:text-blue-600" />

        {/* Profile Dropdown */}
       <div className="relative group ">
  <div className="cursor-pointer ">
    <IoPersonOutline className="w-6 h-6 text-gray-700 " />
  </div>
  <div className="absolute right-0  hidden group-hover:flex flex-col bg-white border border-gray-200 shadow-lg rounded-lg py-2 px-4 w-44 z-50 ">
    <Link to="/profile" className="hover:text-blue-600 transition py-1">My Profile</Link>
    <Link to="/saved" className="hover:text-blue-600 transition py-1">Saved Hostels</Link>
    <Link to="/help" className="hover:text-blue-600 transition py-1">Help Center</Link>
    <button onClick={Logout} className="text-red-500 hover:text-red-700 transition py-1 text-left">Log Out</button>
  </div>
</div>

        {/* Hamburger Menu */}
        <div className="relative group">
          <RxHamburgerMenu className="w-6 h-6 text-gray-700 cursor-pointer" />
          <div className="absolute right-0  hidden group-hover:flex flex-col bg-white border border-gray-200 shadow-lg rounded-lg py-2 px-4 w-44 z-50">
            <Link to="/work" className="hover:text-blue-600 transition py-1">Work With Us</Link>
            <Link to="/saved" className="hover:text-blue-600 transition py-1">Saved Hostels</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
