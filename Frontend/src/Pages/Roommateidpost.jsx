import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Heart, 
  MessageCircle, 
  Share2, 
  User, 
  Calendar,
  Eye,
  Home,
  Users,
  Wifi,
  Car,
  Coffee,
  Shield,
  CheckCircle,
  Mail,
  Clock,
  Star,
  Flag,
  MoreVertical,
  Edit,
  Trash2,
  UserCheck,
  Send,
  MessageSquare,
  X,
  ChevronDown
} from 'lucide-react';
import { Roommatecontext } from '../Context/Roommate';
import { AuthContext } from '../Context/auth';
import { toast } from 'react-toastify';

const Roommateidpost = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const { 
    GetRoommatepostbyid, 
    showInterestInPost, 
    removeInterest,
    Deletepost,
    getAllInterestedUsers,
  
    sendMessage,
    getConversation,
    createConversation
  } = useContext(Roommatecontext);

  const {selecteduser}=useContext(AuthContext)
  

  const { user, authuser } = useContext(AuthContext);
  const currentUser = user || authuser;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInterested, setIsInterested] = useState(false);
  const [interestLoading, setInterestLoading] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [showInterestedUsers, setShowInterestedUsers] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  // New states for chat functionality
  const [showChatModal, setShowChatModal] = useState(false);
  const [showMessageOptions, setShowMessageOptions] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [conversation, setConversation] = useState(null);


  // FIXED: Added GetRoommatepostbyid to dependencies
  useEffect(() => {
    fetchPost();
  }, [id, GetRoommatepostbyid]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state

      
      const response = await GetRoommatepostbyid(id);
      // console.log('Fetched post response:', response);
 
      
      // FIXED: More flexible response handling
      if (response && (response.post || response.data || response)) {
        const postData = response.post || response.data || response;
       
        
        setPost(postData);
        // Handle userRelation for interest status
        if (response.userRelation) {
          setIsInterested(response.userRelation.isInterested || false);
        }
      } else {
        console.error('No post data found in response');
        setError('Post not found');
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError(err.message || 'Failed to load post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInterest = async () => {
    if (!currentUser) {
      toast.error('Please login to show interest');
      navigate('/login');
      return;
    }

    setInterestLoading(true);
    try {
      if (isInterested) {
        const response = await removeInterest(id);
        if (response) {
          setIsInterested(false);
          setPost(prev => ({
            ...prev,
            interested: Math.max(0, (prev.interested || 0) - 1)
          }));
          toast.success('Interest removed successfully');
        }
      } else {
        const response = await showInterestInPost(id);
        if (response) {
          setIsInterested(true);
          setPost(prev => ({
            ...prev,
            interested: (prev.interested || 0) + 1
          }));
          toast.success('Interest shown successfully');
        }
      }
    } catch (err) {
      console.error('Error handling interest:', err);
      toast.error('Failed to update interest. Please try again.');
    } finally {
      setInterestLoading(false);
    }
  };

  const handleShowContact = () => {
    if (!currentUser) {
      toast.error('Please login to view contact information');
      navigate('/login');
      return;
    }
    setShowContactInfo(true);
  };

  // Enhanced message handling with options
  const handleMessageOptions = () => {
    if (!currentUser) {
      toast.error('Please login to send a message');
      navigate('/login');
      return;
    }

    // Check if user is trying to message themselves
    if (isOwner) {
      toast.error('You cannot message yourself');
      return;
    }

    setShowMessageOptions(true);
  };

  const handleEmailMessage = (email) => {
    if (!email) {
      toast.warn('Email not available');
      return;
    }
    
    const subject = encodeURIComponent(`Regarding: ${post.title || 'Roommate Post'}`);
    const body = encodeURIComponent(`Hi ${post.user?.name || 'there'},\n\nI'm interested in your roommate post. Please let me know if it's still available.\n\nThanks!`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    toast.success('Opening email client...');
    setShowMessageOptions(false);
  };

// Replace your handleInAppChat function with this corrected version:

const handleInAppChat = async () => {
  if (!currentUser) {
    toast.error('Please login to start a chat');
    navigate('/login');
    return;
  }

  // Check if user is trying to chat with themselves
  if (isOwner) {
    toast.error('You cannot start a chat with yourself');
    return;
  }

  // Get the correct user ID from the post
  const postOwnerId = post.userId?._id || post.userId || post.user?._id || post.user?.id;
  
  if (!postOwnerId) {
    toast.error('Unable to identify post owner');
    return;
  }

  try {
    setChatLoading(true);
    
    // Since you don't have getConversation and createConversation functions in your context,
    // let's use the initializeChat function from your context instead
    const success = await initializeChat(postOwnerId);
    
    if (success) {
      setShowMessageOptions(false);
      // Navigate to chat page instead of showing modal
      navigate('/chat-app');
      toast.success('Chat initialized successfully');
    }
  } catch (err) {
    console.error('Error starting chat:', err);
    toast.error('Failed to start chat. Please try again.');
  } finally {
    setChatLoading(false);
  }
};
  const handleSendMessage = async () => {
    if (!chatMessage.trim() || chatLoading) return;

    try {
      setChatLoading(true);
      const messageData = {
        conversationId: conversation.id || conversation._id,
        message: chatMessage,
        recipientId: post.user.id || post.user._id
      };

      const response = await sendMessage(messageData);
      
      if (response) {
        // Update conversation with new message
        setConversation(prev => ({
          ...prev,
          messages: [...(prev.messages || []), response.message]
        }));
        setChatMessage('');
        toast.success('Message sent successfully!');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setChatLoading(false);
    }
  };

  const handleShare = () => {
    const shareData = {
      title: post.title || 'Roommate Post',
      text: `Check out this roommate post: ${post.title || 'Roommate Post'}`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => toast.success('Shared successfully!'))
        .catch(() => fallbackShare());
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Link copied to clipboard!'))
      .catch(() => toast.info('Share link: ' + window.location.href));
  };

  const handleShowInterestedUsers = async () => {
    if (!isOwner) return;
    
    try {
      const response = await getAllInterestedUsers(id);
      if (response) {
        setInterestedUsers(response.interestedUsers || []);
        setShowInterestedUsers(true);
      }
    } catch (err) {
      console.error('Error fetching interested users:', err);
      toast.error('Failed to load interested users');
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await Deletepost(id);
        if (response) {
          toast.success('Post deleted successfully');
          navigate('/roommatefinder');
        }
      } catch (err) {
        console.error('Error deleting post:', err);
        toast.error('Failed to delete post');
      }
    }
  };

  const formatBudget = (post) => {
    if (!post) return '₹0/month';
    if (post.type === 'room_available') {
      return `₹${post.rent?.toLocaleString() || '0'}/month`;
    } else {
      const min = post.budget?.min || 0;
      const max = post.budget?.max || 0;
      return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}/month`;
    }
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays} days ago`;
    } catch (err) {
      return 'Recently';
    }
  };

  // FIXED: Better loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post details...</p>
        </div>
      </div>
    );
  }

  // FIXED: Better error handling
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-4xl">!</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-3">
            <button
              onClick={fetchPost}
              className="bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/roommatefinder')}
              className="bg-gray-500 text-white px-6 py-2 rounded-xl hover:bg-gray-600 transition-colors"
            >
              Back to Posts
            </button>
          </div>
        </div>
      </div>
    );
  }

  // FIXED: Check for post existence with better fallbacks
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Home className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Post not found</h3>
          <p className="text-gray-600 mb-6">The post you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/roommatefinder')}
            className="bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600 transition-colors"
          >
            Back to Posts
          </button>
        </div>
      </div>
    );
  }

  // FIXED: Simplified and more reliable owner check
  const isOwner = currentUser?._id === post?.userId?._id;
  // console.log('Is current user the owner?', isOwner);
  // console.log('Current user ID:', currentUser?._id);
  // console.log('Post user ID:', post?.userId?._id);
 
  
  const hasImages = post.images && Array.isArray(post.images) && post.images.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Share post"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images Section */}
            {hasImages && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="relative">
                  <img
                    src={post.images[imageIndex]}
                    alt={`Room ${imageIndex + 1}`}
                    className="w-full h-64 sm:h-80 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      console.error('Failed to load image:', post.images[imageIndex]);
                    }}
                  />
                  
                  {post.images.length > 1 && (
                    <>
                      <div className="absolute inset-y-0 left-0 flex items-center">
                        <button
                          onClick={() => setImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length)}
                          className="ml-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <button
                          onClick={() => setImageIndex((prev) => (prev + 1) % post.images.length)}
                          className="mr-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4 rotate-180" />
                        </button>
                      </div>
                      
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="flex space-x-2">
                          {post.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === imageIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                {post.images.length > 1 && (
                  <div className="p-4">
                    <div className="flex space-x-2 overflow-x-auto">
                      {post.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                            index === imageIndex ? 'border-orange-500' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Post Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                    post.type === 'looking_for_roommate'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {post.type === 'looking_for_roommate' ? (
                      <>
                        <Users className="w-4 h-4 mr-1" />
                        Looking for Roommate
                      </>
                    ) : (
                      <>
                        <Home className="w-4 h-4 mr-1" />
                        Room Available
                      </>
                    )}
                  </span>
                  
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {post.title || 'No title provided'}
                  </h1>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    Posted {getTimeAgo(post.createdAt)}
                  </div>
                </div>
              </div>

              {/* Location & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">
                      {post.location?.area || 'Area not specified'}, {post.location?.city || 'City not specified'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="font-semibold text-green-600">{formatBudget(post)}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {post.description || 'No description provided'}
                </p>
              </div>

              {/* Room Details */}
              {post.roomDetails && Object.keys(post.roomDetails).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Room Details</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {post.roomDetails.roomType && (
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="font-semibold text-gray-900">{post.roomDetails.roomType}</p>
                      </div>
                    )}
                    {post.roomDetails.roomSize && (
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600">Size</p>
                        <p className="font-semibold text-gray-900">{post.roomDetails.roomSize} sq ft</p>
                      </div>
                    )}
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600">Furnished</p>
                      <p className="font-semibold text-gray-900">{post.roomDetails.furnished ? 'Yes' : 'No'}</p>
                    </div>
                    {post.roomDetails.floor && (
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600">Floor</p>
                        <p className="font-semibold text-gray-900">{post.roomDetails.floor}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {post.amenities && post.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {post.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferences */}
              {post.preferences && Object.keys(post.preferences).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Preferences</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600">Gender</p>
                      <p className="font-semibold text-gray-900">{post.preferences.gender || 'Any'}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600">Occupation</p>
                      <p className="font-semibold text-gray-900">{post.preferences.occupation || 'Any'}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600">Age Range</p>
                      <p className="font-semibold text-gray-900">
                        {post.preferences.ageRange?.min || 18} - {post.preferences.ageRange?.max || 35}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {post.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{post.user?.name || 'Anonymous User'}</h3>
                    {post.user?.isVerified && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Member since {new Date(post.user?.createdAt || Date.now()).getFullYear()}
                  </p>
                </div>
              </div>

              {/* Show buttons only for non-owners */}
              {!isOwner && (
                <div className="space-y-3">
                  <button
                    onClick={handleInterest}
                    disabled={interestLoading}
                    className={`w-full flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-colors ${
                      isInterested
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                    } ${interestLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isInterested ? 'fill-current' : ''}`} />
                    {interestLoading ? 'Loading...' : (isInterested ? 'Remove Interest' : 'Show Interest')}
                  </button>
                  
                  {/* Connect Options - Only In-App Chat and Email */}
                  <div className="space-y-2">
                    <div className="relative">
                      <button
                        onClick={handleMessageOptions}
                        className="w-full flex items-center justify-center py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                        title="Send message"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Send Message
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </button>

                      {/* Message Options Dropdown */}
                      {showMessageOptions && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                          <button
                            onClick={handleInAppChat}
                            disabled={chatLoading}
                            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors rounded-t-lg"
                          >
                            <MessageSquare className="w-4 h-4 mr-3 text-blue-500" />
                            <div className="text-left">
                              <p onClick={()=>navigate('/chat-app')} className="font-medium">{chatLoading ? 'Loading...' : 'In-App Chat'}</p>
                              <p className="text-xs text-gray-500">Chat within the app</p>
                            </div>
                          </button>
                          <div className="border-t border-gray-100">
                            <button
                              onClick={() => handleEmailMessage(post.userId?.email)}
                              className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors rounded-b-lg"
                            >
                                                            <Mail className="w-4 h-4 mr-3 text-red-500" />
                              <div className="text-left">
                                <p className="font-medium">Email</p>
                                <p className="text-xs text-gray-500">Send an email</p>
                              </div>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Show message if owner */}
              {isOwner && (
                <div className="p-3 text-center text-sm text-gray-500 bg-gray-50 rounded-lg">
                  This is your post. Other users can contact you here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setShowChatModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Chat with {post.userId?.fullName || post.user?.name || "User"}
            </h3>

            <div className="border rounded-lg h-60 p-3 mb-4 overflow-y-auto">
              {conversation?.messages?.length ? (
                conversation.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 p-2 rounded-lg ${
                      msg.senderId === currentUser?._id
                        ? "bg-blue-100 ml-auto max-w-[80%]"
                        : "bg-gray-100 mr-auto max-w-[80%]"
                    }`}
                  >
                    <p className="text-sm text-gray-800">{msg.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No messages yet.</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={chatLoading}
                className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roommateidpost;
