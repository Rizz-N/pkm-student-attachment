const Users = require("../models/UserModel");
const Guru = require("../models/Guru");
const response = require("../config/response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Register = async (req, res) => {
  try {
    const { username, password, confPassword, role } = req.body;

    if (password !== confPassword) {
      return response(
        400,
        null,
        "Password dan confirm password tidak cocok",
        res
      );
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await Users.create({
      username: username,
      role: role,
      password: hashPassword,
    });
    return response(200, null, "Register Berhasil", res);
  } catch (error) {
    console.log(error);
    return response(500, null, "gagal melakukan registrasi", res);
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Users.findOne({
      where: { username },
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
        },
      ],
    });
    if (!user) return response(404, null, "Username tidak di temukan", res);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return response(400, null, "Wrong password", res);

    const UserId = user.user_id;
    const Username = user.username;
    const UserType = user.user_type;

    const accessToken = jwt.sign(
      { UserId, Username, UserType },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { UserId, Username, UserType },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: { user_id: UserId },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const userData = {
      user_id: user.user_id,
      username: user.username,
      user_type: user.user_type,
      role: user.role,
      guru: user.guru
        ? {
            nip: user.guru.nip,
            nama_lengkap: user.guru.nama_lengkap,
            jenis_kelamin: user.guru.jenis_kelamin,
            tanggal_lahir: user.guru.tanggal_lahir,
            alamat: user.guru.alamat,
            no_telepon: user.guru.no_telepon,
            email: user.guru.email,
            jabatan: user.guru.jabatan,
            mata_pelajaran: user.guru.mata_pelajaran,
            foto_profile: user.guru.foto_profile,
            status: user.guru.status,
          }
        : null,
    };

    return response(
      200,
      { accessToken, user: userData },
      "login berhasil",
      res
    );
  } catch (error) {
    console.error(error);
    return response(500, null, "Terjadi kesalahan saat login", res);
  }
};

const Logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return response(204, null, "no content", res);

    const user = await Users.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!user) return response(204, null, "no content", res);

    await Users.update(
      { refresh_token: null },
      {
        where: { user_id: user.user_id },
      }
    );

    res.clearCookie("refreshToken");
    return response(200, null, "Berhasil logout", res);
  } catch (error) {
    console.error("logout error", error);
    return response(500, null, "Terjadi kesalahan pada server", res);
  }
};

module.exports = { Register, login, Logout };
