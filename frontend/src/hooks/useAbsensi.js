import { useState, useEffect } from "react";
import { absensiService } from "../services/absensiService";

export const useAbsensi = () => {
    const [kelasList, setKelasList] = useState([]);
    const [selectedKelas, setSelectedKelas] = useState('');
    const [muridList, setMuridList] = useState([]);
    const [absensiToday, setAbsensiToday ] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitResult, setSubmitResult] = useState(null);

    const loadKelas = async () => {
        try {
            setLoading(true);
            const response = await absensiService.getKelasForAbsensi();
            setKelasList(Array.isArray(response) ? response : []);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.[0]?.message || 'Gagal memuat data kelas');
            setKelasList([]);
        } finally {
            setLoading(false);
        }
    };

    const loadAbsensiToday = async (kelas_id) => {
      if(!kelas_id){
      setAbsensiToday([]);
      return;
      }

      try {
        const response = await absensiService.getAbsensiToday(kelas_id);
        setAbsensiToday(Array.isArray(response)? response : []);
      } catch (error) {
        console.error('error load absensi:', error );
        setAbsensiToday([]);
      }
    };

    const loadMuridByKelas = async (kelas_id) => {
        if (!kelas_id){
            setMuridList([]);
            return;
        }

        try {
            setLoading(true);

            const [muridResponse, absensiResponse] = await Promise.all([
              absensiService.getMuridByKelas(kelas_id),
              absensiService.getAbsensiToday(kelas_id)
            ]);
            const muridData = Array.isArray(muridResponse)? muridResponse : [];
            const absensiData = Array.isArray(absensiResponse)? absensiResponse :[];
            setAbsensiToday(absensiData);

            const formatedMurid = muridData.map(murid => {
              const absensi = absensiData.find(a => a.murid_id === murid.murid_id);

              return{
                ...murid,
                status: absensi? absensi.status : '',
                keterangan: absensi ? absensi.keterangan : '',
                file: null,
                fileName: 'surat Keterangan',
                sudah_absen: !!absensi,
                status_display: absensi ? absensi.status : 'Belum Presensi'
              };
            });
            setMuridList(formatedMurid);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.[0]?.message || 'Gagal memuat data murid');
            setMuridList([]);
            setAbsensiToday([]);
        } finally {
            setLoading(false);
        }
    };

      // Update status murid
    const updateMuridStatus = (muridIndex, status) => {
        setMuridList(prev => prev.map((murid, index) => 
        index === muridIndex ? { ...murid, status } : murid
        ));
    };

    // Update keterangan murid
    const updateMuridKeterangan = (muridIndex, keterangan) => {
        setMuridList(prev => prev.map((murid, index) => 
        index === muridIndex ? { ...murid, keterangan } : murid
        ));
    };

    // Update file murid
    const updateMuridFile = (muridIndex, file) => {
        setMuridList(prev => prev.map((murid, index) => 
            index === muridIndex ? {
                ...murid, 
                file, 
                fileName: file ? file.name : 'Surat keterangan'
            } : murid
        ));
    };

    // mark selected present students
    const markSelectedPresent = () => {
        setMuridList(prev => prev.map(murid => 
            selectedStudents.includes(murid.murid_id)
            ? { ...murid, status: 'Hadir' }
            : murid
        ));
    };
    
    // mark selected absent students
    const markSelectedAbsent = () => {
        setMuridList(prev => prev.map(murid => 
            selectedStudents.includes(murid.murid_id)
            ? { ...murid, status: 'Alpha' }
            : murid
        ));
    };

    const submitAbsensi =  async (absensiData) => {
      try {
        setLoading(true)
        setSubmitResult(null)

        const result = await absensiService.createAbsensiMurid(absensiData);
        setSubmitResult(result)

        return result;
      } catch (error) {
        console.error('Error submitting absensi:', error);
            setSubmitResult({
                success: false,
                message: error.response?.data?.[0]?.message || 'Gagal menyimpan absensi'
            });
            throw error;
      } finally{
        setLoading(false);
      }
    };

    const clearSubmitResult = () =>{
      setSubmitResult(null);
    };

  useEffect(() => {
    loadKelas();
  }, []);

  useEffect(() => {
    if (selectedKelas) {
      loadMuridByKelas(selectedKelas);
    } else {
      setMuridList([]);
    }
  }, [selectedKelas]);

  return {
    kelasList,
    selectedKelas,
    setSelectedKelas,
    selectedStudents,
    setSelectedStudents,
    muridList,
    absensiToday,
    loading,
    error,
    submitResult,
    updateMuridStatus,
    updateMuridKeterangan,
    updateMuridFile,
    markSelectedPresent,
    markSelectedAbsent,
    submitAbsensi,
    clearSubmitResult,
    refetchKelas: loadKelas,
    refetchMurid: () => loadMuridByKelas(selectedKelas)
  };
}