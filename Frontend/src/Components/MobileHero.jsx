import React, { useState, useEffect } from 'react'
import bg from '../assets/global-deals-bg.png'
import { Link } from 'react-router-dom'
import Hostelcard from './Hostelcard'
import hostels from '../assets/Hostels'

const EnhancedMobileHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    // Auto-scroll featured hostels every 3 seconds
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(hostels.length, 6))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const featuredHostels = hostels.slice(0, 6)

  return (
    <div className={`w-full mx-auto px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Enhanced Header Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="relative h-72">
          <img 
            src={bg}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
          />
          
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-purple-600/70 to-pink-500/60 animate-pulse"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-6 right-6 w-16 h-16 bg-white/10 rounded-full blur-xl animate-bounce"></div>
          <div className="absolute bottom-8 left-8 w-12 h-12 bg-yellow-400/20 rounded-full blur-lg animate-pulse"></div>
          
          {/* Header Content */}
          <div className="relative z-10 flex flex-col justify-center items-center h-full px-6 text-center">
            <div className="mb-4 transform animate-fadeIn">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-4">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
                <span className="text-white text-xs font-medium">Live Deals Available</span>
              </div>
            </div>
            
            <h1 className="text-3xl font-black text-white drop-shadow-2xl mb-3 tracking-tight">
              <span className="bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                Hostels Special
              </span>
              <br />
              <span className="text-2xl">🎉 Deals</span>
            </h1>
            
            <p className="text-base text-white/95 drop-shadow-lg mb-6 max-w-xs leading-relaxed font-medium">
              Discover amazing discounts on premium hostels near MUJ
            </p>
            
            {/* Enhanced Feature Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <div className="bg-white/25 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white text-xs font-semibold shadow-lg">
                <span className="mr-1">✨</span>
                Free Cancellation
              </div>
              <div className="bg-white/25 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white text-xs font-semibold shadow-lg">
                <span className="mr-1">💰</span>
                Best Price
              </div>
              <div className="bg-white/25 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white text-xs font-semibold shadow-lg">
                <span className="mr-1">⚡</span>
                Instant Booking
              </div>
            </div>
            
            {/* Enhanced CTA Button */}
            <Link to="/Allhostels">
              <button className="group relative bg-white hover:bg-yellow-50 text-gray-900 font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 text-base overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <span className="relative flex items-center">
                  Discover All Deals
                  <svg 
                    className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Hostels Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Featured Hostels</h2>
            <p className="text-gray-600 text-sm">Hand-picked accommodations for you</p>
          </div>
          <div className="flex items-center space-x-2">
            {featuredHostels.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-blue-600 w-6' : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Horizontal Scrolling Cards */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {featuredHostels.map((hostel, index) => (
              <div key={hostel.id} className="w-full flex-shrink-0 px-2">
                <Link to={`/hostel/${hostel.id}`}>
                  <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 active:scale-95 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    
                    {/* Hostel Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={Array.isArray(hostel.image) ? hostel.image[0] : hostel.image}
                        alt={hostel.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Rating Badge */}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                        <div className="flex items-center">
                          <span className="text-yellow-500 text-sm mr-1">⭐</span>
                          <span className="text-gray-900 text-sm font-semibold">4.{Math.floor(Math.random() * 5) + 5}</span>
                        </div>
                      </div>

                      {/* Discount Badge */}
                      <div className="absolute top-3 right-3 bg-red-500 text-white rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                        -{Math.floor(Math.random() * 30) + 10}%
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                        {hostel.name}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <span className="mr-2">📍</span>
                        <span>Near MUJ Campus • 2.5 km</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-gray-900">₹{Math.floor(Math.random() * 2000) + 1500}</span>
                          <span className="text-gray-500 text-sm ml-1">/month</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                          <span className="text-green-600 text-sm font-medium">Available</span>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <div className="flex space-x-3 text-gray-600">
                          <span title="WiFi">📶</span>
                          <span title="AC">❄️</span>
                          <span title="Food">🍽️</span>
                          <span title="Laundry">👕</span>
                        </div>
                        
                        <button className="text-blue-600 text-sm font-semibold group-hover:text-blue-700">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Navigation */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredHostels.length) % featuredHostels.length)}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full shadow-lg transition-all duration-200"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredHostels.length)}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full shadow-lg transition-all duration-200"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Enhanced View All Button */}
      <div className="text-center">
        <Link to="/Allhostels">
          <button className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center">
              <span className="mr-2">🏠</span>
              Explore All Hostels
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
            </span>
          </button>
        </Link>
      </div>
    </div>
  )
}

export default EnhancedMobileHero