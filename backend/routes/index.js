const express = require ('express')
const { Register, login, Logout } = require ('../controllers/User')
const {getUser, getKelasWithDetails, getAbsensiGuru, getAbsensiMurid, getGuru, createGuru} = require('../controllers/KelasController')
const {verifyToken} = require ('../middleware/VerifyToken')
const { refreshToken } = require ('../controllers/RefreshToken')
const router = express.Router();


router.get('/users',verifyToken, getUser );
router.get('/token', refreshToken );

router.post('/users', Register );
router.post('/login', login );
router.delete('/logout', Logout );

router.get("/kelas", getKelasWithDetails);
router.get("/guru", getGuru);
router.post("/guru", createGuru);

router.get("/absensi/guru", getAbsensiGuru);
router.get("/absensi/murid", getAbsensiMurid);

module.exports = router
