// const mysql = require('mysql2');
// const dotenv = require('dotenv');
// dotenv.config();

// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE
//   });

const dotenv = require('dotenv');
const Sequelize = require('sequelize');
dotenv.config();

let sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD,{
  host: process.env.DB_HOST,
  dialect: 'mysql'
})

sequelize.authenticate()
.then(()=> {
  console.log("Mysql Connection is Success");
})
.catch (err=> {
  console.log(err);
})

module.exports = sequelize

