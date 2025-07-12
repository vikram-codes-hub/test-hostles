import React from "react";
import { FaInstagram, FaCar, FaCalendarAlt, FaUsers, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const About = () => {
  const features = [
    {
      icon: <FaCar className="text-blue-500 text-2xl" />,
      title: "Carpooling System",
      description: "Need a ride to campus or heading home for the weekend? Use our carpooling feature to connect with students going your way. It's safe, economical, and community-driven.",
      color: "bg-blue-100"
    },
    {
      icon: <FaCalendarAlt className="text-pink-500 text-2xl" />,
      title: "Event Updates",
      description: "Stay in the loop with college fests, workshops, and cultural nights happening around you. Get notified and plan your social calendar better!",
      color: "bg-pink-100"
    },
    {
      icon: <FaUsers className="text-purple-500 text-2xl" />,
      title: "Verified Communities",
      description: "Join exclusive student communities where you can ask questions, share experiences, and get advice from seniors and peers.",
      color: "bg-purple-100"
    },
    {
      icon: <FaChartLine className="text-green-500 text-2xl" />,
      title: "Price Trends",
      description: "See historical pricing data to know the best time to book and get the best deals on hostels near your college.",
      color: "bg-green-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 px-6 py-12 overflow-hidden">
      {/* Floating background elements */}
      <motion.div 
        className="absolute top-20 left-10 w-40 h-40 rounded-full bg-blue-200 opacity-20"
        animate={{
          x: [0, 30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-pink-200 opacity-20"
        animate={{
          x: [0, -40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-5xl font-bold text-gray-800 mb-4"
            whileHover={{ scale: 1.02 }}
          >
            About <span className="text-blue-600">HostelScouts</span>
          </motion.h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Your one-stop platform to discover, explore, and book verified hostels near your college. We simplify student relocation with trusted reviews, prices, amenities, and availability — all in one place.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className={`bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 ${feature.color} bg-opacity-50`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg ${feature.color.replace('bg-', 'bg-').replace('-100', '-50')}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
              </div>
              <p className="text-gray-600 pl-16">{feature.description}</p>
              <motion.button
                whileHover={{ x: 5 }}
                className="mt-4 flex items-center text-blue-600 font-medium pl-16"
              >
                Learn more <FiArrowRight className="ml-1" />
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { number: "500+", label: "Verified Hostels" },
            { number: "10K+", label: "Students Helped" },
            { number: "50+", label: "Colleges Covered" },
            { number: "24/7", label: "Support" }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md text-center">
              <motion.p 
                className="text-4xl font-bold text-blue-600 mb-2"
                whileHover={{ scale: 1.1 }}
              >
                {stat.number}
              </motion.p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Contribution Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl overflow-hidden p-8 text-white"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white bg-opacity-10"></div>
          <div className="absolute -left-20 bottom-0 w-60 h-60 rounded-full bg-white bg-opacity-5"></div>
          
          <div className="relative z-10">
            <motion.h2 
              className="text-3xl font-bold mb-4"
              whileHover={{ x: 5 }}
            >
              🌟 Our Story
            </motion.h2>
            <p className="text-lg mb-6 max-w-2xl">
              HostelScouts was born from the struggles students face finding safe, affordable housing near colleges. Our mission is to make this process stress-free and reliable.
            </p>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 inline-block">
              <p className="mb-2 font-medium">Special thanks to</p>
              <h3 className="text-2xl font-bold mb-3">Vikram Singh Gangwar</h3>
              <p className="mb-4">For his outstanding dedication in building HostelScouts</p>
              <motion.a
                href="https://www.instagram.com/your_instagram_username/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaInstagram size={18} />
                Follow on Instagram
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;