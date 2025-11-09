const Kelas = require ('../models/Kelas')
const Guru = require ('../models/Guru')
const Murid = require ('../models/Murid')
const AbsensiGuru = require ('../models/AbsensiGuru')
const AbsensiMurid = require ('../models/AbsensiMurid')
const { fn , col, where } = require ('sequelize')
const response = require ('../config/response')
const Users = require('../models/UserModel')

// buat ambil data user yang login
const getUser = async (req, res) => {
    try {
        const user_id = req.user.userId;

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
                [fn('COUNT', col('muridKelas.murid_id')), 'total_murid']
            ],
            include:[
                {
                    model: Guru,
                    as: 'walikelas',
                    attributes:[]
                },
                {
                    model: Murid,
                    as: 'muridKelas',
                    attributes:[]
                }
            ],
            group: ['kelas.kelas_id','walikelas.guru_id']
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
        const absensi = await AbsensiMurid.findAll({
            include:[
                {model: Murid,
                    as: 'murid',
                    attributes:[
                        'nama_lengkap','nis', 'nisn'
                    ]
                },
                {model: Kelas,
                    as: 'kelas',
                    attributes:[
                        'nama_kelas','kode_kelas'
                    ]
                }
            ],
            order: [['tanggal','DESC']]
        });
        return response (200, absensi, "Memuat Data absensi murid", res)
    } catch (error) {
        console.log('error message', error.message)
        return response (500, null, "gagal memuat data absensi", res)
    }
} 

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

// buat ambil data absensi guru yang login
const getMyAbsensiGuru = async (req,res) => {
    try {
        const user_id = req.user.userId

        const guru =  await guru.findOne({
            where:{user_id},
            attributes:['guru_id','nama_lengkap']
        });
        if(!guru){
            return response(404, null, "data guru tidak di temukan", res);
        }

        const absensi = await AbsensiGuru.findAll({
            where:{guru_id: guru.guru_id},
            order:[['tanggal', 'DESC'],['jam_masuk','DESC']],
            include:[{
                model: Guru,
                as: 'guru',
                attributes: ['nama_lengkap', 'mata_pelajaran']
            }]
        });
        return response(200, {guru: guru.nama_lengkap, absensi: absensi}, "Absensi guru di ambil", res)
    } catch (error) {
        console.error('Error my absensi', error);
        return response(500, null,"terjadi kesalahan saat mengambil absen", res);
    }
}


module.exports = {getKelasWithDetails, getAbsensiGuru, getAbsensiMurid, createGuru, getGuru, getUser, getMyAbsensiGuru};
