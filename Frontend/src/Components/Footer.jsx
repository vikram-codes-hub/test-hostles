import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { HiOutlineArrowRight } from "react-icons/hi";
import logo from "../assets/wmremove-transformed-removebg-preview.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/Allhostels", label: "View All Hostels" },
    { to: "/roommatefinder", label: "Find Roommates" },
    { to: "/about-us", label: "About Us" },
    { to: "/contact-us", label: "Contact Us" }
  ];

  const supportLinks = [
    { to: "/help", label: "Help Center" },
    { to: "/terms", label: "Terms of Service" },
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/faq", label: "FAQ" }
  ];

  const socialLinks = [
    { href: "#", icon: FaFacebook, label: "Facebook", color: "hover:text-blue-600" },
    { href: "#", icon: FaInstagram, label: "Instagram", color: "hover:text-pink-500" },
    { href: "#", icon: FaTwitter, label: "Twitter", color: "hover:text-blue-400" },
    { href: "#", icon: FaLinkedin, label: "LinkedIn", color: "hover:text-blue-700" }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-30">
   

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <img src={logo} alt="Hostel Scouts Logo" className="h-12 w-auto" />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Helping students find the best hostel deals near their college. 
              Reliable, fast, and student-friendly platform for accommodation needs.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <MdEmail className="w-5 h-5 mr-3 text-blue-400" />
                <span className="text-sm">support@hostelscouts.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MdPhone className="w-5 h-5 mr-3 text-blue-400" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-start text-gray-300">
                <MdLocationOn className="w-5 h-5 mr-3 text-blue-400 mt-0.5" />
                <span className="text-sm">Manipal University Jaipur,<br />Rajasthan, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <HiOutlineArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <HiOutlineArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & App Download */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Connect With Us</h3>
            
            {/* Social Links */}
            <div className="flex space-x-4 mb-8">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 ${social.color} transition-all duration-200 hover:bg-gray-700 hover:scale-110`}
                  >
                    <IconComponent size={18} />
                  </a>
                );
              })}
            </div>

            {/* App Download Buttons */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Download Our App</h4>
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
                <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg border border-gray-700 transition-colors duration-200 flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                    <span className="text-black text-xs font-bold">A</span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-400">GET IT ON</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg border border-gray-700 transition-colors duration-200 flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                    <span className="text-black text-xs font-bold">🍎</span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} Hostel Scouts. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Made with ❤️ for students by students
              </p>
            </div>
            
          
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;