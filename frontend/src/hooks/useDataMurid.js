import { useState, useEffect } from "react";
import { getDataMurid } from "../services/getDataMurid";

export const useDataMurid = () => {
  const [muridList, setMuridList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDataMurid = async () => {
    try {
      setLoading(true);
      const response = await getDataMurid.getMurid();
      setMuridList(Array.isArray(response) ? response : []);
      // console.log("data murid:", response);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.[0]?.message || "Gagal memuat data murid");
      setMuridList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDataMurid();
  }, []);

  return {
    muridList,
    loading,
    error,
    loadDataMurid,
  };
};
