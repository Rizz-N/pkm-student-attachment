const express = require ('express')
const { Register, login, Logout } = require ('../controllers/User')
const { getKelasWithDetails, getAbsensiGuru, getAbsensiMurid, createGuru, getGuru, getUser
        , createAbsensiMurid, getMuridByKelas,
        createAbsensiGuru
} = require('../controllers/KelasController')
const {verifyToken} = require ('../middleware/VerifyToken')
const { refreshToken } = require ('../controllers/RefreshToken')
const router = express.Router();

// public routes
router.post('/users', Register );
router.post('/login', login );
router.get('/token', refreshToken );

// protected routes
router.get('/users',verifyToken, getUser );
router.delete('/logout', Logout );

// routes absensi guru
router.get("/kelas", verifyToken, getKelasWithDetails);
router.get("/kelas/:kelas_id/murid", verifyToken, getMuridByKelas);  // buat absensi murid oleh guru
router.get("/kelas/:kelas_id/absensi/hari-ini", verifyToken, getAbsensiMurid)
router.post("/absensi/bulk", verifyToken, createAbsensiMurid); // Create absensi
router.post("/absensi/guru/bulk", verifyToken, createAbsensiGuru); // Create absensi guru

// Admin routes
router.get("/kelas", verifyToken, getKelasWithDetails);
router.get("/guru", verifyToken, getGuru);
router.post("/guru", createGuru);
router.get("/absensi/guru", verifyToken, getAbsensiGuru);                // Semua absensi guru (admin)
router.get("/absensi/murid", verifyToken, getAbsensiMurid);              // Semua absensi murid (admin)

module.exports = router
