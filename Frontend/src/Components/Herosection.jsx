import React from 'react'

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-br from-purple-600 to-purple-800 max-w-[1400px] mx-auto text-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-16 text-center relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl mt-6 sm:mt-8 lg:mt-10 shadow-xl">
      <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight tracking-tight">
          Find Your Perfect Stay!
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium mb-8 sm:mb-10 md:mb-12 lg:mb-16 max-w-2xl opacity-90 leading-relaxed">
          Explore top-rated hostels and choose the best place to call home!
        </p>
        
   
        
        {/* Stylish Arrow positioned below button */}
        <div className="mt-2 sm:mt-4">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="animate-bounce opacity-70 sm:w-12 sm:h-12"
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
      
      {/* Decorative background elements */}
      <div className="absolute top-4 left-4 w-16 h-16 sm:w-20 sm:h-20 bg-white bg-opacity-10 rounded-full blur-xl"></div>
      <div className="absolute bottom-4 right-4 w-24 h-24 sm:w-32 sm:h-32 bg-white bg-opacity-5 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-8 w-12 h-12 sm:w-16 sm:h-16 bg-purple-300 bg-opacity-20 rounded-full blur-lg"></div>
    </div>
  );
}

export default HeroSection;