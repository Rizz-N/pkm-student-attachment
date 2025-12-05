import SideBarNav from "../components/SideBarNav";
import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const AdminPanel = () => {
  const { user } = useUser();
  if (user && user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <SideBarNav />
      <div className="ml-55">
        <Outlet />
      </div>
    </>
  );
};

export default AdminPanel;
