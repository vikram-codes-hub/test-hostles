import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import hostels from "../assets/Hostels";
import Title from "../Components/Title";

const Edithostel = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hostelData, setHostelData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const found = hostels.find((h) => h.id === id);
    if (found) {
      setHostelData(found);
      setFormData(found);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Updated Hostel Data:", formData);
    alert("Hostel data saved (dummy)");
    setEditMode(false);
  };

  if (!hostelData) {
    return <div className="p-6 text-center">Hostel not found</div>;
  }

  return (
    <div className="p-6 w-full bg-gray-200 min-h-screen">
      <div className="text-2xl">
        <Title text1={"Edit"} text2={"Hostel"}/>
      </div>

      <div className="bg-white p-6 rounded shadow-md max-w-2xl">
        <div className="mb-4">
          <label className="block text-md font-medium text-gray-700">
            Hostel Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            disabled={!editMode}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded bg-white text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address || ""}
            disabled={!editMode}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded bg-white text-black"
          />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price || ""}
              disabled={!editMode}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded bg-white text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category || ""}
              disabled={!editMode}
              onChange={handleChange}
             className="mt-1 block w-full p-2 border rounded bg-white text-black"
            >
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description || ""}
            disabled={!editMode}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded bg-white text-black"
          />
        </div>

        <div className="flex gap-4">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-black text-white px-4 py-2 rounded hover:scale-103 transition-all duration-500"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setFormData(hostelData);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          )}

          <button
            onClick={() => navigate("/viewhostel")}
            className="ml-auto text-black hover:underline"
          >
            ← Back to list
          </button>
        </div>
      </div>
    </div>
  );
};

export default Edithostel;
