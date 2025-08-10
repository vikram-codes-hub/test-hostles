// Create this component: AdminRouteWrapper.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './authcontext';

const AdminRouteWrapper = ({ children }) => {
  const { isAuthReady, authUser, token } = useContext(AuthContext);

  console.log("🔍 AdminRouteWrapper - Auth state:", { isAuthReady, hasToken: !!token, hasUser: !!authUser });

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
    console.log("❌ Not authenticated, redirecting to login");
    return <Navigate to="/admin/login" replace />;
  }

  // Only show admin content if user is admin
  if (authUser.role !== 'admin') {
    console.log("❌ Not admin, redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("✅ Admin authenticated, showing content");
  return children;
};

export default AdminRouteWrapper;