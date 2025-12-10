import { useState, useEffect } from "react";
import { GoDownload } from "react-icons/go";
import SearchBar from "../components/SearchBar";
import StatusBadge from "../components/StatusBadge";
import { useAbsensiMuridRange } from "../hooks/useAbsensiMuridRange";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { absensiService } from "../services/absensiService";

const PanelAbsenMurid = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMurid, setFilteredMurid] = useState([]);

  const {
    records,
    page,
    totalPage,
    totalData,
    loading,
    error,
    setPage,
    loadAbsensi,
  } = useAbsensiMuridRange(startDate, endDate);

  const exportToExcel = async () => {
    try {
      const allData = await absensiService.getAllAbsensiMuridByRange(
        startDate,
        endDate
      );

      const exportData = allData.map((absensi, index) => ({
        No: index + 1,
        NIS: absensi.murid?.nis || "-",
        NISN: absensi.murid?.nisn || "-",
        "Nama Murid": absensi.murid?.nama_lengkap || "-",
        Kelas: absensi.kelas?.nama_kelas || "-",
        "Jam Masuk": absensi.jam_masuk || "-",
        Tanggal: absensi.tanggal || "-",
        "Guru Piket": absensi.guru.nama_lengkap || "-",
        Status: absensi.status || "-",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Absensi Murid");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Nama file dengan rentang tanggal jika ada
      const fileName =
        startDate && endDate
          ? `absensi_murid_${startDate}_sampai_${endDate}.xlsx`
          : `absensi_murid_${new Date().toISOString().slice(0, 10)}.xlsx`;

      saveAs(blob, fileName);
    } catch (error) {
      console.error("error download data", error);
    }
  };

  // Filter data berdasarkan search term
  useEffect(() => {
    let filtered = records;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (absensi) =>
          absensi.murid?.nama_lengkap
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          absensi.murid?.nis
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          absensi.murid?.nisn?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMurid(filtered);
  }, [records, searchTerm]);

  if (loading && !records.length) {
    return (
      <div className="m-10 bg-white rounded-xl p-5">
        <div className="flex flex-col justify-center items-center h-40">
          {/* loading animate */}
          <div className="relative flex items-center justify-center h-16 w-16">
            <div className="absolute h-full w-full rounded-full border-4 border-yellow-500/30"></div>
            <div className="absolute h-3/4 w-3/4 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"></div>
            <div className="absolute h-1/2 w-1/2 rounded-full border-4 border-transparent border-t-yellow-500 border-b-yellow-500 animate-spin animation-delay-75"></div>
          </div>
          <div className="text-lg">Memuat data absensi murid...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white mt-10 ml-5 p-5 rounded-s-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Data Absensi Murid
              </h1>
              <p className="text-gray-600">
                Management data lengkap Absensi Murid
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-2 md:gap-3 items-center justify-end">
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari Nama Murid atau NIS/NISN"
              />
            </div>
          </div>
        </div>
        {/* Filter Section */}
        <div className="mt-6 mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Filter Tanggal Absensi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tanggal Awal
              </label>
              <input
                type="date"
                value={startDate || ""}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={endDate || ""}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 items-end">
              <button
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
                className="flex-1 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all"
              >
                Reset
              </button>
              {startDate && endDate && (
                <div className="text-xs text-gray-600 px-2 py-2">
                  {startDate} s/d {endDate}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Desktop Table View */}
        <div className="hidden lg:block rounded-2xl overflow-hidden border border-gray-300/50 shadow-lg">
          <table className="table-auto w-full border-collapse bg-white/80 backdrop-blur-sm">
            <thead className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-white uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-white uppercase tracking-wider">
                  NIS
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-white uppercase tracking-wider">
                  NISN
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-white uppercase tracking-wider">
                  Nama Murid
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-white uppercase tracking-wider">
                  Kelas
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-white uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-white uppercase tracking-wider">
                  Jam Masuk
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-white uppercase tracking-wider">
                  Guru Piket
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-white uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-10">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    Memuat data Murid...
                  </td>
                </tr>
              ) : filteredMurid.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center">
                    {searchTerm || (startDate && endDate) ? (
                      <div>
                        <p className="text-gray-500">
                          Tidak ditemukan data dengan filter yang dipilih
                        </p>
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setStartDate(null);
                            setEndDate(null);
                          }}
                          className="mt-2 text-blue-600 hover:text-blue-800"
                        >
                          Reset Filter
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-500">
                          Belum ada data Absensi Murid
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredMurid.map((absensi, index) => (
                  <tr
                    key={absensi.id || index}
                    className="border-b border-gray-300/50 hover:bg-gray-50/80 transition-colors duration-150"
                  >
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-700">
                      {absensi.murid?.nis || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-700">
                      {absensi.murid?.nisn || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-800">
                      {absensi.murid?.nama_lengkap || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {absensi.kelas?.nama_kelas || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {absensi.tanggal || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {absensi.jam_masuk || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {absensi.guru.nama_lengkap || "-"}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={absensi.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPage > 1 && (
          <div className="flex items-center justify-between mt-6 px-6 py-4 bg-white rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">
              Halaman {page} dari {totalPage} | Total: {totalData} data
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPage }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      page === p
                        ? "bg-blue-600 text-white font-semibold"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(Math.min(totalPage, page + 1))}
                disabled={page === totalPage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PanelAbsenMurid;
