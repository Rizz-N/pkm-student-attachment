const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/database");
const Guru = require("./Guru");
const Murid = require("./Murid");

const Kelas = db.define(
  "kelas",
  {
    kelas_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    kode_kelas: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    nama_kelas: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    wali_kelas_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Guru,
        key: "guru_id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

Kelas.belongsTo(Guru, { foreignKey: "wali_kelas_id", as: "walikelas" });
Guru.hasMany(Kelas, { foreignKey: "wali_kelas_id", as: "kelasDibimbing" });

Kelas.hasMany(Murid, { foreignKey: "kelas_id", as: "muridKelas" });
Murid.belongsTo(Kelas, { foreignKey: "kelas_id", as: "kelas" });

module.exports = Kelas;
