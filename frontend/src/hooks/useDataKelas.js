import { useState, useEffect } from "react";
import { getDataKelas } from "../services/getDataKelas";

export const useDataKelas = () => {
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDataKelas = async () => {
    try {
      setLoading(true);
      const response = await getDataKelas.getKelas();
      setKelasList(Array.isArray(response) ? response : []);
      // console.log("Data kelas:", response);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.[0]?.message || "Gagal memuat data kelas");
      setKelasList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDataKelas();
  }, []);

  return {
    kelasList,
    loading,
    error,
    loadDataKelas,
  };
};
