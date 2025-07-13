import React from 'react'
import { ToastContainer } from 'react-toastify';
import { Route, Routes } from 'react-router-dom'
import Sidebar from './Components/Sidebar';
import Edithostel from './Pages/Edithostel';
import Addhostel from './Pages/Addhostel';  
import Viewhostel from './Pages/Viewhostel';

import Login from './Pages/Login';

const App = () => {
  return (
    <div className="h-screen flex overflow-hidden flex text-white">
      <ToastContainer />

      {/* Sidebar */}
     
 <Sidebar />
      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-y-auto bg-white text-black p-6">
        <Routes>
          <Route path="/addhostel" element={<Addhostel />} />
          <Route path="/viewhostel" element={<Viewhostel />} />
          <Route path="/Edithostel/:id" element={<Edithostel />} />
          <Route path="/adminlogin" element={<Login/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App;
