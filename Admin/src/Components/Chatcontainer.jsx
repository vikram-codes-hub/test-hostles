import React, { useContext } from 'react';
import chatassets, { messagesDummyData, userDummyData } from '../assets/chatassets';
import { ChatContext } from '../Context/chatcontext';

const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Chatcontainer = () => {
  const { selecteduser, setSelectedUser } = useContext(ChatContext);
  const user = selecteduser || userDummyData;

  return (
    <div className='h-full overflow-scroll relative bg-[#F0F4FF]'>
      {/* Header */}
      <div className='flex justify-between items-center gap-3 py-4 px-5 border-b border-blue-200'>
        <div className='flex items-center gap-3'>
          <img
            src={user.profilePic || chatassets.avatar_icon}
            className='w-9 rounded-full'
            alt="user"
          />
          <p className='text-blue-900 font-medium'>
            {user.fullName}
            <span className="w-2 h-2 rounded-full inline-block ml-2 bg-green-500"></span>
          </p>
          <img
            src={chatassets.arrow_icon}
            onClick={() => setSelectedUser(null)}
            className="md:hidden w-6 cursor-pointer"
            alt="back"
          />
        </div>
        <img src={chatassets.help_icon} className="max-md:hidden w-5" alt="help" />
      </div>

      {/* Chat Messages */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-auto p-4 space-y-4'>
        {messagesDummyData.map((message, index) => {
          if (!message || !message.senderId) return null;

          const isSender = message.senderId === user._id;

          return (
            <div
              key={index}
              className={`flex items-end gap-3 ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div className='flex flex-col items-center text-xs text-gray-500'>
                <img
                  src={
                    isSender
                      ? user.profilePic || chatassets.avatar_icon
                      : chatassets.avatar_icon
                  }
                  className='w-7 rounded-full'
                  alt="profile"
                />
                <p>{formatMessageTime(message.createdAt)}</p>
              </div>
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  isSender
                    ? 'bg-[#D1ECF9] text-[#003C5E]'
                    : 'bg-white text-[#263238]'
                }`}
              >
                {message.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Box */}
      <div className='absolute bottom-0 w-full px-4 py-3 bg-[#E3F2FD] flex items-center gap-3 border-t border-blue-200'>
        <input
          type="text"
          placeholder="Type your message..."
          className='flex-1 text-sm p-3 rounded-full outline-none bg-white text-[#003C5E] placeholder:text-blue-300 shadow-inner'
        />
        <button className='bg-[#64B5F6] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#42A5F5]'>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatcontainer;
