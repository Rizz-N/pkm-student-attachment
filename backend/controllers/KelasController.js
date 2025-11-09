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

        const guru =  await Guru.findOne({
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

const createAbsensiGuru =  async (req, res) => {
    try {
        const user_id = req.user.userId;
        const{status, keterangan} = req.body;

        const guru = await Guru.findOne({
            where:{user_id},
            attributes:['guru_id','nama_lengkap']
        });
        if (!guru){
            return response(400, null, "Data guru tidak ditemukan", res)
        }

        const today = new Date().toISOString().split('T')[0];
        const existingAbsensi = await AbsensiGuru.findOne({
            where:{
                guru_id: guru.guru_id,
                tanggal: today
            }
        });
        if(existingAbsensi){
            return response(400, null, "Anda sudah melakukan absensi", res)
        }

        const absensi = await AbsensiGuru.create({
            guru_id: guru.guru_id,
            tanggal: today,
            jam_masuk: new Date().toTimeString().split(' ')[0],
            status: status || 'Hadir',
            keterangan: keterangan || null
        });
        return response(201, absensi, "Absensi berhasil di catat", res);
    } catch (error) {
        console.error('Erorr create absensi guru'. error);
        return response(500, null, "terjadi kesalahan saat melakukan absensi", res)
    }
}

const getMuridForAbsensi = async (req, res) => {
    try {
        const user_id = req.user.userId

        const guru = await Guru.findOne({
            where:{user_id},
            attributes:['guru_id', 'nama_lengkap', 'mata_pelajaran']
        });

        if(!guru){
            return response(404, null, "data guru tidak di temukan", res);
        }
        const kelas = await Kelas.findAll({
            where:{wali_kelas_id: guru.guru_id},
            include:[{
                model: Murid,
                as: 'muridKelas',
                attributes:['murid_id','nis','nama_lengkap','jenis_kelamin','foto_profile'],
                where:{
                    status: 'aktif'
                },
                required: false
            }]
        });
        return response (200, { guru: guru, kelas: kelas }, "Data murid untuk di absensi berhasil di ambil", res);
    } catch (error) {
        console.error('error get absensi murid', error);
        return response(500, null, "Terjadi kelsalahan saat mengambul data murid", res);
    }
}

// FUNGSI BARU: Create absensi murid oleh guru
const createAbsensiMurid = async (req, res) => {
    try {
        const user_id = req.user.userId;
        const { murid_id, status, keterangan, semester } = req.body;

        // Verifikasi bahwa guru adalah wali kelas dari murid tersebut
        const guru = await Guru.findOne({
            where: { user_id },
            attributes: ['guru_id']
        });

        if (!guru) {
            return response(404, null, "Data guru tidak ditemukan", res);
        }

        // Cari murid dan kelasnya
        const murid = await Murid.findOne({
            where: { murid_id },
            include: [
                {
                    model: Kelas,
                    as: 'kelas',
                    attributes: ['kelas_id', 'wali_kelas_id']
                }
            ]
        });

        if (!murid) {
            return response(404, null, "Data murid tidak ditemukan", res);
        }

        // Cek apakah guru adalah wali kelas dari murid tersebut
        if (murid.kelas.wali_kelas_id !== guru.guru_id) {
            return response(403, null, "Anda tidak memiliki akses untuk mengabsen murid ini", res);
        }

        // Cek apakah sudah absen hari ini
        const today = new Date().toISOString().split('T')[0];
        const existingAbsensi = await AbsensiMurid.findOne({
            where: { 
                murid_id: murid_id,
                tanggal: today
            }
        });

        if (existingAbsensi) {
            return response(400, null, "Murid sudah dilakukan absensi hari ini", res);
        }

        // Buat absensi murid
        const absensi = await AbsensiMurid.create({
            murid_id: murid_id,
            kelas_id: murid.kelas_id,
            tanggal: today,
            jam_masuk: new Date().toTimeString().split(' ')[0],
            semester: semester || 'Ganjil',
            status: status || 'Hadir',
            keterangan: keterangan || null
        });

        return response(201, absensi, "Absensi murid berhasil dicatat", res);

    } catch (error) {
        console.error('Error createAbsensiMurid:', error);
        return response(500, null, "Terjadi kesalahan saat melakukan absensi murid", res);
    }
}

// FUNGSI BARU: Get riwayat absensi murid oleh guru
const getAbsensiMuridByGuru = async (req, res) => {
    try {
        const user_id = req.user.userId;
        
        // Cari guru yang login
        const guru = await Guru.findOne({
            where: { user_id },
            attributes: ['guru_id']
        });

        if (!guru) {
            return response(404, null, "Data guru tidak ditemukan", res);
        }

        // Cari kelas yang diampu guru
        const kelas = await Kelas.findAll({
            where: { wali_kelas_id: guru.guru_id },
            attributes: ['kelas_id']
        });

        const kelasIds = kelas.map(k => k.kelas_id);

        // Ambil absensi murid dari kelas yang diampu guru
        const absensi = await AbsensiMurid.findAll({
            where: {
                kelas_id: kelasIds
            },
            include: [
                {
                    model: Murid,
                    as: 'murid',
                    attributes: ['nama_lengkap', 'nis']
                },
                {
                    model: Kelas,
                    as: 'kelas',
                    attributes: ['nama_kelas', 'kode_kelas']
                }
            ],
            order: [['tanggal', 'DESC'], ['jam_masuk', 'DESC']]
        });

        return response(200, absensi, "Riwayat absensi murid berhasil diambil", res);

    } catch (error) {
        console.error('Error getAbsensiMuridByGuru:', error);
        return response(500, null, "Terjadi kesalahan saat mengambil riwayat absensi", res);
    }
}


module.exports = {  getKelasWithDetails, getAbsensiGuru, getAbsensiMurid, createGuru, getGuru, getUser, 
                    getMyAbsensiGuru, getAbsensiMuridByGuru, createAbsensiGuru , createAbsensiMurid, getMuridForAbsensi};
