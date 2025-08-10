import React, { useContext, useState, useRef, useEffect } from 'react';
import chatassets, { messagesDummyData, userDummyData } from '../assets/chatassets';
import { ChatContext } from '../Context/chatcontext';
import { AuthContext } from '../Context/authcontext';

const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Chatcontainer = () => {
  const { selecteduser, setSelectedUser: openChatWithUser, messages, sendMessage } = useContext(ChatContext);
  const { authUser } = useContext(AuthContext);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const user = selecteduser || userDummyData;

  const messagesToShow = messages?.filter((message) => {
    if (!message || !message.senderId || !message.receiverId) {
      return false;
    }
    
    const senderIsUser = 
      message.senderId === user.userId ||
      message.senderId === user._id ||
      message.senderId.toString() === user.userId ||
      message.senderId.toString() === user._id ||
      message.senderId._id === user.userId ||
      message.senderId._id === user._id;
      
    const receiverIsAuth = 
      message.receiverId === authUser?.id ||
      message.receiverId === authUser?._id ||
      message.receiverId.toString() === authUser?.id ||
      message.receiverId.toString() === authUser?._id ||
      message.receiverId._id === authUser?.id ||
      message.receiverId._id === authUser?._id;
      
    const senderIsAuth = 
      message.senderId === authUser?.id ||
      message.senderId === authUser?._id ||
      message.senderId.toString() === authUser?.id ||
      message.senderId.toString() === authUser?._id ||
      message.senderId._id === authUser?.id ||
      message.senderId._id === authUser?._id;
      
    const receiverIsUser = 
      message.receiverId === user.userId ||
      message.receiverId === user._id ||
      message.receiverId.toString() === user.userId ||
      message.receiverId.toString() === user._id ||
      message.receiverId._id === user.userId ||
      message.receiverId._id === user._id;
    
    return (senderIsUser && receiverIsAuth) || (senderIsAuth && receiverIsUser);
  }) || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesToShow]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      await sendMessage({
        receiverId: user.userId,
        message: messageText.trim()
      });
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleInputChange = (e) => {
    setMessageText(e.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  if (!selecteduser) {
    return (
      <div className="h-full bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full 
                        flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome to Hostel Scout Chat</h2>
          <p className="text-gray-600 leading-relaxed">
            Select a student from the sidebar to start chatting. Help them with their hostel queries 
            and provide personalized assistance.
          </p>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">💡 <strong>Admin Tip:</strong> Use quick suggestions to provide faster responses</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className='h-full overflow-hidden relative bg-gradient-to-b from-gray-50 to-white flex flex-col border-l border-gray-200'>
      {/* Enhanced Header */}
      <div className='flex justify-between items-center gap-3 py-4 px-6 border-b border-gray-200 
                    bg-white/80 backdrop-blur-sm shadow-sm'>
        <div className='flex items-center gap-4'>
          <div className="relative">
            <img
              src={user.profilePic || chatassets.avatar_icon}
              className='w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm'
              alt="user"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          
          <div className="flex flex-col">
            <p className='text-gray-900 font-semibold text-lg'>{user.fullName}</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-sm text-green-600 font-medium">Online</span>
              {isTyping && (
                <span className="text-xs text-gray-500 italic">typing...</span>
              )}
            </div>
          </div>
          
          <button
            onClick={() => openChatWithUser(null)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Chat History
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Block User
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.966-.833-2.736 0L3.077 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Report User
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Chat Messages */}
      <div className='flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'>
        {messagesToShow.length === 0 ? (
          <div className='text-center mt-20'>
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full 
                          flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className='text-gray-600 text-lg mb-2'>Start the conversation with {user.fullName}!</p>
            <p className="text-gray-500 text-sm mb-6">Be welcoming and help them with their hostel needs</p>
            
            {/* Quick Start Buttons */}
            <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
              <button 
                onClick={() => setMessageText("Hello! How can I help you with your hostel queries today?")}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-sm transition-colors"
              >
                👋 Say Hello
              </button>
              <button 
                onClick={() => setMessageText("What information do you need about our hostel facilities?")}
                className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-full text-sm transition-colors"
              >
                🏠 Ask About Facilities
              </button>
              <button 
                onClick={() => setMessageText("I'm here to help with your application process.")}
                className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-full text-sm transition-colors"
              >
                📝 Offer Help
              </button>
            </div>
          </div>
        ) : (
          messagesToShow.map((message, index) => {
            if (!message || !message.senderId) return null;

            const isSender = 
              message.senderId === authUser?._id || 
              message.senderId?.toString() === authUser?._id ||
              message.senderId?._id === authUser?._id;

            return (
              <div
                key={message._id || index}
                className={`flex items-end gap-3 ${isSender ? 'justify-end' : 'justify-start'} 
                          animate-fade-in`}
              >
                {!isSender && (
                  <div className='flex flex-col items-center'>
                    <img
                      src={user.profilePic || chatassets.avatar_icon}
                      className='w-8 h-8 rounded-full object-cover border-2 border-gray-200'
                      alt="profile"
                    />
                  </div>
                )}
                
                <div className={`max-w-sm lg:max-w-md xl:max-w-lg`}>
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm border relative ${
                      isSender
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                        : 'bg-white text-gray-800 border-gray-200 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    
                    {/* Message Status for Sent Messages */}
                    {isSender && (
                      <div className="absolute -bottom-1 -right-1">
                        <svg className="w-4 h-4 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className={`mt-1 px-2 ${isSender ? 'text-right' : 'text-left'}`}>
                    <span className="text-xs text-gray-500">
                      {formatMessageTime(message.createdAt)}
                    </span>
                  </div>
                </div>

                {isSender && (
                  <div className='flex flex-col items-center'>
                    <img
                      src={authUser?.profilePic || chatassets.avatar_icon}
                      className='w-8 h-8 rounded-full object-cover border-2 border-blue-200'
                      alt="profile"
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Box */}
      <div className='px-6 py-4 bg-white border-t border-gray-200'>
        {/* Quick Suggestions */}
        <div className="mb-3 flex flex-wrap gap-2">
          <button 
            onClick={() => setMessageText("Great question! Let me help you with that.")}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs transition-colors"
          >
            👍 Acknowledge
          </button>
          <button 
            onClick={() => setMessageText("I'll need to check that information for you. Give me a moment.")}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs transition-colors"
          >
            ⏰ Check Info
          </button>
          <button 
            onClick={() => setMessageText("Would you like to schedule a visit to see the hostel facilities?")}
            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full text-xs transition-colors"
          >
            🏠 Schedule Visit
          </button>
        </div>

        <form onSubmit={handleSendMessage} className='flex items-end gap-3'>
          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows="1"
              className='w-full text-sm p-4 pr-12 rounded-2xl outline-none bg-gray-50 border border-gray-200
                       text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                       resize-none transition-all duration-200 min-h-[52px] max-h-32 scrollbar-thin scrollbar-thumb-gray-300'
            />
            
            {/* Emoji Button */}
            <button 
              type="button"
              className="absolute right-3 bottom-3 p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          
          <button 
            type="submit"
            disabled={!messageText.trim()}
            className={`p-3 rounded-2xl font-medium transition-all duration-200 flex items-center justify-center
                     ${messageText.trim() 
                       ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                       : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        
       
        <div className="mt-2 text-xs text-gray-500 h-4">
          {messageText.length > 0 && (
            <span>{messageText.length}/1000 characters</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatcontainer;