import { absensiGuru } from "../services/absensiGuru";
import { getTotal } from "../services/getTotal";
import { useState, useEffect } from "react";

export const useGetTotal = () => {
    const [total, setTotal] = useState(0);
    const [totalGuruHadir, setTotalGuruHadir] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
          const loadTotal = async () => {
              try {
                  const [totalGuru, dataAbsenGuru] = await Promise.all([
                    getTotal.getTotalGuru(),
                    getTotal.getAbsensiGuruToday()
                  ]);
                  setTotal(totalGuru.length);

                  const guruHadir = Array.isArray(dataAbsenGuru)
                  ? dataAbsenGuru.filter(guru => guru.status === 'Hadir')
                  : 0;
                  // console.log('total guru hadir', guruHadir)
                  setTotalGuruHadir(guruHadir.length);
              } catch (error) {
                  console.error("Error get total Guru", error)
                  setError(error.message);
                  setTotal(0);
                  setTotalGuruHadir(0);
              }finally{
                setLoading(false);
              }
          };
          loadTotal();
      },[]);
    
      return{
        total,
        totalGuruHadir,
        loading,
        error
      }
}