import axiosToken from "../utils/axiosToken";

export const getTotal = {
  getTotalGuru: async () => {
    try {
      const response = await axiosToken.get("/guru");
      // console.log('get total guru', response.data[0].payload.length)
      return response.data[0]?.payload || [];
    } catch (error) {
      console.error("error fetching total guru", error);
      throw error;
    }
  },

  getAbsensiGuruToday: async () => {
    try {
      const response = await axiosToken.get("/absensi/guru/hari-ini");
      // console.log('Total guru absen hari ini', response.data[0].payload)
      return response.data[0]?.payload || [];
    } catch (error) {
      console.error("Error fetching absensi guru today:", error);
      throw error;
    }
  },

  getAbsensiMuridToday: async () => {
    try {
      const response = await axiosToken.get("/absensi/murid/hadir");
      // console.log("Total murid hadir", response.data[0]);
      return response.data[0]?.payload || [];
    } catch (error) {
      console.error("Error fetching absensi murid hadir:", error);
      throw error;
    }
  },

  getMuridTotal: async () => {
    try {
      const response = await axiosToken.get("/murid");
      // console.log('Total murid', response.data[0])
      return response.data[0]?.payload || [];
    } catch (error) {
      console.error("Error fetching total murid:", error);
      throw error;
    }
  },
};
