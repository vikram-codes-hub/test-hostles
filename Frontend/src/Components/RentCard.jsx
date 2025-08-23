import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Eye, Heart, MessageCircle } from 'lucide-react';

const RentCard = ({ post, onLike, onMessage }) => {
  const formatBudget = (post) => {
    if (!post) return '₹0/month';
    if (post.type === 'room_available') {
      return `₹${post.rent?.toLocaleString() || '0'}/month`;
    } else {
      return `₹${post.budget?.min?.toLocaleString() || '0'} - ₹${post.budget?.max?.toLocaleString() || '0'}/month`;
    }
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };
console.log('Post data:', post._id); // Debug log to check post data
  return (
    <Link 
      to={`/roommatefinder/${post.type}/${post._id || post.id}`}
     
      className="block bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 overflow-hidden"
    >
      {/* Post Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-lg">
              {post.user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{post.user?.name || 'Anonymous'}</span>
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
          {post.title || 'No title provided'}
        </h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {post.description || 'No description provided'}
        </p>

        {/* Location & Budget */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2.5 text-red-500" />
            <span>{post.location?.area || 'Unknown area'}, {post.location?.city || 'Unknown city'}</span>
          </div>
          <div className="flex items-center text-sm">
            <DollarSign className="w-4 h-4 mr-2.5 text-green-500" />
            <span className="font-bold text-green-600">{formatBudget(post)}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
            {post.preferences?.gender || 'Any gender'}
          </span>
          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
            {post.roomDetails?.roomType || 'Any type'}
          </span>
          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
            {post.preferences?.occupation || 'Any occupation'}
          </span>
        </div>
      </div>

      {/* Post Footer */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1.5" />
              {post.views || 0}
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1.5 text-red-400" />
              {post.interested || 0}
            </div>
          </div>
          <div className="flex space-x-1">
            <button 
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              onClick={(e) => {
                e.preventDefault(); // Prevent Link navigation
                e.stopPropagation();
                onLike && onLike(post._id || post.id);
              }}
            >
              <Heart className="w-4 h-4" />
            </button>
            <button 
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              onClick={(e) => {
                e.preventDefault(); // Prevent Link navigation
                e.stopPropagation();
                onMessage && onMessage(post._id || post.id);
              }}
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RentCard;