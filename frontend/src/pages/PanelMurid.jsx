import { GoDownload } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaExclamationTriangle,
  FaUsers,
  FaExchangeAlt,
} from "react-icons/fa";
import SearchBar from "../components/SearchBar";
import { useDataMurid } from "../hooks/useDataMurid";
import { useEffect, useState } from "react";
import ModalMurid from "../components/ModalMurid";
import ModalEditMurid from "../components/ModalEditMurid";
import ModalEditKelasMassal from "../components/ModalEditKelasMassal";
import { getDataMurid } from "../services/getDataMurid";

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
const ConfirmationModal = ({ isOpen, onClose, onConfirm, muridData }) => {
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
          Apakah Anda yakin ingin menghapus murid{" "}
          <span className="font-semibold">{muridData?.nama_lengkap}</span>{" "}
          (NISN: {muridData?.nisn})?
          <br />
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

const PanelMurid = () => {
  const { muridList, loading, error, loadDataMurid } = useDataMurid();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMassEditModalOpen, setIsMassEditModalOpen] = useState(false);
  const [selectedMurid, setSelectedMurid] = useState([]);
  const [selectedMuridForEdit, setSelectedMuridForEdit] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isMessage, setIsMessage] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    muridData: null,
  });
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };
  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  // Handle checkbox selection
  const handleCheckboxChange = (murid) => {
    setSelectedMurid((prev) => {
      const isSelected = prev.some((m) => m.murid_id === murid.murid_id);
      if (isSelected) {
        return prev.filter((m) => m.murid_id !== murid.murid_id);
      } else {
        return [...prev, murid];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedMurid.length === muridList.length) {
      // Unselect all
      setSelectedMurid([]);
    } else {
      // Select all
      setSelectedMurid([...muridList]);
    }
  };

  // Handle individual edit
  const handleEditClick = (murid) => {
    setSelectedMuridForEdit(murid);
    setIsEditModalOpen(true);
  };

  // Handle mass edit
  const handleMassEditClick = () => {
    if (selectedMurid.length === 0) {
      showToast("Pilih minimal 1 murid untuk diedit", "error");
      return;
    }
    setIsMassEditModalOpen(true);
  };

  // Handle individual update
  const handleUpdateMurid = async (murid_id, formData) => {
    try {
      const response = await getDataMurid.updateMurid(murid_id, formData);
      showToast(
        response[0]?.message || "Data murid berhasil diperbarui",
        "success"
      );
      await loadDataMurid();
    } catch (error) {
      console.error("Error updating murid:", error);
      showToast(
        error.response?.data?.[0]?.message || "Gagal memperbarui data murid",
        "error"
      );
      throw error;
    }
  };

  // Handle mass update kelas
  const handleMassUpdateKelas = async (murid_ids, kelas_id) => {
    try {
      const response = await getDataMurid.updateMuridKelasMassal(
        murid_ids,
        kelas_id
      );
      showToast(
        response[0]?.message || "Kelas murid berhasil diperbarui",
        "success"
      );

      // Clear selection
      setSelectedMurid([]);

      // Refresh data
      await loadDataMurid();
    } catch (error) {
      console.error("Error mass update kelas:", error);
      showToast(
        error.response?.data?.[0]?.message || "Gagal memperbarui kelas murid",
        "error"
      );
      throw error;
    }
  };

  const handleSubmitMurid = async (formData) => {
    try {
      const response = await getDataMurid.createMurid(formData);
      // console.log("Pesan response push:", response);
      showToast(response);

      await loadDataMurid();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error response data:", error.response?.data);
    }
  };

  // Fungsi untuk handle delete
  const handleDeleteClick = (murid) => {
    setConfirmationModal({
      isOpen: true,
      muridData: murid,
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmationModal.muridData) return;

    setDeleteLoading(true);
    try {
      const result = await getDataMurid.deleteMurid(
        confirmationModal.muridData.murid_id
      );

      // Tampilkan toast sukses
      showToast(result);

      // Refresh data
      setIsMessage(result);
      await loadDataMurid();

      // Tutup modal
      setConfirmationModal({ isOpen: false, muridData: null });
    } catch (error) {
      console.error("Error deleting murid:", error);

      let errorMessage = "Gagal menghapus data murid";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      showToast(errorMessage, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderActionButtons = (murid) => (
    <div className="flex gap-2">
      <button
        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center gap-1 text-sm"
        onClick={() => handleEditClick(murid)}
      >
        <FaEdit size={14} /> Edit
      </button>
      <button
        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center gap-1 text-sm"
        onClick={() => handleDeleteClick(murid)}
        disabled={deleteLoading}
      >
        <FaTrash size={14} /> Hapus
      </button>
    </div>
  );

  return (
    <>
      <div className="bg-white m-10 p-5">
        <div className=" flex justify-between mb-10">
          <div>
            <h1 className="text-2xl">Data Murid</h1>
            <p className="text-xl">Sekolah...</p>
          </div>
          <div className="mt-2">
            <span className=" flex items-center text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              <FaUsers />
              {selectedMurid.length} murid terpilih
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 md:py-2.5 md:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 text-sm w-fit self-end min-w-[120px]">
              <GoDownload className="text-2xl" />
              unduh
            </button>
            <SearchBar placeholder="Cari Nama atau NIP" />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mb-5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 md:py-2.5 md:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 text-sm min-w-[120px]"
          >
            <FaPlus className="text-xl" />
            Tambah Murid
          </button>

          {selectedMurid.length > 0 && (
            <>
              <button
                onClick={handleMassEditClick}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow hover:shadow-xl transition-all duration-200"
              >
                <FaExchangeAlt className="text-lg" />
                Pindah Kelas ({selectedMurid.length})
              </button>

              <button
                onClick={() => setSelectedMurid([])}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:shadow-xl transition-all duration-200"
              >
                <IoClose className="text-lg" />
                Batalkan Pilihan
              </button>
            </>
          )}
        </div>

        {/* Table data */}
        <div className="overflow-x-auto">
          <table className="whitespace-nowrap">
            <thead className="w-full border-collapse text-center bg-white/80 backdrop-blur-sm">
              <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <th className="px-4 py-4 font-semibold">
                  <input
                    type="checkbox"
                    checked={
                      selectedMurid.length === muridList.length &&
                      muridList.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-4 font-semibold">No</th>
                <th className="px-4 py-4 font-semibold">NIS</th>
                <th className="px-4 py-4 font-semibold">NISN</th>
                <th className="px-4 py-4 font-semibold">Nama Lengkap</th>
                <th className="px-4 py-4 font-semibold">Kelas</th>
                <th className="px-4 py-4 font-semibold">Jenis Kelamin</th>
                <th className="px-4 py-4 font-semibold">Tanggal Lahir</th>
                <th className="px-4 py-4 font-semibold">Alamat</th>
                <th className="px-4 py-4 font-semibold">Agama</th>
                <th className="px-4 py-4 font-semibold">Nama orangtua</th>
                <th className="px-4 py-4 font-semibold">no telepon orangtua</th>
                <th className="px-4 py-4 font-semibold">status</th>
                <th className="px-4 py-4 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={14} className="text-center py-10">
                    Memuat data Murid...
                  </td>
                </tr>
              ) : muridList.length === 0 ? (
                <tr>
                  <td colSpan={14} className="text-center py-10">
                    Tidak ada data Murid
                  </td>
                </tr>
              ) : (
                muridList.map((murid, index) => {
                  const isSelected = selectedMurid.some(
                    (m) => m.murid_id === murid.murid_id
                  );
                  return (
                    <tr
                      key={murid.murid_id}
                      className="border-b border-gray-300/50 hover:bg-gray-50/80 transition-colors duration-150"
                    >
                      <td className="px-4 py-4 font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleCheckboxChange(murid)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-700">
                        {murid.nis}
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-700">
                        {murid.nisn}
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-700">
                        {murid.nama_lengkap}
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-700">
                        {murid.kelas.nama_kelas}
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-700">
                        {murid.jenis_kelamin}
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-700">
                        {murid.tanggal_lahir}
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-700">
                        {murid.alamat}
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-700">
                        {murid.agama}
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-700">
                        {murid.nama_orangtua}
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-700">
                        {murid.no_telepon_orangtua}
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-700">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            murid.status === "aktif"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {murid.status || "aktif"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {renderActionButtons(murid)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, muridData: null })}
        onConfirm={handleConfirmDelete}
        muridData={confirmationModal.muridData}
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

      {/* modal */}
      <ModalMurid
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitMurid}
      />

      {/* Modals */}
      <ModalMurid
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitMurid}
      />

      <ModalEditMurid
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        muridData={selectedMuridForEdit}
        onSuccess={handleUpdateMurid}
      />

      <ModalEditKelasMassal
        open={isMassEditModalOpen}
        onClose={() => setIsMassEditModalOpen(false)}
        selectedMurid={selectedMurid}
        onSuccess={handleMassUpdateKelas}
      />
    </>
  );
};

export default PanelMurid;
