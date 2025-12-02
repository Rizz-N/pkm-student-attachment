// components/ModalEditGuru.jsx
import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { getDataGuru } from "../services/getDataGuru";

const ModalEditGuru = ({ open, onClose, guruData, onSuccess }) => {
  const [formData, setFormData] = useState({
    nip: "",
    nama_lengkap: "",
    jenis_kelamin: "laki-laki",
    tanggal_lahir: "",
    alamat: "",
    no_telepon: "",
    email: "",
    jabatan: "",
    mata_pelajaran: "",
    foto_profile: "",
    status: "aktif",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load data guru saat modal dibuka
  useEffect(() => {
    if (open && guruData) {
      setFormData({
        nip: guruData.nip || "",
        nama_lengkap: guruData.nama_lengkap || "",
        jenis_kelamin: guruData.jenis_kelamin || "laki-laki",
        tanggal_lahir: guruData.tanggal_lahir
          ? guruData.tanggal_lahir.split("T")[0]
          : "",
        alamat: guruData.alamat || "",
        no_telepon: guruData.no_telepon || "",
        email: guruData.email || "",
        jabatan: guruData.jabatan || "",
        mata_pelajaran: guruData.mata_pelajaran || "",
        foto_profile: guruData.foto_profile || "",
        status: guruData.status || "aktif",
      });
      setErrors({});
    }
  }, [open, guruData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error saat user mulai mengetik
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nip.trim()) {
      newErrors.nip = "NIP wajib diisi";
    }

    if (!formData.nama_lengkap.trim()) {
      newErrors.nama_lengkap = "Nama lengkap wajib diisi";
    }

    if (!formData.jenis_kelamin) {
      newErrors.jenis_kelamin = "Jenis kelamin wajib dipilih";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
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

    try {
      const result = await getDataGuru.updateGuru(guruData.guru_id, formData);

      if (onSuccess) {
        onSuccess(result);
      }

      onClose();
    } catch (error) {
      console.error("Error updating guru:", error);

      // Handle error dari backend
      if (error.response?.data?.[0]?.message) {
        const backendError = error.response.data[0].message;

        if (backendError.includes("NIP sudah digunakan")) {
          setErrors({ nip: "NIP sudah digunakan oleh guru lain" });
        } else {
          alert(backendError);
        }
      } else {
        alert("Gagal memperbarui data guru. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Edit Data Guru</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kolom 1 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIP *
                </label>
                <input
                  type="text"
                  name="nip"
                  value={formData.nip}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.nip ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Masukkan NIP"
                />
                {errors.nip && (
                  <p className="mt-1 text-sm text-red-500">{errors.nip}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="nama_lengkap"
                  value={formData.nama_lengkap}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.nama_lengkap ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Masukkan nama lengkap"
                />
                {errors.nama_lengkap && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.nama_lengkap}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Kelamin *
                </label>
                <select
                  name="jenis_kelamin"
                  value={formData.jenis_kelamin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="laki-laki">Laki-laki</option>
                  <option value="perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  name="tanggal_lahir"
                  value={formData.tanggal_lahir}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Masukkan alamat lengkap"
                />
              </div>
            </div>

            {/* Kolom 2 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. Telepon
                </label>
                <input
                  type="text"
                  name="no_telepon"
                  value={formData.no_telepon}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Masukkan nomor telepon"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="contoh@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jabatan
                </label>
                <input
                  type="text"
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Masukkan jabatan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mata Pelajaran
                </label>
                <input
                  type="text"
                  name="mata_pelajaran"
                  value={formData.mata_pelajaran}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Masukkan mata pelajaran"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="aktif">Aktif</option>
                  <option value="non-aktif">Non-aktif</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Foto Profile (URL)
                </label>
                <input
                  type="text"
                  name="foto_profile"
                  value={formData.foto_profile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://example.com/foto.jpg"
                />
                {formData.foto_profile && (
                  <div className="mt-2">
                    <img
                      src={formData.foto_profile}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-full border"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditGuru;
