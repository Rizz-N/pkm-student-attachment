import { FaCog, FaUser, FaPlus } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const SideBarNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const active = (path) => {
    return location.pathname === path
      ? "bg-white text-indigo-600"
      : "text-white/80 hover:bg-white/10 hover:text-white";
  };

  const { user, refreshUser, logout: clearUser } = useUser();

  const handleLogout = async () => {
    console.log("Data sebelum logout", user);
    await clearUser();
    console.log("Data sesudah logout");
    navigate("login");
  };

  return (
    <>
      <div>
        <div className="fixed z-50 left-0 top-0 h-screen p-6 flex flex-col bg-gradient-to-b from-blue-600 to-purple-600">
          <div className="flex items-center mb-10 text-white gap-4">
            <FaCog className="text-3xl" />
            <label className="text-xl">Admin Panel</label>
          </div>
          <div className="flex flex-col gap-8 text-white text-xl">
            <Link
              className={`p-2 rounded-xl text-center ${active("/admin")}`}
              to={"/admin"}
            >
              Dashboard
            </Link>
            <Link
              className={`p-2 rounded-xl text-center ${active(
                "/admin/panelguru"
              )}`}
              to={"/admin/panelguru"}
            >
              Data Guru
            </Link>
            <Link
              className={`p-2 rounded-xl text-center ${active(
                "/admin/panelmurid"
              )}`}
              to={"/admin/panelmurid"}
            >
              Data Murid
            </Link>
            <Link
              className={`p-2 rounded-xl text-center ${active(
                "/admin/panelkelas"
              )}`}
              to={"/admin/panelkelas"}
            >
              Data Kelas
            </Link>
          </div>
        </div>
      </div>

      {/* Modern Top Navigation */}
      <div className="ml-51">
        <div className="flex items-end justify-between sticky top-0 z-40 bg-white border-b border-gray-200/80 shadow-sm backdrop-blur-sm">
          <div className="px-8 py-4">
            <div className="flex items-center justify-end">
              {/* Right Section */}
              <div className="flex items-center gap-6 order-last">
                {/* Create Admin Button */}
                <Link
                  to={"/admin/daftar"}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                >
                  <FaPlus className="text-sm" />
                  Create Admin
                </Link>

                {/* User Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-300/80 transition-all duration-200">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-sm">
                      <FaUser className="text-white text-sm" />
                    </div>
                    <div className="text-left hidden md:block">
                      <h3 className="text-sm font-semibold text-gray-800">
                        Welcome <label>{user.user_nama_lengkap}</label>
                      </h3>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200/80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <h4 className="font-semibold text-gray-800">
                        Admin Panel
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">Admin Access</p>
                    </div>
                    <div className="p-2">
                      <Link
                        className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 font-medium"
                        to={"/user/changepass"}
                      >
                        Ganti Password
                      </Link>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="px-8 pb-4 order-first">
            <div className="flex items-center text-sm text-gray-600">
              <Link
                to="/admin"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-800 font-medium">
                {location.pathname.includes("panelguru") && "Data Guru"}
                {location.pathname.includes("panelmurid") && "Data Murid"}
                {location.pathname.includes("panelkelas") && "Data Kelas"}
                {location.pathname === "/admin" && "Overview"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBarNav;
