import { GoSidebarExpand, GoSignOut } from "react-icons/go";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaUser } from "react-icons/fa";

const ProfileBar = ({ isOpen, setIsOpen }) => {
  const { user, loading, refreshUser } = useUser();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/logout`, {
        withCredentials: true,
      });
      await refreshUser();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Overlay untuk HP */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-lg z-[900] transition-all duration-300 
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"} 
        md:hidden`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div
        className={`
        fixed top-0 left-0 h-screen 
        w-[85%] max-w-sm md:w-96
        bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-2xl
        shadow-2xl border-r border-gray-300/50 
        rounded-r-3xl
        z-[1000]
        transition-all duration-300 ease-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        overflow-hidden
    `}
      >
        {/* Header Profile */}
        <div className="relative p-6 border-b border-gray-300/50 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-white/20 hover:bg-white/30 shadow-lg backdrop-blur-sm transition-all duration-200"
          >
            <GoSidebarExpand className="text-2xl text-white" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <FaUser className="w-16 p-2 h-16 rounded-full shadow-2xl border-4 border-white/30 object-cover" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></div>
            </div>

            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-white w-40 md:w-55 truncate">
                {loading ? "Memuat..." : user?.guru.nama_lengkap || "-"}
              </h2>
              <p className="text-blue-100 text-sm font-medium">
                {user?.guru.jabatan || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Body Detail */}
        <div className="p-6 space-y-4 overflow-y-auto h-[80%] custom-scrollbar">
          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-xl transition-all duration-200">
            <label className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
              NIP
            </label>
            <p className="text-gray-800 font-semibold mt-1">
              {user?.guru.nip || ""}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-xl transition-all duration-200">
            <label className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
              Tanggal Lahir
            </label>
            <p className="text-gray-800 font-semibold mt-1">
              {user?.guru.tanggal_lahir || ""}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-xl transition-all duration-200">
            <label className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
              Jenis Kelamin
            </label>
            <p className="text-gray-800 font-semibold mt-1">
              {user?.guru.jenis_kelamin || ""}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-xl transition-all duration-200">
            <label className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
              Wali Kelas
            </label>
            <p className="text-gray-800 font-semibold mt-1">
              {user?.guru.kelasDibimbing?.[0]?.nama_kelas || ""}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-xl transition-all duration-200">
            <label className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
              Mata Pelajaran
            </label>
            <p className="text-gray-800 font-semibold mt-1">
              {user?.guru.mata_pelajaran || ""}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-xl transition-all duration-200">
            <label className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
              Alamat
            </label>
            <p className="text-gray-800 font-semibold mt-1 leading-relaxed">
              {user?.guru.alamat || ""}
            </p>
          </div>
          <div className="mt-5 px-2 text-end">
            <Link to={"/user/changepass"} className="cursor-pointer underline">
              Ganti password
            </Link>
          </div>
          <button
            onClick={logout}
            className="sm:hidden flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 
                                  hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 
                                  rounded-2xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            <GoSignOut className="text-lg" />
            Logout
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
};

export default ProfileBar;
