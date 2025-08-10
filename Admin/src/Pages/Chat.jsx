import React, { useContext } from 'react'
import Leftsidebar from '../Components/Leftsidebar'
import Chatcontainer from '../Components/Chatcontainer'
import RIghtsidebar from '../Components/RIghtsidebar'
import { ChatContext } from '../Context/chatcontext'
import TokenDebugger from '../Components/Tokkendebugger'

const Chat = () => {
  const { selecteduser } = useContext(ChatContext)

  return (
    <div className=' w-350 h-screen sm:px-[15%] -ml-20 mx-auto sm:py-[5%]'>
      <div className={`  grid grid-cols-1 relative backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] ${
        selecteduser
          ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]'
          : 'md:grid-cols-2'
      }`}>
        <Leftsidebar />
        <Chatcontainer />
        <RIghtsidebar />
        {/* <TokenDebugger/> */}
      </div>
    </div>
  )
}

export default Chat
