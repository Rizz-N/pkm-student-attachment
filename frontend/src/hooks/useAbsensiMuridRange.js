// hooks/useAbsensiMuridRange.js
import { useState, useEffect } from "react";
import { absensiService } from "../services/absensiService";

export const useAbsensiMuridRange = (
  startDate = null,
  endDate = null,
  initialPage = 1,
  limit = 50
) => {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [totalPage, setTotalPage] = useState(0);
  const [totalData, setTotalData] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAbsensi = async () => {
    try {
      setLoading(true);

      const data = await absensiService.getAbsensiMuridByRange(
        startDate,
        endDate,
        page,
        limit
      );

      setRecords(data.records || []);
      setTotalPage(data.totalPage || 0);
      setTotalData(data.totalData || 0);
      // console.log("Absensi murid range", data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.[0]?.message || "Gagal memuat data");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAbsensi();
  }, [startDate, endDate, page]);

  return {
    records,
    page,
    totalPage,
    totalData,
    loading,
    error,
    setPage,
    loadAbsensi,
  };
};
