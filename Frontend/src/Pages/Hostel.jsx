import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import hostels from "../assets/Hostels";
import { MdOutlineNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { assets } from "../assets/Hostels";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { HostelsContext } from "../Context/Hostelss";
import { AuthContext } from "../Context/auth";

const Hostel = () => {
  const { hostelId } = useParams();
  const navigate=useNavigate()
  const [productdata, setProductdata] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toggleSaveHostel, savedHostels } = useContext(HostelsContext);
  const {authuser,addLike,removeLike,getSavedHostels,} = useContext(AuthContext);
  
  // Check if hostel is already saved
  const isSaved = savedHostels.some(hostel => hostel.id === hostelId);

  // Load hostel data when component mounts
  useEffect(() => {
    const found = hostels.find((item) => item.id === hostelId);
    setProductdata(found);
    setCurrentImageIndex(0);
  }, [hostelId]);

  const nextImage = () => {
    if (productdata?.image) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === productdata.image.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (productdata?.image) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? productdata.image.length - 1 : prevIndex - 1
      );
    }
  };

  if (!productdata) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }
  // TODO: [i need to add like functionality when i create adin panel]

  // const handleLikeToggle=async()=>{
  //   if(!authuser){
  //     toast.error("Please login to like hostels");
  //     return;
  //   }
  //   const likepayload= {
  //     userId: authuser._id,
  //     hostelId: productdata._id,
  //   }

  //    if (isSaved) {
  //   removeLike(likepayload);
  // } else {
  //   addLike(likepayload);
  // }

  // toggleSaveHostel(productdata.id); 
  // }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
  
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Gallery */}
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


            {/* Navigation buttons */}
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

          {/* Thumbnail gallery */}
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

        {/* Hostel Details */}
        <div className="w-full md:w-1/2">
       
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {productdata.name}
            </h1>
            <button
              onClick={() => toggleSaveHostel(hostelId)}
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
              Listed: {productdata.listedDate}
            </span>
          </div>

          <div className="text-2xl font-semibold text-gray-900 mb-4">
            ₹{productdata.price.toLocaleString("en-IN")}{" "}
            <span className="text-sm text-gray-500">/ year</span>
            <span className="text-sm font-light ml-2">-negotiable</span>{" "}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{productdata.description}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src={assets.search_icon} alt="address" className="w-5 h-5" />
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
              <span className="text-gray-700">Owner: {productdata.owner}</span>
            </div>
          </div>

          <div className="flex  gap-5">
            <button onClick={()=>navigate('/chat-app')} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors hover:scale-105">
            In-App Chat
          </button>

          <button onClick={()=>navigate('/chat-app')} className="mt-6 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-colors hover:scale-105">
            Chat in whatsapp
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hostel;
