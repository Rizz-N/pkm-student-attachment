import axiosToken from "../utils/axiosToken";

export const getAbsensiTahunan = {
  // GET absensi murid
  getAbsensiMuridBulan: async () => {
    try {
      const response = await axiosToken.get("/absensi/murid/bulanan");
      // console.log("Data absensi:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching absensi murid bulanan:", error);
      throw error;
    }
  },

  // GET absensi tahun
  getAbsensiMuridTahun: async () => {
    try {
      const response = await axiosToken.get("/absensi/murid/tahunan");
      // console.log("Data absensi murid tahunan:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching absensi murid tahunan:", error);
      throw error;
    }
  },
};
