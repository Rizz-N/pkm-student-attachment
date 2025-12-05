const Kelas = require("../models/Kelas");
const Guru = require("../models/Guru");
const Murid = require("../models/Murid");
const AbsensiGuru = require("../models/AbsensiGuru");
const AbsensiMurid = require("../models/AbsensiMurid");
const { fn, col, where, Op, Sequelize } = require("sequelize");
const response = require("../config/response");
const Users = require("../models/UserModel");
const moment = require("moment-timezone");
const bcrypt = require("bcrypt");

// GET ALL ADMIN USERS
const getAllAdminUsers = async (req, res) => {
  try {
    console.log("🔍 Mengambil semua data admin users");

    const adminUsers = await Users.findAll({
      where: {
        role: "admin",
      },
      attributes: [
        "user_id",
        "username",
        "role",
        "user_type",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    console.log("Data admin berhasil diambil:", adminUsers.length, "admin");
    return response(200, adminUsers, "Data admin berhasil diambil", res);
  } catch (error) {
    console.error("Error get all admin users:", error.message);
    return response(500, null, "Gagal memuat data admin", res);
  }
};

// GET ADMIN USER BY ID
const getAdminUserById = async (req, res) => {
  try {
    const { user_id } = req.params;

    console.log("Mengambil data admin dengan ID:", user_id);

    const adminUser = await Users.findOne({
      where: {
        user_id,
        role: "admin",
      },
      attributes: [
        "user_id",
        "username",
        "role",
        "user_type",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!adminUser) {
      console.log("Admin tidak ditemukan");
      return response(404, null, "Data admin tidak ditemukan", res);
    }

    console.log("Admin ditemukan:", adminUser.username);
    return response(200, adminUser, "Data admin berhasil diambil", res);
  } catch (error) {
    console.error("Error get admin by ID:", error.message);
    return response(500, null, "Gagal memuat data admin", res);
  }
};

// CREATE NEW ADMIN USER
const createAdminUser = async (req, res) => {
  console.log("=== BACKEND DEBUG: CREATE ADMIN USER ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  const { username, password } = req.body;

  try {
    // Validasi input
    if (!username || !password) {
      return response(400, null, "Username dan password wajib diisi", res);
    }

    if (password.length < 6) {
      return response(400, null, "Password minimal 6 karakter", res);
    }

    // Cek username sudah digunakan
    const existingUser = await Users.findOne({
      where: { username },
    });

    if (existingUser) {
      console.log("Username sudah digunakan");
      return response(400, null, "Username sudah digunakan", res);
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // Buat user admin baru
    const newAdminUser = await Users.create({
      username,
      password: hashPassword,
      role: "admin", // Set role langsung ke admin
      user_type: null, // Admin tidak punya user_type
    });

    // Ambil data tanpa password
    const adminData = await Users.findOne({
      where: { user_id: newAdminUser.user_id },
      attributes: [
        "user_id",
        "username",
        "role",
        "user_type",
        "createdAt",
        "updatedAt",
      ],
    });

    console.log("Admin user berhasil dibuat:", adminData.username);
    return response(201, adminData, "Admin berhasil dibuat", res);
  } catch (error) {
    console.error("Error create admin user:", error.message);

    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((err) => err.message);
      return response(400, null, messages.join(", "), res);
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return response(400, null, "Username sudah terdaftar", res);
    }

    return response(500, null, "Gagal membuat admin", res);
  }
};

// UPDATE ADMIN USER (username only, not password)
const updateAdminUser = async (req, res) => {
  console.log("=== BACKEND DEBUG: UPDATE ADMIN USER ===");
  console.log("Request params:", req.params);
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  const { user_id } = req.params;
  const { username } = req.body;

  try {
    // Cari admin berdasarkan ID
    const adminUser = await Users.findOne({
      where: {
        user_id,
        role: "admin",
      },
    });

    if (!adminUser) {
      console.log("Admin tidak ditemukan");
      return response(404, null, "Data admin tidak ditemukan", res);
    }

    // Validasi jika username diubah
    if (username && username !== adminUser.username) {
      // Cek username sudah digunakan oleh user lain
      const existingUsername = await Users.findOne({
        where: {
          username,
          user_id: { [Op.ne]: user_id }, // Tidak termasuk user saat ini
        },
      });

      if (existingUsername) {
        console.log("Username sudah digunakan oleh user lain");
        return response(400, null, "Username sudah digunakan", res);
      }
    }

    // Update data
    const updateData = {};
    if (username !== undefined) updateData.username = username;

    console.log("Data yang akan diupdate:", updateData);

    // Lakukan update
    await adminUser.update(updateData);

    // Ambil data terbaru tanpa password
    const updatedAdmin = await Users.findOne({
      where: { user_id },
      attributes: [
        "user_id",
        "username",
        "role",
        "user_type",
        "createdAt",
        "updatedAt",
      ],
    });

    console.log("Admin berhasil diupdate:", updatedAdmin.username);
    return response(200, updatedAdmin, "Data admin berhasil diperbarui", res);
  } catch (error) {
    console.error("Error update admin user:", error.message);

    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((err) => err.message);
      return response(400, null, messages.join(", "), res);
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return response(400, null, "Username sudah terdaftar", res);
    }

    return response(500, null, "Gagal memperbarui data admin", res);
  }
};

// UPDATE ADMIN PASSWORD
const updateAdminPassword = async (req, res) => {
  console.log("=== BACKEND DEBUG: UPDATE ADMIN PASSWORD ===");
  console.log("Request params:", req.params);
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  const { user_id } = req.params;
  const { current_password, new_password, confirm_password } = req.body;

  try {
    // Validasi input
    if (!current_password || !new_password || !confirm_password) {
      return response(
        400,
        null,
        "Password saat ini, password baru, dan konfirmasi password wajib diisi",
        res
      );
    }

    if (new_password.length < 6) {
      return response(400, null, "Password baru minimal 6 karakter", res);
    }

    if (new_password !== confirm_password) {
      return response(
        400,
        null,
        "Password baru dan konfirmasi password tidak cocok",
        res
      );
    }

    if (new_password === current_password) {
      return response(
        400,
        null,
        "Password baru harus berbeda dengan password saat ini",
        res
      );
    }

    // Cari admin berdasarkan ID
    const adminUser = await Users.findOne({
      where: {
        user_id,
        role: "admin",
      },
    });

    if (!adminUser) {
      console.log("❌ Admin tidak ditemukan");
      return response(404, null, "Data admin tidak ditemukan", res);
    }

    // Verifikasi password saat ini
    const isPasswordValid = await bcrypt.compare(
      current_password,
      adminUser.password
    );
    if (!isPasswordValid) {
      console.log("❌ Password saat ini salah");
      return response(400, null, "Password saat ini salah", res);
    }

    // Hash password baru
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(new_password, salt);

    // Update password
    await adminUser.update({ password: hashPassword });

    console.log("✅ Password admin berhasil diupdate:", adminUser.username);
    return response(200, null, "Password berhasil diperbarui", res);
  } catch (error) {
    console.error("❌ Error update admin password:", error.message);
    return response(500, null, "Gagal memperbarui password", res);
  }
};

// RESET ADMIN PASSWORD (by admin/super admin, tanpa verifikasi password lama)
const resetAdminPassword = async (req, res) => {
  console.log("=== BACKEND DEBUG: RESET ADMIN PASSWORD ===");
  console.log("Request params:", req.params);
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  const { user_id } = req.params;
  const { new_password, confirm_password } = req.body;

  try {
    // Validasi input
    if (!new_password || !confirm_password) {
      return response(
        400,
        null,
        "Password baru dan konfirmasi password wajib diisi",
        res
      );
    }

    if (new_password.length < 6) {
      return response(400, null, "Password minimal 6 karakter", res);
    }

    if (new_password !== confirm_password) {
      return response(
        400,
        null,
        "Password dan konfirmasi password tidak cocok",
        res
      );
    }

    // Cari admin berdasarkan ID
    const adminUser = await Users.findOne({
      where: {
        user_id,
        role: "admin",
      },
    });

    if (!adminUser) {
      console.log("❌ Admin tidak ditemukan");
      return response(404, null, "Data admin tidak ditemukan", res);
    }

    // Hash password baru
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(new_password, salt);

    // Update password
    await adminUser.update({ password: hashPassword });

    console.log("✅ Password admin berhasil direset:", adminUser.username);
    return response(200, null, "Password berhasil direset", res);
  } catch (error) {
    console.error("❌ Error reset admin password:", error.message);
    return response(500, null, "Gagal mereset password", res);
  }
};

// DELETE ADMIN USER
const deleteAdminUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    console.log("=== BACKEND DEBUG: DELETE ADMIN USER ===");
    console.log("Admin ID yang akan dihapus:", user_id);

    // Cari admin berdasarkan ID
    const adminUser = await Users.findOne({
      where: {
        user_id,
        role: "admin",
      },
    });

    if (!adminUser) {
      console.log("❌ Admin tidak ditemukan");
      return response(404, null, "Data admin tidak ditemukan", res);
    }

    // Cek apakah ini user yang sedang login (tidak boleh hapus diri sendiri)
    const currentUserId = req.userId; // Asumsi user_id dari middleware auth
    if (parseInt(user_id) === parseInt(currentUserId)) {
      console.log("❌ Tidak dapat menghapus akun sendiri");
      return response(400, null, "Tidak dapat menghapus akun sendiri", res);
    }

    // Hapus admin user
    await adminUser.destroy();
    console.log("✅ Admin berhasil dihapus:", adminUser.username);

    return response(
      200,
      null,
      `Admin ${adminUser.username} berhasil dihapus`,
      res
    );
  } catch (error) {
    console.error("❌ Error delete admin user:", error.message);
    return response(500, null, "Gagal menghapus admin", res);
  }
};

// GET ADMIN PROFILE (untuk user yang sedang login)
const getAdminProfile = async (req, res) => {
  try {
    const user_id = req.userId;

    console.log("🔍 Mengambil profile admin:", user_id);

    const adminProfile = await Users.findOne({
      where: {
        user_id,
        role: "admin",
      },
      attributes: [
        "user_id",
        "username",
        "role",
        "user_type",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!adminProfile) {
      console.log("❌ Admin profile tidak ditemukan");
      return response(404, null, "Profile admin tidak ditemukan", res);
    }

    console.log("✅ Admin profile berhasil diambil:", adminProfile.username);
    return response(200, adminProfile, "Profile admin berhasil diambil", res);
  } catch (error) {
    console.error("❌ Error get admin profile:", error.message);
    return response(500, null, "Gagal memuat profile admin", res);
  }
};

// UPDATE ADMIN PROFILE (username only)
const updateAdminProfile = async (req, res) => {
  console.log("=== BACKEND DEBUG: UPDATE ADMIN PROFILE ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  const user_id = req.userId;
  const { username } = req.body;

  try {
    // Cari admin berdasarkan ID
    const adminUser = await Users.findOne({
      where: {
        user_id,
        role: "admin",
      },
    });

    if (!adminUser) {
      console.log("❌ Admin tidak ditemukan");
      return response(404, null, "Data admin tidak ditemukan", res);
    }

    // Validasi jika username diubah
    if (username && username !== adminUser.username) {
      // Cek username sudah digunakan oleh user lain
      const existingUsername = await Users.findOne({
        where: {
          username,
          user_id: { [Op.ne]: user_id },
        },
      });

      if (existingUsername) {
        console.log("❌ Username sudah digunakan");
        return response(400, null, "Username sudah digunakan", res);
      }
    }

    // Update data
    const updateData = {};
    if (username !== undefined) updateData.username = username;

    console.log("📝 Data yang akan diupdate:", updateData);

    // Lakukan update
    await adminUser.update(updateData);

    // Ambil data terbaru tanpa password
    const updatedProfile = await Users.findOne({
      where: { user_id },
      attributes: [
        "user_id",
        "username",
        "role",
        "user_type",
        "createdAt",
        "updatedAt",
      ],
    });

    console.log("✅ Admin profile berhasil diupdate:", updatedProfile.username);
    return response(200, updatedProfile, "Profile berhasil diperbarui", res);
  } catch (error) {
    console.error("❌ Error update admin profile:", error.message);

    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((err) => err.message);
      return response(400, null, messages.join(", "), res);
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return response(400, null, "Username sudah terdaftar", res);
    }

    return response(500, null, "Gagal memperbarui profile", res);
  }
};

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

    // Validate refreshToken exists in DB to prevent returning stale user data after logout
    if (!user.refresh_token) {
      return response(401, null, "Session telah berakhir, silakan login kembali", res);
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

// create murid
const createMurid = async (req, res) => {
  console.log("=== CREATE MURID ===");
  console.log("Request:", req.body);

  const {
    nis,
    nisn,
    nama_lengkap,
    jenis_kelamin,
    kelas_id,
    tanggal_lahir,
    agama,
    alamat,
    no_telepon,
    nama_orangtua,
    no_telepon_orangtua,
    foto_profile,
    tahun_masuk,
    status = "aktif",
  } = req.body;

  try {
    if (!nis || !nama_lengkap || !jenis_kelamin) {
      return response(
        400,
        null,
        "NIS, Nama Lengkap, dan Jenis Kelamin wajib diisi",
        res
      );
    }

    const existingNis = await Murid.findOne({ where: { nis } });
    if (existingNis) {
      return response(400, null, "NIS sudah terdaftar", res);
    }

    if (nisn) {
      const existingNisn = await Murid.findOne({ where: { nisn } });
      if (existingNisn) {
        return response(400, null, "NISN sudah terdaftar", res);
      }
    }

    if (kelas_id) {
      const kelasExist = await Kelas.findOne({ where: { kelas_id } });
      if (!kelasExist) {
        return response(400, null, "Kelas tidak ditemukan", res);
      }
    }

    const muridData = {
      nis,
      nisn: nisn || null,
      nama_lengkap,
      jenis_kelamin,
      kelas_id: kelas_id || null,
      tanggal_lahir: tanggal_lahir || null,
      agama: agama || null,
      alamat: alamat || null,
      no_telepon: no_telepon || null,
      nama_orangtua: nama_orangtua || null,
      no_telepon_orangtua: no_telepon_orangtua || null,
      foto_profile: foto_profile || null,
      tahun_masuk: tahun_masuk || new Date().getFullYear().toString(),
      status,
    };

    console.log("Data yang dikirim ke DB:", muridData);

    const created = await Murid.create(muridData);

    const muridDetail = await Murid.findOne({
      where: { murid_id: created.murid_id },
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
    });

    return response(201, muridDetail, "Data murid berhasil dibuat", res);
  } catch (error) {
    console.error("Error create murid:", error);

    // Error validasi Sequelize
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message);
      return response(400, null, messages.join(", "), res);
    }

    // Error unik (unique constraint)
    if (error.name === "SequelizeUniqueConstraintError") {
      return response(400, null, "NIS atau NISN sudah terdaftar", res);
    }

    return response(500, null, "Gagal menambahkan data murid", res);
  }
};

const updateMurid = async (req, res) => {
  console.log("=== BACKEND DEBUG: UPDATE MURID ===");
  console.log("Request params:", req.params);
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  const { murid_id } = req.params;
  const {
    nis,
    nisn,
    nama_lengkap,
    jenis_kelamin,
    kelas_id,
    tanggal_lahir,
    agama,
    alamat,
    no_telepon,
    nama_orangtua,
    no_telepon_orangtua,
    foto_profile,
    tahun_masuk,
    status,
  } = req.body;

  try {
    console.log("🔍 Mencari murid dengan ID:", murid_id);

    // Cari murid berdasarkan ID
    const murid = await Murid.findOne({
      where: { murid_id },
    });

    if (!murid) {
      console.log("❌ Murid tidak ditemukan");
      return response(404, null, "Data murid tidak ditemukan", res);
    }

    // Cek jika NIS diubah dan sudah digunakan oleh murid lain
    if (nis && nis !== murid.nis) {
      const existingNis = await Murid.findOne({
        where: { nis },
      });

      if (existingNis && existingNis.murid_id !== parseInt(murid_id)) {
        console.log("❌ NIS sudah digunakan oleh murid lain");
        return response(400, null, "NIS sudah digunakan oleh murid lain", res);
      }
    }

    // Cek jika NISN diubah dan sudah digunakan oleh murid lain
    if (nisn && nisn !== murid.nisn) {
      const existingNisn = await Murid.findOne({
        where: { nisn },
      });

      if (existingNisn && existingNisn.murid_id !== parseInt(murid_id)) {
        console.log("❌ NISN sudah digunakan oleh murid lain");
        return response(400, null, "NISN sudah digunakan oleh murid lain", res);
      }
    }

    // Validasi kelas_id jika diisi
    if (kelas_id !== undefined) {
      if (kelas_id) {
        const kelasExist = await Kelas.findOne({
          where: { kelas_id },
        });

        if (!kelasExist) {
          console.log("❌ Kelas tidak ditemukan dengan ID:", kelas_id);
          return response(400, null, "Kelas tidak ditemukan", res);
        }
      }
    }

    // Update data
    const updateData = {};
    if (nis !== undefined) updateData.nis = nis;
    if (nisn !== undefined) updateData.nisn = nisn;
    if (nama_lengkap !== undefined) updateData.nama_lengkap = nama_lengkap;
    if (jenis_kelamin !== undefined) updateData.jenis_kelamin = jenis_kelamin;
    if (kelas_id !== undefined) updateData.kelas_id = kelas_id || null;
    if (tanggal_lahir !== undefined) updateData.tanggal_lahir = tanggal_lahir;
    if (agama !== undefined) updateData.agama = agama;
    if (alamat !== undefined) updateData.alamat = alamat;
    if (no_telepon !== undefined) updateData.no_telepon = no_telepon;
    if (nama_orangtua !== undefined) updateData.nama_orangtua = nama_orangtua;
    if (no_telepon_orangtua !== undefined)
      updateData.no_telepon_orangtua = no_telepon_orangtua;
    if (foto_profile !== undefined) updateData.foto_profile = foto_profile;
    if (tahun_masuk !== undefined) updateData.tahun_masuk = tahun_masuk;
    if (status !== undefined) updateData.status = status;

    console.log("📝 Data yang akan diupdate:", updateData);

    // Lakukan update
    await murid.update(updateData);

    // Dapatkan data terbaru dengan relasi
    const updatedMurid = await Murid.findOne({
      where: { murid_id },
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
          required: false,
        },
      ],
    });

    console.log("✅ Murid berhasil diupdate:", updatedMurid.nama_lengkap);

    return response(200, updatedMurid, "Data murid berhasil diperbarui", res);
  } catch (error) {
    console.error("❌ Error update murid:", error.message);
    console.error("Error details:", error);

    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((err) => err.message);
      return response(400, null, messages.join(", "), res);
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return response(
        400,
        null,
        "Data dengan NIS/NISN tersebut sudah terdaftar",
        res
      );
    }

    return response(500, null, "Gagal memperbarui data murid", res);
  }
};

const updateMuridKelasMassal = async (req, res) => {
  console.log("=== BACKEND DEBUG: UPDATE MURID KELAS MASSAL ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  const { murid_ids, kelas_id } = req.body;

  try {
    // Validasi input
    if (!murid_ids || !Array.isArray(murid_ids) || murid_ids.length === 0) {
      return response(400, null, "Daftar ID murid wajib diisi", res);
    }

    if (!kelas_id) {
      return response(400, null, "Kelas ID wajib diisi", res);
    }

    console.log(
      `🔍 Akan update ${murid_ids.length} murid ke kelas ID: ${kelas_id}`
    );

    // Validasi kelas_id
    const kelasExist = await Kelas.findOne({
      where: { kelas_id },
    });

    if (!kelasExist) {
      console.log("❌ Kelas tidak ditemukan dengan ID:", kelas_id);
      return response(400, null, "Kelas tidak ditemukan", res);
    }

    // Hitung murid yang ada
    const existingMurid = await Murid.findAll({
      where: {
        murid_id: murid_ids,
      },
      attributes: ["murid_id", "nama_lengkap"],
    });

    if (existingMurid.length !== murid_ids.length) {
      console.log("⚠️ Beberapa murid tidak ditemukan");
    }

    // Update kelas untuk semua murid
    const [affectedRows] = await Murid.update(
      { kelas_id },
      {
        where: {
          murid_id: murid_ids,
        },
      }
    );

    // Ambil data terbaru
    const updatedMurid = await Murid.findAll({
      where: {
        murid_id: murid_ids,
      },
      attributes: ["murid_id", "nis", "nama_lengkap", "kelas_id", "status"],
      include: [
        {
          model: Kelas,
          as: "kelas",
          attributes: ["kelas_id", "kode_kelas", "nama_kelas"],
          required: false,
        },
      ],
    });

    console.log(
      `✅ Berhasil update ${affectedRows} murid ke kelas: ${kelasExist.nama_kelas}`
    );

    const responseData = {
      total_selected: murid_ids.length,
      successfully_updated: affectedRows,
      kelas: {
        kelas_id: kelasExist.kelas_id,
        kode_kelas: kelasExist.kode_kelas,
        nama_kelas: kelasExist.nama_kelas,
      },
      updated_murid: updatedMurid.map((m) => ({
        murid_id: m.murid_id,
        nis: m.nis,
        nama_lengkap: m.nama_lengkap,
        kelas: m.kelas,
      })),
    };

    return response(
      200,
      responseData,
      `Berhasil memindahkan ${affectedRows} murid ke ${kelasExist.nama_kelas}`,
      res
    );
  } catch (error) {
    console.error("❌ Error update murid kelas massal:", error.message);
    return response(500, null, "Gagal memperbarui kelas murid", res);
  }
};

// DELETE MURID
const deleteMurid = async (req, res) => {
  try {
    const { murid_id } = req.params;

    console.log("=== BACKEND DEBUG: DELETE MURID ===");
    console.log("Murid ID yang akan dihapus:", murid_id);

    // 1. Cari data murid
    const murid = await Murid.findOne({
      where: { murid_id },
      attributes: ["murid_id", "nis", "nama_lengkap", "kelas_id", "status"],
    });

    // 2. Jika murid tidak ditemukan
    if (!murid) {
      console.log("❌ Murid tidak ditemukan");
      return response(404, null, "Data murid tidak ditemukan", res);
    }

    // 3. Hapus data murid
    await murid.destroy();
    console.log("✅ Murid berhasil dihapus:", murid.nama_lengkap);

    return response(
      200,
      null,
      `Data murid ${murid.nama_lengkap} berhasil dihapus`,
      res
    );
  } catch (error) {
    console.error("Error delete murid:", error.message);
    return response(500, null, "Gagal menghapus data murid", res);
  }
};

// controllers/KelasController.js
const getKelasForDropdown = async (req, res) => {
  try {
    console.log("🔍 Mengambil data kelas untuk dropdown");

    const kelas = await Kelas.findAll({
      attributes: ["kelas_id", "kode_kelas", "nama_kelas", "wali_kelas_id"],
      include: [
        {
          model: Guru,
          as: "walikelas",
          attributes: ["guru_id", "nama_lengkap", "nip"],
        },
        {
          model: Murid,
          as: "muridKelas",
          attributes: ["murid_id"],
          where: { status: "aktif" },
          required: false,
        },
      ],
      order: [["nama_kelas", "ASC"]],
    });

    // Format data untuk dropdown
    const formattedKelas = kelas.map((k) => ({
      value: k.kelas_id,
      label: `${k.kode_kelas} - ${k.nama_kelas}`,
      nama_kelas: k.nama_kelas,
      kode_kelas: k.kode_kelas,
      wali_kelas: k.walikelas?.nama_lengkap || "-",
      jumlah_murid: k.muridKelas?.length || 0,
    }));

    console.log("✅ Data kelas untuk dropdown:", formattedKelas.length, "item");

    return response(200, formattedKelas, "Data kelas berhasil diambil", res);
  } catch (error) {
    console.error("❌ Error get kelas dropdown:", error.message);
    return response(500, null, "Gagal memuat data kelas", res);
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

const getAllKelas = async (req, res) => {
  try {
    console.log("🔍 Mengambil semua data kelas");

    const kelas = await Kelas.findAll({
      attributes: [
        "kelas_id",
        "kode_kelas",
        "nama_kelas",
        "wali_kelas_id",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Guru,
          as: "walikelas",
          attributes: [
            "guru_id",
            "nip",
            "nama_lengkap",
            "jenis_kelamin",
            "jabatan",
            "status",
          ],
        },
        {
          model: Murid,
          as: "muridKelas",
          attributes: ["murid_id", "nis", "nama_lengkap", "status"],
          where: { status: "aktif" },
          required: false,
        },
      ],
      order: [
        ["nama_kelas", "ASC"],
        ["kode_kelas", "ASC"],
      ],
    });

    // Format data dengan jumlah murid
    const formattedKelas = kelas.map((k) => ({
      kelas_id: k.kelas_id,
      kode_kelas: k.kode_kelas,
      nama_kelas: k.nama_kelas,
      wali_kelas_id: k.wali_kelas_id,
      wali_kelas: k.walikelas
        ? {
            guru_id: k.walikelas.guru_id,
            nip: k.walikelas.nip,
            nama_lengkap: k.walikelas.nama_lengkap,
            jabatan: k.walikelas.jabatan,
            status: k.walikelas.status,
          }
        : null,
      jumlah_murid: k.muridKelas?.length || 0,
      daftar_murid: k.muridKelas || [],
      createdAt: k.createdAt,
      updatedAt: k.updatedAt,
    }));

    console.log(
      "✅ Data kelas berhasil diambil:",
      formattedKelas.length,
      "kelas"
    );
    return response(200, formattedKelas, "Data kelas berhasil diambil", res);
  } catch (error) {
    console.error("❌ Error get all kelas:", error.message);
    return response(500, null, "Gagal memuat data kelas", res);
  }
};

// GET KELAS BY ID
const getKelasById = async (req, res) => {
  try {
    const { kelas_id } = req.params;

    console.log("🔍 Mengambil data kelas dengan ID:", kelas_id);

    const kelas = await Kelas.findOne({
      where: { kelas_id },
      attributes: [
        "kelas_id",
        "kode_kelas",
        "nama_kelas",
        "wali_kelas_id",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Guru,
          as: "walikelas",
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
        },
        {
          model: Murid,
          as: "muridKelas",
          attributes: [
            "murid_id",
            "nis",
            "nisn",
            "nama_lengkap",
            "jenis_kelamin",
            "status",
          ],
          where: { status: "aktif" },
          required: false,
        },
      ],
    });

    if (!kelas) {
      console.log("❌ Kelas tidak ditemukan");
      return response(404, null, "Data kelas tidak ditemukan", res);
    }

    console.log("✅ Kelas ditemukan:", kelas.nama_kelas);
    return response(200, kelas, "Data kelas berhasil diambil", res);
  } catch (error) {
    console.error("❌ Error get kelas by ID:", error.message);
    return response(500, null, "Gagal memuat data kelas", res);
  }
};

// CREATE KELAS
const createKelas = async (req, res) => {
  console.log("=== BACKEND DEBUG: CREATE KELAS ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  const { kode_kelas, nama_kelas, wali_kelas_id } = req.body;

  try {
    // Validasi input
    if (!kode_kelas || !nama_kelas || !wali_kelas_id) {
      return response(
        400,
        null,
        "Kode kelas, Nama kelas, dan Wali kelas harus diisi",
        res
      );
    }

    // Cek kode kelas unik
    const existingKodeKelas = await Kelas.findOne({
      where: { kode_kelas },
    });

    if (existingKodeKelas) {
      console.log("❌ Kode kelas sudah digunakan");
      return response(400, null, "Kode kelas sudah digunakan", res);
    }

    // Cek apakah guru (wali kelas) ada
    const guruExist = await Guru.findOne({
      where: { guru_id: wali_kelas_id },
    });

    if (!guruExist) {
      console.log("❌ Wali kelas tidak ditemukan");
      return response(404, null, "Data wali kelas tidak ditemukan", res);
    }

    // Cek apakah guru sudah menjadi wali kelas di kelas lain
    const guruAlreadyWaliKelas = await Kelas.findOne({
      where: { wali_kelas_id },
    });

    if (guruAlreadyWaliKelas) {
      console.log("❌ Guru sudah menjadi wali kelas di kelas lain");
      return response(
        400,
        null,
        "Guru ini sudah menjadi wali kelas di kelas lain",
        res
      );
    }

    // Buat kelas baru
    const newKelas = await Kelas.create({
      kode_kelas,
      nama_kelas,
      wali_kelas_id,
    });

    // Ambil data lengkap dengan relasi
    const kelasDetail = await Kelas.findOne({
      where: { kelas_id: newKelas.kelas_id },
      attributes: [
        "kelas_id",
        "kode_kelas",
        "nama_kelas",
        "wali_kelas_id",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Guru,
          as: "walikelas",
          attributes: [
            "guru_id",
            "nip",
            "nama_lengkap",
            "jenis_kelamin",
            "jabatan",
            "status",
          ],
        },
      ],
    });

    console.log("✅ Kelas berhasil dibuat:", kelasDetail.nama_kelas);
    return response(201, kelasDetail, "Kelas berhasil dibuat", res);
  } catch (error) {
    console.error("❌ Error create kelas:", error.message);

    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((err) => err.message);
      return response(400, null, messages.join(", "), res);
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return response(400, null, "Kode kelas sudah terdaftar", res);
    }

    return response(500, null, "Gagal membuat kelas", res);
  }
};

// UPDATE KELAS
const updateKelas = async (req, res) => {
  console.log("=== BACKEND DEBUG: UPDATE KELAS ===");
  console.log("Request params:", req.params);
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  const { kelas_id } = req.params;
  const { kode_kelas, nama_kelas, wali_kelas_id } = req.body;

  try {
    // Cari kelas berdasarkan ID
    const kelas = await Kelas.findOne({
      where: { kelas_id },
    });

    if (!kelas) {
      console.log("❌ Kelas tidak ditemukan");
      return response(404, null, "Data kelas tidak ditemukan", res);
    }

    // Validasi kode_kelas unik jika diubah
    if (kode_kelas && kode_kelas !== kelas.kode_kelas) {
      const existingKodeKelas = await Kelas.findOne({
        where: { kode_kelas },
      });

      if (existingKodeKelas) {
        console.log("❌ Kode kelas sudah digunakan");
        return response(400, null, "Kode kelas sudah digunakan", res);
      }
    }

    // Validasi wali_kelas_id jika diubah
    if (wali_kelas_id && wali_kelas_id !== kelas.wali_kelas_id) {
      // Cek apakah guru ada
      const guruExist = await Guru.findOne({
        where: { guru_id: wali_kelas_id },
      });

      if (!guruExist) {
        console.log("❌ Wali kelas tidak ditemukan");
        return response(404, null, "Data wali kelas tidak ditemukan", res);
      }

      // Cek apakah guru sudah menjadi wali kelas di kelas lain (selain kelas ini)
      const guruAlreadyWaliKelas = await Kelas.findOne({
        where: {
          wali_kelas_id,
          kelas_id: { [Sequelize.Op.ne]: kelas_id },
        },
      });

      if (guruAlreadyWaliKelas) {
        console.log("❌ Guru sudah menjadi wali kelas di kelas lain");
        return response(
          400,
          null,
          "Guru ini sudah menjadi wali kelas di kelas lain",
          res
        );
      }
    }

    // Update data
    const updateData = {};
    if (kode_kelas !== undefined) updateData.kode_kelas = kode_kelas;
    if (nama_kelas !== undefined) updateData.nama_kelas = nama_kelas;
    if (wali_kelas_id !== undefined) updateData.wali_kelas_id = wali_kelas_id;

    console.log("📝 Data yang akan diupdate:", updateData);

    // Lakukan update
    await kelas.update(updateData);

    // Ambil data terbaru dengan relasi
    const updatedKelas = await Kelas.findOne({
      where: { kelas_id },
      attributes: [
        "kelas_id",
        "kode_kelas",
        "nama_kelas",
        "wali_kelas_id",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Guru,
          as: "walikelas",
          attributes: [
            "guru_id",
            "nip",
            "nama_lengkap",
            "jenis_kelamin",
            "jabatan",
            "status",
          ],
        },
        {
          model: Murid,
          as: "muridKelas",
          attributes: ["murid_id", "nis", "nama_lengkap", "status"],
          where: { status: "aktif" },
          required: false,
        },
      ],
    });

    console.log("✅ Kelas berhasil diupdate:", updatedKelas.nama_kelas);
    return response(200, updatedKelas, "Kelas berhasil diperbarui", res);
  } catch (error) {
    console.error("❌ Error update kelas:", error.message);

    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((err) => err.message);
      return response(400, null, messages.join(", "), res);
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return response(400, null, "Kode kelas sudah terdaftar", res);
    }

    return response(500, null, "Gagal memperbarui kelas", res);
  }
};

// DELETE KELAS
const deleteKelas = async (req, res) => {
  try {
    const { kelas_id } = req.params;

    console.log("=== BACKEND DEBUG: DELETE KELAS ===");
    console.log("Kelas ID yang akan dihapus:", kelas_id);

    // 1. Cari data kelas
    const kelas = await Kelas.findOne({
      where: { kelas_id },
      attributes: ["kelas_id", "kode_kelas", "nama_kelas"],
      include: [
        {
          model: Murid,
          as: "muridKelas",
          attributes: ["murid_id", "nama_lengkap"],
          where: { status: "aktif" },
          required: false,
        },
      ],
    });

    // 2. Jika kelas tidak ditemukan
    if (!kelas) {
      console.log("❌ Kelas tidak ditemukan");
      return response(404, null, "Data kelas tidak ditemukan", res);
    }

    // 3. Cek apakah kelas masih memiliki murid aktif
    if (kelas.muridKelas && kelas.muridKelas.length > 0) {
      console.log("❌ Kelas masih memiliki murid aktif");
      return response(
        400,
        {
          kelas_id: kelas.kelas_id,
          nama_kelas: kelas.nama_kelas,
          jumlah_murid_aktif: kelas.muridKelas.length,
          murid_aktif: kelas.muridKelas.map((m) => ({
            murid_id: m.murid_id,
            nama_lengkap: m.nama_lengkap,
          })),
        },
        "Kelas tidak dapat dihapus karena masih memiliki murid aktif. Pindahkan murid terlebih dahulu.",
        res
      );
    }

    // 4. Hapus data kelas
    await kelas.destroy();
    console.log("✅ Kelas berhasil dihapus:", kelas.nama_kelas);

    return response(
      200,
      null,
      `Kelas ${kelas.nama_kelas} berhasil dihapus`,
      res
    );
  } catch (error) {
    console.error("❌ Error delete kelas:", error.message);
    return response(500, null, "Gagal menghapus kelas", res);
  }
};

// GET GURU UNTUK DROPDOWN WALI KELAS
const getGuruForWaliKelas = async (req, res) => {
  try {
    console.log("🔍 Mengambil data guru untuk dropdown wali kelas");

    // Ambil semua guru yang aktif dan belum menjadi wali kelas
    const guru = await Guru.findAll({
      where: {
        status: "aktif",
      },
      attributes: ["guru_id", "nip", "nama_lengkap", "jabatan"],
      include: [
        {
          model: Kelas,
          as: "kelasDibimbing",
          attributes: ["kelas_id"],
          required: false,
        },
      ],
      order: [["nama_lengkap", "ASC"]],
    });

    // Filter guru yang belum menjadi wali kelas
    const guruBelumWaliKelas = guru
      .filter((g) => !g.kelasDibimbing || g.kelasDibimbing.length === 0)
      .map((g) => ({
        value: g.guru_id,
        label: `${g.nip} - ${g.nama_lengkap}`,
        nip: g.nip,
        nama_lengkap: g.nama_lengkap,
        jabatan: g.jabatan,
      }));

    // Ambil semua guru untuk referensi (termasuk yang sudah jadi wali kelas)
    const allGuru = guru.map((g) => ({
      value: g.guru_id,
      label: `${g.nip} - ${g.nama_lengkap} ${
        g.kelasDibimbing?.length > 0 ? "(Sudah Wali Kelas)" : ""
      }`,
      nip: g.nip,
      nama_lengkap: g.nama_lengkap,
      jabatan: g.jabatan,
      sudah_wali_kelas: g.kelasDibimbing?.length > 0,
    }));

    const responseData = {
      guru_belum_wali_kelas: guruBelumWaliKelas,
      semua_guru: allGuru,
    };

    console.log("✅ Data guru untuk wali kelas berhasil diambil");
    return response(200, responseData, "Data guru berhasil diambil", res);
  } catch (error) {
    console.error("❌ Error get guru for wali kelas:", error.message);
    return response(500, null, "Gagal memuat data guru", res);
  }
};

const getChartData1Year = async (year, kelas_id) => {
  const result = [];

  for (let month = 1; month <= 12; month++) {
    const startDate = moment(`${year}-${month}-01`)
      .startOf("month")
      .format("YYYY-MM-DD");

    const endDate = moment(`${year}-${month}-01`)
      .endOf("month")
      .format("YYYY-MM-DD");

    const whereClause = {
      tanggal: { [Op.between]: [startDate, endDate] },
    };

    // Jika filter kelas digunakan
    if (kelas_id) {
      whereClause["$murid.kelas_id$"] = kelas_id;
    }

    // Ambil data tiap bulan
    const data = await AbsensiMurid.findAll({
      where: whereClause,
      include: [
        {
          model: Murid,
          as: "murid",
          attributes: ["murid_id", "kelas_id"],
          where: { status: "aktif" },
        },
      ],
      raw: true,
    });

    // Hitung statistik bulan ini
    const hadir = data.filter((d) => d.status === "Hadir").length;
    const sakit = data.filter((d) => d.status === "Sakit").length;
    const izin = data.filter((d) => d.status === "Izin").length;
    const alpha = data.filter((d) => d.status === "Alpha").length;

    result.push({
      bulan: moment(`${year}-${month}-01`).format("MMM"),
      hadir,
      sakit,
      izin,
      alpha,
      total: data.length,
    });
  }

  return result;
};

// GET STATISTIK ABSENSI MURID PER BULAN
const getAbsensiMuridBulanan = async (req, res) => {
  try {
    const { tahun, bulan, kelas_id } = req.query;

    const targetYear = tahun || moment().tz("Asia/Jakarta").year();
    const targetMonth = bulan || moment().tz("Asia/Jakarta").month() + 1;

    const startDate = moment(
      `${targetYear}-${targetMonth.toString().padStart(2, "0")}-01`
    )
      .startOf("month")
      .format("YYYY-MM-DD");

    const endDate = moment(
      `${targetYear}-${targetMonth.toString().padStart(2, "0")}-01`
    )
      .endOf("month")
      .format("YYYY-MM-DD");

    const whereClause = {
      tanggal: {
        [Op.between]: [startDate, endDate],
      },
    };

    if (kelas_id) {
      whereClause["$murid.kelas_id$"] = kelas_id;
    }

    const absensiData = await AbsensiMurid.findAll({
      where: whereClause,
      include: [
        {
          model: Murid,
          as: "murid",
          attributes: ["murid_id", "nama_lengkap", "kelas_id"],
          where: { status: "aktif" },
          include: [
            {
              model: Kelas,
              as: "kelas",
              attributes: ["kelas_id", "nama_kelas"],
            },
          ],
        },
      ],
      attributes: [
        "id",
        "murid_id",
        "tanggal",
        "status",
        "keterangan",
        [Sequelize.fn("DATE", Sequelize.col("tanggal")), "tanggal_only"],
      ],
      order: [["tanggal", "ASC"]],
      raw: false,
      nest: true,
    });

    // ============================
    // Hitung statistik harian
    // ============================
    const daysInMonth = moment(`${targetYear}-${targetMonth}`).daysInMonth();
    const monthlyStats = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${targetYear}-${targetMonth
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      monthlyStats.push({
        date: dateStr,
        day,
        hadir: 0,
        sakit: 0,
        izin: 0,
        alpha: 0,
        total: 0,
      });
    }

    absensiData.forEach((absen) => {
      const day = moment(absen.tanggal, "YYYY-MM-DD").date();
      const index = day - 1;

      if (index >= 0 && index < monthlyStats.length) {
        switch (absen.status) {
          case "Hadir":
            monthlyStats[index].hadir++;
            break;
          case "Sakit":
            monthlyStats[index].sakit++;
            break;
          case "Izin":
            monthlyStats[index].izin++;
            break;
          case "Alpha":
            monthlyStats[index].alpha++;
            break;
        }
        monthlyStats[index].total++;
      }
    });

    const totalStats = {
      hadir: monthlyStats.reduce((a, b) => a + b.hadir, 0),
      sakit: monthlyStats.reduce((a, b) => a + b.sakit, 0),
      izin: monthlyStats.reduce((a, b) => a + b.izin, 0),
      alpha: monthlyStats.reduce((a, b) => a + b.alpha, 0),
      total: monthlyStats.reduce((a, b) => a + b.total, 0),
    };

    totalStats.persentase_hadir =
      totalStats.total > 0
        ? ((totalStats.hadir / totalStats.total) * 100).toFixed(1)
        : "0.0";

    // 🔥🔥🔥 ============================================
    // PERUBAHAN TERPENTING — ⬇⬇⬇ AMBIL 12 BULAN SEKALIGUS
    // ================================================
    const chartData = await getChartData1Year(targetYear, kelas_id);
    // 🔥🔥🔥 ============================================

    const responseData = {
      tahun: parseInt(targetYear),
      bulan: parseInt(targetMonth),
      statistik_harian: monthlyStats,
      total_statistik: totalStats,
      chart_data_1_tahun: chartData, // 🔥 data 12 bulan
      detail: {
        jumlah_murid:
          absensiData.length > 0
            ? new Set(absensiData.map((a) => a.murid_id)).size
            : 0,
      },
    };

    return response(
      200,
      responseData,
      "Statistik absensi berhasil diambil",
      res
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    return response(500, null, "Gagal mengambil statistik absensi", res);
  }
};

// GET STATISTIK ABSENSI GURU PER BULAN
const getAbsensiGuruBulanan = async (req, res) => {
  try {
    const { tahun, bulan } = req.query;

    console.log("🔍 Mengambil statistik absensi guru bulanan");
    console.log("Tahun:", tahun, "Bulan:", bulan);

    // Validasi input
    const targetYear = tahun || moment().tz("Asia/Jakarta").year();
    const targetMonth = bulan || moment().tz("Asia/Jakarta").month() + 1;

    // Buat tanggal awal dan akhir bulan
    const startDate = moment(
      `${targetYear}-${targetMonth.toString().padStart(2, "0")}-01`
    )
      .tz("Asia/Jakarta")
      .startOf("month")
      .format("YYYY-MM-DD");

    const endDate = moment(
      `${targetYear}-${targetMonth.toString().padStart(2, "0")}-01`
    )
      .tz("Asia/Jakarta")
      .endOf("month")
      .format("YYYY-MM-DD");

    // Ambil data absensi guru
    const absensiData = await AbsensiGuru.findAll({
      where: {
        tanggal: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: Guru,
          as: "guru",
          attributes: ["guru_id", "nama_lengkap", "nip", "jabatan"],
          where: {
            status: "aktif",
          },
        },
      ],
      attributes: [
        "guru_id",
        "tanggal",
        "status",
        [Sequelize.fn("DATE", Sequelize.col("tanggal")), "tanggal_only"],
      ],
      order: [["tanggal", "ASC"]],
    });

    // Hitung statistik per hari
    const daysInMonth = moment(
      `${targetYear}-${targetMonth}`,
      "YYYY-MM"
    ).daysInMonth();
    const monthlyStats = [];

    // Inisialisasi data untuk semua hari dalam bulan
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${targetYear}-${targetMonth
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      monthlyStats.push({
        date: dateStr,
        day: day,
        dayName: moment(dateStr).format("ddd"),
        hadir: 0,
        sakit: 0,
        izin: 0,
        alpha: 0,
        total: 0,
        persentase: 0,
      });
    }

    // Hitung per status per hari
    absensiData.forEach((absen) => {
      const date = moment(absen.tanggal).format("YYYY-MM-DD");
      const day = moment(absen.tanggal).date();
      const statIndex = day - 1;

      if (statIndex >= 0 && statIndex < monthlyStats.length) {
        switch (absen.status) {
          case "hadir":
            monthlyStats[statIndex].hadir++;
            break;
          case "sakit":
            monthlyStats[statIndex].sakit++;
            break;
          case "izin":
            monthlyStats[statIndex].izin++;
            break;
          case "alpha":
            monthlyStats[statIndex].alpha++;
            break;
        }
        monthlyStats[statIndex].total++;
      }
    });

    // Hitung total per status untuk bulan ini
    const totalStats = {
      hadir: monthlyStats.reduce((sum, day) => sum + day.hadir, 0),
      sakit: monthlyStats.reduce((sum, day) => sum + day.sakit, 0),
      izin: monthlyStats.reduce((sum, day) => sum + day.izin, 0),
      alpha: monthlyStats.reduce((sum, day) => sum + day.alpha, 0),
      total: monthlyStats.reduce((sum, day) => sum + day.total, 0),
    };

    // Hitung persentase kehadiran
    totalStats.persentase_hadir =
      totalStats.total > 0
        ? ((totalStats.hadir / totalStats.total) * 100).toFixed(1)
        : 0;

    // Per guru statistik
    const guruStats = {};
    absensiData.forEach((absen) => {
      const guruId = absen.guru_id;
      if (!guruStats[guruId]) {
        guruStats[guruId] = {
          guru_id: guruId,
          nama: absen.guru.nama_lengkap,
          nip: absen.guru.nip,
          hadir: 0,
          sakit: 0,
          izin: 0,
          alpha: 0,
          total: 0,
        };
      }

      switch (absen.status) {
        case "hadir":
          guruStats[guruId].hadir++;
          break;
        case "sakit":
          guruStats[guruId].sakit++;
          break;
        case "izin":
          guruStats[guruId].izin++;
          break;
        case "alpha":
          guruStats[guruId].alpha++;
          break;
      }
      guruStats[guruId].total++;
    });

    const guruStatsArray = Object.values(guruStats).map((guru) => ({
      ...guru,
      persentase_hadir:
        guru.total > 0 ? ((guru.hadir / guru.total) * 100).toFixed(1) : 0,
    }));

    // Format untuk chart (6 bulan terakhir)
    const chartData = await getChartDataGuru(targetYear, targetMonth);

    const responseData = {
      tahun: parseInt(targetYear),
      bulan: parseInt(targetMonth),
      nama_bulan: moment(`${targetYear}-${targetMonth}`, "YYYY-MM").format(
        "MMMM YYYY"
      ),
      statistik_harian: monthlyStats,
      total_statistik: totalStats,
      statistik_per_guru: guruStatsArray,
      chart_data: chartData,
      detail: {
        jumlah_guru: Object.keys(guruStats).length,
        hari_aktif: monthlyStats.filter((day) => day.total > 0).length,
        rata_rata_kehadiran: totalStats.persentase_hadir,
      },
    };

    console.log("✅ Statistik absensi guru bulanan berhasil diambil");
    return response(
      200,
      responseData,
      "Statistik absensi guru berhasil diambil",
      res
    );
  } catch (error) {
    console.error("❌ Error get absensi guru bulanan:", error.message);
    return response(500, null, "Gagal mengambil statistik absensi guru", res);
  }
};

// GET STATISTIK TAHUNAN MURID
const getAbsensiMuridTahunan = async (req, res) => {
  try {
    const { tahun, kelas_id } = req.query;

    console.log("🔍 Mengambil statistik absensi murid tahunan");
    console.log("Tahun:", tahun, "Kelas ID:", kelas_id);

    // Validasi input
    const targetYear = tahun || moment().tz("Asia/Jakarta").year();

    // Buat where clause
    const whereClause = {
      tanggal: {
        [Op.between]: [`${targetYear}-01-01`, `${targetYear}-12-31`],
      },
    };

    // Filter berdasarkan kelas jika ada
    if (kelas_id) {
      whereClause["$murid.kelas_id$"] = kelas_id;
    }

    // Ambil data absensi
    const absensiData = await AbsensiMurid.findAll({
      where: whereClause,
      include: [
        {
          model: Murid,
          as: "murid",
          attributes: ["murid_id", "nama_lengkap", "kelas_id"],
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
      attributes: [
        "murid_id",
        "tanggal",
        "status",
        [Sequelize.fn("MONTH", Sequelize.col("tanggal")), "bulan"],
      ],
    });

    // Hitung statistik per bulan
    const monthlyStats = [];
    for (let month = 1; month <= 12; month++) {
      const monthData = absensiData.filter(
        (absen) => moment(absen.tanggal).month() + 1 === month
      );

      const hadir = monthData.filter((a) => a.status === "Hadir").length;
      const sakit = monthData.filter((a) => a.status === "Sakit").length;
      const izin = monthData.filter((a) => a.status === "Izin").length;
      const alpha = monthData.filter((a) => a.status === "Alpha").length;
      const total = monthData.length;

      monthlyStats.push({
        bulan: month,
        nama_bulan: moment()
          .month(month - 1)
          .format("MMMM"),
        hadir,
        sakit,
        izin,
        alpha,
        total,
        persentase: total > 0 ? ((hadir / total) * 100).toFixed(1) : 0,
      });
    }

    // Hitung total tahunan
    const yearlyStats = {
      hadir: monthlyStats.reduce((sum, month) => sum + month.hadir, 0),
      sakit: monthlyStats.reduce((sum, month) => sum + month.sakit, 0),
      izin: monthlyStats.reduce((sum, month) => sum + month.izin, 0),
      alpha: monthlyStats.reduce((sum, month) => sum + month.alpha, 0),
      total: monthlyStats.reduce((sum, month) => sum + month.total, 0),
    };

    yearlyStats.persentase_hadir =
      yearlyStats.total > 0
        ? ((yearlyStats.hadir / yearlyStats.total) * 100).toFixed(1)
        : 0;

    const responseData = {
      tahun: parseInt(targetYear),
      filter_kelas: kelas_id || "Semua Kelas",
      statistik_bulanan: monthlyStats,
      total_tahunan: yearlyStats,
      detail: {
        jumlah_murid:
          absensiData.length > 0
            ? new Set(absensiData.map((a) => a.murid_id)).size
            : 0,
        bulan_tertinggi: monthlyStats.reduce((max, month) =>
          month.persentase > max.persentase ? month : max
        ),
        bulan_terendah: monthlyStats.reduce((min, month) =>
          month.persentase < min.persentase ? month : min
        ),
      },
    };

    console.log("✅ Statistik absensi murid tahunan berhasil diambil");
    return response(
      200,
      responseData,
      "Statistik absensi tahunan berhasil diambil",
      res
    );
  } catch (error) {
    console.error("❌ Error get absensi murid tahunan:", error.message);
    return response(
      500,
      null,
      "Gagal mengambil statistik absensi tahunan",
      res
    );
  }
};

// GET STATISTIK TAHUNAN GURU
const getAbsensiGuruTahunan = async (req, res) => {
  try {
    const { tahun } = req.query;

    console.log("🔍 Mengambil statistik absensi guru tahunan");
    console.log("Tahun:", tahun);

    // Validasi input
    const targetYear = tahun || moment().tz("Asia/Jakarta").year();

    // Ambil data absensi guru
    const absensiData = await AbsensiGuru.findAll({
      where: {
        tanggal: {
          [Op.between]: [`${targetYear}-01-01`, `${targetYear}-12-31`],
        },
      },
      include: [
        {
          model: Guru,
          as: "guru",
          attributes: ["guru_id", "nama_lengkap", "nip", "jabatan"],
          where: {
            status: "aktif",
          },
        },
      ],
      attributes: [
        "guru_id",
        "tanggal",
        "status",
        [Sequelize.fn("MONTH", Sequelize.col("tanggal")), "bulan"],
      ],
    });

    // Hitung statistik per bulan
    const monthlyStats = [];
    for (let month = 1; month <= 12; month++) {
      const monthData = absensiData.filter(
        (absen) => moment(absen.tanggal).month() + 1 === month
      );

      const hadir = monthData.filter((a) => a.status === "hadir").length;
      const sakit = monthData.filter((a) => a.status === "sakit").length;
      const izin = monthData.filter((a) => a.status === "izin").length;
      const alpha = monthData.filter((a) => a.status === "alpha").length;
      const total = monthData.length;

      monthlyStats.push({
        bulan: month,
        nama_bulan: moment()
          .month(month - 1)
          .format("MMMM"),
        hadir,
        sakit,
        izin,
        alpha,
        total,
        persentase: total > 0 ? ((hadir / total) * 100).toFixed(1) : 0,
      });
    }

    // Hitung total tahunan
    const yearlyStats = {
      hadir: monthlyStats.reduce((sum, month) => sum + month.hadir, 0),
      sakit: monthlyStats.reduce((sum, month) => sum + month.sakit, 0),
      izin: monthlyStats.reduce((sum, month) => sum + month.izin, 0),
      alpha: monthlyStats.reduce((sum, month) => sum + month.alpha, 0),
      total: monthlyStats.reduce((sum, month) => sum + month.total, 0),
    };

    yearlyStats.persentase_hadir =
      yearlyStats.total > 0
        ? ((yearlyStats.hadir / yearlyStats.total) * 100).toFixed(1)
        : 0;

    // Per guru statistik tahunan
    const guruStats = {};
    absensiData.forEach((absen) => {
      const guruId = absen.guru_id;
      if (!guruStats[guruId]) {
        guruStats[guruId] = {
          guru_id: guruId,
          nama: absen.guru.nama_lengkap,
          nip: absen.guru.nip,
          hadir: 0,
          sakit: 0,
          izin: 0,
          alpha: 0,
          total: 0,
        };
      }

      switch (absen.status) {
        case "hadir":
          guruStats[guruId].hadir++;
          break;
        case "sakit":
          guruStats[guruId].sakit++;
          break;
        case "izin":
          guruStats[guruId].izin++;
          break;
        case "alpha":
          guruStats[guruId].alpha++;
          break;
      }
      guruStats[guruId].total++;
    });

    const guruStatsArray = Object.values(guruStats).map((guru) => ({
      ...guru,
      persentase_hadir:
        guru.total > 0 ? ((guru.hadir / guru.total) * 100).toFixed(1) : 0,
    }));

    const responseData = {
      tahun: parseInt(targetYear),
      statistik_bulanan: monthlyStats,
      total_tahunan: yearlyStats,
      statistik_per_guru: guruStatsArray,
      detail: {
        jumlah_guru: Object.keys(guruStats).length,
        bulan_tertinggi: monthlyStats.reduce((max, month) =>
          month.persentase > max.persentase ? month : max
        ),
        bulan_terendah: monthlyStats.reduce((min, month) =>
          month.persentase < min.persentase ? month : min
        ),
      },
    };

    console.log("✅ Statistik absensi guru tahunan berhasil diambil");
    return response(
      200,
      responseData,
      "Statistik absensi guru tahunan berhasil diambil",
      res
    );
  } catch (error) {
    console.error("❌ Error get absensi guru tahunan:", error.message);
    return response(
      500,
      null,
      "Gagal mengambil statistik absensi guru tahunan",
      res
    );
  }
};

// HELPER FUNCTIONS
const getChartData = async (tahun, bulan, kelas_id = null) => {
  try {
    const chartData = [];
    const currentDate = moment();

    // Ambil data untuk 6 bulan terakhir
    for (let i = 5; i >= 0; i--) {
      const targetDate = currentDate.clone().subtract(i, "months");
      const targetYear = targetDate.year();
      const targetMonth = targetDate.month() + 1;

      // Buat tanggal awal dan akhir bulan
      const startDate = moment(
        `${targetYear}-${targetMonth.toString().padStart(2, "0")}-01`
      )
        .startOf("month")
        .format("YYYY-MM-DD");

      const endDate = moment(
        `${targetYear}-${targetMonth.toString().padStart(2, "0")}-01`
      )
        .endOf("month")
        .format("YYYY-MM-DD");

      // Buat where clause
      const whereClause = {
        tanggal: {
          [Op.between]: [startDate, endDate],
        },
      };

      // Filter berdasarkan kelas jika ada
      if (kelas_id) {
        whereClause["$murid.kelas_id$"] = kelas_id;
      }

      // Ambil data absensi untuk bulan ini
      const absensiData = await AbsensiMurid.findAll({
        where: whereClause,
        include: [
          {
            model: Murid,
            as: "murid",
            where: { status: "aktif" },
          },
        ],
        attributes: ["status"],
      });

      // Hitung statistik
      const hadir = absensiData.filter((a) => a.status === "hadir").length;
      const sakit = absensiData.filter((a) => a.status === "sakit").length;
      const izin = absensiData.filter((a) => a.status === "izin").length;
      const alpha = absensiData.filter((a) => a.status === "alpha").length;
      const total = absensiData.length;

      const persentaseHadir =
        total > 0 ? ((hadir / total) * 100).toFixed(1) : 0;

      chartData.push({
        month: targetDate.format("MMM"),
        fullMonth: targetDate.format("MMMM YYYY"),
        hadir,
        sakit,
        izin,
        alpha,
        total,
        persentase: parseFloat(persentaseHadir),
      });
    }

    return chartData;
  } catch (error) {
    console.error("Error getChartData:", error.message);
    return [];
  }
};

const getChartDataGuru = async (tahun, bulan) => {
  try {
    const chartData = [];
    const currentDate = moment();

    // Ambil data untuk 6 bulan terakhir
    for (let i = 5; i >= 0; i--) {
      const targetDate = currentDate.clone().subtract(i, "months");
      const targetYear = targetDate.year();
      const targetMonth = targetDate.month() + 1;

      // Buat tanggal awal dan akhir bulan
      const startDate = moment(
        `${targetYear}-${targetMonth.toString().padStart(2, "0")}-01`
      )
        .startOf("month")
        .format("YYYY-MM-DD");

      const endDate = moment(
        `${targetYear}-${targetMonth.toString().padStart(2, "0")}-01`
      )
        .endOf("month")
        .format("YYYY-MM-DD");

      // Ambil data absensi guru untuk bulan ini
      const absensiData = await AbsensiGuru.findAll({
        where: {
          tanggal: {
            [Op.between]: [startDate, endDate],
          },
        },
        attributes: ["status"],
      });

      // Hitung statistik
      const hadir = absensiData.filter((a) => a.status === "hadir").length;
      const sakit = absensiData.filter((a) => a.status === "sakit").length;
      const izin = absensiData.filter((a) => a.status === "izin").length;
      const alpha = absensiData.filter((a) => a.status === "alpha").length;
      const total = absensiData.length;

      const persentaseHadir =
        total > 0 ? ((hadir / total) * 100).toFixed(1) : 0;

      chartData.push({
        month: targetDate.format("MMM"),
        fullMonth: targetDate.format("MMMM YYYY"),
        hadir,
        sakit,
        izin,
        alpha,
        total,
        persentase: parseFloat(persentaseHadir),
      });
    }

    return chartData;
  } catch (error) {
    console.error("Error getChartDataGuru:", error.message);
    return [];
  }
};

// GET DASHBOARD STATISTIK (ringkasan untuk dashboard)
const getDashboardStatistik = async (req, res) => {
  try {
    console.log("🔍 Mengambil statistik dashboard");

    const currentDate = moment().tz("Asia/Jakarta");
    const currentYear = currentDate.year();
    const currentMonth = currentDate.month() + 1;
    const today = currentDate.format("YYYY-MM-DD");

    // Statistik hari ini
    const absensiMuridHariIni = await AbsensiMurid.findAll({
      where: { tanggal: today },
      attributes: ["status"],
    });

    const absensiGuruHariIni = await AbsensiGuru.findAll({
      where: { tanggal: today },
      attributes: ["status"],
    });

    // Statistik bulan ini
    const startOfMonth = currentDate
      .clone()
      .startOf("month")
      .format("YYYY-MM-DD");
    const endOfMonth = currentDate.clone().endOf("month").format("YYYY-MM-DD");

    const absensiMuridBulanIni = await AbsensiMurid.findAll({
      where: {
        tanggal: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      },
      attributes: ["status"],
    });

    const absensiGuruBulanIni = await AbsensiGuru.findAll({
      where: {
        tanggal: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      },
      attributes: ["status"],
    });

    // Hitung statistik
    const statistik = {
      hari_ini: {
        murid: {
          hadir: absensiMuridHariIni.filter((a) => a.status === "hadir").length,
          sakit: absensiMuridHariIni.filter((a) => a.status === "sakit").length,
          izin: absensiMuridHariIni.filter((a) => a.status === "izin").length,
          alpha: absensiMuridHariIni.filter((a) => a.status === "alpha").length,
          total: absensiMuridHariIni.length,
        },
        guru: {
          hadir: absensiGuruHariIni.filter((a) => a.status === "hadir").length,
          sakit: absensiGuruHariIni.filter((a) => a.status === "sakit").length,
          izin: absensiGuruHariIni.filter((a) => a.status === "izin").length,
          alpha: absensiGuruHariIni.filter((a) => a.status === "alpha").length,
          total: absensiGuruHariIni.length,
        },
      },
      bulan_ini: {
        murid: {
          hadir: absensiMuridBulanIni.filter((a) => a.status === "hadir")
            .length,
          sakit: absensiMuridBulanIni.filter((a) => a.status === "sakit")
            .length,
          izin: absensiMuridBulanIni.filter((a) => a.status === "izin").length,
          alpha: absensiMuridBulanIni.filter((a) => a.status === "alpha")
            .length,
          total: absensiMuridBulanIni.length,
        },
        guru: {
          hadir: absensiGuruBulanIni.filter((a) => a.status === "hadir").length,
          sakit: absensiGuruBulanIni.filter((a) => a.status === "sakit").length,
          izin: absensiGuruBulanIni.filter((a) => a.status === "izin").length,
          alpha: absensiGuruBulanIni.filter((a) => a.status === "alpha").length,
          total: absensiGuruBulanIni.length,
        },
      },
      summary: {
        tanggal: today,
        bulan: currentDate.format("MMMM YYYY"),
        persentase_murid_hari_ini:
          absensiMuridHariIni.length > 0
            ? (
                (absensiMuridHariIni.filter((a) => a.status === "hadir")
                  .length /
                  absensiMuridHariIni.length) *
                100
              ).toFixed(1)
            : 0,
        persentase_guru_hari_ini:
          absensiGuruHariIni.length > 0
            ? (
                (absensiGuruHariIni.filter((a) => a.status === "hadir").length /
                  absensiGuruHariIni.length) *
                100
              ).toFixed(1)
            : 0,
      },
    };

    console.log("✅ Statistik dashboard berhasil diambil");
    return response(
      200,
      statistik,
      "Statistik dashboard berhasil diambil",
      res
    );
  } catch (error) {
    console.error("❌ Error get dashboard statistik:", error.message);
    return response(500, null, "Gagal mengambil statistik dashboard", res);
  }
};

module.exports = {
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
  getAllMurid,
  getAbsensiMurid,
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
};
