import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, User, X, Menu, Home, Building, Users, Info, Phone } from "lucide-react";
import { HostelsContext } from "../Context/Hostelss";
import { assets } from "../assets/Hostels";
import { AuthContext } from "../Context/auth";
import { toast } from "react-toastify";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { IoPersonOutline, IoClose } from "react-icons/io5";
import { HiOutlineUsers } from "react-icons/hi2";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setshowSearch } = useContext(HostelsContext);
  const { Logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    Logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const navigationLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/Allhostels", label: "Hostels", icon: Building },
    { to: "/roommatefinder", label: "Find Roommates", icon: Users },
    { to: "/about-us", label: "About", icon: Info },
    { to: "/contact-us", label: "Contact", icon: Phone }
  ];

  const NavItem = ({ to, label, icon: Icon, isActive = false }) => (
    <NavLink
      to={to}
      className={({ isActive }) => `flex items-center space-x-2 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
        isActive
          ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo - Increased Size */}
          <Link to="/" className="flex-shrink-0 group">
            <img 
              className="h-12 w-24 object-contain transition-transform group-hover:scale-105" 
              src={assets.logo} 
              alt="Hostel Scouts Logo" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <NavItem
                key={link.to}
                to={link.to}
                label={link.label}
                icon={link.icon}
              />
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Search Button */}
            <button
              onClick={() => setshowSearch(prev => !prev)}
              className="p-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-all duration-200"
              aria-label="Search"
            >
              <Search className="w-6 h-6" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="p-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-all duration-200">
                <IoPersonOutline className="w-6 h-6" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                <div className="py-2">
                  <Link 
                    to="/profile" 
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <IoPersonOutline className="w-5 h-5 mr-3" />
                    My Profile
                  </Link>
                  <Link 
                    to="/myposts" 
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <HiOutlineUsers className="w-5 h-5 mr-3" />
                    My Posts
                  </Link>
                  <Link 
                    to="/saved" 
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <Building className="w-5 h-5 mr-3" />
                    Saved Hostels
                  </Link>
                  <Link 
                    to="/help" 
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <HiOutlineInformationCircle className="w-5 h-5 mr-3" />
                    Help Center
                  </Link>
                  <hr className="my-1 border-gray-200" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <IoClose className="w-5 h-5 mr-3" />
                    Log Out
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <IoClose className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-4 py-3 space-y-2 bg-gray-50 rounded-b-lg">
            {navigationLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  window.location.pathname === link.to
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-white"
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            ))}
            
            {/* Mobile Profile Links */}
            <hr className="my-3 border-gray-300" />
            <Link 
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-3 py-3 rounded-lg text-sm text-gray-700 hover:text-blue-600 hover:bg-white transition-colors"
            >
              <IoPersonOutline className="w-5 h-5" />
              <span>My Profile</span>
            </Link>
            <Link 
              to="/my-posts"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-3 py-3 rounded-lg text-sm text-gray-700 hover:text-blue-600 hover:bg-white transition-colors"
            >
              <HiOutlineUsers className="w-5 h-5" />
              <span>My Posts</span>
            </Link>
            <button 
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <IoClose className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;