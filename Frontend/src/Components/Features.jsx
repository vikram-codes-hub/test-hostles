import React from 'react';
import { Link } from 'react-router-dom';


const Features = ({text1,text2,color,image}) => {
  return (
    <div className="flex flex-col items-center justify-start  h-[400px]  w-[400px] rounded-2xl p-4 relative overflow-hidden" style={{ backgroundColor: color }}>
      
      {/* Skewed white box with text */}
      <div
        className="bg-white w-[270px] p-4 mb-6 mr-33 h-[70px]  "
        style={{
          clipPath: 'polygon(0 0, 95% 0, 100% 100%, 0% 100%)',
        }}
      >
        <Link to='/carpooling' className="text-black font-bold text-xl block  ">{text1}</Link>
        <p className="underline text-[12px] ">{text2}</p>
      </div>


      {/* Image */}
      <img
        src={image}
        alt="Carpooling"
        className="w-[200px] mt-12 h-auto z-0"
      />
    </div>
  );
};

export default Features;
