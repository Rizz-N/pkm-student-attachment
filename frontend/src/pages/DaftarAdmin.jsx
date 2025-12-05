import React, { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaLock,
  FaCheck,
  FaSpinner,
  FaExclamationCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getDataAdmin } from "../services/getDataAdmin";

const DaftarAdmin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Clear success message when user types
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username wajib diisi";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username minimal 3 karakter";
    }

    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    if (!formData.terms) {
      newErrors.terms = "Anda harus menyetujui syarat dan ketentuan";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      // Siapkan data untuk dikirim ke service
      const adminData = {
        username: formData.username,
        password: formData.password,
      };

      // Gunakan service yang sudah dibuat
      const response = await getDataAdmin.createAdmin(adminData);

      if (response && response.success) {
        setSuccessMessage(response.message || "Admin berhasil dibuat!");

        // Reset form
        setFormData({
          username: "",
          password: "",
          confirmPassword: "",
          terms: false,
        });

        // Optional: Auto redirect setelah beberapa detik
        setTimeout(() => {
          // Redirect ke halaman list admin atau dashboard
          navigate("/admin"); // Sesuaikan dengan route yang sesuai
        }, 3000);
      } else {
        setErrors({ submit: response?.message || "Gagal membuat admin" });
      }
    } catch (error) {
      console.error("Error creating admin:", error);

      // Handle error dari service
      if (error.response) {
        const errorData = error.response.data;
        if (Array.isArray(errorData) && errorData[0]) {
          // Format response: [{ message: "Error message" }]
          setErrors({ submit: errorData[0].message });
        } else if (errorData.message) {
          setErrors({ submit: errorData.message });
        } else {
          setErrors({ submit: "Terjadi kesalahan pada server" });
        }
      } else if (error.request) {
        setErrors({
          submit: "Tidak dapat terhubung ke server. Periksa koneksi Anda.",
        });
      } else {
        setErrors({
          submit: error.message || "Terjadi kesalahan yang tidak diketahui",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // Kembali ke halaman sebelumnya
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Kembali
        </button>

        <div className="rounded-2xl shadow-2xl overflow-hidden bg-white animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <FaUser className="text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Tambah Admin Baru</h1>
                <p className="text-blue-100 mt-1">
                  Buat akun administrator baru untuk sistem
                </p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mx-8 mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-semibold">Berhasil!</p>
                  <p className="text-green-700">{successMessage}</p>
                  <p className="text-green-600 text-sm mt-1">
                    Akan diarahkan ke halaman daftar admin dalam 3 detik...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="mx-8 mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <FaExclamationCircle className="text-red-500 mr-3 flex-shrink-0" />
                <p className="text-red-700">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username Admin
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.username
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="contoh: admin_sekolah"
                    disabled={loading}
                  />
                </div>
                {errors.username ? (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    Username harus unik dan akan digunakan untuk login
                  </p>
                )}
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.password
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Minimal 6 karakter"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.confirmPassword
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Ulangi password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={loading}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">
                  Informasi Keamanan
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Password akan di-hash sebelum disimpan di database
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Admin memiliki akses penuh ke semua fitur sistem
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Pastikan username dan password dirahasiakan</span>
                  </li>
                </ul>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                      errors.terms ? "border-red-500" : ""
                    }`}
                    disabled={loading}
                  />
                </div>
                <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                  Saya menyetujui bahwa saya bertanggung jawab penuh atas akun
                  admin yang dibuat dan akan menjaga kerahasiaan username dan
                  password.
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-1 ml-7">{errors.terms}</p>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  } text-white py-3.5 px-4 rounded-lg font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center`}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-3" />
                      <span>Sedang Membuat Admin...</span>
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-3" />
                      <span>Simpan Admin Baru</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Links */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Lihat daftar admin yang sudah ada di{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/admin/users")}
                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none"
                  >
                    Halaman Admin
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DaftarAdmin;
