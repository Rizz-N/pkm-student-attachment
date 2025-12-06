const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/database");

const Users = db.define(
  "users",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "guru", "murid"),
      allowNull: false,
    },
    user_type: {
      type: DataTypes.ENUM("guru", "murid"),
      allowNull: true,
    },
    refresh_token: {
      type: DataTypes.STRING,
    },
    user_nip: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    user_nama_lengkap: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_jenis_kelamin: {
      type: DataTypes.ENUM("laki-laki", "perempuan"),
      allowNull: true,
    },
    user_tanggal_lahir: {
      type: DataTypes.DATEONLY,
    },
    user_alamat: {
      type: DataTypes.STRING,
    },
    user_no_telepon: {
      type: DataTypes.STRING,
    },
    user_email: {
      type: DataTypes.STRING,
    },
    user_foto_profile: {
      type: DataTypes.STRING,
    },
    user_status: {
      type: DataTypes.ENUM("aktif", "non-aktif"),
      defaultValue: "aktif",
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Users;
