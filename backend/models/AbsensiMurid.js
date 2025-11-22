const { Sequelize, DataTypes } = require ('sequelize')
const db = require('../config/database')
const Murid = require ('./Murid')
const Kelas = require('./Kelas')

const AbsensiMurid = db.define('absensi_murid',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    murid_id:{
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
    semester:{
        type: DataTypes.ENUM('Ganjil', 'Genap'),
        allowNull: false
    },
    status:{
        type: DataTypes.ENUM('Hadir', 'Tidak Hadir', 'Izin')
    },
    keterangan:{
        type: DataTypes.STRING,
        allowNull: true
    },
},{
    freezeTableName:true,
    timestamps: true
});

Murid.hasMany(AbsensiMurid, {foreignKey: "murid_id", as: 'absensi'})
AbsensiMurid.belongsTo(Murid, {foreignKey: 'murid_id', as: 'murid'})

Kelas.hasMany(AbsensiMurid, {foreignKey:'kelas_id', as:'absensi_kelas'})
AbsensiMurid.belongsTo(Kelas, {foreignKey: 'kelas_id', as: 'kelas'})

module.exports = AbsensiMurid;