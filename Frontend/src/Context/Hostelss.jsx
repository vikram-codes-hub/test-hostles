import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import hostels from '../assets/Hostels';

// Create the context
export const HostelsContext = createContext();

// Provider component
const HostelsContextProvider = ({ children }) => {
  const currency = '₹';
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [savedHostels, setSavedHostels] = useState([]);

  // Load saved hostels on initial render
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedHostels')) || [];
    setSavedHostels(saved);
  }, []);

  // Save to localStorage when savedHostels changes
  useEffect(() => {
    localStorage.setItem('savedHostels', JSON.stringify(savedHostels));
  }, [savedHostels]);

  const toggleSaveHostel = (hostelId) => {
    const saveHostels = JSON.parse(localStorage.getItem('savedHostels')) || [];
    const isCurrentlySaved = saveHostels.some(hostel => hostel.id === hostelId);

    if (isCurrentlySaved) {
      // Remove from saved
      const updatedHostels = saveHostels.filter(hostel => hostel.id !== hostelId);
      setSavedHostels(updatedHostels);
    } else {
      // Add to saved
      const hostelToSave = hostels.find(hostel => hostel.id === hostelId);
      if (hostelToSave) {
        const updatedHostels = [...saveHostels, hostelToSave];
        setSavedHostels(updatedHostels);
      }
    }
  };

  const value = {
    currency,
    navigate,
    search,
    setSearch,

    toggleSaveHostel,
    savedHostels
  };

  return (
    <HostelsContext.Provider value={value}>
      {children}
    </HostelsContext.Provider>
  );
};

export default HostelsContextProvider;