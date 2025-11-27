import { useState, useEffect } from "react";
import { useAbsensi } from "../hooks/useAbsensi";
import { GoDownload } from "react-icons/go";
import { GoCalendar } from "react-icons/go";
import Button from "../components/Button";
import SearchBar from "../components/SearchBar";
import { absensiService } from "../services/absensiService";
import StatusBadge from "../components/StatusBadge";
import Calendar from "../components/Calendar";

const StudentAttendance = () => {
  const {
    kelasList,
    selectedKelas,
    setSelectedKelas,
    selectedStudents,
    setSelectedStudents,
    muridList,
    absensiToday,
    loading,
    error,
    submitResult,
    selectedDate,
    isViewingHistory,
    updateMuridStatus,
    updateMuridKeterangan,
    updateMuridFile,
    markSelectedPresent,
    markSelectedAbsent,
    submitAbsensi,
    clearSubmitResult,
    refetchMurid,
    handleDateChange,
    goToToday,
  } = useAbsensi();

  const [semester, setSemester] = useState("Ganjil");
  const [searchTerm, setSearchTerm] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const filteredMurid = muridList.filter(
    (murid) =>
      murid.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      murid.nis?.includes(searchTerm)
  );

  // handle select checkbox
  const handleSelectStudent = (murid_id) => {
    setSelectedStudents((prev) =>
      prev.includes(murid_id)
        ? prev.filter((id) => id !== murid_id)
        : [...prev, murid_id]
    );
  };

  // handle select all
  const handleSelectAll = () => {
    if (selectedStudents.length === filteredMurid.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredMurid.map((murid) => murid.murid_id));
    }
  };

  const showAbsensiResult = (result) => {
    if (result && result[0]) {
      const { payload, message } = result[0];

      let successMessage = message;
      let detailMessage = "";

      if (payload) {
        const { guru, berhasil, sudah_absen } = payload;

        if (berhasil && berhasil.length > 0) {
          detailMessage += `Berhasil absen ${berhasil.length} murid\n`;

          if (sudah_absen && sudah_absen.length > 0) {
            detailMessage += `Nama yang sudah di absen:\n`;
            sudah_absen.forEach((murid, index) => {
              detailMessage += `${index + 1}. ${murid.nama_lengkap}\n`;
            });
          }
        }
      }
      // alert(`${successMessage}\n\n${detailMessage}`);
    }
  };

  // handle submit absensi
  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);
      clearSubmitResult();

      const muridToSubmit =
        selectedStudents.length > 0
          ? muridList.filter((murid) =>
              selectedStudents.includes(murid.murid_id)
            )
          : muridList;

      const muridWithStatus = muridToSubmit.filter(
        (murid) => murid.status && murid.status !== "Belum Presensi"
      );

      if (muridWithStatus.length === 0) {
        setAlertMessage(
          "Tidak ada perubahan absensi untuk disimpan. Silakan pilih status untuk beberapa murid."
        );
        return;
      }

      const absensiData = muridToSubmit
        .filter((murid) =>
          ["Hadir", "Alpha", "Izin", "Sakit"].includes(murid.status)
        )
        .map((murid) => ({
          murid_id: murid.murid_id,
          status: murid.status,
          keterangan: murid.keterangan,
          semester: semester,
        }));

      if (absensiData.length === 0) {
        setAlertMessage(
          "Silakan pilih status minimal untuk 1 guru sebelum menyimpan."
        );
        return;
      }

      console.log("data yang akan di kirim:", absensiData);

      const result = await submitAbsensi(absensiData);

      showAbsensiResult(result);

      console.log("Result absensi:", result);

      if (selectedKelas) {
        await refetchMurid();
      }
      setSelectedStudents([]);
    } catch (error) {
      console.error("Submit error", error);
      // alert('Gagal menyimpan absensi'+ (error.response?.data?.[0]?.message || error.message));
    } finally {
      setSubmitLoading(false);
    }
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
    clearSubmitResult();
  }, [selectedKelas]);

  useEffect(() => {
    if (kelasList && kelasList.length > 0 && !selectedKelas) {
      setSelectedKelas(kelasList[0].kelas_id);
    }
  }, [kelasList, selectedKelas]);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  if (loading && !muridList.length) {
    return (
      <div className="m-10 bg-white rounded-xl p-5">
        <div className="flex justify-center items-center h-40">
          <div className="text-lg">Memuat data...</div>
        </div>
      </div>
    );
  }
  return (
    //   <>
    //     <div className="m-10 bg-white rounded-xl p-5">
    //       <div className="flex justify-between">
    //         <div className="flex-1">
    //           <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
    //             Absensi Siswa
    //             {isViewingHistory &&(
    //               <span className="text-lg font-normal - text-gray-600 ml-2">
    //                 - {selectedDate.toLocaleDateString('id-ID',{
    //                   weekday: 'long',
    //                   year: 'numeric',
    //                   month: 'long',
    //                   day: 'numeric'
    //                 })}
    //               </span>
    //             )}
    //           </h1>
    //         </div>

    //         <div className="flex flex-col gap-3">

    //           <div className="flex gap-3 items-center justify-end">

    //             <Calendar
    //               onDateSelect={handleDateChange}
    //               selectedDate={selectedDate}
    //             />

    //             {isViewingHistory && (
    //               <button
    //                 onClick={goToToday}
    //                 className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
    //               >
    //                 <span>Hari ini</span>
    //               </button>
    //             )}

    //             <div>
    //               <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
    //                 <GoDownload className="text-white text-lg" />
    //                 <span>Unduh</span>
    //               </button>
    //             </div>

    //           </div>

    //           <div className="w-90">
    //             <SearchBar
    //               placeholder="Cari Nama siswa atau NIS"
    //               value={searchTerm}
    //               onChange={(e) => setSearchTerm(e.target.value)}
    //             />
    //           </div>

    //         </div>
    //       </div>

    //       {isViewingHistory && (
    //         <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
    //           <div className="flex items-center">
    //             <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
    //             <p className="text-yellow-700 text-sm">
    //               <strong>Mode Lihat Riwayat:</strong> Anda sedang melihat data absensi tanggal {
    //                 selectedDate.toLocaleDateString('id-ID', {
    //                   day: '2-digit',
    //                   month: '2-digit',
    //                   year: 'numeric'
    //                 })
    //               }. Tidak dapat mengubah data absensi masa lalu.
    //             </p>
    //           </div>
    //         </div>
    //       )}

    //   {/* Filter Section */}
    //   <div className="mt-10">
    //     <div className="flex gap-4 mb-3">
    //       <div className="w-64">
    //         <label className="block text-sm font-medium text-gray-700 mb-2">
    //           Pilih Kelas
    //         </label>
    //         <select
    //           value={selectedKelas}
    //           onChange={(e) => setSelectedKelas(e.target.value)}
    //           className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    //           // disabled={isViewingHistory}
    //         >
    //           {(kelasList || []).map((kelas) => (
    //             <option key={kelas.kelas_id} value={kelas.kelas_id}>
    //               {kelas.nama_kelas}
    //             </option>
    //           ))}
    //         </select>
    //       </div>

    //       <div className="w-64">
    //         <label className="block text-sm font-medium text-gray-700 mb-2">
    //           Semester
    //         </label>
    //         <select
    //           value={semester}
    //           onChange={(e) => setSemester(e.target.value)}
    //           className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    //           disabled={isViewingHistory}
    //         >
    //           <option value="Ganjil">Ganjil</option>
    //           <option value="Genap">Genap</option>
    //         </select>
    //       </div>
    //     </div>

    //     {selectedKelas && (
    //       <p className="mb-3 text-sm text-gray-600">
    //         Menampilkan data untuk: <span className="font-semibold">
    //           {(kelasList || []).find(k => k.kelas_id == selectedKelas)?.nama_kelas}
    //         </span>
    //       </p>
    //     )}

    //     {error && (
    //       <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
    //         {error}
    //       </div>
    //     )}

    //     {/* Success Message */}
    //               {submitResult && submitResult[0] && (
    //                   <div className={`mb-3 p-3 rounded ${
    //                       submitResult[0].message.includes('Berhasil')
    //                           ? 'bg-green-100 border border-green-400 text-green-700'
    //                           : 'bg-yellow-100 border border-yellow-400 text-yellow-700'
    //                   }`}>
    //                       <strong>{submitResult[0].message}</strong>
    //                       {submitResult[0].payload && (
    //                           <div className="mt-2 text-sm">
    //                               {submitResult[0].payload.berhasil && submitResult[0].payload.berhasil.length > 0 && (
    //                                   <p>Berhasil absen: {submitResult[0].payload.berhasil.length} murid</p>
    //                               )}
    //                               {submitResult[0].payload.sudah_absen && submitResult[0].payload.sudah_absen.length > 0 && (
    //                                   <div>
    //                                       <p>Sudah absen: {submitResult[0].payload.sudah_absen.length} murid</p>
    //                                       <ul className="list-disc list-inside">
    //                                           {submitResult[0].payload.sudah_absen.map((murid, index) => (
    //                                               <li key={index}>{murid.nama}</li>
    //                                           ))}
    //                                       </ul>
    //                                   </div>
    //                               )}
    //                           </div>
    //                       )}
    //                   </div>
    //               )}

    //     {/* Action Buttons */}
    //     <div className="flex gap-2 mb-4">
    //       <button className="bg-gray-600 border-gray-300 text-xl text-white hover:bg-gray-700 py-2 px-4 rounded-xl cursor-pointer"
    //               onClick={handleSelectAll}>
    //           Select All
    //       </button>

    //       <button className="bg-green-400 border-gray-300 text-xl text-white hover:bg-green-500 py-2 px-4 rounded-xl cursor-pointer"
    //               onClick={markSelectedPresent}
    //               disabled={selectedStudents.length === 0}>
    //           Present
    //       </button>
    //       <button className="bg-red-400 border-gray-300 text-xl text-white hover:bg-red-500 py-2 px-4 rounded-xl cursor-pointer"
    //               onClick={markSelectedAbsent}
    //               disabled={selectedStudents.length === 0}>
    //           Absent
    //       </button>
    //     </div>

    //     {/* Table */}
    //     <table className="table-auto w-full border-collapse text-center">
    //       <thead className="bg-gray-200">
    //         <tr>
    //           {!isViewingHistory && <th className="px-3 py-2"></th>}
    //           <th className="px-3 py-2">No</th>
    //           <th className="px-3 py-2">NIS</th>
    //           <th className="px-3 py-2">Nama Lengkap</th>
    //           <th className="px-3 py-2">Jenis Kelamin</th>
    //           <th className="px-3 py-2">Surat Keterangan</th>
    //           <th className="px-3 py-2">Status</th>
    //           {!isViewingHistory && <th className="px-3 py-2">Aksi</th>}
    //         </tr>
    //       </thead>

    //       <tbody>
    //         {filteredMurid.map((murid, index) => (
    //           <tr key={murid.murid_id} className="border-b border-gray-300">
    //             {!isViewingHistory && ( <td className="px-3 py-3">
    //               <input  type="checkbox"
    //                       checked={selectedStudents.includes(murid.murid_id)}
    //                       onChange={() => handleSelectStudent(murid.murid_id)}
    //                       disabled={murid.sudah_absen}
    //               />
    //             </td>)}
    //             <td className="px-3 py-3">{index + 1}</td>
    //             <td className="px-3 py-3">{murid.nis}</td>
    //             <td className="px-3 py-3">{murid.nama_lengkap}</td>
    //             <td className="px-3 py-3">{murid.jenis_kelamin}</td>
    //             <td className="px-3 py-3">
    //               <label className="inline-block border-2 border-gray-400 py-1 px-4 rounded-xl cursor-pointer ">
    //                 {murid.fileName}
    //                 <input
    //                   type="file"
    //                   className="hidden"
    //                   onChange={(e) => updateMuridFile(index, e.target.files[0])}
    //                 />
    //               </label>
    //             </td>
    //             <td className="px-3 py-3">
    //               <StatusBadge status={murid.status_display} />
    //             </td>
    //             {!isViewingHistory && (
    //             <td className="px-3 py-3">
    //               <select
    //                 value={murid.status}
    //                 onChange={(e) => updateMuridStatus(index, e.target.value)}
    //                 className="border border-gray-300 rounded px-2 py-1"
    //                 disabled={murid.sudah_absen}
    //               >
    //                 <option value="">Pilih Status</option>
    //                 <option value="Hadir">Hadir</option>
    //                 <option value="Izin">Izin</option>
    //                 <option value="Sakit">Sakit</option>
    //                 <option value="Alpha">Alpha</option>
    //               </select>
    //               {murid.sudah_absen && (
    //                 <div className="text-xs text-yellow-600 mt-1">
    //                   Sudah absen hari ini
    //                 </div>
    //               )}
    //             </td>
    //             )}
    //           </tr>
    //         ))}

    //         {filteredMurid.length === 0 && selectedKelas && (
    //           <tr>
    //             <td colSpan="8" className="px-3 py-4 text-center text-gray-500">
    //               Tidak ada data murid untuk kelas ini
    //             </td>
    //           </tr>
    //         )}
    //       </tbody>
    //     </table>

    //     {/* Info summary */}
    //           <div className="mt-4 p-3 bg-gray-100 rounded-lg">
    //               <h4 className="font-semibold mb-2">Summary Absensi Hari Ini:</h4>
    //               <div className="flex gap-4 text-sm">
    //                   <span className="flex items-center">
    //                       <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
    //                       Hadir: {muridList.filter(m => m.status === 'Hadir').length}
    //                   </span>
    //                   <span className="flex items-center">
    //                       <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
    //                       Izin: {muridList.filter(m => m.status === 'Izin').length}
    //                   </span>
    //                   <span className="flex items-center">
    //                       <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
    //                       Sakit: {muridList.filter(m => m.status === 'Sakit').length}
    //                   </span>
    //                   <span className="flex items-center">
    //                       <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
    //                       Alpha: {muridList.filter(m => m.status === 'Alpha').length}
    //                   </span>
    //                   <span className="flex items-center">
    //                       <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
    //                       Belum: {muridList.filter(m => m.status >= 0).length}
    //                   </span>
    //               </div>
    //           </div>
    //       {!isViewingHistory && (
    //       <div className="flex justify-end p-2">
    //           <button type="submit"
    //                   className="bg-blue-800 border-gray-400 text-xl text-white hover:bg-blue-900 px-4 py-2 rounded-xl  cursor-pointer"
    //                   onClick={handleSubmit}
    //                   disabled={submitLoading || !muridList.length}>
    //               Submit
    //           </button>
    //     </div>
    //     )}
    //   </div>
    // </div>
    //   </>
    <>
      <div className="m-4 md:m-10 bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-gray-300/30 shadow-lg">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              Absensi Siswa
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
                placeholder="Cari Nama siswa atau NIS"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Warning Banner - Sama seperti sebelumnya */}
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
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-4">
            <div className="w-full md:w-64">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pilih Kelas
              </label>
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="w-full border border-gray-300/50 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm transition-all duration-200 text-sm md:text-base"
              >
                {(kelasList || []).map((kelas) => (
                  <option key={kelas.kelas_id} value={kelas.kelas_id}>
                    {kelas.nama_kelas}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-64">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full border border-gray-300/50 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm transition-all duration-200 text-sm md:text-base"
                disabled={isViewingHistory}
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          </div>

          {selectedKelas && (
            <p className="mb-4 text-sm text-gray-600 font-medium">
              Menampilkan data untuk:{" "}
              <span className="font-semibold text-blue-600">
                {
                  (kelasList || []).find((k) => k.kelas_id == selectedKelas)
                    ?.nama_kelas
                }
              </span>
            </p>
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
                disabled={selectedStudents.length === 0}
              >
                Present
              </button>
              <button
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 md:py-2.5 md:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 text-sm flex-1 min-w-[120px]"
                onClick={markSelectedAbsent}
                disabled={selectedStudents.length === 0}
              >
                Absent
              </button>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
            {filteredMurid.map((murid, index) => (
              <div
                key={murid.murid_id}
                className="bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {/* Header Card */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {!isViewingHistory && (
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(murid.murid_id)}
                        onChange={() => handleSelectStudent(murid.murid_id)}
                        disabled={murid.sudah_absen}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {murid.nama_lengkap}
                      </h3>
                      <p className="text-gray-600 text-sm">NIS: {murid.nis}</p>
                    </div>
                  </div>
                </div>

                {/* Detail Info */}
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">Jenis Kelamin</span>
                    <p className="font-medium text-gray-800">
                      {murid.jenis_kelamin}
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
                    {murid.fileName || "Upload File"}
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        updateMuridFile(index, e.target.files[0])
                      }
                    />
                  </label>
                </div>
                {/* status badge */}
                <div className="mb-4">
                  <StatusBadge status={murid.status_display} />
                </div>
                {/* Action Section */}
                {!isViewingHistory && (
                  <div className="space-y-3">
                    <select
                      value={murid.status}
                      onChange={(e) => updateMuridStatus(index, e.target.value)}
                      className="w-full border border-gray-300/50 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm transition-all duration-200 text-sm"
                      disabled={murid.sudah_absen}
                    >
                      <option value="">Pilih Status</option>
                      <option value="Hadir">Hadir</option>
                      <option value="Izin">Izin</option>
                      <option value="Sakit">Sakit</option>
                      <option value="Alpha">Alpha</option>
                    </select>

                    {murid.sudah_absen && (
                      <div className="text-xs text-yellow-600 font-medium text-center p-2 bg-yellow-50 rounded-lg">
                        ✓ Sudah absen hari ini
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {filteredMurid.length === 0 && selectedKelas && (
              <div className="text-center py-8 text-gray-500 font-medium bg-white/50 rounded-2xl border border-gray-300/30">
                Tidak ada data murid untuk kelas ini
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
                  <th className="px-4 py-4 font-semibold">NIS</th>
                  <th className="px-4 py-4 font-semibold">Nama Lengkap</th>
                  <th className="px-4 py-4 font-semibold">Jenis Kelamin</th>
                  <th className="px-4 py-4 font-semibold">Surat Keterangan</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  {!isViewingHistory && (
                    <th className="px-4 py-4 font-semibold">Aksi</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredMurid.map((murid, index) => (
                  <tr
                    key={murid.murid_id}
                    className="border-b border-gray-300/50 hover:bg-gray-50/80 transition-colors duration-150"
                  >
                    {!isViewingHistory && (
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(murid.murid_id)}
                          onChange={() => handleSelectStudent(murid.murid_id)}
                          disabled={murid.sudah_absen}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </td>
                    )}
                    <td className="px-4 py-4 font-medium text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-700">
                      {murid.nis}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-800">
                      {murid.nama_lengkap}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {murid.jenis_kelamin}
                    </td>
                    <td className="px-4 py-4">
                      <label className="inline-block border-2 border-gray-400/50 py-2 px-4 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700">
                        {murid.fileName}
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) =>
                            updateMuridFile(index, e.target.files[0])
                          }
                        />
                      </label>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={murid.status_display} />
                    </td>
                    {!isViewingHistory && (
                      <td className="px-4 py-4">
                        <select
                          value={murid.status}
                          onChange={(e) =>
                            updateMuridStatus(index, e.target.value)
                          }
                          className="border border-gray-300/50 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm transition-all duration-200"
                          disabled={murid.sudah_absen}
                        >
                          <option value="">Pilih Status</option>
                          <option value="Hadir">Hadir</option>
                          <option value="Izin">Izin</option>
                          <option value="Sakit">Sakit</option>
                          <option value="Alpha">Alpha</option>
                        </select>
                        {murid.sudah_absen && (
                          <div className="text-xs text-yellow-600 mt-1 font-medium">
                            Sudah absen hari ini
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Info Summary */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">
              Summary Absensi Hari Ini:
            </h4>
            <div className="flex flex-wrap gap-4 text-sm font-medium">
              <span className="flex items-center text-xs md:text-sm">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-2"></div>
                Hadir: {muridList.filter((m) => m.status === "Hadir").length}
              </span>
              <span className="flex items-center text-xs md:text-sm">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full mr-2"></div>
                Izin: {muridList.filter((m) => m.status === "Izin").length}
              </span>
              <span className="flex items-center text-xs md:text-sm">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full mr-2"></div>
                Sakit: {muridList.filter((m) => m.status === "Sakit").length}
              </span>
              <span className="flex items-center text-xs md:text-sm">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full mr-2"></div>
                Alpha: {muridList.filter((m) => m.status === "Alpha").length}
              </span>
              <span className="flex items-center text-xs md:text-sm">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-400 rounded-full mr-2"></div>
                Belum: {muridList.filter((m) => m.status >= 0).length}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          {!isViewingHistory && (
            <div className="flex justify-end p-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 md:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 w-full md:w-auto text-sm md:text-base"
                onClick={handleSubmit}
                disabled={submitLoading || !muridList.length}
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
        {/* Error & Success Messages*/}
        {error && (
          <div className="mb-4 p-3 md:p-4 bg-red-50/80 backdrop-blur-sm border border-red-300/50 text-red-700 rounded-xl font-medium text-sm">
            {error}
          </div>
        )}

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
                      Berhasil absen:{" "}
                      {submitResult[0].payload.detail.berhasil.length} murid
                    </p>
                  )}
                {submitResult[0].payload.detail.sudah_absen &&
                  submitResult[0].payload.detail.sudah_absen.length > 0 && (
                    <div className="text-yellow-600">
                      <p>
                        Yang Sudah absen:{" "}
                        {submitResult[0].payload.detail.sudah_absen.length}{" "}
                        murid
                      </p>
                      <ul className="list-disc list-inside">
                        {submitResult[0].payload.detail.sudah_absen.map(
                          (murid, index) => (
                            <li key={index}>{murid.nama}</li>
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
export default StudentAttendance;
