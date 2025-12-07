import axiosToken from "../utils/axiosToken";

export const absensiGuru = {
  getGuruForAbsensi: async () => {
    try {
      const response = await axiosToken.get("/guru");
      return response.data[0]?.payload || [];
    } catch (error) {
      console.error("error fetching guru for attendance", error);
      throw error;
    }
  },

  getAbsensiGuruToday: async () => {
    try {
      const response = await axiosToken.get("/absensi/guru/hari-ini");
      return response.data[0]?.payload || [];
    } catch (error) {
      console.error("Error fetching absensi guru today:", error);
      throw error;
    }
  },

  getAbsensiGuruByDate: async (tanggal = null) => {
    try {
      const params = {};
      if (tanggal) {
        params.tanggal = tanggal;
      }
      const response = await axiosToken.get("/absensi/guru", { params });
      return response.data[0]?.payload || [];
    } catch (error) {
      console.error("Error fetching absensi guru by date", error);
      throw error;
    }
  },
  getAbsensiGuruByRange: async (startDate = null, endDate = null) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axiosToken.get("/absensi/guru/range", { params });
      return response.data[0]?.payload || [];
    } catch (error) {
      console.error("Error fetching absensi guru by range", error);
      throw error;
    }
  },

  createAbsensiGuru: async (absensiData) => {
    try {
      const response = await axiosToken.post("/absensi/guru/bulk", {
        absensi: absensiData,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating absensi guru:", error);
      throw error;
    }
  },
};
