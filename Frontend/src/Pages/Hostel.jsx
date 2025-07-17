import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { HostelsContext } from "../Context/Hostelss";
import { AuthContext } from "../Context/auth";
import { toast } from "react-toastify";
import { assets } from "../assets/Hostels";

const Hostel = () => {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const [productdata, setProductdata] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toggleSaveHostel, savedHostels } = useContext(HostelsContext);
  const {
    authuser,
    addLike,
    removeLike,
    getSingleHostelInfo,
  } = useContext(AuthContext);

  const isSaved = savedHostels.some((hostel) => hostel._id === hostelId);

  useEffect(() => {
    const fetchHostelData = async () => {
      const data = await getSingleHostelInfo(hostelId);
      if (data.success) {
        setProductdata(data.hostel);
      } else {
        console.error("Failed to fetch hostel data:", data.mssg);
      }
    };
    fetchHostelData();
  }, [hostelId]);

  const nextImage = () => {
    if (productdata?.image) {
      setCurrentImageIndex((prev) =>
        prev === productdata.image.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (productdata?.image) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? productdata.image.length - 1 : prev - 1
      );
    }
  };

  const handleLikeToggle = async () => {
    if (!authuser) {
      toast.error("Please login to like hostels");
      return;
    }

    const likePayload = {
      userId: authuser._id,
      hostelId: productdata._id,
    };

    if (isSaved) {
      await removeLike(likePayload);
    } else {
      await addLike(likePayload);
    }

    toggleSaveHostel(productdata._id);
  };

  if (!productdata) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }
console.log("Product data:", productdata);
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Section */}
        <div className="w-full md:w-1/2 relative">
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
            {productdata.image && (
              <img
                src={productdata.image[currentImageIndex]}
                alt={productdata.name}
                className="w-full h-full object-cover"
              />
            )}
            {/* Save button */}
            <button
              onClick={handleLikeToggle}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all z-10"
              aria-label={isSaved ? "Remove from favorites" : "Add to favorites"}
            >
              {isSaved ? (
                <FaHeart className="text-red-500 text-xl" />
              ) : (
                <FaRegHeart className="text-gray-800 text-xl hover:text-red-500" />
              )}
            </button>

            {/* Image navigation */}
            {productdata.image.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all"
                >
                  <GrFormPrevious size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all"
                >
                  <MdOutlineNavigateNext size={24} />
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {productdata.image.length}
            </div>
          </div>

          {/* Thumbnails */}
          {productdata.image.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto py-2">
              {productdata.image.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${
                    currentImageIndex === index
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {productdata.name}
            </h1>
            <button
              onClick={handleLikeToggle}
              className="flex items-center gap-2 text-gray-700 hover:text-red-500"
            >
              {isSaved ? (
                <>
                  <FaHeart className="text-red-500" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <FaRegHeart />
                  <span>Save for later</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {productdata.category}
            </span>
            <span className="text-gray-600">
              Listed:{" "}
              {productdata.date
                ? new Date(productdata.date).toLocaleDateString()
                : "Unknown"}
            </span>
          </div>

          <div className="text-2xl font-semibold text-gray-900 mb-4">
            ₹{productdata.price.toLocaleString("en-IN")}{" "}
            <span className="text-sm text-gray-500">/ year</span>
            <span className="text-sm font-light ml-2">-negotiable</span>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="">{productdata.description}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src={assets.search_icon} alt="address" className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700">{productdata.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={assets.search_icon} alt="phone" className="w-5 h-5" />
              <span className="text-gray-700">{productdata.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={assets.search_icon} alt="email" className="w-5 h-5" />
              <span className="text-gray-700">{productdata.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={assets.search_icon} alt="owner" className="w-5 h-5" />
              <span className="text-gray-700">Owner: {productdata.name}</span>
            </div>
          </div>

          <div className="flex gap-5">
            <button
              onClick={() => navigate("/chat-app")}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition hover:scale-105"
            >
              In-App Chat
            </button>

            <button
              onClick={() => navigate("/chat-app")}
              className="mt-6 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition hover:scale-105"
            >
              Chat on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hostel;
