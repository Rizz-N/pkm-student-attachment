const {Sequelize, DataTypes } = require ('sequelize')
const db = require('../config/database')
const Users = require('./UserModel')

const Murid = db.define('murid',{
    murid_id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    nis:{
        type: DataTypes.STRING,
        unique: true
    },
    nisn:{
        type: DataTypes.STRING,
        unique: true
    },
    nama_lengkap:{
        type: DataTypes.STRING,
        allowNull: false
    },
    jenis_kelamin:{
        type: DataTypes.ENUM('laki-laki','perempuan'),
        allowNull: false
    },
    kelas_id:{
        type: DataTypes.INTEGER
    },
    tanggal_lahir:{
        type: DataTypes.DATEONLY
    },
    agama:{
        type: DataTypes.ENUM('Islam','Kristen','Khatolik','Hindu','Budha','Konghucu'),
        allowNull: true
    },
    alamat:{
        type: DataTypes.STRING
    },
    no_telepon:{
        type: DataTypes.STRING
    },
    nama_orangtua:{
        type: DataTypes.STRING
    },
    no_telepon_orangtua:{
        type: DataTypes.STRING
    },
    foto_profile:{
        type: DataTypes.STRING
    },
    tahun_masuk:{
        type: DataTypes.DATEONLY
    },
    status:{
        type: DataTypes.ENUM('aktif','non-aktif'),
        defaultValue: 'aktif'
    },
},{
    freezeTableName:true,
    timestamps: true
});

Murid.belongsTo(Users,{foreignKey:'user_id', onDelete: 'CASCADE'});
Users.hasOne(Murid, {foreignKey: 'user_id'});

module.exports = Murid