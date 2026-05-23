import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isBootstrapping } = useAppContext();
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

  return children;
}
