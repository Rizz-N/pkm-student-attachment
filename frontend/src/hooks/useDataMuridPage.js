import { useState, useEffect } from "react";
import { getDataMurid } from "../services/getDataMurid";

export const useDataMuridPage = () => {
  const [muridListPage, setMuridListPage] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDataMurid = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const response = await getDataMurid.getMuridPage(pageNumber, 25);
      // Response dari backend berisi: { total, totalPages, currentPage, data }
      setTotalPages(response.totalPages || 1);
      setPage(response.currentPage || pageNumber);
      setMuridListPage(response.data || []);
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
    loadDataMurid(page);
  }, [page]);

  return {
    muridListPage,
    loading,
    error,
    page,
    totalPages,
    setPage,
    loadDataMurid,
  };
};
