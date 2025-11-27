import { useState, useEffect } from "react";
import { absensiGuru } from "../services/absensiGuru";

export const useAbsensiGuru = () => {
  const [guruList, setGuruList] = useState([]);
  const [absensiToday, setAbsensiToday] = useState([]);
  const [selectedGuru, setSelectedGuru] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isViewingHistory, setIsViewingHistory] = useState(false);

  const formatDateLocal = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`; // hasil = "2025-11-25"
  };

  const loadGuru = async () => {
    try {
      setLoading(true);
      const response = await absensiGuru.getGuruForAbsensi();
      setGuruList(Array.isArray(response) ? response : []);
      //   console.log("data terkirim", response);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.[0]?.message || "Gagal memuat data guru");
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
      console.error("Error load absensi guru:", error);
      setAbsensiToday([]);
    }
  };

  const loadGuruAbsensiByDate = async (date = null) => {
    try {
      setLoading(true);

      const dateString = date
        ? formatDateLocal(date)
        : formatDateLocal(new Date());

      // console.log('[loadGuruAbsensiByDate] Memuat data untuk tanggal:', dateString);

      const [guruResponse, absensiResponse] = await Promise.all([
        absensiGuru.getGuruForAbsensi(),
        absensiGuru.getAbsensiGuruByDate(dateString),
      ]);

      console.log("data guru", guruResponse);
      console.log("data absensi", absensiResponse);

      const guruData = Array.isArray(guruResponse) ? guruResponse : [];
      const absensiData = Array.isArray(absensiResponse) ? absensiResponse : [];

      // console.log('[loadGuruAbsensiByDate] Jumlah guru:', guruData.length);
      // console.log('[loadGuruAbsensiByDate] Jumlah absensi:', absensiData.length);
      // console.log('[loadGuruAbsensiByDate] Data absensi:', absensiData);

      const isToday = dateString === new Date().toISOString().split("T")[0];
      if (isToday) {
        setAbsensiToday(absensiData);
      }

      const formattedGuru = guruData.map((guru) => {
        const absensi = absensiData.find((a) => {
          const isMatch = a.guru_id === guru.guru_id;
          // console.log(`Mapping: ${guru.nama_lengkap} (${guru.guru_id}) -> ${isMatch ? `ABSENSI: ${a.status}` : 'TIDAK ABSEN'}`);
          return isMatch;
        });

        return {
          ...guru,
          status: absensi ? absensi.status : "",
          keterangan: absensi ? absensi.keterangan : "",
          file: null,
          fileName: "Surat Keterangan",
          sudah_absen: !!absensi,
          status_display: absensi ? absensi.status : "Belum Presensi",
          jam_masuk: absensi ? absensi.jam_masuk : "-",
          tanggal_absen: absensi ? absensi.tanggal : null,
        };
      });

      //  console.log('[loadGuruAbsensiByDate] Hasil akhir:', formattedGuru);

      setGuruList(formattedGuru);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.[0]?.message || "Gagal memuat data guru");
      setGuruList([]);
      setAbsensiToday([]);
    } finally {
      setLoading(false);
    }
  };

  const loadGuruWithAbsensi = async () => {
    return loadGuruAbsensiByDate(new Date());
  };

  // Handle perubahan tanggal
  const handleDateChange = (date) => {
    // console.log('[handleDateChange] Tanggal dipilih:', date);
    setSelectedDate(date);

    const today = new Date();
    const isHistory = date.toDateString() !== today.toDateString();
    //  console.log('[handleDateChange] Is viewing history:', isHistory);

    setIsViewingHistory(isHistory);
    loadGuruAbsensiByDate(date);
  };

  // Kembali ke hari ini
  const goToToday = () => {
    const today = new Date();
    // console.log('[goToToday] Kembali ke hari ini');
    setSelectedDate(today);
    setIsViewingHistory(false);
    loadGuruAbsensiByDate(today);
  };

  // Update status guru
  const updateGuruStatus = (guruIndex, status) => {
    if (isViewingHistory) return;

    setGuruList((prev) =>
      prev.map((guru, index) =>
        index === guruIndex ? { ...guru, status } : guru
      )
    );
  };

  // Update keterangan guru
  const updateGuruKeterangan = (guruIndex, keterangan) => {
    if (isViewingHistory) return;

    setGuruList((prev) =>
      prev.map((guru, index) =>
        index === guruIndex ? { ...guru, keterangan } : guru
      )
    );
  };

  // Update file guru
  const updateGuruFile = (guruIndex, file) => {
    if (isViewingHistory) return;

    setGuruList((prev) =>
      prev.map((guru, index) =>
        index === guruIndex
          ? {
              ...guru,
              file,
              fileName: file ? file.name : "Surat Keterangan",
            }
          : guru
      )
    );
  };

  // Mark selected present
  const markSelectedPresent = () => {
    if (isViewingHistory || selectedGuru.length === 0) return;
    setGuruList((prev) =>
      prev.map((guru) =>
        selectedGuru.includes(guru.guru_id)
          ? { ...guru, status: "Hadir" }
          : guru
      )
    );
  };

  // Mark selected absent
  const markSelectedAbsent = () => {
    if (isViewingHistory || selectedGuru.length === 0) return;

    setGuruList((prev) =>
      prev.map((guru) =>
        selectedGuru.includes(guru.guru_id)
          ? { ...guru, status: "Tidak Hadir" }
          : guru
      )
    );
  };

  // Submit absensi
  const submitAbsensi = async (absensiData) => {
    try {
      if (isViewingHistory) {
        throw new Error(
          "Tidak dapat menyimpan absensi untuk tanggal sebelumnya"
        );
      }

      setLoading(true);
      setSubmitResult(null);

      const result = await absensiGuru.createAbsensiGuru(absensiData);
      setSubmitResult(result);

      await loadGuruAbsensiByDate(selectedDate);

      return result;
    } catch (error) {
      console.error("error submiting absensi guru", error);

      setSubmitResult({
        success: false,
        message:
          error.response?.data?.[0]?.message ||
          error.message ||
          "Gagal menyimpan absensi guru",
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
    loadGuruAbsensiByDate(new Date());
  }, []);

  return {
    guruList,
    absensiToday,
    selectedGuru,
    setSelectedGuru,
    loading,
    error,
    submitResult,
    selectedDate,
    isViewingHistory,
    updateGuruStatus: (guruIndex, status) => {
      if (isViewingHistory) return;
      setGuruList((prev) =>
        prev.map((guru, index) =>
          index === guruIndex ? { ...guru, status } : guru
        )
      );
    },
    updateGuruKeterangan: (guruIndex, keterangan) => {
      if (isViewingHistory) return;
      setGuruList((prev) =>
        prev.map((guru, index) =>
          index === guruIndex ? { ...guru, keterangan } : guru
        )
      );
    },
    updateGuruFile: (guruIndex, file) => {
      if (isViewingHistory) return;
      setGuruList((prev) =>
        prev.map((guru, index) =>
          index === guruIndex
            ? {
                ...guru,
                file,
                fileName: file ? file.name : "Surat Keterangan",
              }
            : guru
        )
      );
    },
    markSelectedPresent: () => {
      if (isViewingHistory || selectedGuru.length === 0) return;
      setGuruList((prev) =>
        prev.map((guru) =>
          selectedGuru.includes(guru.guru_id)
            ? { ...guru, status: "Hadir" }
            : guru
        )
      );
    },
    markSelectedAbsent: () => {
      if (isViewingHistory || selectedGuru.length === 0) return;
      setGuruList((prev) =>
        prev.map((guru) =>
          selectedGuru.includes(guru.guru_id)
            ? { ...guru, status: "Tidak Hadir" }
            : guru
        )
      );
    },
    submitAbsensi,
    clearSubmitResult,
    refetchGuru: () => loadGuruAbsensiByDate(selectedDate),
    handleDateChange,
    goToToday,
  };
};
