import React, { useState, useContext } from 'react'
import chatassets, { userDummyData } from '../assets/chatassets'
import { ChatContext } from '../Context/chatcontext'

const Leftsidebar = () => {
  const [input, setinput] = useState('')
  const { setSelectedUser, selectedUser } = useContext(ChatContext)

  const usersWithUnseen = userDummyData.map((user, i) => ({
    ...user,
    unseenCount: [2, 5, 0, 1, 3][i] || 0
  }))

  const filteredusers = usersWithUnseen.filter((user) =>
    user.fullName.toLowerCase().includes(input.toLowerCase().trim())
  )

  return (
    <div className="h-full bg-[#1B1F3B] p-5 rounded-r-xl overflow-y-scroll text-white">
      <div className="p-5">
        <div className="flex justify-between items-center">
          <img src={chatassets.logo} className="max-w-40" alt="logo" />
        </div>

        <div className="bg-[#2D3142]/80 rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={chatassets.search_icon} className="w-3" alt="search" />
          <input
            onChange={(e) => setinput(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>

      <div className="flex flex-col">
        {filteredusers.map((user, index) => (
          <div
            key={user._id || index}
            className={`relative flex items-center gap-3 p-2 pl-4 rounded cursor-pointer hover:bg-[#2D3142] max-sm:text-sm ${
              selectedUser?._id === user._id ? 'bg-[#3E64FF]' : ''
            }`}
            onClick={() => setSelectedUser(user)}
          >
            <img
              src={user?.profilePic || chatassets.avatar_icon}
              className="w-[35px] aspect-[1/1] rounded-full"
              alt="user"
            />
            <div className="flex flex-col leading-5">
              <p className="text-sm text-white font-medium">{user.fullName}</p>
              <span className="text-[#00FFAB] text-xs">Online</span>
            </div>

            {user.unseenCount > 0 && (
              <div className="ml-auto bg-[#FF4C60] text-white text-xs px-2 py-0.5 rounded-full">
                {user.unseenCount}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Leftsidebar
