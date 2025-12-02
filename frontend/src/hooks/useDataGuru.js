import { useState, useEffect } from "react";
import { getDataGuru } from "../services/getDataGuru";

export const useDataGuru = () => {
  const [guruList, setGuruList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDataGuru = async () => {
    try {
      setLoading(true);
      const response = await getDataGuru.getGuru();
      setGuruList(Array.isArray(response) ? response : []);
      // console.log("data terkirim:", response);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.[0]?.message || "Gagal memuat data guru");
      setGuruList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDataGuru();
  }, []);

  return {
    guruList,
    loading,
    error,
    loadDataGuru,
  };
};
