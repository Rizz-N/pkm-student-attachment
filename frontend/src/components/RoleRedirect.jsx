import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const RoleRedirect = () => {
  const { user } = useUser();
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "guru") return <Navigate to="/dashboard" replace />;

  return <Navigate to="/login" replace />;
};

export default RoleRedirect;
