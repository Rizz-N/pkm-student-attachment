const {Sequelize} = require('sequelize')

const db = new Sequelize('attendance_management','root','mysqlpass',{
    host: "localhost",
    dialect: "mysql"
});

module.exports = db;