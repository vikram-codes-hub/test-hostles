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
  const { token, isAuthReady, authUser } = useContext(AuthContext);
  const location = useLocation();
  
  const isLoginPage = location.pathname === "/adminlogin";

  // AdminRouteWrapper Component
  const AdminRouteWrapper = ({ children }) => {
    // Show loading while auth is initializing
    if (!isAuthReady) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    // Redirect to login if not authenticated
    if (!token || !authUser) {
      return <Navigate to="/adminlogin" replace />;
    }

    // Only show admin content if user is admin
    if (authUser.role !== 'admin') {
      return (
        <div className="flex items-center justify-center min-h-screen bg-red-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
            <p className="text-red-500">You don't have admin privileges</p>
          </div>
        </div>
      );
    }

    return children;
  };

  return (
    <div className="h-screen flex overflow-hidden text-white">
      <ToastContainer />
      
      {/* Show sidebar only when authenticated and not on login page */}
      {!isLoginPage && isAuthReady && token && authUser && <Sidebar />}
      
      {/* Main Content Area */}
      <div className={`flex-1 h-full overflow-y-auto ${
        !isLoginPage && isAuthReady && token && authUser 
          ? 'bg-white text-black p-6' 
          : 'bg-gray-100 text-black flex items-center justify-center'
      }`}>
        <Routes>
          {/* Public Route - Login */}
          <Route path="/adminlogin" element={<Login />} />
          
          {/* Protected Routes with AdminRouteWrapper */}
          <Route 
            path="/"
            element={
              <AdminRouteWrapper>
                <Addhostel />
              </AdminRouteWrapper>
            }
          />
          
          <Route 
            path="/viewhostel"
            element={
              <AdminRouteWrapper>
                <Viewhostel />
              </AdminRouteWrapper>
            }
          />
          
          <Route 
            path="/Edithostel/:id"
            element={
              <AdminRouteWrapper>
                <Edithostel />
              </AdminRouteWrapper>
            }
          />
          
          <Route 
            path="/chat" 
            element={
              <AdminRouteWrapper>
                <Chat />
              </AdminRouteWrapper>
            } 
          />
          
          {/* Catch all route - redirect to login if not authenticated */}
          <Route 
            path="*" 
            element={
              isAuthReady ? (
                token && authUser ? <Navigate to="/" replace /> : <Navigate to="/adminlogin" replace />
              ) : (
                <div className="flex items-center justify-center min-h-screen">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              )
            } 
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;