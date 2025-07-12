import React from 'react'


const Hostelcard = ({image,name}) => {
  return (
    <div className="w-60 h-60 rounded-2xl shadow-lg overflow-hidden bg-white hover:scale-105 transition-transform duration-300 border border-gray-200">
      <img src={image} alt={name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 text-center">{name}</h3>
      </div>
    </div>
  )
}

export default Hostelcard
