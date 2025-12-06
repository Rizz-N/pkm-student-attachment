import { useState } from "react";
import Card from "../components/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUserFriends,
} from "react-icons/fa";
import { useGetTotal } from "../hooks/useGetTotal";
import { useLoading } from "../hooks/useLoading";
import ModernBanner from "../components/ModernBaner";
import { useAbsensiTahunan } from "../hooks/useAbsensiTahunan";

const Overview = () => {
  const { total, totalMurid, totalGuruHadir, totalMuridHadir, loading, error } =
    useGetTotal();

  const animatedTotalTeacher = useLoading(total);
  const animatedTotalStudent = useLoading(totalMurid);
  const animatedTotalTeacherPresence = useLoading(totalGuruHadir);
  const animatedTotalStudentPresence = useLoading(totalMuridHadir);
  const {
    chartData,
    chartDataGuru,
    loading: loadingChart,
    error: errorChart,
  } = useAbsensiTahunan();

  const [filterYear, setFilterYear] = useState("6bulan");
  const [filterMonth, setFilterMonth] = useState("enambulan");

  // Data untuk grafik murid
  let attendanceData = [];

  if (filterYear === "6bulan") {
    attendanceData = chartData.slice(-6);
  } else if (filterYear === "tahunini") {
    attendanceData = chartData;
  }

  // Data untuk grafik guru
  let attendanceDataGuru = [];

  if (filterMonth === "enambulan") {
    attendanceDataGuru = chartDataGuru.slice(-6);
  } else if (filterMonth === "12bulan") {
    attendanceDataGuru = chartDataGuru;
  }

  if (loading) {
    return (
      <div className="mt-8 relative min-h-[85vh] md:min-h-[80vh] overflow-hidden bg-gradient-to-br from-blue-50 via-white to-yellow-50/20">
        {/* Header dengan animasi berbeda */}
        <div className="px-4 md:px-10 pt-8 pb-6">
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse mb-4"></div>
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2 animate-pulse"></div>
        </div>

        {/* Cards dengan warna berbeda */}
        <div className="mt-4 mx-4 md:mx-10 grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 md:p-10">
          {/* Card 1 - Kuning */}
          <div className="bg-white/80 border border-yellow-100 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-2">
                <div className="h-5 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded w-32 animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded w-24 animate-pulse"></div>
              </div>
              <div className="h-8 w-8 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-full animate-pulse"></div>
            </div>
            <div className="h-10 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg animate-pulse mt-4"></div>
          </div>

          {/* Card 2 - Hijau */}
          <div className="bg-white/80 border border-green-100 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-2">
                <div className="h-5 bg-gradient-to-r from-green-100 to-green-200 rounded w-36 animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-green-100 to-green-200 rounded w-28 animate-pulse"></div>
              </div>
              <div className="h-8 w-8 bg-gradient-to-r from-green-100 to-green-200 rounded-full animate-pulse"></div>
            </div>
            <div className="h-10 bg-gradient-to-r from-green-100 to-green-200 rounded-lg animate-pulse mt-4"></div>
            <div className="h-4 bg-gradient-to-r from-green-100 to-green-200 rounded w-40 animate-pulse mt-4"></div>
          </div>

          {/* Card 3 - Ungu */}
          <div className="bg-white/80 border border-purple-100 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-2">
                <div className="h-5 bg-gradient-to-r from-purple-100 to-purple-200 rounded w-28 animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="h-8 w-8 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full animate-pulse"></div>
            </div>
            <div className="h-10 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg animate-pulse mt-4"></div>
          </div>

          {/* Card 4 - Biru */}
          <div className="bg-white/80 border border-blue-100 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-2">
                <div className="h-5 bg-gradient-to-r from-blue-100 to-blue-200 rounded w-36 animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded w-32 animate-pulse"></div>
              </div>
              <div className="h-8 w-8 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse"></div>
            </div>
            <div className="h-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg animate-pulse mt-4"></div>
            <div className="h-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded w-48 animate-pulse mt-4"></div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mx-4 md:mx-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48 animate-pulse"></div>
                <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-40 animate-pulse"></div>
              </div>
              <div className="h-[400px] bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 md:mx-10 grid grid-cols-1 lg:grid-cols-4 gap-6 bg-transparent p-4 md:p-10">
        <Card
          container="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-gray-300/30 p-6 flex-1 rounded-2xl shadow-lg"
          top="flex justify-between items-center"
          title="Total Teacher"
          source="https://via.assets.so/img.jpg?w=50&h=50&bg=dbeafe&f=png"
          rstyle="text-4xl mt-8 font-bold text-gray-400"
          result="Error"
        />
        <Card
          container="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-gray-300/30 p-6 flex-1 rounded-2xl shadow-lg"
          top="flex justify-between items-center"
          title="Teacher Present today"
          source="https://via.assets.so/img.jpg?w=50&h=50&bg=dbeafe&f=png"
          rstyle="text-4xl mt-8 font-bold text-gray-400"
          result="Error"
        />
        <Card
          container="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-gray-300/30 p-6 flex-1 rounded-2xl shadow-lg"
          top="flex justify-between items-center"
          title="Total Teacher"
          source="https://via.assets.so/img.jpg?w=50&h=50&bg=dbeafe&f=png"
          rstyle="text-4xl mt-8 font-bold text-gray-400"
          result="Error"
        />
        <Card
          container="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-gray-300/30 p-6 flex-1 rounded-2xl shadow-lg"
          top="flex justify-between items-center"
          title="Teacher Present today"
          source="https://via.assets.so/img.jpg?w=50&h=50&bg=dbeafe&f=png"
          rstyle="text-4xl mt-8 font-bold text-gray-400"
          result="Error"
        />
      </div>
    );
  }

  return (
    <>
      <ModernBanner />
      <div className="mt-8 relative min-h-[85vh] md:min-h-[80vh] overflow-hidden bg-gradient-to-br from-blue-50 via-white to-yellow-50/20 ">
        <div className="px-4 md:px-10 pt-8 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Dashboard Kehadiran Sekolah
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl">
            Monitor kehadiran guru dan siswa secara real-time dengan data akurat
            dan terupdate.
            <span className="block mt-1 text-sm text-gray-500">
              Data diperbarui:{" "}
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
        </div>
        <div className="mt-4 mx-4 md:mx-10 grid grid-cols-1 lg:grid-cols-4 gap-6 bg-transparent p-4 md:p-10">
          <Card
            container="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-yellow-300/30 p-6 flex-1 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
            top="flex justify-between items-center"
            title={
              <div>
                <h3>Total Guru</h3>
                <p className="text-gray-500 mt-1">tenaga pengajar aktif</p>
              </div>
            }
            icon={<FaChalkboardTeacher />}
            color="yellow"
            result={animatedTotalTeacher.toString()}
            rstyle="text-4xl mt-4 font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent"
          />

          <Card
            container="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-green-300/30 p-6 flex-1 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
            top="flex justify-between items-center"
            title={
              <div>
                <h3>Guru Hadir Hari Ini</h3>
                <p className="text-gray-500 mt-1">
                  {animatedTotalTeacher > 0
                    ? `${Math.round(
                        (animatedTotalTeacherPresence / animatedTotalTeacher) *
                          100
                      )}% dari total guru`
                    : "Menunggu data"}
                </p>
              </div>
            }
            icon={<FaUserFriends />}
            color="green"
            result={animatedTotalTeacherPresence.toString()}
            rstyle="text-4xl mt-4 font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent"
            subtitle={
              <div className="mt-2 text-sm">
                <span className="text-green-600 font-medium">
                  {animatedTotalTeacherPresence > 0
                    ? "✓ Sedang aktif"
                    : "Belum ada data"}
                </span>
              </div>
            }
          />

          <Card
            container="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-indigo-300/30 p-6 flex-1 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
            top="flex justify-between items-center"
            title={
              <div>
                <h3>Total Siswa</h3>
                <p className="text-gray-500 mt-1">Semua siswa terdaftar</p>
              </div>
            }
            icon={<FaUserGraduate />}
            color="indigo"
            result={animatedTotalStudent.toString()}
            rstyle="text-4xl mt-4 font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent"
          />

          <Card
            container="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-blue-300/30 p-6 flex-1 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
            top="flex justify-between items-center"
            title={
              <div>
                <h3>Siswa Hadir Hari Ini</h3>
                <p className="text-gray-500 mt-1">
                  {animatedTotalStudent > 0
                    ? `${Math.round(
                        (animatedTotalStudentPresence / animatedTotalStudent) *
                          100
                      )}% dari total siswa`
                    : "Menunggu data"}
                </p>
              </div>
            }
            icon={<FaUserFriends />}
            color="blue"
            result={animatedTotalStudentPresence.toString()}
            rstyle="text-4xl mt-4 font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent"
            subtitle={
              <div className="mt-2 text-sm">
                <span className="text-blue-600 font-medium">
                  {animatedTotalStudentPresence > 0
                    ? "✓ Proses belajar berlangsung"
                    : "Belum ada data"}
                </span>
              </div>
            }
          />
        </div>
        {/* statsitik kehadiran */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mx-8">
          {/* Attendance Chart Teacher */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">
                Statistik Kehadiran Guru
              </h3>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white"
              >
                <option value="enambulan">6 Bulan Terakhir</option>
                <option value="12bulan">Tahun Ini</option>
              </select>
            </div>
            <div
              className="h-[400px] w-full"
              style={{ minWidth: 0, minHeight: 300 }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceDataGuru}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                  <YAxis
                    stroke="#6B7280"
                    fontSize={12}
                    label={{
                      value: "Persentase (%)",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle" },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="hadir"
                    name="Hadir"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="alpha"
                    name="Tidak Hadir"
                    fill="#EF4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance Chart Student */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">
                Statistik Kehadiran Murid
              </h3>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white"
              >
                <option value="6bulan">6 Bulan Terakhir</option>
                <option value="tahunini">Tahun Ini</option>
              </select>
            </div>
            <div
              className="h-[400px] w-full"
              style={{ minWidth: 0, minHeight: 300 }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                  <YAxis
                    stroke="#6B7280"
                    fontSize={12}
                    label={{
                      value: "Persentase (%)",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle" },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="hadir"
                    name="Hadir"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="alpha"
                    name="Tidak Hadir"
                    fill="#EF4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
