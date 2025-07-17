import React, { useContext } from 'react';
import { ChatContext } from '../Context/chatcontext';

const RIghtsidebar = () => {
  const { selecteduser } = useContext(ChatContext);

  if (!selecteduser) return null;

  return (
    <div
      className={`bg-[#F0F4F8] text-black h-full relative overflow-y-auto scrollbar-hide ${
        selecteduser ? 'max-md:hidden' : ''
      }`}
    >
      {/* Profile Section */}
      <div className="flex flex-col">
        <div className="pt-8 pb-4 flex flex-col gap-3 items-center border-b border-gray-300 shadow-sm mb-3">
          <img
            src={selecteduser.profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-violet-400/50"
          />
          <div className="flex flex-col items-center gap-1 px-3">
            <p className="text-xl font-medium">{selecteduser.fullName}</p>
            <p className="text-sm text-gray-500">B.Tech - 2nd Year Student</p>
          </div>
        </div>

        {/* Suggestions Section for Admin */}
        <div className="px-4">
          <h2 className="text-lg font-semibold mb-2">Suggestions</h2>
          <ul className="flex flex-col gap-3 text-sm text-gray-700">
            <li className="bg-white rounded-xl p-3 shadow-sm">
              Ensure documents are submitted before hostel allotment.
            </li>
            <li className="bg-white rounded-xl p-3 shadow-sm">
              Recommended room: 3rd Floor, Block B
            </li>
            <li className="bg-white rounded-xl p-3 shadow-sm">
              Good attendance, eligible for hostel festival duties.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RIghtsidebar;
