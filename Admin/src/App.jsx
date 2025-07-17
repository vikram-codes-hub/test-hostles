import React, { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Edithostel from './Pages/Edithostel';
import Addhostel from './Pages/Addhostel';
import Viewhostel from './Pages/Viewhostel';
import Login from './Pages/Login';
import { AuthContext } from './Context/authcontext';
import Chat from './Pages/Chat';

const App = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  const isLoginPage = location.pathname === "/adminlogin";

  // Protected Route Wrapper
  const ProtectedRoute = ({ children }) => {
    if (!token) return <Navigate to="/adminlogin" replace />;
    return children;
  };

  return (
    <div className="h-screen flex overflow-hidden text-white">
      <ToastContainer />

      {/* Sidebar only visible when not on login page AND token is valid */}
      {!isLoginPage && token && <Sidebar />}

      {/* Main Content Area */}
      <div className={`flex-1 h-full overflow-y-auto ${!isLoginPage && token ? 'bg-white text-black p-6' : 'bg-gray-100 text-black flex items-center justify-center'}`}>
        <Routes>
          <Route path="/adminlogin" element={!token?<Login/>:Navigate("/")} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Addhostel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewhostel"
            element={
              <ProtectedRoute>
                <Viewhostel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Edithostel/:id"
            element={
              <ProtectedRoute>
                <Edithostel />
              </ProtectedRoute>
            }
          />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
