const Kelas = require ('../models/Kelas')
const Guru = require ('../models/Guru')
const Murid = require ('../models/Murid')
const AbsensiGuru = require ('../models/AbsensiGuru')
const AbsensiMurid = require ('../models/AbsensiMurid')
const { fn , col, where, Sequelize } = require ('sequelize')
const response = require ('../config/response')
const Users = require('../models/UserModel')

// buat ambil data user yang login
const getUser = async (req, res) => {
    try {
        const user_id = req.userId;

        const user = await Users.findOne({
            where:{ user_id },
            include:[{
                model : Guru,
                attributes:['nip','nama_lengkap','jenis_kelamin','tanggal_lahir','alamat','no_telepon','email','jabatan','mata_pelajaran','foto_profile','status']
            },{
                model : Murid,
                attributes: [
                    'nis', 'nisn', 'nama_lengkap','jenis_kelamin', 'kelas_id', 'tanggal_lahir','agama', 'alamat', 'no_telepon', 'nama_orangtua', 'no_telepon_orangtua', 'foto_profile', 'tahun_masuk','status'
                ],
                include:[
                    {
                        model: Kelas,
                        as:'kelas',
                        attributes:['kelas_id', 'kode_kelas', 'nama_kelas','wali_kelas_id']
                    }
                ]
            }
        ]
        });

        if(!user){
            return response(404, null, "User tidak ditemukan", res);
        }
        let userData = {
            user_id: user.user_id,
            username: user.username,
            role: user.role,
            user_type: user.user_type,
        };

        if(user.role === 'guru' && user.guru){
            userData.guru = user.guru;
        }else if(user.role === 'murid' && user.murid){
            userData.murid = user.murid;
        }

        response(200, userData, "Memuat Profile user", res)
    } catch (error) {
        console.log(error);
        response(500, null, "Gagal memuat Profile user", res)
    }    
}

// buat ambil data kelas
const getKelasWithDetails = async (req, res) => {
    try {
        const kelas = await Kelas.findAll({
            attributes:[
                'kelas_id',
                'kode_kelas',
                'nama_kelas',
                [Sequelize.literal(`(SELECT COUNT(*) FROM murid WHERE murid.kelas_id = kelas.kelas_id AND murid.status = 'aktif')`), 'jumlah_murid']
            ],
            include:[
                {
                    model: Guru,
                    as: 'walikelas',
                    attributes:['guru_id','nama_lengkap','nip']
                },
                {
                    model: Murid,
                    as: 'muridKelas',
                    attributes:['murid_id','nama_lengkap','nis','jenis_kelamin','status']
                }
            ]
        });
        return response(200, kelas, 'data berhasil dimuat', res);
    } catch (error) {
        console.error('message error',error.message)
        return response(500, null, 'gagal memuat data', res);
    }
}

// buat ambil data absensi semua guru
const getAbsensiGuru = async (req, res) => {
    try {
        const guru = await AbsensiGuru.findAll({
            include:[
                {
                    model: Guru,
                    as: 'guru',
                    attributes:['guru_id','nama_lengkap']
                }
            ]
        });
        return response(200, guru, "memuat data absensi guru", res);
    } catch (error) {
        console.error('error message', error)
        return response(500, null, "gagal memuat data absensi", res);
    }
}

// buat ambil data absensi murid
const getAbsensiMurid = async (req, res) => {
    try {
        const {kelas_id} = req.params;
        const today = new Date().toISOString().split('T')[0];

        const absensi = await AbsensiMurid.findAll({
            where:{
                tanggal: today,
                '$murid.kelas_id$': kelas_id
            },
            include:[{
                model: Murid,
                as: 'murid',
                attributes:['murid_id', 'nis', 'nama_lengkap'],
                where:{
                    status: 'aktif'
                },
                include:[{
                    model : Kelas,
                    as: 'kelas',
                    attributes:['kelas_id', 'nama_kelas']
                }]
            }],
            attributes:['murid_id', 'status', 'keterangan','tanggal']
        });
        return response (200, absensi,'Data Absensi hari ini berhasil dimuat', res);
    } catch (error) {
        console.error('Error', error.message)
        return response (500, null, 'Gagal Memuat data absensi', res);
    }
}; 

// untuk membuat atau input data guru
const createGuru = async (req, res) => {
    const {nip, nama_lengkap, jenis_kelamin, tanggal_lahir, alamat, no_telepon, email, jabatan, mata_pelajaran, foto_profile } = req.body;

    try {
        const existingGuru = await Guru.findOne({where: {nip} });
        if(existingGuru){
            return response(400, null, 'nip sudah terdaftar', res);
        }
        const guru = await Guru.create({
            nip: nip,
            nama_lengkap: nama_lengkap,
            jenis_kelamin: jenis_kelamin,
            tanggal_lahir: tanggal_lahir,
            alamat: alamat,
            no_telepon: no_telepon,
            email: email,
            jabatan: jabatan,
            mata_pelajaran: mata_pelajaran,
            foto_profile: foto_profile,
        })
        return response(201, guru, "Data guru dan akun berhasil di buat", res)
    } catch (error) {
        console.error(error.message);
        return response(500, null, 'gagal menambahkan data guru', res)
    }

}

// buat ambil semua data guru
const getGuru = async (req, res) => {
    try {
        const guru = await Guru.findAll()
        return response(200, guru, 'Memuat data guru', res)
    } catch (error) {
        console.error(error.message)
        return response(500, null, 'Gagal memuat data guru', res)
    }
}

const getMuridByKelas = async (req, res) => {
    try {
        const { kelas_id } = req.params;
        
        const murid = await Murid.findAll({
            where: { 
                kelas_id,
                status: 'aktif' // hanya murid aktif
            },
            attributes: ['murid_id', 'nis', 'nama_lengkap', 'jenis_kelamin', 'status'],
            include: [{
                model: Kelas,
                as: 'kelas',
                attributes: ['kelas_id', 'nama_kelas']
            }]
        });

        return response(200, murid, 'Data murid berhasil dimuat', res);
    } catch (error) {
        console.error('Error:', error.message);
        return response(500, null, 'Gagal memuat data murid', res);
    }
};

const createAbsensiMurid = async (req, res) => {
    try {
        const user_id = req.userId;
        const { absensi } = req.body;

        const guru = await Guru.findOne({
            where: { user_id },
            attributes: ['guru_id', 'nama_lengkap']
        });

        if (!guru) {
            return response(404, null, "Data guru tidak ditemukan", res);
        }

        const today = new Date().toISOString().split('T')[0];
        const now =  new Date();
        
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const jamMasuk = `${hours}:${minutes}:${seconds}`;

        const results = [];
        const alreadyAbsensed = [];

        for (const absensiData of absensi) {
            const { murid_id, status, keterangan, semester } = absensiData;

            const muridExist = await Murid.findOne({
                where: {murid_id},
                include: {
                    model: Kelas,
                    as: 'kelas',
                    attributes:['kelas_id']
                }
            });
            if(!muridExist) continue;

            const checkAbsensi = await AbsensiMurid.findOne({
                where:{
                    murid_id,
                    tanggal: today
                }
            })
            if(checkAbsensi){
                alreadyAbsensed.push({
                    murid_id,
                    nama: muridExist.nama_lengkap
                });
                continue;
            }

            const newData = await AbsensiMurid.create({
                guru_id: guru.guru_id,
                murid_id,
                kelas_id: muridExist.kelas.kelas_id,
                tanggal: today,
                jam_masuk: jamMasuk,
                semester: semester || 'Ganjil',
                status,
                keterangan: keterangan || null
            });

            results.push(newData)
        }

        return response(201,
                        {   guru: guru.nama_lengkap, 
                            berhasil : results, 
                            sudah_absen: alreadyAbsensed
                        }, 
                            alreadyAbsensed.length > 0 
                            ? "Sebagian Murid sudah Pernah absen hari ini" 
                            : "Absensi murid Berhasil di catat" , res);
    } catch (error) {
        console.error("Absensi Error:", error);
        return response(500, null, "Terjadi kesalahan saat mencatat absensi", res);
    }
};

module.exports = {  getKelasWithDetails, getAbsensiGuru, getAbsensiMurid, createGuru, getGuru, getUser, 
                    createAbsensiMurid, getMuridByKelas
};
