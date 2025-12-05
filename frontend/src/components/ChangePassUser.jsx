import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaArrowLeft,
} from "react-icons/fa";
import { getDataAdmin } from "../services/getDataAdmin";

const ChangePassUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const dataUser = {
        current_password: formData.current_password,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      };

      console.log("Data yang akan di kirim:", dataUser);
      const response = await getDataAdmin.updateAdminPassword(dataUser);
      console.log("Success Response:", response);

      const isArrayResp = Array.isArray(response);
      const top = isArrayResp ? response[0] : response;
      const respMessage = top?.message || "";
      if (respMessage) {
        setSuccess(true);
        setFormData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        setError("Gagal mengubah password");
      }
    } catch (err) {
      console.error("Error Message:", err);
      const errorMsg =
        err.response?.data?.[0]?.message || err.message || "Terjadi kesalahan";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            to={"/dashboard"}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 group transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Kembali ke Profil
          </Link>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200/60">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4 backdrop-blur-sm border border-white/30">
                  <FaLock className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Ganti Password
                  </h1>
                  <p className="text-blue-100/90 mt-1">
                    Perbarui kata sandi untuk keamanan akun
                  </p>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mx-6 mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/80 rounded-xl">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
                    <FaCheck className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-green-800 font-semibold">
                      Password Berhasil Diperbarui!
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                      Password Anda telah diganti dengan aman.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mx-6 mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/80 rounded-xl">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-4 flex-shrink-0 mt-0.5">
                    <span className="text-red-600 font-bold">!</span>
                  </div>
                  <div>
                    <p className="text-red-800 font-semibold">Gagal</p>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Current Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Password Saat Ini
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  </div>
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleChange}
                    className="w-full px-5 py-3 pl-12 pr-12 border-2 border-gray-300/80 rounded-xl focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-gray-400"
                    placeholder="Masukkan password saat ini"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                  >
                    {showCurrentPass ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Password Baru
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  </div>
                  <input
                    type={showNewPass ? "text" : "password"}
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    className="w-full px-5 py-3 pl-12 pr-12 border-2 border-gray-300/80 rounded-xl focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-gray-400"
                    placeholder="Minimal 8 karakter"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setShowNewPass(!showNewPass)}
                  >
                    {showNewPass ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Konfirmasi Password Baru
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  </div>
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="w-full px-5 py-3 pl-12 pr-12 border-2 border-gray-300/80 rounded-xl focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-gray-400"
                    placeholder="Ketik ulang password baru"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                  >
                    {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Security Tips */}
              <div className="bg-gray-50/80 border border-gray-200/60 rounded-xl p-4 mt-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  Tips Keamanan
                </h4>
                <ul className="text-xs text-gray-600 space-y-1.5">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Gunakan kombinasi huruf besar, kecil, angka, dan simbol
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Ganti password secara berkala untuk keamanan ekstra
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5"
                  } cursor-pointer text-white py-3.5 px-4 rounded-xl font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-3" />
                      <span>Perbarui Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassUser;
