import React, { useContext, useEffect, useState } from 'react';
import Title from '../Components/Title';
import Productitem from '../Components/Productitem';
import hostels from '../assets/Hostels';
import { HostelsContext } from '../Context/Hostelss';

const Allhostels = () => {
  const {search,showSearch}=useContext(HostelsContext)
  const [Filterproducts, setFilterproducts] = useState([]);
  const [categoryfilter,setcategoryfilter]=useState([])
  const [sorttype,setsorttype]=useState('')

  const toggelfilter=(e)=>{
    if(categoryfilter.includes(e.target.value)){
      setcategoryfilter(prev=>prev.filter(item=>item!==e.target.value))
    }else{
      setcategoryfilter(prev=>[...prev,e.target.value])
    }
    
  }

  const applyfilter=()=>{
    let hostelcopy=hostels.slice()
    if(search&&showSearch){
      hostelcopy=hostelcopy.filter(item=>item.name.toLowerCase().includes(search.toLowerCase))
    }
    if(categoryfilter.length>0){
      hostelcopy=hostelcopy.filter(item=>categoryfilter.includes(item.category))
    }
    setFilterproducts(hostelcopy)

  }
useEffect(()=>{
  applyfilter()
},[hostels,categoryfilter,search,showSearch])
  useEffect(() => {
    setFilterproducts(hostels);
   
  }, []);

  const sorthostel=()=>{
    let hostelcopy=hostels.slice();
    switch(sorttype){
      case 'low-high':
        setFilterproducts(hostelcopy.sort((a,b)=>(a.price-b.price)))
        break;
      case 'high-low':
        setFilterproducts(hostelcopy.sort((a,b)=>(b.price-a.price)))
      default:
        break
    }
  }

  useEffect(()=>{
    sorthostel()
  },[sorttype])
  return (
    <div className="flex flex-col lg:flex-row gap-6 pt-10 px-4 lg:px-10">
      
      {/* Left Filters */}
      <div className="lg:min-w-[240px]">
        <p className="text-2xl font-semibold mb-4 flex items-center gap-2">Filters</p>

        {/* Category Filter */}
        <div className="border rounded-lg border-gray-300 p-5 bg-white shadow-sm">
          <p className="mb-3 text-sm font-medium text-gray-700">CATEGORY</p>
          <div className="font-light text-gray-600 flex flex-col gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" onChange={toggelfilter} value={"Boys"} className="accent-blue-500" /> Boys
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" onChange={toggelfilter} value={"Girls"} className="accent-pink-500" /> Girls
            </label>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-base sm:text-lg mb-6 gap-3">
          <Title text1="ALL" text2="Hostels" />
          <select onChange={(e)=>setsorttype(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="Relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Hostel Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {Filterproducts.map((item, index) => (
            <Productitem
              key={index}
              name={item.name}
              id={item.id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Allhostels;
