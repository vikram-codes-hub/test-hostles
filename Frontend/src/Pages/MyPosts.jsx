import React, { useState, useEffect, useContext } from 'react';
import { Plus, Users, Home, MessageSquare, Clock, Eye, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Roommatecontext } from '../Context/Roommate'

const MyPosts = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Get functions from context
  const { getMyPosts, Deletepost } = useContext(Roommatecontext);

  // Fetch user's posts on component mount
  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await getMyPosts();
      
      if (result && result.posts) {
        setUserPosts(result.posts);
        setStats(result.stats || {});
      } else {
        setUserPosts([]);
        setStats({});
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const result = await Deletepost(postId);
      
      if (result) {
        // Remove post from local state
        setUserPosts(prev => prev.filter(post => post._id !== postId));
        setDeleteConfirm(null);
        
        // Update stats by refetching (or you could update manually)
        fetchMyPosts();
      }
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleToggleStatus = async (postId, currentStatus) => {
    try {
      // You'll need to add this function to your context
      // For now, using direct API call
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/roommate/posts/${postId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update post status');
      }

      // Update post status in local state
      setUserPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, isActive: !currentStatus }
          : post
      ));
    } catch (err) {
      console.error('Error updating post status:', err);
      alert(err.message || 'Failed to update post status. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8 max-w-md mx-auto">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Posts</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchMyPosts}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Use stats from API or calculate from local data
  const totalPosts = stats.totalPosts || userPosts.length;
  const activePosts = stats.activePosts || userPosts.filter(post => post.isActive && !post.isExpired).length;
  const totalViews = stats.totalViews || userPosts.reduce((sum, post) => sum + (post.views || 0), 0);
  const totalInterested = stats.totalInterested || userPosts.reduce((sum, post) => sum + (post.interestedCount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
              <p className="text-gray-600 mt-2">Manage your roommate finder posts</p>
            </div>
            <button
              onClick={() => window.location.href = '/roommatefinder/create'}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Post
            </button>
          </div>
        </div>

        {/* Stats Cards - Show when user has posts */}
        {userPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Posts</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalPosts}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <Home className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Active Posts</p>
                  <p className="text-2xl font-semibold text-gray-900">{activePosts}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalViews}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-full">
                  <MessageSquare className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Interested Users</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalInterested}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {userPosts.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-center py-16 px-8">
              <div className="mx-auto mb-6 w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                No posts created yet
              </h2>
              
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You haven't created any roommate finder posts yet. Start by creating your first post to find the perfect roommate or advertise your available room!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => window.location.href = '/roommatefinder'}
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Post
                </button>
                
                <button
                  onClick={() => window.location.href = '/roommatefinder'}
                  className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Browse Other Posts
                </button>
              </div>

              {/* Help Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  What can you post?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900">Looking for Roommate</h4>
                      <p className="text-sm text-gray-600">Find someone to share your room or flat with</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Home className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900">Room Available</h4>
                      <p className="text-sm text-gray-600">Offer your extra room to potential roommates</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts List - Show when user has posts */}
        {userPosts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Posts ({userPosts.length})</h2>
              <button
                onClick={fetchMyPosts}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Refresh
              </button>
            </div>

            {userPosts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.type === 'looking_for_roommate' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {post.type === 'looking_for_roommate' ? 'Looking for Roommate' : 'Room Available'}
                      </span>
                      
                      {/* Status Badge */}
                      <button
                        onClick={() => handleToggleStatus(post._id, post.isActive)}
                        className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                          post.isExpired
                            ? 'bg-red-100 text-red-800 cursor-not-allowed'
                            : post.isActive 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        disabled={post.isExpired}
                        title={post.isExpired ? 'This post has expired' : 'Click to toggle status'}
                      >
                        {post.isExpired ? 'Expired' : (post.isActive ? 'Active' : 'Inactive')}
                      </button>

                      {/* Expiring Soon Warning */}
                      {post.isExpiringSoon && !post.isExpired && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          Expires in {post.daysLeft} days
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">{post.description}</p>
                    
                    {post.location && (
                      <p className="text-sm text-gray-500 mb-3">
                        📍 {post.location.area ? `${post.location.area}, ` : ''}{post.location.city}
                      </p>
                    )}
                    
                    {/* Budget/Rent Display */}
                    {post.type === 'room_available' && post.rent && (
                      <p className="text-sm font-medium text-green-600 mb-3">💰 ₹{post.rent}/month</p>
                    )}
                    {post.type === 'looking_for_roommate' && post.budget && (
                      <p className="text-sm font-medium text-green-600 mb-3">
                        💰 ₹{post.budget.min}-₹{post.budget.max}/month
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {post.views || 0} views
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {post.interestedCount || 0} interested
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.timeAgo || new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => window.location.href = `/roommatefinder/edit/${post._id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Post"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(post._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Post</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this post? This action cannot be undone and all associated images will also be deleted.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeletePost(deleteConfirm)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;