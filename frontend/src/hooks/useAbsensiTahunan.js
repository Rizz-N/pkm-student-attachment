import { useState, useEffect } from "react";
import { getAbsensiTahunan } from "../services/getAbsensiTahunan";

export const useAbsensiTahunan = () => {
  const [chartData, setChartData] = useState([]);
  const [chartDataTahun, setChartDataTahun] = useState([]);
  const [chartDataGuru, setChartDataGuru] = useState([]);
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

  const loadAbsensiBulananGuru = async () => {
    try {
      setLoading(true);
      const response = await getAbsensiTahunan.getAbsensiGuruBulan();
      const dataGuru = response[0].payload.chart_data;
      const formatedData = dataGuru.map((item) => ({
        month: item.month,
        hadir: item.hadir,
        alpha: item.alpha,
      }));
      setChartDataGuru(formatedData);
      // console.log("Data absensi guru bulanan:", formatedData);
    } catch (error) {
      console.error("Error get absensi guru bulanan:", error);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAbsensiBulananMurid();
    loadAbsensiTanunanMurid();
    loadAbsensiBulananGuru();
  }, []);

  return {
    chartDataTahun,
    chartData,
    chartDataGuru,
    loading,
    error,
    loadAbsensiBulananMurid,
    loadAbsensiTanunanMurid,
    loadAbsensiBulananGuru,
  };
};
