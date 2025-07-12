import React, { useContext, useEffect, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { assets } from '../assets/Hostels';
import { HostelsContext } from '../Context/Hostelss';
import { useLocation } from 'react-router-dom';

const Searchbar = () => {
    const {search,setsearch,showSearch,setshowSearch}=useContext(HostelsContext)
    const [visible,setvisible]=useState(false)
    const location=useLocation()


    useEffect(()=>{
        if(location.pathname.includes('/Allhostels')){
            setvisible(true)
        }else{
            setvisible(false)
        }
    },[location])
  return showSearch && visible ?(
     <div className='border-t border-b border-gray-200 bg-gray-50 py-4'>
      <div className='flex items-center justify-center max-w-2xl mx-auto px-4'>
        <div className='relative flex-1 flex items-center'>
          <input onChange={(e)=>setsearch(e.target.value)}
            type="text" 
            className='w-full rounded-full border border-gray-300 py-3 pl-5 pr-10 text-sm 
                      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                      transition-all duration-200 shadow-sm hover:shadow-md' 
            placeholder='Search hostels...' 
          />
          <div className='absolute right-3 flex items-center pointer-events-none'>
            <CiSearch className='h-5 w-5 text-gray-400' />
          </div>
        </div>
        <img onClick={()=>setshowSearch(false)}
          src={assets.cross_icon} 
          alt="Close search" 
          className='ml-3 h-6 w-6 cursor-pointer opacity-70 hover:opacity-100 transition-opacity'
        />
      </div>
    </div>
  ):null
  
}

export default Searchbar