import { useEffect, useState } from "react";
import { absensiGuru } from "../services/absensiGuru";

export const useAbsensiGuruRange = (startDate = null, endDate = null) => {
  const [isAbsensiGuru, setIsAbsensiGuru] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAbsensi = async () => {
    try {
      setLoading(true);
      const data = await absensiGuru.getAbsensiGuruByRange(startDate, endDate);
      // console.log("range data", data);
      setIsAbsensiGuru(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      setError(error.response.data?.[0]?.message || "Gagal memuat data guru");
      setIsAbsensiGuru([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAbsensi();
  }, [startDate, endDate]);

  return {
    isAbsensiGuru,
    loading,
    error,
    loadAbsensi,
  };
};
