import React, { useContext } from 'react';
import { ChatContext } from '../Context/chatcontext';

const RightSidebar = () => {
  const { selecteduser } = useContext(ChatContext);

  if (!selecteduser) return null;

  return (
    <div className={`bg-gradient-to-b from-gray-50 to-white text-gray-900 h-full relative overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent border-l-2 border-gray-300 shadow-2xl ${
      selecteduser ? 'max-md:hidden' : ''
    }`}>
      
      {/* Enhanced Profile Section */}
      <div className="pt-8 pb-6 flex flex-col gap-4 items-center border-b-2 border-gray-200 bg-white shadow-lg">
        <div className="relative">
          <img
            src={selecteduser.profilePic || '/api/placeholder/100/100'}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow-xl"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-3 border-white rounded-full shadow-md"></div>
        </div>
        
        <div className="text-center px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1 drop-shadow-sm">{selecteduser.fullName}</h2>
          <p className="text-sm text-gray-600">B.Tech - 2nd Year Student</p>
        </div>
      </div>

      {/* Enhanced Suggestions Section */}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 drop-shadow-sm">Suggestions</h3>
        
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-200">
            <div className="flex items-start gap-3">
              <span className="text-xl drop-shadow-sm">📋</span>
              <p className="text-sm text-gray-700 leading-relaxed">
                Ensure documents are submitted before hostel allotment.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-200">
            <div className="flex items-start gap-3">
              <span className="text-xl drop-shadow-sm">🏠</span>
              <p className="text-sm text-gray-700 leading-relaxed">
                Recommended room: 3rd Floor, Block B
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-200">
            <div className="flex items-start gap-3">
              <span className="text-xl drop-shadow-sm">🎯</span>
              <p className="text-sm text-gray-700 leading-relaxed">
                Good attendance, eligible for hostel festival duties.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Visual Enhancement - Subtle inner glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-blue-200 opacity-50"></div>
      </div>
    </div>
  );
};

export default RightSidebar;