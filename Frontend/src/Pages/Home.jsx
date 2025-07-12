import React from 'react'
import Navbar from '../Components/Navbar'
import Freecancellation from '../Components/Freecancellation'
import Herosection from '../Components/Herosection'
import Features from '../Components/Features'
import Hero2 from '../Components/Hero2'
import phoneImage from '../assets/phone_only.png';
import image2 from '../assets/usp2.webp';
import image3 from '../assets/cropped.png';
import Lowerinput from '../Components/Lowerinput'

const Home = () => {
  return (
    <div>
      <Herosection/>
<Freecancellation/>
<div className='mt-10  ' >
  <Hero2/>
</div>
<div className='flex justify-between max-w-[1400px] mx-auto mt-10'>
  <Features text1={"Carpolling"} text2={"See who is going"} color={"#b7e5fd"} image={phoneImage}/>
  <Features text1={"Join our hostel chat"} text2={"Join with hosteler before check-in"} color={"#00e0ce"}image={image2}/>
  <Features text1={"Event & Activities"} text2={"Explore & join fun experience"} color={"#2767e7"}image={image3}/>
</div>
<Lowerinput/>
     
    </div>
  )
}

export default Home
