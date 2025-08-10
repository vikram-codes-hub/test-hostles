import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { HostelsContext } from "../Context/Hostelss";
import { AuthContext } from "../Context/auth";
import { ChatContext } from "../Context/Chatcontext";
import { toast } from "react-toastify";
import { assets } from "../assets/Hostels";

const Hostel = () => {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [productdata, setProductdata] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false); // New state for like status
  const [isLoadingLike, setIsLoadingLike] = useState(false); // Loading state for like action
  
  // Contexts
  const {
    authuser,
    addLike,
    removeLike,
    getSingleHostelInfo,
    checkLikeStatus, // Make sure to add this to your AuthContext
  } = useContext(AuthContext);
  const { initializeChat } = useContext(ChatContext);

  // Fetch hostel data
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

  // Check like status when component mounts and user is logged in
  useEffect(() => {
    const checkLike = async () => {
      if (authuser && hostelId) {
        try {
          const liked = await checkLikeStatus(hostelId);
          setIsLiked(liked);
        } catch (error) {
          console.error('Error checking like status:', error);
        }
      }
    };
    
    checkLike();
  }, [authuser, hostelId, checkLikeStatus]);

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

  // Updated like toggle function
  const handleLikeToggle = async () => {
    if (!authuser) {
      toast.error("Please login to like hostels");
      return;
    }

    if (!productdata) {
      toast.error("Hostel data not loaded");
      return;
    }

    setIsLoadingLike(true);

    try {
      if (isLiked) {
        await removeLike(productdata._id);
        setIsLiked(false);
      } else {
        await addLike(productdata._id);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Don't change the isLiked state if there's an error
    } finally {
      setIsLoadingLike(false);
    }
  };

  // Handle chat initialization
  const handleStartChat = () => {
    if (!authuser) {
      toast.error("Please login to start chatting");
      return;
    }

    if (!isLiked) {
      toast.error("Please like the hostel first to start chatting");
      return;
    }

    if (!productdata) {
      toast.error("Hostel data not loaded");
      return;
    }

    console.log("🚀 Starting chat with hostel:", productdata.name);
    
    // Initialize chat with proper data
    const success = initializeChat({
      adminId: productdata.adminId || productdata._id,
      userId: authuser._id,
      hostelInfo: {
        id: productdata._id,
        name: productdata.name,
        ownerName: productdata.ownerName || productdata.name,
        image: productdata.image?.[0] || '',
        phone: productdata.phone,
        email: productdata.email,
        address: productdata.address
      }
    });

    if (success) {
      toast.success("Chat initialized! Redirecting...");
      navigate("/chat-app");
    } else {
      toast.error("Failed to initialize chat. Please try again.");
    }
  };

  // Handle WhatsApp chat
  const handleWhatsAppChat = () => {
    if (!productdata.phone) {
      toast.error("Phone number not available for this hostel");
      return;
    }

    const message = `Hi! I'm interested in your hostel "${productdata.name}". Could you please provide more details?`;
    const phoneNumber = productdata.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (!productdata) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

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
            
            {/* Like button with loading state */}
            <button
              onClick={handleLikeToggle}
              disabled={isLoadingLike}
              className={`absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all z-10 ${
                isLoadingLike ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
            >
              {isLoadingLike ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
              ) : isLiked ? (
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
              disabled={isLoadingLike}
              className={`flex items-center gap-2 text-gray-700 hover:text-red-500 ${
                isLoadingLike ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoadingLike ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  <span>Loading...</span>
                </>
              ) : isLiked ? (
                <>
                  <FaHeart className="text-red-500" />
                  <span>Liked</span>
                </>
              ) : (
                <>
                  <FaRegHeart />
                  <span>Like this hostel</span>
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

          {/* Updated Chat Buttons */}
          <div className="flex gap-5">
            <button
              onClick={handleStartChat}
              className={`mt-6 font-medium py-2 px-6 rounded-lg transition hover:scale-105 flex items-center gap-2 ${
                authuser && isLiked 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!authuser || !isLiked}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              In-App Chat
            </button>

            <button
              onClick={handleWhatsAppChat}
              className="mt-6 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
              </svg>
              Chat on WhatsApp
            </button>
          </div>

          {/* Status messages */}
          {!authuser && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                💡 Please <span className="font-semibold">login</span> to like hostels and start chatting.
              </p>
            </div>
          )}
          
          {authuser && !isLiked && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                💙 Please <span className="font-semibold">like this hostel</span> first to start in-app chatting with the admin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hostel;