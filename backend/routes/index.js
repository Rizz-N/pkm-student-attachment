const express = require("express");
const { Register, login, Logout } = require("../controllers/User");
const {
  getAllAdminUsers,
  getAdminUserById,
  createAdminUser,
  updateAdminUser,
  updateAdminPassword,
  resetAdminPassword,
  deleteAdminUser,
  getAdminProfile,
  updateAdminProfile,
  getUser,
  getMuridByKelas,
  getAbsensiMurid,
  getAllMurid,
  getMuridAllPresence,
  getKelasWithDetails,
  getAbsensiMuridByDate,
  createAbsensiMurid,
  createMurid,
  updateMurid,
  updateMuridKelasMassal,
  deleteMurid,
  createGuru,
  getGuru,
  getAbsensiGuru,
  createAbsensiGuru,
  getAbsensiGuruHariIni,
  getAbsenGuruByDate,
  deleteGuru,
  updateGuru,
  getKelasForDropdown,
  getAllKelas,
  getKelasById,
  createKelas,
  updateKelas,
  deleteKelas,
  getGuruForWaliKelas,
  getAbsensiMuridBulanan,
  getAbsensiGuruBulanan,
  getAbsensiMuridTahunan,
  getAbsensiGuruTahunan,
  getDashboardStatistik,
} = require("../controllers/KelasController");
const { verifyToken } = require("../middleware/VerifyToken");
const adminMiddleware = require("../middleware/adminMiddleware");
const { refreshToken } = require("../controllers/RefreshToken");
const router = express.Router();

// public routes
router.post("/users", Register);
router.post("/login", login);
router.get("/token", refreshToken);

// protected routes
router.get("/users", verifyToken, getUser);
router.delete("/logout", Logout);

// routes absensi murid
router.get("/kelas", verifyToken, getKelasWithDetails);
router.get("/kelas/:kelas_id/murid", verifyToken, getMuridByKelas); // buat absensi murid oleh guru
router.get("/kelas/:kelas_id/absensi/hari-ini", verifyToken, getAbsensiMurid);
router.get("/murid", verifyToken, getAllMurid);
router.get("/absensi/murid", verifyToken, getAbsensiMuridByDate);
router.get("/absensi/murid/hadir", verifyToken, getMuridAllPresence);
router.get("/absensi/murid/bulanan", verifyToken, getAbsensiMuridBulanan);
router.get("/absensi/murid/tahunan", verifyToken, getAbsensiMuridTahunan);
router.post("/absensi/bulk", verifyToken, createAbsensiMurid); // Create absensi

// route absensi guru
router.get("/guru", verifyToken, getGuru); // Get semua data guru
router.get("/absensi/guru", verifyToken, getAbsensiGuru); // Get semua absensi guru
router.get("/absensi/guru/hari-ini", verifyToken, getAbsensiGuruHariIni); // Get absensi guru hari ini
router.get("/absensi/guru/tanggal", verifyToken, getAbsenGuruByDate);
router.get("/absensi/guru/bulanan", verifyToken, getAbsensiGuruBulanan);
router.get("/absensi/guru/tahunan", verifyToken, getAbsensiGuruTahunan);
router.post("/absensi/guru/bulk", verifyToken, createAbsensiGuru); // Create absensi guru bulk

// Admin routes
router.post("/guru", verifyToken, createGuru); //Input data guru
router.delete("/guru/:guru_id", verifyToken, deleteGuru);
router.put("/guru/:guru_id", verifyToken, updateGuru); // PUT untuk update full
router.patch("/guru/:guru_id", verifyToken, updateGuru); // PATCH untuk partial update
router.post("/murid", verifyToken, createMurid); //Input data murid
router.delete("/murid/:murid_id", verifyToken, deleteMurid); //delete data murid
router.get("/kelas/dropdown", verifyToken, getKelasForDropdown); //get kelas untuk dropdown
router.put("/murid/:murid_id", verifyToken, updateMurid);
router.patch("/murid/:murid_id", verifyToken, updateMurid);
router.put("/murid/massal/update-kelas", verifyToken, updateMuridKelasMassal);
// admin router kelas
router.get("/kelas", verifyToken, getAllKelas);
router.get("/kelas/:kelas_id", verifyToken, getKelasById);
router.post("/kelas", verifyToken, createKelas);
router.put("/kelas/:kelas_id", verifyToken, updateKelas);
router.delete("/kelas/:kelas_id", verifyToken, deleteKelas);
router.get("/kelas/wali-kelas/guru", verifyToken, getGuruForWaliKelas);

//router admin panel
// Routes untuk Admin Management (hanya bisa diakses oleh admin)
router.get("/admin/users", verifyToken, adminMiddleware, getAllAdminUsers);
router.get(
  "/admin/users/:user_id",
  verifyToken,
  adminMiddleware,
  getAdminUserById
);
router.post("/admin/users", verifyToken, createAdminUser);
router.put(
  "/admin/users/:user_id",
  verifyToken,
  adminMiddleware,
  updateAdminUser
);
router.delete(
  "/admin/users/:user_id",
  verifyToken,
  adminMiddleware,
  deleteAdminUser
);
router.put(
  "/admin/users/:user_id/reset-password",
  verifyToken,
  adminMiddleware,
  resetAdminPassword
);

// Routes untuk Admin Profile (bisa diakses admin untuk dirinya sendiri)
router.get("/admin/profile", verifyToken, getAdminProfile);
router.put("/admin/profile", verifyToken, updateAdminProfile);
router.put("/admin/profile/change-password", verifyToken, updateAdminPassword);

router.get("/dashboard/statistik", verifyToken, getDashboardStatistik);

module.exports = router;
