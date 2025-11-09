const {Sequelize, DataTypes} = require ('sequelize')
const db = require ('../config/database')

const Users = db.define('users',{
    user_id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    username:{
        type: DataTypes.STRING,
        unique: true
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    role:{
        type: DataTypes.ENUM('admin','guru','murid'),
        allowNull: false
    },
    user_type:{
        type: DataTypes.ENUM('guru','murid'),
        allowNull:true
    },
    refresh_token:{
        type: DataTypes.STRING
    },
},{
    freezeTableName:true
});

module.exports = Users