import React, { useState, useContext } from 'react'
import chatassets, { userDummyData } from '../assets/chatassets'
import { ChatContext } from '../Context/chatcontext'

const Leftsidebar = () => {
  const [input, setinput] = useState('')
  const { setSelectedUser: openChatWithUser, selecteduser, users } = useContext(ChatContext)
  
  const safeUsers = users || []
  
  const mappedUsers = safeUsers.map((user, i) => ({
    _id: user.userId,     
    userId: user.userId,
    fullName: user.fullName || user.userName || `User ${user.userId.slice(-4)}`,
    profilePic: user.profilePic || null,
    lastMessage: user.lastMessage,
    unseenCount: user.unseenCount || 0
  }))
  
  const filteredusers = mappedUsers.filter((user) => {
    if (!user || !user.fullName) return false         
    return user.fullName.toLowerCase().includes(input.toLowerCase().trim())
  })

  return (
    <div className="h-full bg-gradient-to-b from-[#1a1d3a] to-[#0f1123] border-r border-gray-800/50 overflow-hidden flex flex-col">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-700/50 bg-[#1e2247]/50 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">HS</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Admin Panel</h1>
              <p className="text-gray-400 text-xs">Hostel Scout Chat</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-xs font-medium">Online</span>
          </div>
        </div>
        
        {/* Enhanced Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            onChange={(e) => setinput(e.target.value)}
            type="text"
            className="w-full bg-gray-800/40 border border-gray-700/50 text-white text-sm rounded-xl pl-10 pr-4 py-3 
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
                     backdrop-blur-sm transition-all duration-200"
            placeholder="Search students..."
            value={input}
          />
          {input && (
            <button
              onClick={() => setinput('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-4 w-4 text-gray-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Stats Bar */}
        <div className="flex justify-between items-center mt-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
          <div className="text-center">
            <p className="text-white font-semibold text-sm">{safeUsers.length}</p>
            <p className="text-gray-400 text-xs">Total Chats</p>
          </div>
          <div className="text-center">
            <p className="text-orange-400 font-semibold text-sm">
              {safeUsers.reduce((acc, user) => acc + (user.unseenCount || 0), 0)}
            </p>
            <p className="text-gray-400 text-xs">Unread</p>
          </div>
          <div className="text-center">
            <p className="text-green-400 font-semibold text-sm">{safeUsers.filter(u => u.lastMessage).length}</p>
            <p className="text-gray-400 text-xs">Active</p>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent p-2">
        {filteredusers.length > 0 ? (
          <div className="space-y-2">
            {filteredusers.map((user, index) => (
              <div
                key={user._id || index}
                className={`group relative flex items-center gap-3 p-4 rounded-xl cursor-pointer 
                         transition-all duration-200 hover:bg-gray-800/40 hover:shadow-lg
                         border border-transparent hover:border-gray-700/50
                         ${selecteduser?.userId === user.userId 
                           ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 shadow-lg' 
                           : ''}`}
                onClick={() => {
                  console.log("Clicking user:", user);
                  openChatWithUser(user);
                }}
              >
                {/* Profile Image with Status */}
                <div className="relative flex-shrink-0">
                  <img
                    src={user?.profilePic || chatassets.avatar_icon}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-600 
                             group-hover:border-blue-400 transition-colors duration-200"
                    alt="user"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-gray-800 rounded-full"></div>
                </div>
                
                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-medium text-sm truncate">
                      {user.fullName || 'Unknown User'}
                    </p>
                    <span className="text-xs text-gray-400">
                      {user.lastMessage ? '2m ago' : 'New'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-gray-400 text-xs truncate">
                      {user.lastMessage?.slice(0, 30) || 'No messages yet'}
                    </p>
                    {user.unseenCount > 0 && (
                      <div className="flex-shrink-0 ml-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 
                                       bg-gradient-to-r from-orange-500 to-red-500 text-white 
                                       text-xs font-bold rounded-full animate-pulse">
                          {user.unseenCount > 9 ? '9+' : user.unseenCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Hover Effect Indicator */}
                <div className="absolute left-0 top-1/2 w-1 h-0 bg-gradient-to-b from-blue-500 to-purple-600 
                              rounded-r-full transform -translate-y-1/2 transition-all duration-200
                              group-hover:h-8"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">
              {input ? 'No students found' : safeUsers.length > 0 ? 'No matching students' : 'No messages yet'}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {input ? 'Try a different search term' : 'Students will appear here when they start chatting'}
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions Footer */}
      <div className="p-4 border-t border-gray-700/50 bg-gray-800/20">
        <div className="flex justify-between items-center">
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 
                           text-gray-300 hover:text-white rounded-lg transition-all duration-200 text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 
                           text-blue-400 hover:text-blue-300 rounded-lg transition-all duration-200 text-xs
                           border border-blue-500/30">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>
      </div>
    </div>
  )
}

export default Leftsidebar