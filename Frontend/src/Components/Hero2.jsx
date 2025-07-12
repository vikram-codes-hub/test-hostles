import React from 'react'
import bg from '../assets/global-deals-bg.png'
import img from '../assets/1.svg'
import { Link } from 'react-router-dom'
import Hostelcard from './Hostelcard'
// import hostel1 from '../assets/elegance.webp'
// import hostel2 from '../assets/hive.jpg'
// import hostel3 from '../assets/66115bc1d6be29.webp'
import hostels from '../assets/Hostels'


const Hero2 = () => {
  return (
    <div className="relative w-fit mx-auto">
      <img src={bg} alt="" className="block" />
      <img
        src={img}
        alt=""
        className="absolute rounded-xl top-7 left-0 z-10"
      />
      <p className="absolute top-10 left-6 z-20 text-white text-4xl font-bold drop-shadow">
        Hostels Special Deals
      </p>
      <p className="absolute top-22 left-8 z-20 text-white text-md drop-shadow">
        BIG Discounts on best hostels near muj
      </p>
          <div className="absolute top-[160px] left-8 z-30 flex gap-8">
       <Link to={`/hostel/${hostels[0].id}`}><Hostelcard image={Array.isArray(hostels[0].image) ? hostels[0].image[0] : hostels[0].image} name={hostels[0].name}/></Link>
        <Link to={`/hostel/${hostels[1].id}`}><Hostelcard image={Array.isArray(hostels[1].image) ? hostels[1].image[0] : hostels[1].image} name={hostels[1].name}/></Link>
        <Link to={`/hostel/${hostels[2].id}`}><Hostelcard image={Array.isArray(hostels[2].image) ? hostels[2].image[0] : hostels[2].image} name={hostels[2].name}/></Link>
      </div>
      <button className="border text-sm w-40 h-10 p-1 rounded-xl font-bold absolute bottom-4 right-4 bg-white z-30">
        <Link to="/Allhostels">Discover all deals</Link>
      </button>
    </div>
  )
}

export default Hero2