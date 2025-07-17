import React, { useContext, useEffect, useState } from 'react';
import Title from '../Components/Title';
import Productitem from '../Components/Productitem';
import { HostelsContext } from '../Context/Hostelss';
import { AuthContext } from '../Context/auth';

const Allhostels = () => {
  const { search, showSearch } = useContext(HostelsContext);
  const { listhostels } = useContext(AuthContext);

  const [hostels, setHostels] = useState([]);
  const [filteredHostels, setFilteredHostels] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [sortType, setSortType] = useState('');

  useEffect(() => {
  const fetchHostels = async () => {
    const data = await listhostels();
    // console.log("API raw data:", data);
    if (data.success) {
      // console.log("Setting hostels:", data.hostel); 
      setHostels(data.hostel);
      setFilteredHostels(data.hostel);
    }
  };
  fetchHostels();
}, []);


  useEffect(() => {
    let filtered = [...hostels];

    // Filter by search
    if (search && showSearch) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter.length > 0) {
      filtered = filtered.filter(item => categoryFilter.includes(item.category));
    }

    // Sort
    switch (sortType) {
      case 'low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredHostels(filtered);
  }, [hostels, search, showSearch, categoryFilter, sortType]);

  const toggleFilter = (e) => {
    const value = e.target.value;
    setCategoryFilter(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };
  
  console.log(hostels)

  return (
    <div className="flex flex-col lg:flex-row gap-6 pt-10 px-4 lg:px-10">
      {/* Left Filters */}
      <div className="lg:min-w-[240px]">
        <p className="text-2xl font-semibold mb-4 flex items-center gap-2">Filters</p>

        <div className="border rounded-lg border-gray-300 p-5 bg-white shadow-sm">
          <p className="mb-3 text-sm font-medium text-gray-700">CATEGORY</p>
          <div className="font-light text-gray-600 flex flex-col gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" onChange={toggleFilter} value="Boys" className="accent-blue-500" /> Boys
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" onChange={toggleFilter} value="Girls" className="accent-pink-500" /> Girls
            </label>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-base sm:text-lg mb-6 gap-3">
          <Title text1="ALL" text2="Hostels" />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Hostel Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredHostels.map((item, index) => (
            <Productitem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image || "https://via.placeholder.com/300x200.png?text=No+Image"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Allhostels;
