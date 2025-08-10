import React, { useContext, useEffect, useState, useCallback, useRef } from "react";
import chatassets from "../../assets/chatassets";
import { BiDotsVertical } from "react-icons/bi";
import { ChatContext } from "../../Context/Chatcontext";
import { AuthContext } from "../../Context/auth";
import toast from "react-hot-toast";

const ChatHeader = () => {
  const chatContext = useContext(ChatContext);
  const authContext = useContext(AuthContext);



  const {
    sendMessage, 
    messages, 
    fetchMessages, 
    currentChatAdmin,
    startChatWithHostelAdmin,
    loading,
    getChatDebugInfo // Add this for better debugging
  } = chatContext || {};
  
  const { 
    authuser,
    selecteduser,
    setSelectedUser,
    token
  } = authContext || {};

  const [input, setInput] = useState("");
  
  // FIXED: Use ref to track if messages are already being fetched
  const fetchingRef = useRef(false);
  const lastFetchedAdminRef = useRef(null);

  function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  }

  const testChatWithAdmin = async () => {
    // Replace with actual admin ID from your database
    const testAdminId = "REPLACE_WITH_ACTUAL_ADMIN_ID"; 
    const testHostelName = "Test Hostel";
    
    if (startChatWithHostelAdmin) {
      const success = await startChatWithHostelAdmin(testAdminId, testHostelName);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const trimmedMessage = input.trim();
    if (!trimmedMessage) {
      toast.error("Please enter a message");
      return;
    }

    if (!authuser || !authuser._id) {
      toast.error("User authentication error. Please login again.");
      return;
    }

    const targetAdminId = currentChatAdmin || selecteduser?.userId;
    
    if (!targetAdminId) {
      toast.error("Admin not available. Please select a hostel to chat with.");
      return;
    }

    try {
      if (!sendMessage) {
        toast.error("Chat service not available");
        return;
      }

      const success = await sendMessage(trimmedMessage, targetAdminId);
      
      if (success) {
        setInput("");
        toast.success("Message sent!");
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  // FIXED: Memoized fetch function to prevent infinite loops
  const memoizedFetchMessages = useCallback(async (adminId) => {
    if (!adminId || !authuser || !fetchMessages) {
      return;
    }

    // Prevent duplicate fetches for the same admin
    if (fetchingRef.current || lastFetchedAdminRef.current === adminId) {
      return;
    }

    fetchingRef.current = true;
    lastFetchedAdminRef.current = adminId;

    try {
      await fetchMessages(adminId);
    } catch (error) {
      // Reset refs on error so we can try again
      lastFetchedAdminRef.current = null;
    } finally {
      fetchingRef.current = false;
    }
  }, [fetchMessages, authuser]);

  // FIXED: Better useEffect with proper dependency management
  useEffect(() => {
    const targetAdminId = currentChatAdmin || selecteduser?.userId;
    
    if (targetAdminId && targetAdminId !== lastFetchedAdminRef.current) {
      memoizedFetchMessages(targetAdminId);
    }
  }, [currentChatAdmin, selecteduser?.userId, memoizedFetchMessages]);

  // FIXED: Reset refs when admin changes
  useEffect(() => {
    const targetAdminId = currentChatAdmin || selecteduser?.userId;
    
    // Reset when admin changes
    if (targetAdminId !== lastFetchedAdminRef.current) {
      fetchingRef.current = false;
    }
  }, [currentChatAdmin, selecteduser?.userId]);

  const targetAdminId = currentChatAdmin || selecteduser?.userId;

  // Show debug info if no admin is selected
  if (!targetAdminId) {
    return (
      <div className="h-full mt-[-150px] w-full overflow-hidden rounded-2xl relative bg-gradient-to-b from-[#3a3556] to-[#2a2640] flex flex-col shadow-xl">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-white">
            <h3 className="text-xl mb-4">🔍 Debug Information</h3>
            <div className="bg-black/20 p-4 rounded-lg text-left text-sm space-y-2">
              {getChatDebugInfo ? (
                Object.entries(getChatDebugInfo()).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {String(value)}
                  </p>
                ))
              ) : (
                <>
                  <p><strong>Auth User:</strong> {authuser ? `${authuser.fullName || authuser.name} (${authuser._id})` : "❌ Not loaded"}</p>
                  <p><strong>Token:</strong> {token ? "✅ Present" : "❌ Missing"}</p>
                  <p><strong>Current Chat Admin:</strong> {currentChatAdmin || "❌ Not set"}</p>
                  <p><strong>Selected User:</strong> {selecteduser ? `${selecteduser.userName} (${selecteduser.userId})` : "❌ Not set"}</p>
                  <p><strong>Messages Count:</strong> {messages?.length || 0}</p>
                </>
              )}
            </div>
            
            <div className="mt-6 space-y-3">
              <p className="text-yellow-300">
                ⚠️ No admin selected for chat
              </p>
              <p className="text-sm text-gray-300">
                To start chatting, go back to a hostel page and click "In-App Chat"
              </p>
              
              {/* Test button - remove in production */}
              <button 
                onClick={testChatWithAdmin}
                className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                🧪 Test Chat (Debug)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full mt-[-150px] w-full overflow-hidden rounded-2xl relative bg-gradient-to-b from-[#3a3556] to-[#2a2640] flex flex-col shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center gap-3 py-4 px-5 border-b border-stone-500/30 bg-[#4b466a]/95 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              className="w-9 h-9 rounded-full object-cover border-2 border-purple-400/30"
              src={chatassets.profile_martin}
              alt="Admin"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#4b466a]"></span>
          </div>
          <div className="flex flex-col">
            <p className="text-white font-medium text-sm">
              {selecteduser?.userName || selecteduser?.hostelName + " Admin" || "Admin Support"}
            </p>
            <p className="text-xs text-purple-200/80">
              {loading ? "Loading..." : "Online"}
            </p>
          </div>
        </div>
        <div className="group relative">
          <button className="p-1 rounded-full hover:bg-white/10 transition-colors">
            <BiDotsVertical className="h-5 w-5 text-white/80 hover:text-white cursor-pointer" />
          </button>
          <div className="absolute top-full right-0 z-20 w-44 p-2 rounded-xl bg-[#5a5485] border border-gray-600/30 shadow-2xl text-white hidden group-hover:block transition-all duration-200 origin-top-right scale-95 group-hover:scale-100">
            <p className="cursor-pointer hover:bg-white/10 px-3 py-2 rounded-lg text-sm transition-colors">Logout</p>
            <hr className="my-1 border-t border-gray-600/40" />
            <p className="cursor-pointer hover:bg-white/10 px-3 py-2 rounded-lg text-sm transition-colors">Edit Profile</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white/60">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
              <p className="text-sm">Loading messages...</p>
            </div>
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((mssg, index) => {
            const messageSenderId = typeof mssg.senderId === 'object' 
              ? mssg.senderId._id || mssg.senderId.id 
              : mssg.senderId;
            
            const currentUserId = authuser?._id || authuser?.id;
            const isSender = messageSenderId === currentUserId;

            return (
              <div
                key={mssg._id || `${index}-${mssg.createdAt}`}
                className={`flex items-start gap-3 ${isSender ? "justify-end" : "justify-start"}`}
              >
                {!isSender && (
                  <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                    <img
                      src={chatassets.profile_martin}
                      className="w-8 h-8 rounded-full object-cover border border-purple-400/20"
                      alt="Admin"
                    />
                    <p className="font-light text-xs text-white/50">
                      {formatMessageTime(mssg.createdAt)}
                    </p>
                  </div>
                )}
                
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${isSender 
                  ? "bg-purple-600 rounded-tr-none text-white" 
                  : "bg-[#5a5485] rounded-tl-none text-white"}`}>
                  <p className="text-sm">
                    {mssg.message || mssg.text || mssg.content || "Message content not available"}
                  </p>
                </div>

                {isSender && (
                  <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                    <img
                      src={chatassets.avatar_icon}
                      className="w-8 h-8 rounded-full object-cover border border-purple-400/20"
                      alt="You"
                    />
                    <p className="font-light text-xs text-white/50">
                      {formatMessageTime(mssg.createdAt)}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white/60">
              <p className="text-lg mb-2">👋 Welcome to Admin Support</p>
              <p className="text-sm">Send a message to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 w-full p-4 bg-gradient-to-t from-[#4b466a] to-[#4b466a]/80 backdrop-blur-lg border-t border-stone-500/20">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <div className="flex-1 flex items-center bg-white/10 px-5 rounded-full transition-all focus-within:ring-2 focus-within:ring-purple-500/40 focus-within:bg-white/15">
            <input
              type="text"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Type a message..."
              className="flex-1 text-sm py-3 bg-transparent border-none outline-none text-white placeholder-gray-400/60"
              disabled={loading}
            />
          </div>
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-purple-500/20 active:scale-95"
          >
            <img src={chatassets.send_button} className="w-5 h-5" alt="Send" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatHeader;