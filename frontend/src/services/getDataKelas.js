import axiosToken from "../utils/axiosToken";

export const getDataKelas = {
  // GET SEMUA KELAS
  getKelas: async () => {
    try {
      const response = await axiosToken.get("/kelas");
      // console.log("Total kelas:", response.data[0]);
      return response.data[0]?.payload || [];
    } catch (error) {
      console.error("Error fetching total kelas:", error);
      throw error;
    }
  },

  // GET KELAS BY ID
  getKelasById: async (kelas_id) => {
    try {
      const response = await axiosToken.get(`/kelas/${kelas_id}`);
      // console.log("Detail kelas:", response.data[0]);
      return response.data[0]?.payload || null;
    } catch (error) {
      console.error("Error fetching detail kelas:", error);
      throw error;
    }
  },

  // CREATE KELAS BARU
  createKelas: async (formData) => {
    try {
      const response = await axiosToken.post("/kelas", formData);
      // console.log("Kelas berhasil dibuat:", response.data[0].message);
      return response.data[0];
    } catch (error) {
      console.error(
        "Error creating kelas:",
        error.response?.data?.[0]?.message
      );
      throw error;
    }
  },

  // UPDATE KELAS
  updateKelas: async (kelas_id, formData) => {
    try {
      console.log("Updating kelas:", kelas_id, formData);
      const response = await axiosToken.put(`/kelas/${kelas_id}`, formData);
      // console.log("Update response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating kelas:", error.response?.data);
      throw error;
    }
  },

  // DELETE KELAS
  deleteKelas: async (kelas_id) => {
    try {
      const response = await axiosToken.delete(`/kelas/${kelas_id}`);
      // console.log("Berhasil hapus kelas:", response.data[0].message);
      return response.data[0].message;
    } catch (error) {
      console.error("Error deleting kelas:", error.response?.data);
      throw error;
    }
  },

  // GET GURU UNTUK WALI KELAS DROPDOWN
  getGuruForWaliKelas: async () => {
    try {
      const response = await axiosToken.get("/kelas/wali-kelas/guru");
      // console.log("Data guru untuk wali kelas:", response.data[0]);
      return response.data[0]?.payload || {};
    } catch (error) {
      console.error("Error fetching guru for wali kelas:", error);
      throw error;
    }
  },
};
