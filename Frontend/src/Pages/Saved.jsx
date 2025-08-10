import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/auth';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Saved = () => {
  // Use only the new like system
  const { getSavedHostels, removeLike, authuser } = useContext(AuthContext);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedHostels = async () => {
      if (!authuser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getSavedHostels();
        console.log(data)
        setHostels(data || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching liked hostels:", error);
        setError("Failed to load liked hostels");
        setHostels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedHostels();
  }, [authuser, getSavedHostels]);

  const handleRemoveLike = async (hostelId) => {
    try {
      await removeLike(hostelId);
      // Remove from local state immediately for better UX
      setHostels(prev => prev.filter(hostel => hostel._id !== hostelId));
    } catch (error) {
      console.error("Error removing like:", error);
    }
  };

  const handleHostelClick = (hostelId) => {
    navigate(`/hostel/${hostelId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not logged in
  if (!authuser) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
          <p className="text-gray-600">You need to be logged in to view your liked hostels.</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Liked Hostels</h1>
        <p className="text-gray-600">
          {hostels.length} hostel{hostels.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {hostels && hostels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {hostels.map((hostel) => (
            <div
              key={hostel._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative">
                <img
                  className="w-full h-48 object-cover"
                  src={hostel.image?.[0] || '/placeholder-image.jpg'}
                  alt={hostel.name}
                  onClick={() => handleHostelClick(hostel._id)}
                />
                
                {/* Remove Like Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveLike(hostel._id);
                  }}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                  aria-label="Remove from favorites"
                >
                  <FaHeart className="text-red-500 text-lg" />
                </button>

                {/* Price Badge */}
                {hostel.price && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-semibold">
                    ₹{hostel.price.toLocaleString('en-IN')}/year
                  </div>
                )}
              </div>

              {/* Content */}
              <div 
                className="p-4"
                onClick={() => handleHostelClick(hostel._id)}
              >
                <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate">
                  {hostel.name}
                </h3>
                
                {/* Category */}
                {hostel.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                    {hostel.category}
                  </span>
                )}
                
                {/* Address */}
                {hostel.address && (
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <FaMapMarkerAlt className="mr-1 flex-shrink-0" />
                    <span className="truncate">{hostel.address}</span>
                  </div>
                )}
                
                {/* Phone */}
                {hostel.phone && (
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <FaPhone className="mr-1 flex-shrink-0" />
                    <span>{hostel.phone}</span>
                  </div>
                )}
                
                {/* Description */}
                {hostel.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {hostel.description}
                  </p>
                )}
                
                {/* Liked Date */}
                {hostel.likedAt && (
                  <p className="text-xs text-gray-500">
                    Liked on {new Date(hostel.likedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Liked Hostels</h2>
          <p className="text-gray-600 mb-6">
            You haven't liked any hostels yet. Start exploring and like hostels to see them here!
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Explore Hostels
          </button>
        </div>
      )}
    </div>
  );
};

export default Saved;