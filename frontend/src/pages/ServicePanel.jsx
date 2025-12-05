import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Dashboard from "./Dashboard";

const ServicePanel = () => {
  const { user } = useUser();
  if (user && user.role !== "guru") {
    return <Navigate to="/login" replace />;
  }
  return (
    <div>
      <Dashboard />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default ServicePanel;
