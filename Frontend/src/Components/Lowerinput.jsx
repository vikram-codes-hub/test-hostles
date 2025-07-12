import React from 'react'
import { FaArrowRight } from "react-icons/fa";
const Lowerinput = () => {
 const onsubmithandeller=(e)=>{
        e.preventDefault()
    }
  return (
    <div className='text-center mt-20'>
       
       <p className='text-gray-400 mt-3'>
  Join our newsletter to get exclusive updates, special dealson the hostels.
</p>


        <form onSubmit={onsubmithandeller} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
            <input className="w-full sm:flex-1 outline-none" type="email" placeholder='Enter your email' required  />
            <button type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
        </form>
      
    </div>
  )
}

export default Lowerinput