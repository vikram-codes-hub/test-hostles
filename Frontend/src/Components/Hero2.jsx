import React from 'react'
import bg from '../assets/global-deals-bg.png'
import img from '../assets/1.svg'
import { Link } from 'react-router-dom'
import Hostelcard from './Hostelcard'
import hostels from '../assets/Hostels'

const Hero2 = () => {
  return (
    <div className="relative w-full max-w-[1400px] mx-auto rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
      {/* Background Image */}
      <div className="relative min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
        <img 
          src={bg} 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20"></div>
        
      

        {/* Header Text Section */}
        <div className="absolute top-12 sm:top-16 lg:top-20 left-4 sm:left-6 lg:left-8 z-20 max-w-md">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white drop-shadow-lg mb-2 sm:mb-3">
            Hostels Special Deals
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-white/90 drop-shadow font-medium">
            BIG Discounts on best hostels near MUJ
          </p>
        </div>

        {/* Hostels Cards Section - Responsive Grid */}
        <div className="absolute bottom-20 sm:bottom-24 lg:bottom-28 left-4 sm:left-6 lg:left-8 right-4 sm:right-6 lg:right-8 z-30">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {hostels.slice(0, 3).map((hostel, index) => (
              <div key={hostel.id} className="transform hover:scale-105 transition-all duration-300">
                <Link to={`/hostel/${hostel.id}`}>
                  <Hostelcard 
                    image={Array.isArray(hostel.image) ? hostel.image[0] : hostel.image} 
                    name={hostel.name}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button - Responsive positioning */}
        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 right-4 sm:right-6 lg:right-8 z-30">
          <Link to="/Allhostels">
            <button className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-2 sm:py-3 px-4 sm:px-6 lg:px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base">
              Discover all deals
              <svg 
                className="inline-block ml-2 w-4 h-4 sm:w-5 sm:h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </Link>
        </div>

        {/* Feature Badges - Mobile Hidden, Tablet+ Visible */}
        <div className="hidden sm:flex absolute top-4 right-4 lg:top-8 lg:right-8 z-20 gap-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs lg:text-sm font-medium">
            Free Cancellation
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs lg:text-sm font-medium">
            Best Price
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero2