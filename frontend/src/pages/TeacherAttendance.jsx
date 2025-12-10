import { useState, useEffect } from "react";
import { useAbsensiGuru } from "../hooks/useAbsensiGuru";
import { GoDownload } from "react-icons/go";
import SearchBar from "../components/SearchBar";
import StatusBadge from "../components/StatusBadge";
import Calendar from "../components/Calendar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const TeacherAttendance = () => {
  const {
    guruList,
    absensiToday,
    selectedGuru,
    setSelectedGuru,
    loading,
    error,
    submitResult,
    selectedDate,
    isViewingHistory,
    updateGuruStatus,
    updateGuruKeterangan,
    updateGuruFile,
    markSelectedPresent,
    markSelectedAbsent,
    submitAbsensi,
    clearSubmitResult,
    refetchGuru,
    handleDateChange,
    goToToday,
  } = useAbsensiGuru();

  const [searchTerm, setSearchTerm] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const filteredGuru = guruList.filter(
    (guru) =>
      guru.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guru.nip?.includes(searchTerm)
  );

  // Handle select checkbox
  const handleSelectGuru = (guru_id) => {
    setSelectedGuru((prev) =>
      prev.includes(guru_id)
        ? prev.filter((id) => id !== guru_id)
        : [...prev, guru_id]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedGuru.length === filteredGuru.length) {
      setSelectedGuru([]);
    } else {
      setSelectedGuru(filteredGuru.map((guru) => guru.guru_id));
    }
  };

  // Show absensi result
  const showAbsensiResult = (result) => {
    if (result && result[0]) {
      const { payload, message } = result[0];

      let successMessage = message;
      let detailMessage = "";

      if (payload) {
        const { guru, berhasil, sudah_absen } = payload;

        if (berhasil && berhasil.length > 0) {
          detailMessage += `berhasil absen ${berhasil.length} guru\n`;

          if (sudah_absen && sudah_absen.length > 0) {
            detailMessage += `Nama Guru yang sudah di absen:\n`;
            sudah_absen.forEach((guru, index) => {
              detailMessage += ` ${index + 1}. ${guru.nama_lengkap}\n `;
            });
          }
        }
      }
      // alert(`${successMessage}\n\n${detailMessage}`);
    }
  };

  // Handle submit absensi
  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);

      const guruToSubmit =
        selectedGuru.length > 0
          ? guruList.filter((guru) => selectedGuru.includes(guru.guru_id))
          : guruList;

      const guruWithStatus = guruToSubmit.filter(
        (guru) => guru.status && guru.status !== "Belum Presensi"
      );

      if (guruWithStatus.length === 0) {
        setAlertMessage(
          "Tidak ada guru yang di catat, Silahkan pilih status dahulu."
        );
        return;
      }

      const absensiData = guruToSubmit
        .filter((guru) =>
          ["Hadir", "Tidak Hadir", "Izin", "Sakit"].includes(guru.status)
        )
        .map((guru) => ({
          guru_id: guru.guru_id,
          status: guru.status,
          keterangan: guru.keterangan || null,
        }));

      if (absensiData.length === 0) {
        setAlertMessage(
          "Silakan pilih status minimal untuk 1 guru sebelum menyimpan."
        );
        return;
      }

      // console.log("Data yang akan dikirim:", absensiData);

      const result = await submitAbsensi(absensiData);
      showAbsensiResult(result);
      // console.log("Result absensi guru:", result);

      await refetchGuru([]);
      setSelectedGuru([]);
    } catch (error) {
      console.error("Submit error:", error);
      alert(
        "Gagal menyimpan absensi: " +
          (error.response?.data?.[0]?.message || error.message)
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const exportToExcel = () => {
    const exportData = guruList.map((guru, index) => ({
      No: index + 1,
      NIP: guru.nip,
      Nama: guru.nama_lengkap,
      "Wali Kelas": guru.kelasDibimbing?.[0]?.nama_kelas || "-",
      "Jam Masuk": guru.jam_masuk,
      Status: guru.status_display,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Absensi Guru");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `absensi_guru_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;

    saveAs(blob, fileName);
  };

  useEffect(() => {
    if (submitResult) {
      const timer = setTimeout(() => {
        clearSubmitResult();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitResult, clearSubmitResult]);

  useEffect(() => {
    if (submitResult) {
      console.log("Submit result updated:", submitResult);
    }
  }, [submitResult]);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  if (loading && !guruList.length) {
    return (
      <div className="m-10 bg-white rounded-xl p-5">
        <div className="flex flex-col justify-center items-center h-40">
          {/* loading animate */}
          <div className="relative flex items-center justify-center h-16 w-16">
            <div className="absolute h-full w-full rounded-full border-4 border-yellow-500/30"></div>
            <div className="absolute h-3/4 w-3/4 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"></div>
            <div className="absolute h-1/2 w-1/2 rounded-full border-4 border-transparent border-t-yellow-500 border-b-yellow-500 animate-spin animation-delay-75"></div>
          </div>
          <div className="text-lg">Memuat data guru...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="m-4 md:m-10 bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-gray-300/30 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              Absensi Guru
              {isViewingHistory && (
                <span className="text-sm md:text-lg font-normal text-gray-600 ml-2">
                  -{" "}
                  {selectedDate.toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </h1>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-2 md:gap-3 items-center justify-end">
              <Calendar
                onDateSelect={handleDateChange}
                selectedDate={selectedDate}
              />

              {isViewingHistory && (
                <button
                  onClick={goToToday}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-3 md:py-2.5 md:px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 text-sm"
                >
                  <span>Hari ini</span>
                </button>
              )}

              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-3 md:py-2.5 md:px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 text-sm"
              >
                <GoDownload className="text-white text-base md:text-lg" />
                <span>Unduh</span>
              </button>
            </div>

            <div className="w-full">
              <SearchBar
                placeholder="Cari Nama Guru atau NIP"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isViewingHistory && (
          <div className="mt-4 p-3 bg-yellow-50/80 backdrop-blur-sm border border-yellow-300/50 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <p className="text-yellow-700 text-xs md:text-sm font-medium">
                <strong>Mode Lihat Riwayat:</strong> Tidak dapat mengubah data
                absensi masa lalu.
              </p>
            </div>
          </div>
        )}

        {/* Filter Section */}
        <div className="mt-6">
          {error && (
            <div className="mb-4 p-3 md:p-4 bg-red-50/80 backdrop-blur-sm border border-red-300/50 text-red-700 rounded-xl font-medium text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mb-6 sm:w-132">
            <button
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-2 px-4 md:py-2.5 md:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 text-sm flex-1 min-w-[120px]"
              onClick={handleSelectAll}
            >
              Select All
            </button>
            <div className="flex flex-wrap gap-2">
              <button
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 md:py-2.5 md:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 text-sm flex-1 min-w-[120px]"
                onClick={markSelectedPresent}
                disabled={selectedGuru.length === 0}
              >
                Present
              </button>
              <button
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 md:py-2.5 md:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 text-sm flex-1 min-w-[120px]"
                onClick={markSelectedAbsent}
                disabled={selectedGuru.length === 0}
              >
                Absent
              </button>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
            {filteredGuru.map((guru, index) => (
              <div
                key={guru.guru_id}
                className="bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {/* Header Card */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {!isViewingHistory && (
                      <input
                        type="checkbox"
                        checked={selectedGuru.includes(guru.guru_id)}
                        onChange={() => handleSelectGuru(guru.guru_id)}
                        disabled={guru.sudah_absen}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {guru.nama_lengkap}
                      </h3>
                      <p className="text-gray-600 text-sm">NIP: {guru.nip}</p>
                    </div>
                  </div>
                </div>

                {/* Detail Info */}
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">Jabatan</span>
                    <p className="font-medium text-gray-800">{guru.jabatan}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Jam Masuk</span>
                    <p className="font-medium text-gray-800">
                      {guru.jam_masuk}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">No. Urut</span>
                    <p className="font-medium text-gray-800">{index + 1}</p>
                  </div>
                </div>

                {/* File Upload */}
                {/* <div className="mb-4">
                  <span className="text-gray-500 text-sm block mb-2">
                    Surat Keterangan
                  </span>
                  <label className="inline-block w-full border-2 border-gray-400/50 py-2 px-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700 text-center">
                    {guru.fileName || "Upload File"}
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => updateGuruFile(index, e.target.files[0])}
                      disabled={guru.sudah_absen}
                    />
                  </label>
                </div> */}
                {/* status badge */}
                <div className="mb-4">
                  <StatusBadge status={guru.status_display} />
                </div>

                {/* Action Section */}
                {!isViewingHistory && (
                  <div className="space-y-3">
                    <select
                      value={guru.status}
                      onChange={(e) => updateGuruStatus(index, e.target.value)}
                      className="w-full px-4 py-2 text-gray-800 bg-white border-0 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm bg-gray-400"
                      disabled={guru.sudah_absen}
                    >
                      <option value="">Pilih Status</option>
                      <option value="Hadir">Hadir</option>
                      <option value="Tidak Hadir">Tidak Hadir</option>
                      <option value="Izin">Izin</option>
                      <option value="Sakit">Sakit</option>
                    </select>

                    {guru.sudah_absen && (
                      <div className="text-xs text-yellow-600 font-medium text-center p-2 bg-yellow-50 rounded-lg">
                        ✓ Sudah absen hari ini
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {filteredGuru.length === 0 && (
              <div className="text-center py-8 text-gray-500 font-medium bg-white/50 rounded-2xl border border-gray-300/30">
                Tidak ada data guru
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block rounded-2xl overflow-hidden border border-gray-300/50 shadow-lg">
            <table className=" w-full border-collapse text-center bg-white/80 backdrop-blur-sm">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  {!isViewingHistory && (
                    <th className="px-6 py-3 text-xs font-semibold text-white uppercase tracking-wider"></th>
                  )}
                  <th className="px-6 py-3 text-xs font-semibold text-white uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-white uppercase tracking-wider">
                    NIP
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-white uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-white uppercase tracking-wider">
                    Wali kelas
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-white uppercase tracking-wider">
                    Jam Masuk
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-white uppercase tracking-wider">
                    Status
                  </th>
                  {/* <th className="px-6 py-3 text-xs font-semibold text-white uppercase tracking-wider">
                    Surat Keterangan
                  </th> */}
                  {!isViewingHistory && (
                    <th className="px-4 py-4 font-semibold">Aksi</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                      Memuat data Guru...
                    </td>
                  </tr>
                ) : filteredGuru.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center">
                      {searchTerm ? (
                        <div>
                          <p className="text-gray-500">
                            Tidak ditemukan guru dengan kata kunci "{searchTerm}
                            "
                          </p>
                          <button
                            onClick={() => setSearchTerm("")}
                            className="mt-2 text-blue-600 hover:text-blue-800"
                          >
                            Tampilkan semua guru
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-500">Belum ada data Murid</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredGuru.map((guru, index) => (
                    <tr
                      key={guru.guru_id}
                      className="border-b border-gray-300/50 hover:bg-gray-50/80 transition-colors duration-150"
                    >
                      {!isViewingHistory && (
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedGuru.includes(guru.guru_id)}
                            onChange={() => handleSelectGuru(guru.guru_id)}
                            disabled={guru.sudah_absen}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                        </td>
                      )}
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-700">
                        {guru.nip}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-800">
                        {guru.nama_lengkap}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {guru.kelasDibimbing?.[0]?.nama_kelas}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {guru.jam_masuk}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={guru.status_display} />
                      </td>
                      {/* <td className="px-4 py-4">
                      <label className="inline-block border-2 border-gray-400/50 py-2 px-4 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700">
                        {guru.fileName || "Upload File"}
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) =>
                            updateGuruFile(index, e.target.files[0])
                          }
                          disabled={guru.sudah_absen}
                        />
                      </label>
                    </td> */}
                      {!isViewingHistory && (
                        <td className="px-4 py-4">
                          <select
                            value={guru.status}
                            onChange={(e) =>
                              updateGuruStatus(index, e.target.value)
                            }
                            className="w-full px-4 py-2 text-gray-800 bg-white border-0 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm bg-white/90"
                            disabled={guru.sudah_absen}
                          >
                            <option value="">Pilih Status</option>
                            <option value="Hadir">Hadir</option>
                            <option value="Tidak Hadir">Tidak Hadir</option>
                            <option value="Izin">Izin</option>
                            <option value="Sakit">Sakit</option>
                          </select>
                          {guru.sudah_absen && (
                            <div className="text-xs text-yellow-600 mt-1 font-medium">
                              Sudah absen hari ini
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Info Summary */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">
              Summary Absensi Guru Hari Ini:
            </h4>
            <div className="flex flex-wrap gap-4 text-sm font-medium">
              <span className="flex items-center text-xs md:text-sm">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-2"></div>
                Hadir: {guruList.filter((g) => g.status === "Hadir").length}
              </span>
              <span className="flex items-center text-xs md:text-sm">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full mr-2"></div>
                Tidak Hadir:{" "}
                {guruList.filter((g) => g.status === "Tidak Hadir").length}
              </span>
              <span className="flex items-center text-xs md:text-sm">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full mr-2"></div>
                Izin: {guruList.filter((g) => g.status === "Izin").length}
              </span>
              <span className="flex items-center text-xs md:text-sm">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full mr-2"></div>
                Sakit: {guruList.filter((g) => g.status === "Sakit").length}
              </span>
              <span className="flex items-center text-xs md:text-sm">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-400 rounded-full mr-2"></div>
                Belum:{" "}
                {
                  guruList.filter(
                    (g) => !g.status || g.status === "Belum Presensi"
                  ).length
                }
              </span>
            </div>
          </div>

          {!isViewingHistory && (
            <div className="flex justify-end p-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 md:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 w-full md:w-auto text-sm md:text-base"
                onClick={handleSubmit}
                disabled={submitLoading || !guruList.length}
              >
                {submitLoading ? "Menyimpan..." : "Submit Absensi"}
              </button>
            </div>
          )}
        </div>
        {/* Alert Message */}
        {alertMessage && (
          <div className="mb-4 p-4 bg-red-50/80 backdrop-blur-sm border border-red-300/50 text-red-700 rounded-xl font-medium">
            <p className="text-red-800">{alertMessage}</p>
          </div>
        )}
        {/* Success Message */}
        {submitResult && submitResult[0] && !alertMessage && (
          <div
            className={`mb-4 p-3 md:p-4 rounded-xl font-medium text-sm ${
              submitResult[0].message.includes("berhasil")
                ? "bg-green-50/80 backdrop-blur-sm border border-green-300/50 text-green-700"
                : "bg-yellow-50/80 backdrop-blur-sm border border-yellow-300/50 text-yellow-700"
            }`}
          >
            <strong>{submitResult[0].message}</strong>
            {submitResult[0].payload && (
              <div className="mt-2 text-sm">
                {submitResult[0].payload.detail.berhasil &&
                  submitResult[0].payload.detail.berhasil.length > 0 && (
                    <p>
                      Berhasil Melakukan absensi:{" "}
                      {submitResult[0].payload.detail.berhasil.length} guru
                    </p>
                  )}
                {submitResult[0].payload.detail.sudah_absen &&
                  submitResult[0].payload.detail.sudah_absen.length > 0 && (
                    <div className="text-yellow-600">
                      <p>
                        Yang Sudah absen:{" "}
                        {submitResult[0].payload.detail.sudah_absen.length} guru
                      </p>
                      <ul className="list-disc list-inside">
                        {submitResult[0].payload.detail.sudah_absen.map(
                          (guru, index) => (
                            <li key={index}>{guru.nama}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TeacherAttendance;
