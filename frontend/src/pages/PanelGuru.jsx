import { useDataGuru } from "../hooks/useDataGuru";
import { useEffect, useState } from "react";
import { GoDownload } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { FaPlus, FaTrash, FaEdit, FaExclamationTriangle } from "react-icons/fa";
import SearchBar from "../components/SearchBar";
import ModalGuru from "../components/ModalGuru";
import ModalEditGuru from "../components/ModalEditGuru";
import { getDataGuru } from "../services/getDataGuru";

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

// komponen Confirmation Modal
const ConfirmationModal = ({ isOpen, onClose, onConfirm, guruData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
          <FaExclamationTriangle className="text-red-600 text-2xl" />
        </div>
        <h3 className="text-lg font-semibold text-center mb-2">
          Konfirmasi Hapus
        </h3>
        <p className="text-gray-600 text-center mb-6">
          Apakah Anda yakin ingin menghapus guru{" "}
          <span className="font-semibold">{guruData?.nama_lengkap}</span> (NIP:{" "}
          {guruData?.nip})?
          <br />
          <span className="text-red-500 font-medium">
            Data user login juga akan dihapus!
          </span>
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <FaTrash /> Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

const PanelGuru = () => {
  const { guruList, loading, error, loadDataGuru } = useDataGuru();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    guruData: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGuru, setSelectedGuru] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  const handleSubmitGuru = async (formData) => {
    try {
      const response = await getDataGuru.createGuru(formData);

      const message = response[0]?.message || "Data guru berhasil ditambahkan";

      showToast(message, "success");
      await loadDataGuru();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error response data:", error.response?.data);

      let errorMessage = "Gagal menambahkan data guru";

      if (error.status === 400) {
        if (error.response?.data) {
          if (
            Array.isArray(error.response.data) &&
            error.response.data[0]?.message
          ) {
            const backendMessage = error.response.data[0].message;

            if (backendMessage.toLowerCase().includes("nip sudah terdaftar")) {
              errorMessage =
                "NIP sudah terdaftar. Silakan gunakan NIP yang berbeda.";
            } else if (
              backendMessage.toLowerCase().includes("tidak boleh kosong")
            ) {
              errorMessage =
                "Data tidak lengkap. Pastikan NIP dan Nama Lengkap sudah diisi.";
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
  const handleDeleteClick = (guru) => {
    setConfirmationModal({
      isOpen: true,
      guruData: guru,
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmationModal.guruData) return;

    setDeleteLoading(true);
    try {
      const result = await getDataGuru.deleteGuru(
        confirmationModal.guruData.guru_id
      );

      // Tampilkan toast sukses
      showToast(result.message || "Data guru berhasil dihapus", "success");

      // Refresh data
      await loadDataGuru();

      // Tutup modal
      setConfirmationModal({ isOpen: false, guruData: null });
    } catch (error) {
      console.error("Error deleting guru:", error);

      let errorMessage = "Gagal menghapus data guru";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      showToast(errorMessage, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Fungsi untuk handle edit
  const handleEditClick = (guru) => {
    setSelectedGuru(guru);
    setIsEditModalOpen(true);
  };

  // Fungsi setelah edit berhasil
  const handleEditSuccess = (result) => {
    showToast(result.message || "Data guru berhasil diperbarui", "success");
    loadDataGuru(); // Refresh data
  };

  const renderActionButtons = (guru) => (
    <div className="flex gap-2">
      <button
        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center gap-1 text-sm"
        onClick={() => handleEditClick(guru)}
      >
        <FaEdit size={14} /> Edit
      </button>
      <button
        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center gap-1 text-sm"
        onClick={() => handleDeleteClick(guru)}
        disabled={deleteLoading}
      >
        <FaTrash size={14} /> Hapus
      </button>
    </div>
  );

  // Handle body overflow untuk modal
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <>
      <div className="bg-white m-10 p-5">
        <div className=" flex justify-between mb-10">
          <div>
            <h1 className="text-2xl">Data Guru</h1>
            <p className="text-xl">Sekolah...</p>
          </div>
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 md:py-2.5 md:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 text-sm w-fit self-end min-w-[120px]">
              <GoDownload className="text-2xl" />
              unduh
            </button>
            <SearchBar placeholder="Cari Nama atau NIP" />
          </div>
        </div>
        <div className="mb-5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 md:py-2.5 md:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 text-sm min-w-[120px]"
          >
            <FaPlus className="text-xl" />
            Tambah Guru
          </button>
        </div>

        {/* Table data */}
        <div className="overflow-x-auto">
          <table className="whitespace-nowrap">
            <thead className="w-full border-collapse text-center bg-white/80 backdrop-blur-sm">
              <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <th className="px-4 py-4 font-semibold">No</th>
                <th className="px-4 py-4 font-semibold">NIP</th>
                <th className="px-4 py-4 font-semibold">Nama Lengkap</th>
                <th className="px-4 py-4 font-semibold">Jenis Kelamin</th>
                <th className="px-4 py-4 font-semibold">Tanggal Lahir</th>
                <th className="px-4 py-4 font-semibold">Alamat</th>
                <th className="px-4 py-4 font-semibold">No Telepon</th>
                <th className="px-4 py-4 font-semibold">Email</th>
                <th className="px-4 py-4 font-semibold">Jabatan</th>
                <th className="px-4 py-4 font-semibold">Mata Pelajaran</th>
                <th className="px-4 py-4 font-semibold">Wali Kelas</th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-4 py-4 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-10">
                    Memuat data guru...
                  </td>
                </tr>
              ) : guruList.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-10">
                    Tidak ada data guru
                  </td>
                </tr>
              ) : guruList.length > 0 ? (
                guruList.map((guru, index) => (
                  <tr
                    key={guru.guru_id}
                    className="border-b border-gray-300/50 hover:bg-gray-50/80 transition-colors duration-150"
                  >
                    <td className="px-4 py-4 font-medium text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-700">
                      {guru.nip}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-700">
                      {guru.nama_lengkap}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-700">
                      {guru.jenis_kelamin}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-700">
                      {guru.tanggal_lahir}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-700">
                      {guru.alamat}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-700">
                      {guru.no_telepon}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-700">
                      {guru.email}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-700">
                      {guru.jabatan}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-700">
                      {guru.mata_pelajaran}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-700">
                      {guru.kelasDibimbing?.[0]?.nama_kelas}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-700">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          guru.status === "aktif"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {guru.status || "aktif"}
                      </span>
                    </td>
                    <td className="px-4 py-4">{renderActionButtons(guru)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Tidak ada data guru
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* modal */}
        <ModalGuru
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitGuru}
        />

        {/* Modal Edit */}
        <ModalEditGuru
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedGuru(null);
          }}
          guruData={selectedGuru}
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
        onClose={() => setConfirmationModal({ isOpen: false, guruData: null })}
        onConfirm={handleConfirmDelete}
        guruData={confirmationModal.guruData}
      />

      {/* Loading overlay untuk delete */}
      {deleteLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-3">Menghapus data...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default PanelGuru;
