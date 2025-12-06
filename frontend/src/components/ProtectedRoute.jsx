import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* loading animate */}
        <div className="relative flex items-center justify-center h-16 w-16">
          <div className="absolute h-full w-full rounded-full border-4 border-yellow-500/30"></div>
          <div className="absolute h-3/4 w-3/4 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"></div>
          <div className="absolute h-1/2 w-1/2 rounded-full border-4 border-transparent border-t-yellow-500 border-b-yellow-500 animate-spin animation-delay-75"></div>
        </div>
      </div>
    );
  }

  // Belum login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Jika role tidak diizinkan → arahkan ke halaman sesuai role
  if (!allowedRoles.includes(user.role)) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />
    );
  }

  return children;
};

export default ProtectedRoute;
