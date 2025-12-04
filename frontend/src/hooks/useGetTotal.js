import { absensiGuru } from "../services/absensiGuru";
import { getTotal } from "../services/getTotal";
import { useState, useEffect } from "react";

export const useGetTotal = () => {
  const [total, setTotal] = useState(0);
  const [totalMurid, setTotalMurid] = useState(0);
  const [totalGuruHadir, setTotalGuruHadir] = useState(0);
  const [totalMuridHadir, setTotalMuridHadir] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTotal = async () => {
      try {
        const [totalGuru, dataAbsenGuru, dataAbsenMurid, totalMurid] =
          await Promise.all([
            getTotal.getTotalGuru(),
            getTotal.getAbsensiGuruToday(),
            getTotal.getAbsensiMuridToday(),
            getTotal.getMuridTotal(),
          ]);
        setTotal(totalGuru.length);
        // console.log('Total murid sekolah', totalMurid.length)
        setTotalMurid(totalMurid.length);

        const guruHadir = Array.isArray(dataAbsenGuru)
          ? dataAbsenGuru.filter((guru) => guru.status === "Hadir")
          : 0;
        // console.log("total guru hadir", guruHadir);
        setTotalGuruHadir(guruHadir.length);

        const muridHadir = Array.isArray(dataAbsenMurid)
          ? dataAbsenMurid.filter((murid) => murid.status === "Hadir")
          : 0;
        // console.log("Total murid hadir", muridHadir);
        setTotalMuridHadir(muridHadir.length);
      } catch (error) {
        console.error("Error get total Guru", error);
        setError(error.message);
        setTotal(0);
        setTotalGuruHadir(0);
      } finally {
        setLoading(false);
      }
    };
    loadTotal();
  }, []);

  return {
    total,
    totalMurid,
    totalGuruHadir,
    totalMuridHadir,
    loading,
    error,
  };
};
