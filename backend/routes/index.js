const express = require ('express')
const { Register, login, Logout } = require ('../controllers/User')
const { getKelasWithDetails, getAbsensiGuru, getAbsensiMurid, createGuru, getGuru, getUser, 
        getMyAbsensiGuru, getAbsensiMuridByGuru, createAbsensiGuru , createAbsensiMurid, getMuridForAbsensi} = require('../controllers/KelasController')
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
router.get('/absensi/guru/my', verifyToken, getMyAbsensiGuru);
router.post('/absensi/guru', verifyToken, createAbsensiGuru);
router.get('/absensi/murid/by-guru', verifyToken, getAbsensiMuridByGuru)
router.post('/absensi/murid', verifyToken, createAbsensiMurid);
router.get('/murid/absensi', verifyToken, getMuridForAbsensi);

// Admin routes
router.get("/kelas", verifyToken, getKelasWithDetails);
router.get("/guru", verifyToken, getGuru);
router.post("/guru", createGuru);
router.get("/absensi/guru", verifyToken, getAbsensiGuru);                // Semua absensi guru (admin)
router.get("/absensi/murid", verifyToken, getAbsensiMurid);              // Semua absensi murid (admin)

module.exports = router
