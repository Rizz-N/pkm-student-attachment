import { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import axiosToken from "../utils/axiosToken";

const ModalMurid = ({ open, onClose, onSubmit }) => {
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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nipInputRef = useRef(null);
  const [kelasOption, setKelasOption] = useState([]);

  useEffect(() => {
    if (open) {
      loadKelasData();
    }
  }, [open]);

  const loadKelasData = async () => {
    try {
      const response = await axiosToken.get("/kelas/dropdown");
      console.log("Data di dropdown", response.data[0].payload);
      setKelasOption(
        Array.isArray(response.data[0].payload) ? response.data[0].payload : []
      );
    } catch (error) {
      console.error("error fetching kelas", error);
      setKelasOption([]);
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
      const formattedData = {
        ...form,
        kelas_id: form.kelas_id,
        status: "aktif",
        tahun_masuk: new Date().getFullYear().toString(),
      };

      await onSubmit(formattedData);
      setForm({
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
      });
    } catch (err) {
      console.error("Error di modal:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({
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
    });
    setError("");
    setLoading(false);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white w-full max-w-4xl shadow-2xl border border-gray-200/60 transform transition-all duration-300 scale-100">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Tambah Murid
              </h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors duration-200 cursor-pointer"
                disabled={loading}
              >
                <IoClose className="text-2xl" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Isi data Murid dengan lengkap dan benar
            </p>
          </div>

          {/* Error Message */}

          {/* Debug info */}
          <div className="mx-6 mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
            <p>
              Debug: Kelas ID terpilih:{" "}
              <strong>{form.kelas_id || "(belum dipilih)"}</strong>
            </p>
            <p>
              Total pilihan kelas: <strong>{kelasOption.length}</strong>
            </p>
          </div>
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
          >
            {/* NIS */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                NIS
                <span className="text-red-500">*</span>
              </label>
              <input
                name="nis"
                value={form.nis}
                placeholder="Masukkan NIS Murid"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:bg-white"
                required
                disabled={loading}
              />
              {/* {error.includes("NIS tersebut sudah terdaftar") && (
                  <p className="text-sm text-red-600">
                    NIS ini sudah digunakan. Silakan gunakan NIS yang berbeda.
                  </p>
                )} */}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                NISN
                <span className="text-red-500">*</span>
              </label>
              <input
                ref={nipInputRef}
                name="nisn"
                value={form.nisn}
                placeholder="Masukkan NISN Murid"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:bg-white"
                required
                disabled={loading}
              />
              {/* {error.includes("NISN tersebut sudah terdaftar") && (
                  <p className="text-sm text-red-600">
                    NISN ini sudah digunakan. Silakan gunakan NISN yang berbeda.
                  </p>
                )} */}
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
                placeholder="Nama lengkap murid"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:bg-white"
                required
                disabled={loading}
              />
            </div>

            {/* Row Kelas */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Kelas
              </label>
              <select
                name="kelas_id"
                value={form.kelas_id}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:bg-white appearance-none"
              >
                <option value="">Pilih Kelas</option>
                {kelasOption.map((kelas) => (
                  <option key={kelas.value} value={kelas.value}>
                    {kelas.label || `${kelas.kode_kelas} - ${kelas.nama_kelas}`}
                  </option>
                ))}
              </select>
              {form.kelas_id && (
                <p className="text-xs text-gray-500 mt-1">
                  Terpilih:
                  {kelasOption.find((k) => k.value == form.kelas_id)?.label}
                </p>
              )}
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
            {/* No Telepon */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Agama
              </label>
              <input
                name="agama"
                value={form.agama}
                placeholder="Masukan agama resmi"
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:bg-white"
              />
            </div>
            {/* nama orangtua */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Nama Orangtua
              </label>
              <input
                name="nama_orangtua"
                value={form.nama_orangtua}
                placeholder="Masukan nama orangtua"
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:bg-white"
              />
            </div>
            {/* no orangtua */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                No telepon orangtua
              </label>
              <input
                name="no_telepon_orangtua"
                value={form.no_telepon_orangtua}
                placeholder="Masukan No Telepon"
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 hover:bg-white"
              />
            </div>
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white border border-gray-300 text-gray-700 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium hover:shadow-sm cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-blue-500/25 cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Menyimpan...
                  </span>
                ) : (
                  <span>Simpan Data</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ModalMurid;
