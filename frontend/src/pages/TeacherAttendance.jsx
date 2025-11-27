import { useState, useEffect } from "react";
import { useAbsensiGuru } from "../hooks/useAbsensiGuru";
import { GoDownload } from "react-icons/go";
import { GoCalendar } from "react-icons/go";
import Button from "../components/Button";
import SearchBar from "../components/SearchBar";
import { absensiGuru } from "../services/absensiGuru";
import Dropdown from "../components/Dropdown";
import StatusBadge from "../components/StatusBadge";
import Calendar from "../components/Calendar";

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
          "Tidak ada perubahan absensi untuk disimpan. Silakan pilih status untuk beberapa guru."
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

      console.log("Data yang akan dikirim:", absensiData);

      const result = await submitAbsensi(absensiData);
      showAbsensiResult(result);
      console.log("Result absensi guru:", result);

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
        <div className="flex justify-center items-center h-40">
          <div className="text-lg">Memuat data guru...</div>
        </div>
      </div>
    );
  }

  return (
    // <>
    //     <div className="m-10 bg-white rounded-xl p-5">
    //         <div className="flex justify-between">
    //           <div className="flex-1">
    //             <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
    //                 Absensi Guru
    //                 {isViewingHistory &&(
    //                     <span className="text-lg font-normal - text-gray-600 ml-2">
    //                   - {selectedDate.toLocaleDateString('id-ID',{
    //                     weekday: 'long',
    //                     year: 'numeric',
    //                     month: 'long',
    //                     day: 'numeric'
    //                   })}
    //                 </span>
    //                 )}
    //             </h1>
    //           </div>

    //           <div className="flex flex-col gap-3">

    //             <div className="flex gap-3 items-center justify-end">

    //                 <Calendar
    //                     onDateSelect={handleDateChange}
    //                     selectedDate={selectedDate}
    //                 />

    //                 {isViewingHistory && (
    //                 <button
    //                   onClick={goToToday}
    //                   className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
    //                 >
    //                   <span>Hari ini</span>
    //                 </button>
    //               )}

    //               <div>
    //                 <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
    //                   <GoDownload className="text-white text-lg" />
    //                   <span>Unduh</span>
    //                 </button>
    //               </div>

    //             </div>

    //             <div className="w-90">
    //               <SearchBar
    //                 placeholder="Cari Nama Guru atau NIP"
    //                 value={searchTerm}
    //                 onChange={(e) => setSearchTerm(e.target.value)}
    //               />
    //             </div>

    //           </div>
    //         </div>

    //         {isViewingHistory && (
    //           <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
    //             <div className="flex items-center">
    //               <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
    //               <p className="text-yellow-700 text-sm">
    //                 <strong>Mode Lihat Riwayat:</strong> Anda sedang melihat data absensi tanggal {
    //                   selectedDate.toLocaleDateString('id-ID', {
    //                     day: '2-digit',
    //                     month: '2-digit',
    //                     year: 'numeric'
    //                   })
    //                 }. Tidak dapat mengubah data absensi masa lalu.
    //               </p>
    //             </div>
    //           </div>
    //         )}

    //         {/* Filter Section */}
    //             <div className="mt-10">
    //                 {error && (
    //                     <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
    //                         {error}
    //                     </div>
    //                 )}

    //                 {/* Success Message */}
    //                 {submitResult && submitResult[0] && !alertMessage &&(
    //                     <div className={`mb-3 p-3 rounded ${
    //                         submitResult[0].message.includes('Berhasil')
    //                             ? 'bg-green-100 border border-green-400 text-green-700'
    //                             : 'bg-yellow-100 border border-yellow-400 text-yellow-700'
    //                         }`}>

    //                         <strong>{submitResult[0].message}</strong>

    //                         {submitResult[0].payload && (
    //                             <div className="mt-2 text-sm">
    //                                 {submitResult[0].payload.detail.berhasil && submitResult[0].payload.detail.berhasil.length > 0 && (
    //                                     <p>Berhasil absen: {submitResult[0].payload.detail.berhasil.length} guru</p>
    //                                 )}

    //                                 {submitResult[0].payload.detail.sudah_absen && submitResult[0].payload.detail.sudah_absen.length > 0 && (

    //                                     <div className="text-yellow-600">
    //                                         <p>Sudah absen: {submitResult[0].payload.detail.sudah_absen.length} guru</p>
    //                                         <ul className="list-disc list-inside">
    //                                             {submitResult[0].payload.detail.sudah_absen.map((guru, index) => (
    //                                                 <li key={index}>{guru.nama}</li>
    //                                             ))}
    //                                         </ul>
    //                                     </div>
    //                                 )}
    //                             </div>
    //                         )}
    //                     </div>
    //                 )}

    //                 {/* alert message */}
    //                 {alertMessage && (
    //                     <div className="border-2 border-red-400 bg-red-200 mb-10 py-4 px-4 rounded-md">
    //                         <p className="text-xl text-red-800" >{alertMessage}</p>
    //                     </div>
    //                 )}

    //                 {/* Action Buttons */}
    //                 <div className="flex gap-2 mb-4">
    //                     <button
    //                         className="bg-gray-600 border-gray-300 text-xl text-white hover:bg-gray-700 py-2 px-4 rounded-xl cursor-pointer"
    //                         onClick={handleSelectAll}
    //                     >
    //                         Select All
    //                     </button>
    //                     <button
    //                         className="bg-green-400 border-gray-300 text-xl text-white hover:bg-green-500 py-2 px-4 rounded-xl cursor-pointer"
    //                         onClick={markSelectedPresent}
    //                         disabled={selectedGuru.length === 0}
    //                     >
    //                         Present
    //                     </button>
    //                     <button
    //                         className="bg-red-400 border-gray-300 text-xl text-white hover:bg-red-500 py-2 px-4 rounded-xl cursor-pointer"
    //                         onClick={markSelectedAbsent}
    //                         disabled={selectedGuru.length === 0}
    //                     >
    //                         Absent
    //                     </button>
    //                 </div>

    //                 {/* Table */}
    //                 <table className="table-auto w-full border-collapse text-center">
    //                     <thead className="bg-gray-200">
    //                         <tr>
    //                             {!isViewingHistory && <th className="px-3 py-2"></th>}
    //                             <th className="px-3 py-2">No</th>
    //                             <th className="px-3 py-2">NIP</th>
    //                             <th className="px-3 py-2">Nama</th>
    //                             <th className="px-3 py-2">Jabatan</th>
    //                             <th className="px-3 py-2">Jam Masuk</th>
    //                             <th className="px-3 py-2">Status</th>
    //                             <th className="px-3 py-2">Surat Keterangan</th>
    //                             {!isViewingHistory &&<th className="px-3 py-2">Aksi</th>}
    //                         </tr>
    //                     </thead>

    //                     <tbody>
    //                         {filteredGuru.map((guru, index) => (
    //                             <tr key={guru.guru_id} className="border-b border-gray-300">
    //                                 {!isViewingHistory && (<td className="px-3 py-2">
    //                                     <input
    //                                         type="checkbox"
    //                                         checked={selectedGuru.includes(guru.guru_id)}
    //                                         onChange={() => handleSelectGuru(guru.guru_id)}
    //                                         disabled={guru.sudah_absen}
    //                                     />
    //                                 </td>)}
    //                                 <td className="px-3 py-2">{index + 1}</td>
    //                                 <td className="px-3 py-2">{guru.nip}</td>
    //                                 <td className="px-3 py-2">{guru.nama_lengkap}</td>
    //                                 <td className="px-3 py-2">{guru.jabatan}</td>
    //                                 <td className="px-3 py-2">{guru.jam_masuk}</td>
    //                                 <td className="px-3 py-2">
    //                                     <StatusBadge status={guru.status_display} />
    //                                 </td>
    //                                 <td className="px-3 py-2">
    //                                     <label className="border-2 border-gray-400 py-2 px-3 rounded-xl w-50 cursor-pointer">
    //                                         {guru.fileName}
    //                                         <input
    //                                             type="file"
    //                                             className="hidden"
    //                                             onChange={(e) => updateGuruFile(index, e.target.files[0])}
    //                                             disabled={guru.sudah_absen}
    //                                         />
    //                                     </label>
    //                                 </td>
    //                                 {!isViewingHistory && (
    //                                 <td className="px-3 py-2">
    //                                     <select
    //                                         value={guru.status}
    //                                         onChange={(e) => updateGuruStatus(index, e.target.value)}
    //                                         className="border border-gray-300 rounded px-2 py-1"
    //                                         disabled={guru.sudah_absen}
    //                                     >
    //                                         <option value="">Pilih Status</option>
    //                                         <option value="Hadir">Hadir</option>
    //                                         <option value="Tidak Hadir">Tidak Hadir</option>
    //                                         <option value="Izin">Izin</option>
    //                                         <option value="Sakit">Sakit</option>
    //                                     </select>
    //                                     {guru.sudah_absen && (
    //                                         <div className="text-xs text-yellow-600 mt-1">
    //                                             Sudah absen hari ini
    //                                         </div>
    //                                     )}
    //                                 </td>
    //                                 )}
    //                             </tr>
    //                         ))}

    //                         {filteredGuru.length === 0 && (
    //                             <tr>
    //                                 <td colSpan="9" className="px-3 py-4 text-center text-gray-500">
    //                                     Tidak ada data guru
    //                                 </td>
    //                             </tr>
    //                         )}
    //                     </tbody>
    //                 </table>

    //                 {/* Info Summary */}
    //                 <div className="mt-4 p-3 bg-gray-100 rounded-lg">
    //                     <h4 className="font-semibold mb-2">Summary Absensi Guru Hari Ini:</h4>
    //                     <div className="flex gap-4 text-sm">
    //                         <span className="flex items-center">
    //                             <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
    //                             Hadir: {guruList.filter(g => g.status === 'Hadir').length}
    //                         </span>
    //                         <span className="flex items-center">
    //                             <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
    //                             Tidak Hadir: {guruList.filter(g => g.status === 'Tidak Hadir').length}
    //                         </span>
    //                         <span className="flex items-center">
    //                             <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
    //                             Izin: {guruList.filter(g => g.status === 'Izin').length}
    //                         </span>
    //                         <span className="flex items-center">
    //                             <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
    //                             Sakit: {guruList.filter(g => g.status === 'Sakit').length}
    //                         </span>
    //                         <span className="flex items-center">
    //                             <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
    //                             Belum: {guruList.filter(g => !g.status || g.status === 'Belum Presensi').length}
    //                         </span>
    //                     </div>
    //                 </div>

    //                 <div className="flex justify-end p-2">
    //                     <button
    //                         type="submit"
    //                         className="bg-blue-800 border-gray-400 text-xl text-white hover:bg-blue-900 px-4 py-2 rounded-xl cursor-pointer"
    //                         onClick={handleSubmit}
    //                         disabled={submitLoading || !guruList.length}
    //                     >
    //                         {submitLoading ? 'Menyimpan...' : 'Submit'}
    //                     </button>
    //                 </div>
    //             </div>
    //     </div>
    // </>
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

              <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-3 md:py-2.5 md:px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 text-sm">
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

          {/* Success Message */}
          {submitResult && submitResult[0] && !alertMessage && (
            <div
              className={`mb-4 p-3 md:p-4 rounded-xl font-medium text-sm ${
                submitResult[0].message.includes("Berhasil")
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
                        Berhasil absen:{" "}
                        {submitResult[0].payload.detail.berhasil.length} guru
                      </p>
                    )}
                  {submitResult[0].payload.detail.sudah_absen &&
                    submitResult[0].payload.detail.sudah_absen.length > 0 && (
                      <div className="text-yellow-600">
                        <p>
                          Sudah absen:{" "}
                          {submitResult[0].payload.detail.sudah_absen.length}{" "}
                          guru
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
                <div className="mb-4">
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
                </div>
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
                      className="w-full border border-gray-300/50 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm transition-all duration-200 text-sm"
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
            <table className="w-full border-collapse text-center bg-white/80 backdrop-blur-sm">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  {!isViewingHistory && (
                    <th className="px-4 py-4 font-semibold"></th>
                  )}
                  <th className="px-4 py-4 font-semibold">No</th>
                  <th className="px-4 py-4 font-semibold">NIP</th>
                  <th className="px-4 py-4 font-semibold">Nama</th>
                  <th className="px-4 py-4 font-semibold">Wali kelas</th>
                  <th className="px-4 py-4 font-semibold">Jam Masuk</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-4 py-4 font-semibold">Surat Keterangan</th>
                  {!isViewingHistory && (
                    <th className="px-4 py-4 font-semibold">Aksi</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredGuru.map((guru, index) => (
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
                    <td className="px-4 py-4 font-medium text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-700">
                      {guru.nip}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-800">
                      {guru.nama_lengkap}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-600">
                      {guru.kelasDibimbing?.[0]?.nama_kelas}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-700">
                      {guru.jam_masuk}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={guru.status_display} />
                    </td>
                    <td className="px-4 py-4">
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
                    </td>
                    {!isViewingHistory && (
                      <td className="px-4 py-4">
                        <select
                          value={guru.status}
                          onChange={(e) =>
                            updateGuruStatus(index, e.target.value)
                          }
                          className="border border-gray-300/50 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm transition-all duration-200"
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
                ))}

                {filteredGuru.length === 0 && (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-4 py-8 text-center text-gray-500 font-medium"
                    >
                      Tidak ada data guru
                    </td>
                  </tr>
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
      </div>
    </>
  );
};

export default TeacherAttendance;
