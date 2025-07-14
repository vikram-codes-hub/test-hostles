import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/authcontext";
import { toast } from "react-toastify";


// TODO: [i need to add without refresh the removed hostel should be gone]
const Viewhostel = () => {
  const navigate = useNavigate();
  const { listHostels, removeHostel } = useContext(AuthContext);
  const [hostels, setHostels] = useState([]);
  const [refresh, setRefresh] = useState(false); // used to refetch after delete

  // Fetch all hostels listed by admin
  useEffect(() => {
    const fetchHostels = async () => {
      const data = await listHostels();
      if (data) {
        setHostels(data);
      } else {
        toast.error("Failed to fetch hostels");
      }
    };
    fetchHostels();
  }, [refresh]);

  // Remove hostel handler
  const handleRemoveHostel = async (id) => {
    try {
      const response = await removeHostel(id);
      if (response.success) {
        toast.success("Hostel removed successfully");
        setRefresh((prev) => !prev); // trigger re-fetch
      } else {
        toast.error("Failed to delete hostel");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || error.message);
    }
  };

  return (
    <div className="w-full p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Hostels</h2>

      {hostels.length === 0 ? (
        <p className="text-gray-600 text-center">No hostels found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels.map((hostel) => (
            <div
              key={hostel._id}
              className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition"
            >
              <img
                src={hostel.image?.[0] || "/placeholder.jpg"}
                alt={hostel.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {hostel.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{hostel.address}</p>
                <p className="text-gray-800 font-semibold mb-4">
                  ₹{Number(hostel.price).toLocaleString("en-IN")}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/Edithostel/${hostel._id}`)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemoveHostel(hostel._id)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Viewhostel;
