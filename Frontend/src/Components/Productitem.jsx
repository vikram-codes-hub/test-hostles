import React, { useContext } from 'react'
import { HostelsContext } from '../Context/Hostelss'
import { Link } from 'react-router-dom'

const Productitem = ({ id, image, name, price }) => {
  const { currency } = useContext(HostelsContext)

  return (
    <Link
      to={`/hostel/${id}`}
      className="block text-gray-800 cursor-pointer group"
    >
      <div className="overflow-hidden rounded-lg shadow-md transition-shadow duration-300 ease-in-out group-hover:shadow-xl">
        <img
          src={image[0]}
          alt={name}
          className="w-full h-56 object-cover rounded-lg transform transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>
      <p className="pt-4 pb-2 text-base font-semibold truncate">{name}</p>
      <p className="text-sm font-medium text-indigo-600">
        {currency}{price.toLocaleString()}
      </p>
    </Link>
  )
}

export default Productitem
