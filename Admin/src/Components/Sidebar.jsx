import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/Hostels'
import { IoIosAddCircleOutline } from "react-icons/io";
import { AiOutlineEye } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { AuthContext } from '../Context/authcontext';
const Sidebar = () => {

  const {logout}=useContext(AuthContext)
  return (
    <div className='w-[18%] min-h-screen shadow-2xl bg-gray flex flex-col'>
      <div className='flex flex-col  justify-between'>
        <div className='-mt-[20px]'>
          <img src={assets.logo} alt="" className='w-full h-40 object-cover' />
        </div>

        <div className='flex flex-col mt-10'>
          <NavLink to='/' className='flex items-center gap-3 border p-2 px-4 border-gray-300 border-r-0 rounded-l ml-1'>
            <IoIosAddCircleOutline className='w-5 h-5 text-black'/>
            <p className='hidden md:block md:text-[12px] lg:text-lg text-black'>Add Items</p>
          </NavLink>
                    
          <NavLink to='/viewhostel' className='flex items-center mt-4 gap-3 border p-2 px-4 border-gray-300 border-r-0 rounded-l ml-1'>
            <AiOutlineEye className='w-5 h-5 text-black'/>
            <p className='hidden md:block md:text-[12px] lg:text-lg text-black'>View My Hostels</p>
          </NavLink>

          <NavLink to='/chat' className='flex items-center gap-3 mt-5 border p-2 px-4 border-gray-300 ml-1 border-r-0 rounded-l'>
            <CiEdit className='w-5 h-5 text-black'/>
            <p className='hidden md:block md:text-[12px] lg:text-lg text-black'>Chat box</p>
          </NavLink>
        </div>
      </div>

     
      <div onClick={logout} className='mt-auto flex items-center gap-3 border mb-9 p-2 px-4 border-gray-300 border-r-0 ml-1 rounded-l cursor-pointer hover:bg-gray-200'>
        
        <p  className='text-black text-sm md:text-[12px] lg:text-lg ml-5 md:ml-10'>Logout</p>
      </div>
    </div>
  )
}

export default Sidebar
