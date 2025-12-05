import axiosToken from "../utils/axiosToken";

export const getDataAdmin = {
  // GET ALL ADMIN USERS
  getAdmins: async () => {
    try {
      const response = await axiosToken.get("/admin/users");
      console.log("Data admin:", response.data[0]);
      return response.data[0]?.payload || [];
    } catch (error) {
      console.error("Error fetching admin data:", error);
      throw error;
    }
  },

  // GET ADMIN BY ID
  getAdminById: async (user_id) => {
    try {
      const response = await axiosToken.get(`/admin/users/${user_id}`);
      console.log("Detail admin:", response.data[0]);
      return response.data[0]?.payload || null;
    } catch (error) {
      console.error("Error fetching admin detail:", error);
      throw error;
    }
  },

  // CREATE ADMIN USER
  createAdmin: async (formData) => {
    try {
      const response = await axiosToken.post("/admin/users", formData);
      console.log("Admin berhasil dibuat:", response.data[0].message);
      console.log("Data yang di kirim:", response.data);

      return response.data[0];
    } catch (error) {
      console.error(
        "Error creating admin:",
        error.response?.data?.[0]?.message
      );
      throw error;
    }
  },

  // UPDATE ADMIN USER
  updateAdmin: async (user_id, formData) => {
    try {
      console.log("Updating admin:", user_id, formData);
      const response = await axiosToken.put(
        `/admin/users/${user_id}`,
        formData
      );
      console.log("Update response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating admin:", error.response?.data);
      throw error;
    }
  },

  // DELETE ADMIN USER
  deleteAdmin: async (user_id) => {
    try {
      const response = await axiosToken.delete(`/admin/users/${user_id}`);
      console.log("Berhasil hapus admin:", response.data[0].message);
      return response.data[0].message;
    } catch (error) {
      console.error("Error deleting admin:", error.response?.data);
      throw error;
    }
  },

  // UPDATE PASSWORD User
  updateAdminPassword: async (formData) => {
    try {
      const response = await axiosToken.put(
        "/admin/profile/change-password",
        formData
      );
      console.log("Password berhasil diupdate:", response.data[0].message);
      return response.data[0];
    } catch (error) {
      console.error("Error updating password:", error.response?.data);
      throw error;
    }
  },

  // RESET ADMIN PASSWORD (by admin)
  resetAdminPassword: async (user_id, formData) => {
    try {
      const response = await axiosToken.put(
        `/admin/users/${user_id}/reset-password`,
        formData
      );
      console.log("Password berhasil direset:", response.data[0].message);
      return response.data[0];
    } catch (error) {
      console.error("Error resetting password:", error.response?.data);
      throw error;
    }
  },

  // GET ADMIN PROFILE
  getAdminProfile: async () => {
    try {
      const response = await axiosToken.get("/admin/profile");
      console.log("Admin profile:", response.data[0]);
      return response.data[0]?.payload || null;
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      throw error;
    }
  },

  // UPDATE ADMIN PROFILE
  updateAdminProfile: async (formData) => {
    try {
      const response = await axiosToken.put("/admin/profile", formData);
      console.log("Profile berhasil diupdate:", response.data[0].message);
      return response.data[0];
    } catch (error) {
      console.error("Error updating profile:", error.response?.data);
      throw error;
    }
  },
};
