import axiosToken from "../utils/axiosToken";

export const getDataGuru = {
  getGuru: async () => {
    try {
      const response = await axiosToken.get("/guru");
      return response.data[0]?.payload || [];
    } catch (error) {
      console.error("error fetching guru for attendance", error);
      throw error;
    }
  },
  createGuru: async (formData) => {
    try {
      const response = await axiosToken.post("/guru", formData);
      return response.data;
    } catch (error) {
      console.error(error.response?.data?.[0]?.message);
      throw error;
    }
  },
  updateGuru: async (guru_id, formData) => {
    try {
      const response = await axiosToken.put(`/guru/${guru_id}`, formData);
      return response.data;
    } catch (error) {
      console.error("Error updating guru:", error.response?.data);
      throw error;
    }
  },
  deleteGuru: async (guru_id) => {
    try {
      const response = await axiosToken.delete(`/guru/${guru_id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting guru:", error.response?.data);
      throw error;
    }
  },
};
