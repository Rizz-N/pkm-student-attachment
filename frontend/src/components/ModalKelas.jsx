import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { getDataKelas } from "../services/getDataKelas";

const ModalKelas = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    kode_kelas: "",
    nama_kelas: "",
    wali_kelas_id: "",
  });
  const [guruOptions, setGuruOptions] = useState([]);
  const [loadingGuru, setLoadingGuru] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (open) {
      loadGuruWaliKelas();
      setFormData({
        kode_kelas: "",
        nama_kelas: "",
        wali_kelas_id: "",
      });
      setFormErrors({});
    }
  }, [open]);

  const loadGuruWaliKelas = async () => {
    try {
      setLoadingGuru(true);
      const response = await getDataKelas.getGuruForWaliKelas();
      const guruList = response.guru_belum_wali_kelas || [];
      setGuruOptions(guruList);
    } catch (error) {
      console.error("Error loading guru:", error);
    } finally {
      setLoadingGuru(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const errors = {};
    if (!formData.kode_kelas.trim())
      errors.kode_kelas = "Kode kelas wajib diisi";
    if (!formData.nama_kelas.trim())
      errors.nama_kelas = "Nama kelas wajib diisi";
    if (!formData.wali_kelas_id)
      errors.wali_kelas_id = "Wali kelas wajib dipilih";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onSubmit(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Tambah Kelas Baru
            </h2>
            <p className="text-gray-600 mt-1">Isi data kelas dengan lengkap</p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoClose className="text-2xl text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Kode Kelas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kode Kelas <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="kode_kelas"
                value={formData.kode_kelas}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  formErrors.kode_kelas ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Contoh: X-A, XI-IPA1, XII-IPS2"
              />
              {formErrors.kode_kelas && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.kode_kelas}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Kode kelas harus unik
              </p>
            </div>

            {/* Nama Kelas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Kelas <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama_kelas"
                value={formData.nama_kelas}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  formErrors.nama_kelas ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Contoh: 10 IPA 1, 11 IPS 2, 12 Bahasa"
              />
              {formErrors.nama_kelas && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.nama_kelas}
                </p>
              )}
            </div>

            {/* Wali Kelas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wali Kelas <span className="text-red-500">*</span>
              </label>
              {loadingGuru ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Memuat data guru...</p>
                </div>
              ) : guruOptions.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    Tidak ada guru yang tersedia. Pastikan ada guru yang belum
                    menjadi wali kelas.
                  </p>
                </div>
              ) : (
                <select
                  name="wali_kelas_id"
                  value={formData.wali_kelas_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    formErrors.wali_kelas_id
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Pilih Wali Kelas</option>
                  {guruOptions.map((guru) => (
                    <option key={guru.value} value={guru.value}>
                      {guru.label}
                    </option>
                  ))}
                </select>
              )}
              {formErrors.wali_kelas_id && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.wali_kelas_id}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Guru yang sudah menjadi wali kelas tidak akan muncul dalam
                daftar
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md hover:shadow-lg"
              >
                Simpan Kelas
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalKelas;
