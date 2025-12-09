import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { refreshUser } = useUser();
  const Login = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage("Username dan Password wajib di isi");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        { username, password },
        { withCredentials: true }
      );
      const currentUser = await refreshUser();

      if (!currentUser) {
        setMessage("Gagal memuat data user");
        setIsLoading(false);
        return;
      }

      if (currentUser.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (currentUser.role === "guru") {
        navigate("/dashboard", { replace: true });
      }
      // console.log("Login success, user role:", currentUser.role);
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        setMessage(error.response.data[0]?.message || "Login gagal");
      } else {
        setMessage("Terjadi kesalahan, silakan coba lagi");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50/80">
      <div className="w-full max-w-md flex flex-col p-6 md:p-8 rounded-2xl shadow-2xl bg-white/90 backdrop-blur-xl border border-gray-300/50">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            SMPN 227 Jakarta
          </h1>
          <p className="text-gray-600 text-sm md:text-base font-medium">
            Attendance Management System
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={Login} className="flex flex-col gap-4">
          {/* Error Message */}
          {message && (
            <div className="p-3 bg-red-50/80 backdrop-blur-sm border border-red-300/50 text-red-700 rounded-xl text-sm font-medium text-center">
              {message}
            </div>
          )}

          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">
              Username
            </label>
            <div className="relative group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username Anda"
                className="pl-10 w-full bg-white/80 backdrop-blur-sm border border-gray-300/50 rounded-xl p-3 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-base md:text-lg placeholder-gray-400"
                disabled={isLoading}
              />
              <FaUser className=" absolute inset-y-4 left-4 items-center text-gray-400 transition-all duration-200 " />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">
              Password
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password Anda"
                className="pl-10 w-full bg-white/80 backdrop-blur-sm border border-gray-300/50 rounded-xl p-3 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-base md:text-lg placeholder-gray-400"
                disabled={isLoading}
              />
              <FaLock className=" absolute inset-y-4 left-4 items-center text-gray-400 transition-all duration-200 " />
              <button
                type="button"
                className="absolute inset-y-0 right-5 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base md:text-lg mt-4"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Memproses...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Masuk</span>
              </div>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 font-medium">
            Sistem Manajemen Kehadiran Digital
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
