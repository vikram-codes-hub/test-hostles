import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import logo from "../assets/wmremove-transformed-removebg-preview.png";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-12 border-t">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div>
          <img src={logo} alt="Logo" className="h-14 mb-2" />
          <p className="text-sm leading-6">
            Helping students find the best hostel deals near their college. 
            Reliable, fast, and student-friendly!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
            <li><Link to="/Allhostels" className="hover:text-blue-600">View All Hostels</Link></li>
            <li><Link to="/about-us" className="hover:text-blue-600">About Us</Link></li>
            <li><Link to="/contact-us" className="hover:text-blue-600">Contact Us</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Support</h3>
          <ul className="space-y-1 text-sm">
            <li><Link to="/help" className="hover:text-blue-600">Help Center</Link></li>
            <li><Link to="/terms" className="hover:text-blue-600">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4 text-gray-600 mt-2">
            <a href="#" className="hover:text-blue-600"><FaFacebook size={20} /></a>
            <a href="#" className="hover:text-pink-500"><FaInstagram size={20} /></a>
            <a href="#" className="hover:text-blue-400"><FaTwitter size={20} /></a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 py-4 border-t">
        © {new Date().getFullYear()} Hostel Finder. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
