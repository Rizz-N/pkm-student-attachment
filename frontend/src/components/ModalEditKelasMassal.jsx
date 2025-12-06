// components/ModalEditKelasMassal.jsx
import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import axiosToken from "../utils/axiosToken";

const ModalEditKelasMassal = ({ open, onClose, selectedMurid, onSuccess }) => {
  const [kelas_id, setKelasId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [kelasOption, setKelasOption] = useState([]);

  // Load data kelas saat modal dibuka
  useEffect(() => {
    if (open) {
      loadKelasData();
      setKelasId("");
      setError("");
    }
  }, [open]);

  const loadKelasData = async () => {
    try {
      const response = await axiosToken.get("/kelas/dropdown");
      setKelasOption(response.data[0]?.payload || []);
    } catch (error) {
      console.error("Error loading kelas:", error);
      setError("Gagal memuat data kelas");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (kelas_id === "") {
        throw new Error("Harap pilih kelas tujuan");
      }

      const muridIds = selectedMurid.map((m) => m.murid_id);

      const kelasKeluar = kelas_id === "0" ? null : parseInt(kelas_id);

      if (onSuccess) {
        await onSuccess(muridIds, kelasKeluar);
      }

      onClose();
    } catch (err) {
      console.error("Error in mass edit modal:", err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md shadow-2xl border border-gray-200/60 rounded-lg">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Pindah Kelas Massal
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedMurid.length} murid terpilih
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              disabled={loading}
              type="button"
            >
              <IoClose className="text-xl" />
            </button>
          </div>
        </div>

        {/* Selected Murid List */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Murid yang akan dipindahkan:
          </h3>
          <div className="max-h-40 overflow-y-auto">
            {selectedMurid.map((murid, index) => (
              <div
                key={murid.murid_id}
                className="flex items-center justify-between py-1"
              >
                <span className="text-sm text-gray-600">
                  {index + 1}. {murid.nama_lengkap} ({murid.nis})
                </span>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {murid.kelas?.nama_kelas || "Tidak ada kelas"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pilih Kelas Tujuan *
              </label>
              <select
                value={kelas_id}
                onChange={(e) => setKelasId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                <option value="">-- Pilih Kelas --</option>
                <option value="0">Keluar</option>
                {kelasOption.map((kelas) => (
                  <option key={kelas.value} value={kelas.value}>
                    {kelas.label} ({kelas.jumlah_murid} murid)
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Murid akan dipindahkan ke kelas yang dipilih
              </p>
            </div>

            {/* Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-700">
                ⚠️ <strong>Perhatian:</strong> Aksi ini akan mengubah kelas
                untuk semua murid yang dipilih.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Memproses...
                </>
              ) : (
                <>
                  <FaUsers />
                  Pindah {selectedMurid.length} Murid
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditKelasMassal;
