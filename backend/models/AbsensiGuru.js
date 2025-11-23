const { Sequelize, DataTypes } = require ('sequelize')
const db = require('../config/database')
const Guru = require ('./Guru')

const AbsensiGuru = db.define('absensi_guru',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    guru_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tanggal:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    jam_masuk:{
        type: DataTypes.TIME,
        allowNull: false
    },
    status:{
        type: DataTypes.ENUM('Hadir', 'Tidak Hadir', 'Izin')
    },
    guru_piket_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    keterangan:{
        type: DataTypes.STRING,
        allowNull: true
    },
},{
    freezeTableName:true,
    timestamps: true
});

AbsensiGuru.belongsTo(Guru, {foreignKey: 'guru_id', as: 'guru'});
Guru.hasMany(AbsensiGuru, {foreignKey: "guru_id", as: 'absensi'});

AbsensiGuru.belongsTo(Guru, {foreignKey: 'guru_piket_id', as: 'guruPiket'});
Guru.hasMany(AbsensiGuru,{foreignKey: 'guru_piket_id', as: 'absensiDibuat'});

module.exports = AbsensiGuru;