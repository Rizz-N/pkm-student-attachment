import { getUsers } from "../services/getUsers";
import { useState, useEffect } from "react";

export const useLoginUsers = () => {
  const [isUser, setIsUser] = useState("");
  const [isNip, setIsNip] = useState("");
  const [isAlamat, setIsAlamat] = useState("");
  const [isMataPelajaran, setIsMataPelajaran] = useState("");
  const [isJabatan, setIsJabatan] = useState("");
  const [isJenisKelamin, setIsJenisKelamin] = useState("");
  const [isTanggalLahir, setIsTanggalLahir] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const loadUser = async () => {
    try {
      const dataUser = await getUsers.getUserLogin();
      // console.log('user login', dataUser);
      setIsUser(dataUser.guru.nama_lengkap || "");
      setIsNip(dataUser.guru.nip || "");
      setIsAlamat(dataUser.guru.alamat || "");
      setIsMataPelajaran(dataUser.guru.mata_pelajaran || "");
      setIsJabatan(dataUser.guru.jabatan || "");
      setIsJenisKelamin(dataUser.guru.jenis_kelamin || "");
      setIsTanggalLahir(dataUser.guru.tanggal_lahir || "");
    } catch (error) {
      console.error("Error get Users", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const forceRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    loadUser();

    const handleUserChange = () => {
      console.log("User changed event detected, refreshing data...");
      loadUser();
    };

    window.addEventListener("userChanged", handleUserChange);

    return () => {
      window.removeEventListener("userChanged", handleUserChange);
    };
  }, [refreshTrigger]);
  return {
    isUser,
    isNip,
    isAlamat,
    isJenisKelamin,
    isMataPelajaran,
    isJabatan,
    isTanggalLahir,
    loading,
    error,
    forceRefresh,
  };
};
