import React from "react";
import { useNavigate } from "react-router-dom";
import hostels from "../assets/Hostels"; 

const Viewhostel = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">My Hostels</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hostels.map((hostel) => (
          <div
            key={hostel.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={hostel.image[0]}
              alt={hostel.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{hostel.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{hostel.address}</p>
              <p className="text-gray-800 font-semibold mb-2">
                ₹{hostel.price.toLocaleString("en-IN")}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/Edithostel/${hostel.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => alert("Delete functionality pending")}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Viewhostel;
