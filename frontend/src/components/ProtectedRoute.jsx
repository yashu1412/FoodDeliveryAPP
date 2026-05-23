import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isBootstrapping, user } = useAppContext();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading your account...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p>You don't have permission to access this page</p>
      </div>
    );
  }

  return children;
}
