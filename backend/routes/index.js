const express = require ('express')
const { Register, login, Logout } = require ('../controllers/User')
const { getUser, 
        getMuridByKelas, getAbsensiMurid, getKelasWithDetails, getAbsensiMuridByDate, createAbsensiMurid, 
        createGuru, getGuru, getAbsensiGuru, createAbsensiGuru, getAbsensiGuruHariIni
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

// routes absensi murid
router.get("/kelas", verifyToken, getKelasWithDetails);
router.get("/kelas/:kelas_id/murid", verifyToken, getMuridByKelas);  // buat absensi murid oleh guru
router.get("/kelas/:kelas_id/absensi/hari-ini", verifyToken, getAbsensiMurid)
router.get("/absensi/murid", verifyToken, getAbsensiMuridByDate)
router.post("/absensi/bulk", verifyToken, createAbsensiMurid); // Create absensi

// route absensi murid
router.get("/guru", verifyToken, getGuru);                            // Get semua data guru
router.get("/absensi/guru", verifyToken, getAbsensiGuru);             // Get semua absensi guru
router.get("/absensi/guru/hari-ini", verifyToken, getAbsensiGuruHariIni); // Get absensi guru hari ini
router.post("/absensi/guru/bulk", verifyToken, createAbsensiGuru);    // Create absensi guru bulk

// Admin routes
router.get("/kelas", verifyToken, getKelasWithDetails);
router.get("/guru", verifyToken, getGuru);
router.post("/guru", createGuru);
router.get("/absensi/guru", verifyToken, getAbsensiGuru);                // Semua absensi guru (admin)
router.get("/absensi/murid", verifyToken, getAbsensiMurid);              // Semua absensi murid (admin)

module.exports = router
