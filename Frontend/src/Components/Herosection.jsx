import React from 'react'

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-br from-purple-600 to-purple-800 max-w-[1400px] mx-auto text-white px-6 py-20 text-center relative overflow-hidden rounded-3xl mt-10 shadow-xl">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
           Find Your Perfect Stay!
        </h1>
        
        <p className="text-xl md:text-2xl font-medium mb-12">
           Explore top-rated hostels and choose the best place to call home!
        </p>

        {/* Stylish Arrow positioned below text */}
        <div className="mt-4">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="animate-bounce"
          >
            <path
              d="M12 5V19"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M19 12L12 19L5 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;