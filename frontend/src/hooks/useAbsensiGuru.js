import { useState, useEffect } from "react";
import { absensiGuru } from "../services/absensiGuru";

export const useAbsensiGuru = () => {
    const [guruList, setGuruList] = useState([]);
    const [absensiToday, setAbsensiToday] = useState([]);
    const [selectedGuru, setSelectedGuru] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitResult, setSubmitResult] = useState(null);

    const loadGuru = async () => {
        try {
            setLoading(true);
            const response = await absensiGuru.getGuruForAbsensi();
            setGuruList(Array.isArray(response) ? response : []);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.[0]?.message || 'Gagal memuat data guru');
            setGuruList([]);
        } finally {
            setLoading(false);
        }
    };

    const loadAbsensiToday = async () => {
        try {
            const response = await absensiGuru.getAbsensiGuruToday();
            setAbsensiToday(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error('Error load absensi guru:', error);
            setAbsensiToday([]);
        }
    };

    const loadGuruWithAbsensi = async () => {
        try {
            setLoading(true);

            const [guruResponse, absensiResponse] = await Promise.all([
                absensiGuru.getGuruForAbsensi(),
                absensiGuru.getAbsensiGuruToday()
            ]);

            const guruData = Array.isArray(guruResponse) ? guruResponse : [];
            const absensiData = Array.isArray(absensiResponse) ? absensiResponse : [];
            setAbsensiToday(absensiData);

            const formattedGuru = guruData.map(guru => {
                const absensi = absensiData.find(a => a.guru_id === guru.guru_id);

                return {
                    ...guru,
                    status: absensi ? absensi.status : '',
                    keterangan: absensi ? absensi.keterangan : '',
                    file: null,
                    fileName: 'Surat Keterangan',
                    sudah_absen: !!absensi,
                    status_display: absensi ? absensi.status : 'Belum Presensi',
                    jam_masuk: absensi ? absensi.jam_masuk : '-'
                };
            });

            setGuruList(formattedGuru);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.[0]?.message || 'Gagal memuat data guru');
            setGuruList([]);
            setAbsensiToday([]);
        } finally {
            setLoading(false);
        }
    };

    // Update status guru
    const updateGuruStatus = (guruIndex, status) => {
        setGuruList(prev => prev.map((guru, index) =>
            index === guruIndex ? { ...guru, status } : guru
        ));
    };

    // Update keterangan guru
    const updateGuruKeterangan = (guruIndex, keterangan) => {
        setGuruList(prev => prev.map((guru, index) =>
            index === guruIndex ? { ...guru, keterangan } : guru
        ));
    };

    // Update file guru
    const updateGuruFile = (guruIndex, file) => {
        setGuruList(prev => prev.map((guru, index) =>
            index === guruIndex ? {
                ...guru,
                file,
                fileName: file ? file.name : 'Surat Keterangan'
            } : guru
        ));
    };

    // Mark selected present
    const markSelectedPresent = () => {
        setGuruList(prev => prev.map(guru =>
            selectedGuru.includes(guru.guru_id)
                ? { ...guru, status: 'Hadir' }
                : guru
        ));
    };

    // Mark selected absent
    const markSelectedAbsent = () => {
        setGuruList(prev => prev.map(guru =>
            selectedGuru.includes(guru.guru_id)
                ? { ...guru, status: 'Tidak Hadir' }
                : guru
        ));
    };

    // Submit absensi
    const submitAbsensi = async (absensiData) => {
        try {
            setLoading(true);
            setSubmitResult(null);

            const result = await absensiGuru.createAbsensiGuru(absensiData);
            setSubmitResult(result);

            return result;
        } catch (error) {
            console.error('error submiting absensi guru', error);

            setSubmitResult({
                success: false,
                message: error.response?.data?.[0]?.message || 'Gagal menyimpan absensi guru'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const clearSubmitResult = () => {
        setSubmitResult(null);
    };

    useEffect(() => {
        loadGuruWithAbsensi();
    }, []);

    return {
        guruList,
        absensiToday,
        selectedGuru,
        setSelectedGuru,
        loading,
        error,
        submitResult,
        updateGuruStatus,
        updateGuruKeterangan,
        updateGuruFile,
        markSelectedPresent,
        markSelectedAbsent,
        submitAbsensi,
        clearSubmitResult,
        refetchGuru: loadGuruWithAbsensi
    };
}