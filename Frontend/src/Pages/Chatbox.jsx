import React from 'react'
import ChatHeader from '../Components/Chatcompo/ChatHeader'


const Chatbox = () => {
  return (
    <div className='w-full max-h-screen border-none sm:px-[15%] sm:py-[15%]'>
      <div className=' max-w-1/2  mx-auto'>

       <ChatHeader/>
      </div>
     
    </div>
  )
}

export default Chatbox
