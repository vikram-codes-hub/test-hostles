import React,{useContext} from 'react'
import { Route, Routes, useLocation ,Navigate} from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Contactus from './Pages/Contactus'
import About from './Pages/About'
import Footer from './Components/Footer'
import AllHostels from './Pages/Allhostels'
import Navbar from './Components/Navbar'
import Hostel from './Pages/Hostel'
import Searchbar from './Components/Searchbar'
import Saved from './Pages/Saved'
import Chatbox from './Pages/Chatbox'
import Helpcenter from './Pages/Helpcenter'
import ProfilePage from './Pages/ProfilePage'
import { toast, ToastContainer } from "react-toastify";

import { AuthContext } from './Context/auth'

const App = () => {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === '/login';

  const {authuser}=useContext(AuthContext)

  return (
    <div>
      {!hideNavAndFooter && <Navbar />}
      {!hideNavAndFooter && <Searchbar />}
      <ToastContainer/>
      <Routes>
        <Route path='/' element={authuser?<Home />:<Navigate to="/login"/>} />
        <Route path='/Allhostels' element={authuser?<AllHostels />:<Navigate to="/login"/>} />
        <Route path='/hostel/:hostelId' element={authuser?<Hostel />:<Navigate to="/login"/>} />
        <Route path='/login' element={!authuser?<Login />:<Navigate to="/"/>} />
        <Route path='/contact-us' element={authuser?<Contactus />:<Navigate to="/login"/>} />
        <Route path='/about-us' element={authuser?<About />:<Navigate to="/login"/>} />
        <Route path='/saved' element={authuser?<Saved />:<Navigate to="/login"/>} />
        <Route path='/chat-app' element={authuser?<Chatbox />:<Navigate to="/login"/>} />
        <Route path='/help' element={authuser?<Helpcenter />:<Navigate to="/login"/>} />
        <Route path='/profile' element={authuser?<ProfilePage />:<Navigate to="/login"/>} />
      </Routes>
      {!hideNavAndFooter && <Footer />}
    </div>
  )
}

export default App