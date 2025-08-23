import React, { useState, useContext, useEffect } from 'react';
import { Search, Users, Home, Plus, Filter, MapPin, Calendar, DollarSign, User, Heart, Eye, MessageCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Roommatecontext } from '../Context/Roommate';
import { toast } from 'react-toastify';
import RentCard from '../Components/RentCard' // Import the RentCard component

const Roomateoption = () => {
  const [activeTab, setActiveTab] = useState('looking_for_roommate');
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    budget: '',
    gender: '',
    roomType: ''
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getRoommatePosts } = useContext(Roommatecontext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getRoommatePosts();
        console.log('API response:', response);
        
        // Extract the posts array from the response object
        const postsArray = response?.posts || [];
        console.log('Posts array:', postsArray);
        
        setPosts(postsArray);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [getRoommatePosts]);

  const filteredPosts = posts.filter(post => post.type === activeTab);

  const handleLike = (postId) => {
    // Add your like functionality here
    console.log('Liked post:', postId);
    toast.success('Added to favorites!');
  };

  const handleMessage = (postId) => {
    // Add your message functionality here
    console.log('Message post:', postId);
    toast.info('Opening chat...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Find Your Perfect Roommate 🏠
            </h1>
            <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
              Connect with awesome people, split the rent, and make some great memories along the way!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex bg-white rounded-2xl shadow-md border-2 border-gray-100 overflow-hidden">
            <button
              onClick={() => setActiveTab('looking_for_roommate')}
              className={`flex items-center px-5 py-3 font-medium transition-all relative ${
                activeTab === 'looking_for_roommate'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              Need a Roommate?
            </button>
            <button
              onClick={() => setActiveTab('room_available')}
              className={`flex items-center px-5 py-3 font-medium transition-all relative ${
                activeTab === 'room_available'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              <Home className="w-5 h-5 mr-2" />
              Have a Room?
            </button>
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center px-4 py-2.5 text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:text-orange-600 transition-all shadow-sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            <Link 
              to={`/roommatefinder/${activeTab}`}
              className="flex items-center px-5 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              {activeTab === 'looking_for_roommate' ? 'Find Roommate' : 'List Room'}
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading posts...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-500 text-4xl">!</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-orange-500 text-white px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors font-medium shadow-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
              <div className="flex flex-wrap justify-center sm:justify-between items-center gap-6 text-sm">
                <div className="flex items-center text-gray-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  {filteredPosts.length} {activeTab === 'looking_for_roommate' ? 'people looking' : 'rooms available'} right now
                </div>
                <div className="flex items-center text-gray-600">
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  Verified members available
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  Safe & secure platform
                </div>
              </div>
            </div>

            {/* Posts Grid - Using RentCard component */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <RentCard 
                  key={post._id || post.id}
                  post={post}
                  onLike={handleLike}
                  onMessage={handleMessage}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  {activeTab === 'looking_for_roommate' ? (
                    <Users className="w-12 h-12 text-orange-500" />
                  ) : (
                    <Home className="w-12 h-12 text-orange-500" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Hmm, looks pretty quiet here! 🤔
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Be the first to {activeTab === 'looking_for_roommate' ? 'post about finding a roommate' : 'list your available room'}. 
                  Others are probably waiting for someone like you!
                </p>
                <Link
                  to={`/roommatefinder/${activeTab}`}
                  className="inline-block bg-orange-500 text-white px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors font-medium shadow-lg"
                >
                  {activeTab === 'looking_for_roommate' ? 'Find Roommate' : 'List Room'}
                </Link>
              </div>
            )}

            {/* Load More Button */}
            {filteredPosts.length > 0 && (
              <div className="text-center mt-10">
                <button className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-xl hover:border-orange-300 hover:text-orange-600 transition-all font-medium">
                  Show More Posts
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Roomateoption;