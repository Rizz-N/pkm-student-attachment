import { useState, useEffect } from "react";
import { getAbsensiTahunan } from "../services/getAbsensiTahunan";

export const useAbsensiTahunan = () => {
  const [chartData, setChartData] = useState([]);
  const [chartDataTahun, setChartDataTahun] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAbsensiBulananMurid = async () => {
    try {
      setLoading(true);
      const response = await getAbsensiTahunan.getAbsensiMuridBulan();
      const data = response[0].payload.chart_data_1_tahun;
      const formatted = data.map((item) => ({
        month: item.bulan,
        hadir: item.hadir,
        alpha: item.alpha,
      }));
      setChartData(formatted);
      // console.log("Data absen murid bulanan:", response[0].payload);
      // console.log("data bulanan:", formatted);
      setError(null);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAbsensiTanunanMurid = async () => {
    try {
      setLoading(true);
      const response = await getAbsensiTahunan.getAbsensiMuridTahun();

      const dataTahun = response[0].payload.total_tahunan;
      const formattedTahun = [
        {
          month: "Tahun Ini",
          hadir: dataTahun.hadir,
          alpha: dataTahun.alpha,
        },
      ];
      setChartDataTahun(formattedTahun);
      // console.log("data tahunan:", formattedTahun);
      // console.log("data tahun", response[0].payload);
    } catch (error) {
      console.error("error load absensi tahunan", error);
    }
  };

  useEffect(() => {
    loadAbsensiBulananMurid();
    loadAbsensiTanunanMurid();
  }, []);

  return {
    chartDataTahun,
    chartData,
    loading,
    error,
    loadAbsensiBulananMurid,
    loadAbsensiTanunanMurid,
  };
};
