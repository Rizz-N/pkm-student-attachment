import axiosToken from "../utils/axiosToken";

export const getDataMurid = {
  getMurid: async () => {
    try {
      const response = await axiosToken.get("/murid");
      // console.log("Total murid", response.data[0]);
      return response.data[0]?.payload || [];
    } catch (error) {
      console.error("Error fetching total murid:", error);
      throw error;
    }
  },
  getMuridPage: async (page = 1, limit = 25) => {
    try {
      const response = await axiosToken.get("/murid/page", {
        params: { page, limit },
      });
      // console.log("Total murid", response.data[0]);
      return response.data[0]?.payload || [];
    } catch (error) {
      console.error("Error fetching total murid:", error);
      throw error;
    }
  },
  createMurid: async (formData) => {
    try {
      const response = await axiosToken.post("/murid", formData);
      // console.log("Data yang di kiim:", response.data[0].message);
      return response.data[0].message;
    } catch (error) {
      console.error(error.response?.data?.[0]?.message);
      throw error;
    }
  },
  createMurid: async (formData) => {
    try {
      const response = await axiosToken.post("/murid", formData);
      // console.log("Data yang di kiim:", response.data[0].message);
      return response.data[0].message;
    } catch (error) {
      console.error(error.response?.data?.[0]?.message);
      throw error;
    }
  },

  updateMurid: async (murid_id, formData) => {
    try {
      // console.log("Updating murid:", murid_id, formData);
      const response = await axiosToken.put(`/murid/${murid_id}`, formData);
      // console.log("Update response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating murid:", error.response?.data);
      throw error;
    }
  },

  updateMuridKelasMassal: async (murid_ids, kelas_id) => {
    try {
      // console.log("Mass update kelas:", { murid_ids, kelas_id });
      const response = await axiosToken.put("/murid/massal/update-kelas", {
        murid_ids,
        kelas_id,
      });
      // console.log("Mass update response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error mass update kelas:", error.response?.data);
      throw error;
    }
  },

  deleteMurid: async (murid_id) => {
    try {
      const response = await axiosToken.delete(`/murid/${murid_id}`);
      // console.log("Berhasil hapus:", response.data[0].message);
      return response.data[0].message;
    } catch (error) {
      console.error("Error deleting guru:", error.response?.data);
      throw error;
    }
  },
};
