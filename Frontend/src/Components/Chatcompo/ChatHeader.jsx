import React from "react";
import chatassets, { messagesDummyData } from "../../assets/chatassets";
import { BiDotsVertical } from "react-icons/bi";

const ChatHeader = () => {
  // Function to format time in cleaner way
  function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
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
              alt="Martin Johnson"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#4b466a]"></span>
          </div>
          <div className="flex flex-col">
            <p className="text-white font-medium text-sm">Martin Johnson</p>
            <p className="text-xs text-purple-200/80">Online</p>
          </div>
        </div>
        <div className="group relative">
          <button className="p-1 rounded-full hover:bg-white/10 transition-colors">
            <BiDotsVertical className="h-5 w-5 text-white/80 hover:text-white cursor-pointer" />
          </button>
          <div className="absolute top-full right-0  z-20 w-44 p-2 rounded-xl bg-[#5a5485] border border-gray-600/30 shadow-2xl text-white hidden group-hover:block transition-all duration-200 origin-top-right scale-95 group-hover:scale-100">
            <p className="cursor-pointer hover:bg-white/10 px-3 py-2 rounded-lg text-sm transition-colors">Logout</p>
            <hr className="my-1 border-t border-gray-600/40" />
            <p className="cursor-pointer hover:bg-white/10 px-3 py-2 rounded-lg text-sm transition-colors">Edit Profile</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-[url('pattern.png')] bg-opacity-5 bg-fixed">
        {messagesDummyData.map((mssg, index) => {
          const isSender = mssg.senderId === "680f50e4f10f3cd28382ecf9";
          return (
            <div
              key={index}
              className={`flex items-start gap-3 ${isSender ? "justify-end" : "justify-start"}`}
            >
              {!isSender && (
                <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                  <img
                    src={chatassets.profile_martin}
                    className="w-8 h-8 rounded-full object-cover border border-purple-400/20"
                    alt=""
                  />
                  <p className="font-light text-xs text-white/50">
                    {formatMessageTime(mssg.createdAt)}
                  </p>
                </div>
              )}
              
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${isSender 
                ? "bg-purple-600 rounded-tr-none text-white" 
                : "bg-[#5a5485] rounded-tl-none text-white"}`}>
                <p className="text-sm">{mssg.text}</p>
              </div>

              {isSender && (
                <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                  <img
                    src={chatassets.avatar_icon}
                    className="w-8 h-8 rounded-full object-cover border border-purple-400/20"
                    alt=""
                  />
                  <p className="font-light text-xs text-white/50">
                    {formatMessageTime(mssg.createdAt)}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 w-full p-4 bg-gradient-to-t from-[#4b466a] to-[#4b466a]/80 backdrop-blur-lg border-t border-stone-500/20">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center bg-white/10 px-5 rounded-full transition-all focus-within:ring-2 focus-within:ring-purple-500/40 focus-within:bg-white/15">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 text-sm py-3 bg-transparent border-none outline-none text-white placeholder-gray-400/60"
            />
            <div className="flex items-center gap-2 pl-2">
              <button className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <button className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
          <button className="p-2.5 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors shadow-md hover:shadow-purple-500/20 active:scale-95">
            <img src={chatassets.send_button} className="w-5 h-5" alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;