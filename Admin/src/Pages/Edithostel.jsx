import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Title from "../Components/Title";
import { AuthContext } from "../Context/authcontext";
import { toast } from "react-toastify";

const Edithostel = () => {
  const { getSingleHostelInfo, edithostel } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [hostelData, setHostelData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState({});

  useEffect(() => {
    const fetchHostelData = async () => {
      try {
        const data = await getSingleHostelInfo(id);
        // console.log("Fetched hostel data:", data);
        if (data.success) {
          setHostelData(data.hostel);
          setFormData(data.hostel);
          setImagePreviews(data.hostel.image || []);
        } else {
          alert(data.mssg || "Hostel not found");
        }
      } catch (error) {
        console.error("Error fetching hostel data:", error);
        alert("Failed to fetch hostel data");
      } finally {
        setLoading(false);
      }
    };

    fetchHostelData();
  }, [id, getSingleHostelInfo]);


  // TODO: [image upload not working properly, need to fix it]
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setImageFiles((prev) => ({ ...prev, [`image${index + 1}`]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => {
          const newPreviews = [...prev];
          newPreviews[index] = reader.result;
          return newPreviews;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("address", formData.address);
      form.append("price", formData.price);
      form.append("description", formData.description);
      form.append("category", formData.category);

      Object.keys(imageFiles).forEach((key) => {
        form.append(key, imageFiles[key]);
      });

      const res = await edithostel(id, form);
      if (res.success) {
        toast.success("Hostel updated successfully");
        setEditMode(false);
        setHostelData(formData);
      } else {
        toast.error(res.mssg || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.mssg || error.message);
    }
  };

  if (!hostelData) {
    return <div className="p-6 text-center">Hostel not found</div>;
  }

  return (
    <div className="p-6 w-full bg-gray-200 min-h-screen">
      <div className="text-2xl">
        <Title text1={"Edit"} text2={"Hostel"} />
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

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hostel Images
          </label>
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i}>
                {imagePreviews[i] && (
                  <img
                    src={imagePreviews[i]}
                    alt={`Hostel ${i}`}
                    className="w-full h-40 object-cover mb-2 border rounded"
                  />
                )}
                {editMode && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, i)}
                  />
                )}
              </div>
            ))}
          </div>
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
