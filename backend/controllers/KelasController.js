const Kelas = require("../models/Kelas");
const Guru = require("../models/Guru");
const Murid = require("../models/Murid");
const AbsensiGuru = require("../models/AbsensiGuru");
const AbsensiMurid = require("../models/AbsensiMurid");
const { fn, col, where, Sequelize } = require("sequelize");
const response = require("../config/response");
const Users = require("../models/UserModel");
const moment = require("moment-timezone");

// buat ambil data user yang login
const getUser = async (req, res) => {
  try {
    const user_id = req.userId;

    const user = await Users.findOne({
      where: { user_id },
      include: [
        {
          model: Guru,
          attributes: [
            "nip",
            "nama_lengkap",
            "jenis_kelamin",
            "tanggal_lahir",
            "alamat",
            "no_telepon",
            "email",
            "jabatan",
            "mata_pelajaran",
            "foto_profile",
            "status",
          ],
          include: [
            {
              model: Kelas,
              as: "kelasDibimbing",
              attributes: [
                "kelas_id",
                "kode_kelas",
                "nama_kelas",
                "wali_kelas_id",
              ],
            },
          ],
        },
        {
          model: Murid,
          attributes: [
            "nis",
            "nisn",
            "nama_lengkap",
            "jenis_kelamin",
            "kelas_id",
            "tanggal_lahir",
            "agama",
            "alamat",
            "no_telepon",
            "nama_orangtua",
            "no_telepon_orangtua",
            "foto_profile",
            "tahun_masuk",
            "status",
          ],
          include: [
            {
              model: Kelas,
              as: "kelas",
              attributes: [
                "kelas_id",
                "kode_kelas",
                "nama_kelas",
                "wali_kelas_id",
              ],
            },
          ],
        },
      ],
    });

    if (!user) {
      return response(404, null, "User tidak ditemukan", res);
    }
    let userData = {
      user_id: user.user_id,
      username: user.username,
      role: user.role,
      user_type: user.user_type,
    };

    if (user.role === "guru" && user.guru) {
      userData.guru = user.guru;
    } else if (user.role === "murid" && user.murid) {
      userData.murid = user.murid;
    }

    response(200, userData, "Memuat Profile user", res);
  } catch (error) {
    console.log(error);
    response(500, null, "Gagal memuat Profile user", res);
  }
};

// buat ambil data kelas
const getKelasWithDetails = async (req, res) => {
  try {
    const kelas = await Kelas.findAll({
      attributes: [
        "kelas_id",
        "kode_kelas",
        "nama_kelas",
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM murid WHERE murid.kelas_id = kelas.kelas_id AND murid.status = 'aktif')`
          ),
          "jumlah_murid",
        ],
      ],
      include: [
        {
          model: Guru,
          as: "walikelas",
          attributes: ["guru_id", "nama_lengkap", "nip"],
        },
        {
          model: Murid,
          as: "muridKelas",
          attributes: [
            "murid_id",
            "nama_lengkap",
            "nis",
            "jenis_kelamin",
            "status",
          ],
        },
      ],
    });
    return response(200, kelas, "data berhasil dimuat", res);
  } catch (error) {
    console.error("message error", error.message);
    return response(500, null, "gagal memuat data", res);
  }
};

// buat ambil data absensi murid
const getAbsensiMurid = async (req, res) => {
  try {
    const { kelas_id } = req.params;
    const today = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");

    const absensi = await AbsensiMurid.findAll({
      tanggal: today,
      where: {
        "$murid.kelas_id$": kelas_id,
      },
      include: [
        {
          model: Murid,
          as: "murid",
          attributes: ["murid_id", "nis", "nama_lengkap"],
          where: {
            status: "aktif",
          },
          include: [
            {
              model: Kelas,
              as: "kelas",
              attributes: ["kelas_id", "nama_kelas"],
            },
          ],
        },
      ],
      attributes: ["murid_id", "status", "keterangan", "tanggal"],
    });
    return response(200, absensi, "Data Absensi hari ini berhasil dimuat", res);
  } catch (error) {
    console.error("Error", error.message);
    return response(500, null, "Gagal Memuat data absensi", res);
  }
};

// ambil data semua murid
const getAllMurid = async (req, res) => {
  try {
    const murid = await Murid.findAll({
      where: {
        status: "aktif",
      },
      attributes: [
        "murid_id",
        "nis",
        "nisn",
        "nama_lengkap",
        "jenis_kelamin",
        "kelas_id",
        "tanggal_lahir",
        "agama",
        "alamat",
        "no_telepon",
        "nama_orangtua",
        "no_telepon_orangtua",
        "foto_profile",
        "tahun_masuk",
        "status",
      ],
      include: [
        {
          model: Kelas,
          as: "kelas",
          attributes: ["kelas_id", "kode_kelas", "nama_kelas"],
        },
      ],
      order: [
        ["kelas_id", "ASC"],
        ["nama_lengkap", "ASC"],
      ],
    });

    return response(200, murid, "Semua data murid berhasil dimuat", res);
  } catch (error) {
    console.error("Error getAllMurid:", error.message);
    return response(500, null, "Gagal memuat semua data murid", res);
  }
};

// ambil data semua murid yang hadir
const getMuridAllPresence = async (req, res) => {
  try {
    const { tanggal } = req.query;
    const targetDate =
      tanggal || moment().tz("Asia/Jakarta").format("YYYY-MM-DD");

    const muridHadir = await AbsensiMurid.findAll({
      where: {
        tanggal: targetDate,
        status: "hadir",
      },
      include: [
        {
          model: Murid,
          as: "murid",
          attributes: [
            "murid_id",
            "nis",
            "nama_lengkap",
            "jenis_kelamin",
            "kelas_id",
          ],
          include: [
            {
              model: Kelas,
              as: "kelas",
              attributes: ["kelas_id", "nama_kelas"],
            },
          ],
        },
      ],
      attributes: ["murid_id", "status", "keterangan", "tanggal", "jam_masuk"],
      order: [[{ model: Murid, as: "murid" }, "kelas_id", "ASC"]],
    });
    return response(
      200,
      muridHadir,
      `Data murid hadir tanggal ${targetDate} berhasil dimuat`,
      res
    );
  } catch (error) {
    console.error("Error getMuridAllPresence:", error.message);
    return response(500, null, "Gagal memuat data murid hadir", res);
  }
};

const getMuridByKelas = async (req, res) => {
  try {
    const { kelas_id } = req.params;

    const murid = await Murid.findAll({
      where: {
        kelas_id,
        status: "aktif", // hanya murid aktif
      },
      attributes: [
        "murid_id",
        "nis",
        "nama_lengkap",
        "jenis_kelamin",
        "status",
      ],
      include: [
        {
          model: Kelas,
          as: "kelas",
          attributes: ["kelas_id", "nama_kelas"],
        },
      ],
    });

    return response(200, murid, "Data murid berhasil dimuat", res);
  } catch (error) {
    console.error("Error:", error.message);
    return response(500, null, "Gagal memuat data murid", res);
  }
};

const getAbsensiMuridByDate = async (req, res) => {
  try {
    const { kelas_id, tanggal } = req.query;
    const whereClause = {};

    if (kelas_id) {
      whereClause["$murid.kelas_id$"] = kelas_id;
    }

    // Jika tidak ada tanggal, default ke hari ini
    const targetDate =
      tanggal || moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
    whereClause.tanggal = targetDate;

    const absensi = await AbsensiMurid.findAll({
      where: whereClause,
      include: [
        {
          model: Murid,
          as: "murid",
          attributes: ["murid_id", "nis", "nama_lengkap", "jenis_kelamin"],
          where: {
            status: "aktif",
          },
          include: [
            {
              model: Kelas,
              as: "kelas",
              attributes: ["kelas_id", "nama_kelas"],
            },
          ],
        },
      ],
      attributes: ["murid_id", "status", "keterangan", "tanggal", "jam_masuk"],
    });

    return response(
      200,
      absensi,
      `Data absensi tanggal ${targetDate} berhasil dimuat`,
      res
    );
  } catch (error) {
    console.error("Error getAbsensiMuridByDate:", error.message);
    return response(500, null, "Gagal memuat data absensi", res);
  }
};

const createAbsensiMurid = async (req, res) => {
  try {
    const user_id = req.userId;
    const { absensi } = req.body;

    const guru = await Guru.findOne({
      where: { user_id },
      attributes: ["guru_id", "nama_lengkap"],
    });

    if (!guru) {
      return response(404, null, "Data guru tidak ditemukan", res);
    }

    const now = moment().tz("Asia/Jakarta");
    const today = now.format("YYYY-MM-DD");
    const jamMasuk = now.format("HH:mm:ss");

    const results = [];
    const alreadyAbsensed = [];
    const notFoundMurid = [];

    for (const absensiData of absensi) {
      const { murid_id, status, keterangan, semester } = absensiData;

      const muridExist = await Murid.findOne({
        where: { murid_id },
        include: {
          model: Kelas,
          as: "kelas",
          attributes: ["kelas_id"],
        },
      });
      if (!muridExist) {
        notFoundMurid.push({ murid_id });
        continue;
      }

      const checkAbsensi = await AbsensiMurid.findOne({
        where: {
          murid_id,
          tanggal: today,
        },
      });

      if (checkAbsensi) {
        alreadyAbsensed.push({
          murid_id,
          nama: muridExist.nama_lengkap,
        });
        continue;
      }

      const newData = await AbsensiMurid.create({
        guru_id: guru.guru_id,
        murid_id,
        kelas_id: muridExist.kelas.kelas_id,
        tanggal: today,
        jam_masuk: jamMasuk,
        semester: semester || "Ganjil",
        status,
        keterangan: keterangan || null,
      });

      results.push({
        murid_id: newData.murid_id,
        nama: muridExist.nama_lengkap,
        status: newData.status,
        jam_masuk: newData.jam_masuk,
      });
    }

    const responseData = {
      guru: guru.nama_lengkap,
      tanggal: today,
      total_data: absensi.length,
      berhasil_dicatat: results.length,
      sudah_absen: alreadyAbsensed.length,
      murid_tidak_ditemukan: notFoundMurid.length,
      detail: {
        berhasil: results,
        sudah_absen: alreadyAbsensed,
        tidak_ditemukan: notFoundMurid,
      },
    };

    let message = "Absensi murid berhasil di catat";

    if (alreadyAbsensed.length > 0) {
      message = `Sebagian murid sudah absen hari ini. ${results.length} berhasil dicatat, ${alreadyAbsensed.length} sudah absen.`;
    }

    if (results.length === 0 && alreadyAbsensed.length === 0) {
      message = "Tidak ada data absensi yang berhasil diproses";
    }

    return response(201, responseData, message, res);
  } catch (error) {
    console.error("Absensi Error:", error);
    return response(500, null, "Terjadi kesalahan saat mencatat absensi", res);
  }
};

// untuk membuat atau input data guru
const createGuru = async (req, res) => {
  console.log("=== BACKEND DEBUG: CREATE GURU ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  const {
    nip,
    nama_lengkap,
    jenis_kelamin,
    tanggal_lahir,
    alamat,
    no_telepon,
    email,
    jabatan,
    mata_pelajaran,
    foto_profile,
  } = req.body;

  try {
    console.log("🔍 Checking existing guru dengan NIP:", nip);
    const existingGuru = await Guru.findOne({ where: { nip } });
    if (existingGuru) {
      console.log("❌ NIP sudah terdaftar:", nip);
      return response(400, null, "nip sudah terdaftar", res);
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
    });
    return response(201, guru, "Data guru dan akun berhasil di buat", res);
  } catch (error) {
    console.error(error.message);
    return response(500, null, "gagal menambahkan data guru", res);
  }
};

// buat ambil semua data guru
const getGuru = async (req, res) => {
  try {
    const guru = await Guru.findAll({
      attributes: [
        "guru_id",
        "nip",
        "nama_lengkap",
        "jenis_kelamin",
        "tanggal_lahir",
        "alamat",
        "no_telepon",
        "email",
        "jabatan",
        "mata_pelajaran",
        "status",
      ],
      include: [
        {
          model: Kelas,
          as: "kelasDibimbing",
          attributes: ["kelas_id", "kode_kelas", "nama_kelas", "wali_kelas_id"],
        },
      ],
    });
    return response(200, guru, "Memuat data guru", res);
  } catch (error) {
    console.error("error get guru", error.message);
    return response(500, null, "Gagal memuat data guru", res);
  }
};

// buat ambil data absensi semua guru
const getAbsensiGuru = async (req, res) => {
  try {
    const { tanggal } = req.query;
    const targetDate =
      tanggal || moment().tz("Asia/Jakarta").format("YYYY-MM-DD");

    const absensiGuru = await AbsensiGuru.findAll({
      where: { tanggal: targetDate },
      include: [
        {
          model: Guru,
          as: "guru",
          attributes: ["guru_id", "nama_lengkap", "nip", "jabatan"],
        },
        {
          model: Guru,
          as: "guruPiket",
          attributes: ["guru_id", "nama_lengkap"],
          foreignKey: "guru_piket_id",
        },
      ],
      order: [
        ["tanggal", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    return response(200, absensiGuru, "Memuat data absensi guru", res);
  } catch (error) {
    console.error("error get absensi guru", error.message);
    return response(500, null, "gagal memuat data absensi guru", res);
  }
};

// buat ambil data absensi guru hari ini
const getAbsensiGuruHariIni = async (req, res) => {
  try {
    const today = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");

    const absensiGuru = await AbsensiGuru.findAll({
      where: { tanggal: today },
      include: [
        {
          model: Guru,
          as: "guru",
          attributes: ["guru_id", "nama_lengkap", "nip", "jabatan"],
        },
        {
          model: Guru,
          as: "guruPiket",
          attributes: ["guru_id", "nama_lengkap"],
          foreignKey: "guru_piket_id",
        },
      ],
    });

    return response(200, absensiGuru, "Memuat data absensi guru hari ini", res);
  } catch (error) {
    console.error("Error getAbsensiGuruHariIni:", error);
    return response(500, null, "Gagal memuat data absensi guru hari ini", res);
  }
};

const getAbsenGuruByDate = async (req, res) => {
  try {
    const { tanggal } = req.query;
    const whereClause = {};

    const targetDate =
      tanggal || moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
    whereClause.tanggal = targetDate;

    const absensi = await AbsensiGuru.findAll({
      where: whereClause,
      include: [
        {
          model: Guru,
          as: "guru",
          attributes: ["guru_id", "nama_lengkap", "nip", "jabatan"],
          where: {
            status: "aktif",
          },
        },
        {
          model: Guru,
          as: "guruPiket",
          attributes: ["guru_id", "nama_lengkap"],
          foreignKey: "guru_piket_id",
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return response(
      200,
      absensi,
      `Data absensi tanggal ${targetDate} berhasil dimuat`,
      res
    );
  } catch (error) {
    console.error("Error getAbsensiGuruByDate", error.message);
    return response(500, null, "Gagal memuat data absensi", res);
  }
};

const createAbsensiGuru = async (req, res) => {
  try {
    const user_id = req.userId;
    const { absensi } = req.body;

    if (!absensi || !Array.isArray(absensi) || absensi.length === 0) {
      return response(400, null, "Data absensi tidak valid", res);
    }

    const guruPiket = await Guru.findOne({
      where: { user_id },
      attributes: ["guru_id", "nama_lengkap"],
    });

    if (!guruPiket) {
      return response(404, null, "Akun guru piket tidak di temukan", res);
    }

    const now = moment().tz("Asia/Jakarta");
    const today = now.format("YYYY-MM-DD");
    const jamMasuk = now.format("HH:mm:ss");

    const results = [];
    const alreadyAbsensed = [];
    const notFoundGuru = [];

    for (const absensiData of absensi) {
      const { guru_id, status, keterangan } = absensiData;

      if (!guru_id || !status) {
        continue;
      }

      const guruExist = await Guru.findOne({
        where: { guru_id },
        attributes: ["guru_id", "nama_lengkap"],
      });
      if (!guruExist) {
        notFoundGuru.push({ guru_id });
        continue;
      }

      const checkAbsensi = await AbsensiGuru.findOne({
        where: {
          guru_id,
          tanggal: today,
        },
      });

      if (checkAbsensi) {
        alreadyAbsensed.push({
          guru_id,
          nama: guruExist.nama_lengkap,
          absensi_id: checkAbsensi.id,
        });
        continue;
      }

      const newData = await AbsensiGuru.create({
        guru_id,
        tanggal: today,
        jam_masuk: jamMasuk,
        status,
        keterangan: keterangan || null,
        guru_piket_id: guruPiket.guru_id,
      });
      results.push({
        absensi_id: newData.id,
        guru_id: newData.guru_id,
        nama: guruExist.nama_lengkap,
        status: newData.status,
        jam_masuk: newData.jam_masuk,
      });
    }

    const responseData = {
      guru_piket: guruPiket.nama_lengkap,
      tanggal: today,
      total_data: absensi.length,
      berhasil_dicatat: results.length,
      sudah_absen: alreadyAbsensed.length,
      guru_tidak_ditemukan: notFoundGuru.length,
      detail: {
        berhasil: results,
        sudah_absen: alreadyAbsensed,
        tidak_ditemukan: notFoundGuru,
      },
    };

    let message = "absensi guru berhasil dicatat";
    if (alreadyAbsensed.length > 0) {
      message = `Sebagian guru sudah absen hari ini. ${results.length} berhasil dicatat, ${alreadyAbsensed.length} sudah absen.`;
    }
    if (results.length == 0 && alreadyAbsensed.length === 0) {
      message = "Tidak ada data absensi yang berhasil diproses";
    }
    return response(201, responseData, message, res);
  } catch (error) {
    console.error("Absensi Guru Error:", error);
    return response(
      500,
      null,
      "Terjadi kesalahan saat mencatat absensi guru",
      res
    );
  }
};

const deleteGuru = async (req, res) => {
  try {
    const { guru_id } = req.params;
    console.log("=== BACKEND DEBUG: DELETE GURU ===");
    console.log("Guru ID yang akan dihapus:", guru_id);
    // 1. Cari data guru beserta user_id-nya
    const guru = await Guru.findOne({
      where: { guru_id },
      attributes: ["guru_id", "user_id", "nama_lengkap"],
    });

    if (!guru) {
      console.log("Guru tidak ditemukan");
      return response(404, null, "Data guru tidak ditemukan", res);
    }

    // 2. Hapus data guru (akan trigger cascade ke user karena relasi onDelete: 'CASCADE')
    await guru.destroy();

    // 3. Jika user_id ada, hapus juga user
    if (guru.user_id) {
      await Users.destroy({
        where: { user_id: guru.user_id },
      });
      console.log("User berhasil dihapus bersama guru");
    }

    console.log("Guru berhasil dihapus:", guru.nama_lengkap);
    return response(
      200,
      null,
      `Data guru ${guru.nama_lengkap} berhasil dihapus`,
      res
    );
  } catch (error) {
    console.error("Error delete guru:", error.message);
    return response(500, null, "Gagal menghapus data guru", res);
  }
};

const updateGuru = async (req, res) => {
  console.log("=== BACKEND DEBUG: UPDATE GURU ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  const { guru_id } = req.params;
  const {
    nip,
    nama_lengkap,
    jenis_kelamin,
    tanggal_lahir,
    alamat,
    no_telepon,
    email,
    jabatan,
    mata_pelajaran,
    foto_profile,
    status,
  } = req.body;

  try {
    console.log("🔍 Mencari guru dengan ID:", guru_id);

    // Cari guru berdasarkan ID
    const guru = await Guru.findOne({
      where: { guru_id },
    });

    if (!guru) {
      console.log("Guru tidak ditemukan");
      return response(404, null, "Data guru tidak ditemukan", res);
    }

    // Cek jika NIP diubah dan sudah digunakan oleh guru lain
    if (nip && nip !== guru.nip) {
      const existingNip = await Guru.findOne({
        where: { nip },
      });

      if (existingNip && existingNip.guru_id !== parseInt(guru_id)) {
        console.log("NIP sudah digunakan oleh guru lain");
        return response(400, null, "NIP sudah digunakan oleh guru lain", res);
      }
    }

    // Update data guru
    const updateData = {};

    if (nip !== undefined) updateData.nip = nip;
    if (nama_lengkap !== undefined) updateData.nama_lengkap = nama_lengkap;
    if (jenis_kelamin !== undefined) updateData.jenis_kelamin = jenis_kelamin;
    if (tanggal_lahir !== undefined) updateData.tanggal_lahir = tanggal_lahir;
    if (alamat !== undefined) updateData.alamat = alamat;
    if (no_telepon !== undefined) updateData.no_telepon = no_telepon;
    if (email !== undefined) updateData.email = email;
    if (jabatan !== undefined) updateData.jabatan = jabatan;
    if (mata_pelajaran !== undefined)
      updateData.mata_pelajaran = mata_pelajaran;
    if (foto_profile !== undefined) updateData.foto_profile = foto_profile;
    if (status !== undefined) updateData.status = status;

    console.log("Data yang akan diupdate:", updateData);

    // Lakukan update
    await guru.update(updateData);

    console.log("Guru berhasil diupdate:", guru.nama_lengkap);

    // Ambil data terbaru dengan relasi
    const updatedGuru = await Guru.findOne({
      where: { guru_id },
      attributes: [
        "guru_id",
        "nip",
        "nama_lengkap",
        "jenis_kelamin",
        "tanggal_lahir",
        "alamat",
        "no_telepon",
        "email",
        "jabatan",
        "mata_pelajaran",
        "foto_profile",
        "status",
      ],
      include: [
        {
          model: Kelas,
          as: "kelasDibimbing",
          attributes: ["kelas_id", "kode_kelas", "nama_kelas", "wali_kelas_id"],
        },
      ],
    });

    return response(200, updatedGuru, "Data guru berhasil diperbarui", res);
  } catch (error) {
    console.error("Error update guru:", error.message);
    return response(500, null, "Gagal memperbarui data guru", res);
  }
};

module.exports = {
  getUser,
  getMuridByKelas,
  getAllMurid,
  getAbsensiMurid,
  getMuridAllPresence,
  getKelasWithDetails,
  getAbsensiMuridByDate,
  createAbsensiMurid,
  createGuru,
  getGuru,
  getAbsensiGuru,
  createAbsensiGuru,
  getAbsensiGuruHariIni,
  getAbsenGuruByDate,
  deleteGuru,
  updateGuru,
};
