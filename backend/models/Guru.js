const { Sequelize, DataTypes } = require ('sequelize')
const response = require ('../config/response')
const db = require('../config/database')
const Users = require ('./UserModel')
const bcrypt = require ('bcrypt')

const Guru = db.define('guru',{
    guru_id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    nip:{
        type: DataTypes.STRING,
        unique: true,
        allowNull:false
    },
    nama_lengkap:{
        type: DataTypes.STRING,
        allowNull: false
    },
    jenis_kelamin:{
        type: DataTypes.ENUM('laki-laki','perempuan'),
        allowNull: false
    },
    tanggal_lahir:{
        type: DataTypes.DATEONLY
    },
    alamat:{
        type: DataTypes.STRING
    },
    no_telepon:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    },
    jabatan:{
        type: DataTypes.STRING
    },
    mata_pelajaran:{
        type: DataTypes.STRING,
        allowNull: true
    },
    foto_profile:{
        type: DataTypes.STRING
    },
    status:{
        type: DataTypes.ENUM('aktif','non-aktif'),
        defaultValue: 'aktif'
    },
    user_id:{
        type :DataTypes.INTEGER,
        allowNull: true,
        references:{
            model: Users,
            key: 'user_id'
        }
    }
},{
    freezeTableName:true
});

Guru.afterCreate(async (guru) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(guru.nip, salt)

        const newUser = await Users.create({
            username: guru.nip,
            password: hashPassword,
            role: 'guru',
            user_type: 'guru'
        })

        await guru.update({user_id: newUser.user_id});

       console.log(`akun untuk guru ${guru.nama_lengkap} berhasil dibuat`)
    } catch (error) {
        console.error('gagal membuat akun guru', error)
    }
})

Guru.belongsTo(Users,{foreignKey:'user_id', onDelete: 'CASCADE'});
Users.hasOne(Guru, {foreignKey: 'user_id'});

module.exports = Guru;