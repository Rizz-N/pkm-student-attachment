import { useState, useEffect, Suspense, lazy } from "react";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaClipboardList,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useDataMurid } from "../hooks/useDataMurid";
import { useDataGuru } from "../hooks/useDataGuru";
import { useDataKelas } from "../hooks/useDataKelas";
import { useGetTotal } from "../hooks/useGetTotal";
import { useAbsensiTahunan } from "../hooks/useAbsensiTahunan";
import { useLoading } from "../hooks/useLoading";
import LoadingSpiner from "../components/LoadingSpiner";
const ChartAbsenMurid = lazy(() => import("../components/ChartAbsenMurid"));
const ChartAbsenGuru = lazy(() => import("../components/ChartAbsensiGuru"));

// Komponen StatCard
const StatCard = ({ title, value, icon: Icon, color, change, subtitle }) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    purple: "text-purple-600 bg-purple-100",
    yellow: "text-yellow-600 bg-yellow-100",
    red: "text-red-600 bg-red-100",
    indigo: "text-indigo-600 bg-indigo-100",
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {/* {change && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  change > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {change > 0 ? "↑" : "↓"} {Math.abs(change)}%
              </span>
              <span className="text-xs text-gray-500 ml-2">
                dari bulan lalu
              </span>
            </div>
          )} */}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="text-2xl" />
        </div>
      </div>
    </div>
  );
};

const AdminDash = () => {
  const { muridList, loading, error, loadDataMurid } = useDataMurid();
  const { guruList, loadDataGuru } = useDataGuru();
  const { kelasList, loadDataKelas } = useDataKelas();
  const { total, totalMurid, totalGuruHadir, totalMuridHadir } = useGetTotal();
  const {
    chartData,
    chartDataGuru,
    loading: loadingChart,
    error: errorChart,
  } = useAbsensiTahunan();

  const animatedTotalTeacher = useLoading(total);
  const animatedTotalStudent = useLoading(totalMurid);
  const animatedTotalTeacherPresence = useLoading(totalGuruHadir);
  const animatedTotalStudentPresence = useLoading(totalMuridHadir);

  const [filterYear, setFilterYear] = useState("6bulan");
  const [filterMonth, setFilterMonth] = useState("enambulan");

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    todayAttendance: 0,
  });

  const totalPresent = totalGuruHadir + totalMuridHadir;
  const allTotal = total + totalMurid;

  const todayAttendance =
    allTotal > 0 ? ((totalPresent / allTotal) * 100).toFixed(1) : 0;

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

  const classDistributionData = kelasList.map((k) => ({
    name: k.kode_kelas,
    value: k.jumlah_murid,
  }));

  const COLORS = [
    "#4F46E5",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
  ];

  // Update statistik ketika data murid berubah
  useEffect(() => {
    if (muridList.length > 0) {
      setStats((prevStats) => ({
        ...prevStats,
        totalStudents: muridList.length,

        // Hitung murid aktif
        activeStudents: muridList.filter((m) => m.status === "aktif").length,

        // Hitung berdasarkan kelas
        classesWithStudents: new Set(muridList.map((m) => m.kelas_id)).size,

        // Hitung berdasarkan jenis kelamin
        maleStudents: muridList.filter((m) => m.jenis_kelamin === "laki-laki")
          .length,
        femaleStudents: muridList.filter((m) => m.jenis_kelamin === "perempuan")
          .length,
      }));
    }
  }, [muridList]);

  // Update statistik ketika data guru berubah
  useEffect(() => {
    if (guruList.length > 0) {
      setStats((prevStats) => ({
        ...prevStats,
        totalTeachers: guruList.length,

        // Hitung murid aktif
        activeTeachers: guruList.filter((m) => m.status === "aktif").length,

        // Hitung berdasarkan jenis kelamin
        maleTeachers: guruList.filter((m) => m.jenis_kelamin === "laki-laki")
          .length,
        femaleTeachers: guruList.filter((m) => m.jenis_kelamin === "perempuan")
          .length,
      }));
    }
  }, [guruList]);

  // Fungsi untuk menghitung persentase perubahan
  const calculateChange = (current, previous) => {
    if (previous === 0) return 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  // Jika loading
  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Dashboard Admin
        </h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="ml-4 text-gray-600">Memuat data </p>
        </div>
      </div>
    );
  }

  // Jika error
  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Dashboard Admin
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-600 font-medium">Error: {error}</p>
          <button
            onClick={loadDataMurid}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
        <p className="text-gray-600 mt-2">
          Selamat datang di panel administrasi sekolah
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Murid"
          value={stats.totalStudents.toLocaleString()}
          icon={FaUserGraduate}
          color="indigo"
          change={calculateChange(stats.totalStudents, 1200)}
          subtitle={`${
            muridList.filter((m) => m.status === "aktif").length
          } aktif`}
        />
        <StatCard
          title="Total Guru"
          value={stats.totalTeachers.toLocaleString()}
          icon={FaChalkboardTeacher}
          color="blue"
          change={calculateChange(stats.totalTeachers, 1200)}
          subtitle={`${
            guruList.filter((m) => m.status === "aktif").length
          } aktif`}
        />
        <StatCard
          title="Total Kelas"
          value={kelasList.length}
          icon={FaBook}
          color="purple"
          subtitle={`${kelasList.length} kelas tersedia`}
        />
        <StatCard
          title="Kehadiran Hari Ini"
          value={`${todayAttendance}%`}
          icon={FaClipboardList}
          color="green"
          change={calculateChange(totalPresent, 1200)}
          subtitle={`${totalPresent} hadir dari ${allTotal}`}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Attendance Chart Teacher */}
        <Suspense fallback={<LoadingSpiner />}>
          <ChartAbsenGuru />
        </Suspense>

        {/* Attendance Chart Student */}
        <Suspense fallback={<LoadingSpiner />}>
          <ChartAbsenMurid />
        </Suspense>

        {/* Class Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Distribusi Kelas
          </h3>
          <div className="w-full" style={{ minWidth: 0, minHeight: 300 }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={classDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {classDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
            {classDistributionData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
                <span className="text-sm font-medium text-gray-800 ml-auto">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDash;
