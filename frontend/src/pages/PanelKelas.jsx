import { useDataKelas } from "../hooks/useDataKelas";
import { useEffect, useState } from "react";
import { GoDownload } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { FaPlus, FaTrash, FaEdit, FaExclamationTriangle } from "react-icons/fa";
import SearchBar from "../components/SearchBar";
import ModalKelas from "../components/ModalKelas";
import ModalEditKelas from "../components/ModalEditKelas";
import { getDataKelas } from "../services/getDataKelas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Komponen Toast Notification
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const borderColor =
    type === "success" ? "border-green-400" : "border-red-400";

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} border ${borderColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 animate-in slide-in-from-right`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200"
        >
          <IoClose />
        </button>
      </div>
    </div>
  );
};

// Komponen Confirmation Modal
const ConfirmationModal = ({ isOpen, onClose, onConfirm, kelasData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
          <FaExclamationTriangle className="text-red-600 text-2xl" />
        </div>
        <h3 className="text-lg font-semibold text-center mb-2">
          Konfirmasi Hapus Kelas
        </h3>
        <p className="text-gray-600 text-center mb-4">
          Apakah Anda yakin ingin menghapus kelas{" "}
          <span className="font-semibold">{kelasData?.nama_kelas}</span> (
          {kelasData?.kode_kelas})?
        </p>

        {/* Warning jika ada murid */}
        {kelasData?.jumlah_murid > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-yellow-800 text-sm">
              ⚠️ <span className="font-semibold">Peringatan:</span> Kelas ini
              masih memiliki{" "}
              <span className="font-bold">{kelasData?.jumlah_murid} murid</span>
              .
              <br />
              Semua murid akan dipindahkan ke "Belum Terdaftar".
            </p>
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <FaTrash /> Hapus Kelas
          </button>
        </div>
      </div>
    </div>
  );
};

const PanelKelas = () => {
  const { kelasList, loading, error, loadDataKelas } = useDataKelas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    kelasData: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredKelas, setFilteredKelas] = useState([]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  // Filter kelas berdasarkan search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredKelas(kelasList);
      return;
    }

    const filtered = kelasList.filter(
      (kelas) =>
        kelas.nama_kelas?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kelas.kode_kelas?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kelas.wali_kelas?.nama_lengkap
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredKelas(filtered);
  }, [kelasList, searchTerm]);

  const handleSubmitKelas = async (formData) => {
    try {
      const response = await getDataKelas.createKelas(formData);

      const message = response[0]?.message || "Kelas berhasil ditambahkan";

      showToast(message, "success");
      await loadDataKelas();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error response data:", error.response?.data);

      let errorMessage = "Gagal menambahkan kelas";

      if (error.status === 400) {
        if (error.response?.data) {
          if (
            Array.isArray(error.response.data) &&
            error.response.data[0]?.message
          ) {
            const backendMessage = error.response.data[0].message;

            if (
              backendMessage
                .toLowerCase()
                .includes("kode kelas sudah digunakan")
            ) {
              errorMessage =
                "Kode kelas sudah digunakan. Silakan gunakan kode yang berbeda.";
            } else if (backendMessage.toLowerCase().includes("wajib diisi")) {
              errorMessage =
                "Data tidak lengkap. Pastikan Kode Kelas, Nama Kelas, dan Wali Kelas sudah diisi.";
            } else if (backendMessage.toLowerCase().includes("wali kelas")) {
              errorMessage =
                "Guru yang dipilih sudah menjadi wali kelas di kelas lain.";
            } else {
              errorMessage = backendMessage;
            }
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      showToast(errorMessage, "error");
    }
  };

  // Fungsi untuk handle delete
  const handleDeleteClick = (kelas) => {
    setConfirmationModal({
      isOpen: true,
      kelasData: kelas,
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmationModal.kelasData) return;

    setDeleteLoading(true);
    try {
      const result = await getDataKelas.deleteKelas(
        confirmationModal.kelasData.kelas_id
      );

      // Tampilkan toast sukses
      showToast(result.message || "Kelas berhasil dihapus", "success");

      // Refresh data
      await loadDataKelas();

      // Tutup modal
      setConfirmationModal({ isOpen: false, kelasData: null });
    } catch (error) {
      console.error("Error deleting kelas:", error);

      let errorMessage = "Gagal menghapus kelas";
      if (error.response?.data?.[0]?.message) {
        errorMessage = error.response.data[0].message;
      }

      showToast(errorMessage, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Fungsi untuk handle edit
  const handleEditClick = (kelas) => {
    setSelectedKelas(kelas);
    setIsEditModalOpen(true);
  };

  // Fungsi setelah edit berhasil
  const handleEditSuccess = (result) => {
    showToast(result.message || "Kelas berhasil diperbarui", "success");
    loadDataKelas(); // Refresh data
  };

  const exportToExcel = () => {
    const exportData = kelasList.map((kelas, index) => ({
      No: index + 1,
      Kelas: kelas.nama_kelas,
      "Wali Kelas": kelas.walikelas.nama_lengkap,
      NIP: kelas.walikelas.nip,
      "Jumlah Murid": kelas.jumlah_murid,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Kelas");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `Data_Kelas_${new Date().toISOString().slice(0, 10)}.xlsx`;

    saveAs(blob, fileName);
  };

  const renderActionButtons = (kelas) => (
    <div className="flex gap-2">
      <button
        className="cursor-pointer px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center gap-1 text-sm"
        onClick={() => handleEditClick(kelas)}
      >
        <FaEdit size={14} /> Edit
      </button>
      <button
        className="cursor-pointer px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center gap-1 text-sm"
        onClick={() => handleDeleteClick(kelas)}
        disabled={deleteLoading}
      >
        <FaTrash size={14} /> Hapus
      </button>
    </div>
  );

  // Handle body overflow untuk modal
  useEffect(() => {
    if (isModalOpen || isEditModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, isEditModalOpen]);

  // Format jumlah murid
  const formatJumlahMurid = (jumlah) => {
    return jumlah > 0 ? (
      <span className="font-semibold text-blue-600">{jumlah} murid</span>
    ) : (
      <span className="text-gray-400">0 murid</span>
    );
  };

  return (
    <>
      <div className="bg-white mt-10 ml-5 p-5 rounded-s-lg shadow-sm">
        <div className="flex justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Data Kelas</h1>
            <p className="text-gray-600">Manajemen kelas dan wali kelas</p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 md:py-2.5 md:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 text-sm w-fit self-end min-w-[120px]"
            >
              <GoDownload className="text-lg" />
              Export Data
            </button>
            <SearchBar
              placeholder="Cari Kelas, Kode, atau Wali Kelas"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Info Jumlah Kelas */}
        <div className="mb-5 flex justify-between items-center">
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 md:py-2.5 md:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 text-sm min-w-[120px]"
            >
              <FaPlus className="text-lg" />
              Tambah Kelas
            </button>
          </div>
          <div className="text-sm text-gray-600">
            Total: <span className="font-semibold">{filteredKelas.length}</span>{" "}
            kelas
            {searchTerm && (
              <span className="ml-2">(Filter: "{searchTerm}")</span>
            )}
          </div>
        </div>

        {/* Table data */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="table-auto min-w-full divide-y divide-gray-200">
            <thead className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-purple-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Kode Kelas
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Nama Kelas
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Wali Kelas
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  NIP
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Jumlah Murid
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-2 text-gray-500">Memuat data kelas...</p>
                  </td>
                </tr>
              ) : filteredKelas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center">
                    {searchTerm ? (
                      <div>
                        <p className="text-gray-500">
                          Tidak ditemukan kelas dengan kata kunci "{searchTerm}"
                        </p>
                        <button
                          onClick={() => setSearchTerm("")}
                          className="mt-2 text-blue-600 hover:text-blue-800"
                        >
                          Tampilkan semua kelas
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-500">Belum ada data kelas</p>
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="mt-2 text-green-600 hover:text-green-800 font-medium"
                        >
                          + Tambah kelas pertama
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredKelas.map((kelas, index) => (
                  <tr
                    key={kelas.kelas_id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4  text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 ">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {kelas.kode_kelas}
                      </span>
                    </td>
                    <td className="px-6 py-4  text-sm font-semibold text-gray-900">
                      {kelas.nama_kelas}
                    </td>
                    <td className="px-6 py-4  text-sm text-gray-700">
                      {kelas.walikelas ? (
                        <div>
                          <p className="font-medium">
                            {kelas.walikelas.nama_lengkap}
                          </p>
                          <p className="text-xs text-gray-500">
                            {kelas.walikelas.jabatan}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400">
                          Belum ada wali kelas
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4  text-sm text-gray-700">
                      {kelas.walikelas?.nip || "-"}
                    </td>
                    <td className="px-6 py-4  text-sm text-gray-700">
                      {formatJumlahMurid(kelas.jumlah_murid || 0)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {renderActionButtons(kelas)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Stats Card */}
        {!loading && filteredKelas.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800">Total Kelas</h3>
              <p className="text-2xl font-bold text-blue-600">
                {filteredKelas.length}
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800">
                Total Murid
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {filteredKelas.reduce(
                  (sum, kelas) => sum + (kelas.jumlah_murid || 0),
                  0
                )}
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-purple-800">
                Kelas dengan Wali Kelas
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                {filteredKelas.filter((kelas) => kelas.walikelas).length}
              </p>
            </div>
          </div>
        )}

        {/* Modal Tambah Kelas */}
        <ModalKelas
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitKelas}
        />

        {/* Modal Edit Kelas */}
        <ModalEditKelas
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedKelas(null);
          }}
          kelasData={selectedKelas}
          onSuccess={handleEditSuccess}
        />

        {/* Toast Notification */}
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, kelasData: null })}
        onConfirm={handleConfirmDelete}
        kelasData={confirmationModal.kelasData}
      />

      {/* Loading overlay untuk delete */}
      {deleteLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-3 text-gray-600">Menghapus kelas...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default PanelKelas;
