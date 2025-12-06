import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import axiosToken from "../utils/axiosToken";

const ModalEditMurid = ({ open, onClose, muridData, onSuccess }) => {
  const [form, setForm] = useState({
    nis: "",
    nisn: "",
    nama_lengkap: "",
    jenis_kelamin: "",
    tanggal_lahir: "",
    alamat: "",
    kelas_id: "",
    agama: "",
    nama_orangtua: "",
    no_telepon_orangtua: "",
    status: "aktif",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [kelasOption, setKelasOption] = useState([]);

  // Load data saat modal dibuka
  useEffect(() => {
    if (open && muridData) {
      // Isi form dengan data murid
      setForm({
        nis: muridData.nis || "",
        nisn: muridData.nisn || "",
        nama_lengkap: muridData.nama_lengkap || "",
        jenis_kelamin: muridData.jenis_kelamin || "",
        tanggal_lahir: muridData.tanggal_lahir || "",
        alamat: muridData.alamat || "",
        kelas_id: muridData.kelas_id?.toString() || "",
        agama: muridData.agama || "",
        nama_orangtua: muridData.nama_orangtua || "",
        no_telepon_orangtua: muridData.no_telepon_orangtua || "",
        status: muridData.status || "aktif",
      });

      // Load data kelas
      loadKelasData();
    }
  }, [open, muridData]);

  const loadKelasData = async () => {
    try {
      const response = await axiosToken.get("/kelas/dropdown");
      setKelasOption(response.data[0]?.payload || []);
    } catch (error) {
      console.error("Error loading kelas:", error);
      setError("Gagal memuat data kelas");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validasi
      if (!form.nis || !form.nama_lengkap || !form.jenis_kelamin) {
        throw new Error("NIS, Nama Lengkap, dan Jenis Kelamin wajib diisi");
      }

      // Format data
      const formattedData = {
        nis: form.nis.trim(),
        nisn: form.nisn.trim() || null,
        nama_lengkap: form.nama_lengkap.trim(),
        jenis_kelamin: form.jenis_kelamin,
        kelas_id: form.kelas_id ? parseInt(form.kelas_id) : null,
        tanggal_lahir: form.tanggal_lahir || null,
        agama: form.agama || null,
        alamat: form.alamat.trim() || null,
        nama_orangtua: form.nama_orangtua.trim() || null,
        no_telepon_orangtua: form.no_telepon_orangtua || null,
        status: form.status,
      };

      console.log("Updating murid with data:", formattedData);

      if (onSuccess) {
        await onSuccess(muridData.murid_id, formattedData);
      }

      onClose();
    } catch (err) {
      console.error("Error in edit modal:", err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl shadow-2xl border border-gray-200/60 rounded-lg">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Edit Data Murid
            </h2>
            <button
              onClick={onClose}
              className="cursor-pointer w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
              disabled={loading}
              type="button"
            >
              <IoClose className="text-2xl" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Edit data murid: <strong>{muridData?.nama_lengkap}</strong>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kolom 1 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  NIS *
                </label>
                <input
                  name="nis"
                  value={form.nis}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  NISN
                </label>
                <input
                  name="nisn"
                  value={form.nisn}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Nama Lengkap *
                </label>
                <input
                  name="nama_lengkap"
                  value={form.nama_lengkap}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Kolom 2 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Kelas
                </label>
                <select
                  name="kelas_id"
                  value={form.kelas_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  disabled={loading}
                >
                  <option value="">-- Pilih Kelas --</option>
                  {kelasOption.map((kelas) => (
                    <option key={kelas.value} value={kelas.value}>
                      {kelas.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Jenis Kelamin *
                </label>
                <select
                  name="jenis_kelamin"
                  value={form.jenis_kelamin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                  disabled={loading}
                >
                  <option value="">Pilih jenis kelamin</option>
                  <option value="laki-laki">Laki-laki</option>
                  <option value="perempuan">Perempuan</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  disabled={loading}
                >
                  <option value="aktif">Aktif</option>
                  <option value="non-aktif">Non-aktif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data lainnya */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Alamat
            </label>
            <textarea
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Nama Orangtua
              </label>
              <input
                name="nama_orangtua"
                value={form.nama_orangtua}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                No Telepon Orangtua
              </label>
              <input
                name="no_telepon_orangtua"
                value={form.no_telepon_orangtua}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                disabled={loading}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditMurid;
