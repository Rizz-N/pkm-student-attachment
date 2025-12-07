import React, { useState, useMemo, memo } from "react";
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
import { useAbsensiTahunan } from "../hooks/useAbsensiTahunan";

const ChartAbsenMurid = memo(() => {
  const { chartData } = useAbsensiTahunan();
  const [filterYear, setFilterYear] = useState("6bulan");

  // Optimasi: Memoize data yang difilter
  const attendanceData = useMemo(() => {
    if (filterYear === "6bulan") {
      return chartData?.slice(-6) || [];
    }
    return chartData || [];
  }, [chartData, filterYear]);

  // Optimasi: Tentukan jumlah baris maksimum
  const maxBarSize = useMemo(() => {
    const count = attendanceData.length;
    if (count <= 6) return 40;
    if (count <= 12) return 30;
    return 20;
  }, [attendanceData.length]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">
            Statistik Kehadiran Murid
          </h3>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white"
            disabled
          >
            <option value="6bulan">6 Bulan Terakhir</option>
            <option value="tahunini">Tahun Ini</option>
          </select>
        </div>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-gray-500">Data tidak tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          Statistik Kehadiran Murid
        </h3>
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-gray-400 transition-colors"
        >
          <option value="6bulan">6 Bulan Terakhir</option>
          <option value="tahunini">Tahun Ini</option>
        </select>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={attendanceData}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            barSize={maxBarSize}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="#6B7280"
              fontSize={11}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={11}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "12px",
                padding: "8px",
              }}
              formatter={(value) => [`${value}%`, "Persentase"]}
              labelFormatter={(label) => `Bulan: ${label}`}
            />
            <Legend
              wrapperStyle={{
                fontSize: "12px",
                paddingTop: "10px",
              }}
            />
            <Bar
              dataKey="hadir"
              name="Hadir"
              fill="#10B981"
              radius={[2, 2, 0, 0]}
              isAnimationActive={false}
            />
            <Bar
              dataKey="alpha"
              name="Tidak Hadir"
              fill="#EF4444"
              radius={[2, 2, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

ChartAbsenMurid.displayName = "ChartAbsenMurid";

export default ChartAbsenMurid;
