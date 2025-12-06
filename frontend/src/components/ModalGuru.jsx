import { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";

const ModalGuru = ({ open, onClose, onSubmit }) => {
  if (!open) return null;

  const [form, setForm] = useState({
    nip: "",
    nama_lengkap: "",
    jenis_kelamin: "",
    tanggal_lahir: "",
    alamat: "",
    no_telepon: "",
    email: "",
    jabatan: "",
    mata_pelajaran: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nipInputRef = useRef(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onSubmit(form);
      setForm({
        nip: "",
        nama_lengkap: "",
        jenis_kelamin: "",
        tanggal_lahir: "",
        alamat: "",
        no_telepon: "",
        email: "",
        jabatan: "",
        mata_pelajaran: "",
      });
    } catch (err) {
      console.error("🔴 Error di modal:", err);
      let modalErrorMessage =
        err.message || "Terjadi kesalahan saat menyimpan data";
      if (modalErrorMessage.includes("NIP sudah terdaftar")) {
        setError(modalErrorMessage);
        setTimeout(() => {
          if (nipInputRef.current) {
            nipInputRef.current.focus();
            nipInputRef.current.select();
          }
        }, 100);
      } else {
        setError(modalErrorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({
      nip: "",
      nama_lengkap: "",
      jenis_kelamin: "",
      tanggal_lahir: "",
      alamat: "",
      no_telepon: "",
      email: "",
      jabatan: "",
      mata_pelajaran: "",
    });
    setError("");
    setLoading(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white w-full max-w-4xl shadow-2xl border border-gray-200/60 transform transition-all duration-300 scale-100">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Tambah Guru
              </h2>
              <button
                onClick={handleClose}
                className="cursor-pointer w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors duration-200 cursor-pointer"
                disabled={loading}
              >
                <IoClose className="text-2xl" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Isi data guru dengan lengkap dan benar
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <div className="flex items-center">
                <span className="flex-1">{error}</span>
                {error.includes("NIP sudah terdaftar") && (
                  <button
                    onClick={() => {
                      setForm((prev) => ({ ...prev, nip: "" }));
                      if (nipInputRef.current) {
                        nipInputRef.current.focus();
                      }
                    }}
                    className="ml-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    Hapus NIP
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
          >
            <div>
              {/* NIP */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  NIP
                  <span className="text-red-500">*</span>
                </label>
                <input
                  ref={nipInputRef}
                  name="nip"
                  value={form.nip}
                  placeholder="Masukkan NIP guru"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:bg-white"
                  required
                  disabled={loading}
                />
                {error.includes("NIP sudah terdaftar") && (
                  <p className="text-sm text-red-600">
                    💡 NIP ini sudah digunakan. Silakan gunakan NIP yang
                    berbeda.
                  </p>
                )}
              </div>

              {/* Nama Lengkap */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  Nama Lengkap
                  <span className="text-red-500">*</span>
                </label>
                <input
                  name="nama_lengkap"
                  value={form.nama_lengkap}
                  placeholder="Nama lengkap guru"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:bg-white"
                  required
                  disabled={loading}
                />
              </div>

              {/* Row - Jenis Kelamin & Tanggal Lahir */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Jenis Kelamin
                  </label>
                  <select
                    name="jenis_kelamin"
                    value={form.jenis_kelamin}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:bg-white appearance-none"
                  >
                    <option value="">Pilih jenis kelamin</option>
                    <option value="laki-laki">laki-laki</option>
                    <option value="perempuan">perempuan</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    name="tanggal_lahir"
                    value={form.tanggal_lahir}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:bg-white"
                  />
                </div>
              </div>

              {/* Alamat */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Alamat
                </label>
                <input
                  name="alamat"
                  value={form.alamat}
                  placeholder="Alamat lengkap"
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:bg-white"
                />
              </div>
            </div>
            <div>
              {/* No Telepon */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  No Telepon
                </label>
                <input
                  name="no_telepon"
                  value={form.no_telepon}
                  placeholder="Nomor telepon aktif"
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:bg-white"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  placeholder="alamat@email.com"
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:bg-white"
                />
              </div>

              {/* Jabatan */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Jabatan
                </label>
                <input
                  name="jabatan"
                  value={form.jabatan}
                  placeholder="Jabatan guru"
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:bg-white"
                />
              </div>

              {/* Mata Pelajaran */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Mata Pelajaran
                </label>
                <input
                  name="mata_pelajaran"
                  value={form.mata_pelajaran}
                  placeholder="Mata pelajaran yang diajar"
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:bg-white"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="cursor-pointer px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white border border-gray-300 text-gray-700 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium hover:shadow-sm cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-blue-500/25 cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Data"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ModalGuru;
