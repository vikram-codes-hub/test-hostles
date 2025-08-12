import React, { useState } from 'react';
import { Search, Users, Home, Plus, Filter, MapPin, Calendar, DollarSign, User, Heart, Eye, MessageCircle, Star } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Roomateoption = () => {
  const [activeTab, setActiveTab] = useState('looking_for_roommate');
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    budget: '',
    gender: '',
    roomType: ''
  });

  // Mock data for posts
  const mockPosts = [
    {
      id: 1,
      type: 'looking_for_roommate',
      title: 'Looking for a Female Roommate near MUJ',
      description: 'Final year CSE student looking for a clean and studious female roommate to share a 2BHK apartment.',
      budget: { min: 8000, max: 12000, currency: 'INR' },
      location: { area: 'Dehmi Kalan', city: 'Jaipur', nearbyCollege: 'Manipal University Jaipur' },
      preferences: { gender: 'female', ageRange: { min: 20, max: 24 }, occupation: 'student' },
      roomDetails: { roomType: '2bhk', furnishing: 'semi_furnished' },
      contact: { preferredContact: 'whatsapp' },
      user: { name: 'Priya S.', avatar: '👩' },
      views: 24,
      interested: 3,
      createdAt: '2024-01-15',
      isVerified: true
    },
    {
      id: 2,
      type: 'room_available',
      title: 'Spacious Room Available in 3BHK Flat',
      description: 'One room available in a well-maintained 3BHK flat with AC, WiFi, and all amenities. Perfect for working professionals.',
      rent: 15000,
      location: { area: 'Vaishali Nagar', city: 'Jaipur', nearbyCollege: 'Multiple colleges nearby' },
      preferences: { gender: 'any', occupation: 'working_professional' },
      roomDetails: { roomType: 'single', furnishing: 'fully_furnished', amenities: ['wifi', 'ac', 'parking'] },
      user: { name: 'Rahul K.', avatar: '👨' },
      views: 18,
      interested: 5,
      createdAt: '2024-01-12',
      isVerified: false
    },
    {
      id: 3,
      type: 'looking_for_roommate',
      title: 'Two Engineering Students Seeking Roommate',
      description: 'We are two second-year engineering students looking for one more roommate to share a 3BHK near campus.',
      budget: { min: 6000, max: 9000, currency: 'INR' },
      location: { area: 'University Area', city: 'Jaipur', nearbyCollege: 'Manipal University Jaipur' },
      preferences: { gender: 'male', ageRange: { min: 18, max: 22 }, occupation: 'student' },
      roomDetails: { roomType: 'shared', furnishing: 'semi_furnished' },
      user: { name: 'Arjun & Dev', avatar: '👥' },
      views: 31,
      interested: 7,
      createdAt: '2024-01-10',
      isVerified: true
    }
  ];

  const filteredPosts = mockPosts.filter(post => post.type === activeTab);

 
  const formatBudget = (post) => {
    if (post.type === 'room_available') {
      return `₹${post.rent?.toLocaleString()}/month`;
    } else {
      return `₹${post.budget?.min?.toLocaleString()} - ₹${post.budget?.max?.toLocaleString()}/month`;
    }
  };

  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
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
            <button
            
              className="flex items-center px-5 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              {activeTab === 'looking_for_roommate' ?<NavLink to='/roommatefinder/looking_for_roommate'>Find Roommate</NavLink>:<NavLink to='/roommatefinder/room_available'>List Room</NavLink>}
            </button>
          </div>
        </div>

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

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 overflow-hidden">
              {/* Post Header */}
              <div className="p-5 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-lg">
                      {post.user.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{post.user.name}</span>
                        {post.isVerified && (
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{getTimeAgo(post.createdAt)}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    post.type === 'looking_for_roommate'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {post.type === 'looking_for_roommate' ? '🔍 Looking' : '🏡 Available'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {post.description}
                </p>

                {/* Location & Budget */}
                <div className="space-y-2.5 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2.5 text-red-500" />
                    <span>{post.location.area}, {post.location.city}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4 mr-2.5 text-green-500" />
                    <span className="font-bold text-green-600">{formatBudget(post)}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                    {post.preferences.gender}
                  </span>
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                    {post.roomDetails.roomType}
                  </span>
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                    {post.preferences.occupation}
                  </span>
                </div>
              </div>

              {/* Post Footer */}
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1.5" />
                      {post.views}
                    </div>
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1.5 text-red-400" />
                      {post.interested}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
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
            <button
              onClick={handleCreatePost}
              className="bg-orange-500 text-white px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors font-medium shadow-lg"
            >
              {activeTab === 'looking_for_roommate' ? 'Find Roommate' : 'List Room'}
            </button>
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
      </div>
    </div>
  );
};

export default Roomateoption;