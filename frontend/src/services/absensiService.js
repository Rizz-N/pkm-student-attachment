import axiosToken from "../utils/axiosToken";

export const absensiService = {
  getKelasForAbsensi: async () => {
    try {
      const response = await axiosToken.get("/kelas");
      return response.data[0].payload || [];
    } catch (error) {
      console.error("Error fetching kelas for absensi:", error);
      throw error;
    }
  },

  getMuridByKelas: async (kelas_id) => {
    try {
      const response = await axiosToken.get(`/kelas/${kelas_id}/murid`);
      return response.data[0].payload || [];
    } catch (error) {
      console.error("Error fetching murid by kelas:", error);
      throw error;
    }
  },

  getAbsensiMuridByRange: async (
    startDate = null,
    endDate = null,
    page = 1,
    limit = 50
  ) => {
    try {
      const params = { page, limit };

      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axiosToken.get("/absensi/murid/range", { params });
      // console.log("data absensi", response);
      return (
        response.data?.[0]?.payload || {
          records: [],
          totalData: 0,
          totalPage: 0,
          currentPage: page,
        }
      );
    } catch (error) {
      console.error("Error fetching absensi murid by range", error);
      throw error;
    }
  },

  getAllAbsensiMuridByRange: async (startDate, endDate) => {
    try {
      const response = await axiosToken.get("/absensi/murid/range", {
        params: {
          startDate,
          endDate,
          page: 1,
          limit: 999999,
        },
      });
      // console.log("data absensi ", response);

      return response.data[0]?.payload.records || [];
    } catch (error) {
      console.error("Error fetching ALL absensi murid", error);
      throw error;
    }
  },

  getAbsensiToday: async (kelas_id) => {
    try {
      const response = await axiosToken.get(
        `/kelas/${kelas_id}/absensi/hari-ini`
      );
      return response.data[0].payload || [];
    } catch (error) {
      console.error("Error fetching absensi today", error);
      throw error;
    }
  },

  getAbsensiByDate: async (kelas_id, tanggal = null) => {
    try {
      const params = { kelas_id };
      if (tanggal) {
        params.tanggal = tanggal;
      }
      const response = await axiosToken.get("/absensi/murid", { params });
      return response.data[0]?.payload || [];
    } catch (error) {
      console.error("Error fetching absensi murid by date", error);
      throw error;
    }
  },

  createAbsensi: async (absensiData) => {
    try {
      const response = await axiosToken.post("/absensi", absensiData);
      return response.data;
    } catch (error) {
      console.error("Error creating absensi:", error);
      throw error;
    }
  },

  createAbsensiMurid: async (absensiData) => {
    try {
      const response = await axiosToken.post("/absensi/bulk", {
        absensi: absensiData,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating absensi murid", error);
      throw error;
    }
  },
};
