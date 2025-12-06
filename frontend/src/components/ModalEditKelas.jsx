import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { getDataKelas } from "../services/getDataKelas";

const ModalEditKelas = ({ open, onClose, kelasData, onSuccess }) => {
  const [formData, setFormData] = useState({
    kode_kelas: "",
    nama_kelas: "",
    wali_kelas_id: "",
  });
  const [guruOptions, setGuruOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && kelasData) {
      setFormData({
        kode_kelas: kelasData.kode_kelas || "",
        nama_kelas: kelasData.nama_kelas || "",
        wali_kelas_id: kelasData.wali_kelas_id || "",
      });
      loadGuruWaliKelas();
      setFormErrors({});
    }
  }, [open, kelasData]);

  const loadGuruWaliKelas = async () => {
    try {
      setLoading(true);
      const response = await getDataKelas.getGuruForWaliKelas();
      const guruList = response.semua_guru || [];
      setGuruOptions(guruList);
    } catch (error) {
      console.error("Error loading guru:", error);
    } finally {
      setLoading(false);
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

  const handleSubmit = async (e) => {
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

    try {
      setIsSubmitting(true);
      const result = await getDataKelas.updateKelas(
        kelasData.kelas_id,
        formData
      );
      onSuccess(result);
      onClose();
    } catch (error) {
      console.error("Error updating kelas:", error);
      // Handle error in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open || !kelasData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Edit Kelas</h2>
            <p className="text-gray-600 mt-1">
              {kelasData.kode_kelas} - {kelasData.nama_kelas}
            </p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isSubmitting}
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
                disabled={isSubmitting}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  formErrors.kode_kelas ? "border-red-500" : "border-gray-300"
                } ${isSubmitting ? "bg-gray-100" : ""}`}
              />
              {formErrors.kode_kelas && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.kode_kelas}
                </p>
              )}
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
                disabled={isSubmitting}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  formErrors.nama_kelas ? "border-red-500" : "border-gray-300"
                } ${isSubmitting ? "bg-gray-100" : ""}`}
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
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Memuat data guru...</p>
                </div>
              ) : (
                <select
                  name="wali_kelas_id"
                  value={formData.wali_kelas_id}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    formErrors.wali_kelas_id
                      ? "border-red-500"
                      : "border-gray-300"
                  } ${isSubmitting ? "bg-gray-100" : ""}`}
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
            </div>

            {/* Info Saat Ini */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">
                Informasi Saat Ini:
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Kode Kelas:</p>
                  <p className="font-medium">{kelasData.kode_kelas}</p>
                </div>
                <div>
                  <p className="text-gray-500">Nama Kelas:</p>
                  <p className="font-medium">{kelasData.nama_kelas}</p>
                </div>
                <div>
                  <p className="text-gray-500">Wali Kelas:</p>
                  <p className="font-medium">
                    {kelasData.walikelas?.nama_lengkap || "Belum ada"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Jumlah Murid:</p>
                  <p className="font-medium">
                    {kelasData.jumlah_murid || 0} murid
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="cursor-pointer px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Menyimpan...
                  </span>
                ) : (
                  "Simpan Perubahan"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalEditKelas;
