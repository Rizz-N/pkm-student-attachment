import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { GoSignOut } from "react-icons/go";
import { FaUserCog } from "react-icons/fa";
import Overview from "./Overview";
import StudentAttendance from "./StudentAttendance";
import TeacherAttendance from "./TeacherAttendance";
import ProfileBar from "../components/ProfileBar";
import { useUser } from "../context/UserContext";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const { user, refreshUser, logout: clearUser } = useUser();

  if (user && user.role !== "guru") {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    console.log("Data sebelum logout", user);
    await clearUser();
    console.log("Data sesudah logout");
    navigate("login");
  };

  const active = (path) =>
    location.pathname === path
      ? "bg-white/30 backdrop-blur-sm text-white shadow-inner border border-white/20"
      : "hover:bg-white/20 hover:text-white backdrop-blur-sm transition-all duration-200";

  return (
    <>
      <div ref={sidebarRef}>
        <ProfileBar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      {/* Navbar */}
      <div
        className="py-4 px-6 flex justify-between items-center bg-gradient-to-r from-white to-gray-50/80 backdrop-blur-xl shadow-lg border-b border-gray-300/30 
                    fixed w-screen top-0 z-[900] text-[1.1rem] sm:text-[1rem] tracking-wide"
      >
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6">
            {!isOpen && (
              <button
                onClick={() => setIsOpen(true)}
                className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg hover:shadow-xl border border-gray-300/50 hover:bg-gray-50/80 transition-all duration-200 hover:-translate-y-0.5"
              >
                <FaUserCog className="text-2xl sm:text-3xl text-gray-700" />
              </button>
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Attendance Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-medium">
              Welcome back,{" "}
              <span className="text-blue-600 font-semibold">
                {user?.guru.nama_lengkap}
              </span>{" "}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="hidden sm:flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 
                        hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 
                        rounded-2xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
        >
          <GoSignOut className="text-lg" />
          Logout
        </button>
      </div>

      {/* Navbar Link Halaman */}
      <div className="mt-28 mx-4 sm:mx-auto bg-gradient-to-r from-blue-600 to-purple-600 backdrop-blur-sm border border-blue-500/30 shadow-xl flex justify-between p-2 rounded-2xl sm:rounded-full sm:max-w-2xl">
        <Link
          to="/dashboard"
          className={`text-xs sm:text-lg text-white font-semibold px-4 sm:px-6 py-3 rounded-2xl sm:rounded-full transition-all duration-200 ${active(
            "/dashboard"
          )} hover:bg-white/20 backdrop-blur-sm`}
        >
          Overview
        </Link>
        <Link
          to="/dashboard/student"
          className={`text-xs sm:text-lg text-white font-semibold px-4 sm:px-6 py-3 rounded-2xl sm:rounded-full transition-all duration-200 ${active(
            "/dashboard/student"
          )} hover:bg-white/20 backdrop-blur-sm`}
        >
          Student
        </Link>
        <Link
          to="/dashboard/teacher"
          className={`text-xs sm:text-lg text-white font-semibold px-4 sm:px-6 py-3 rounded-2xl sm:rounded-full transition-all duration-200 ${active(
            "/dashboard/teacher"
          )} hover:bg-white/20 backdrop-blur-sm`}
        >
          Teacher
        </Link>
      </div>
      <div>
        <Routes>
          <Route index element={<Overview />} />
          <Route path="student" element={<StudentAttendance />} />
          <Route path="teacher" element={<TeacherAttendance />} />
        </Routes>
      </div>
    </>
  );
};

export default Dashboard;
