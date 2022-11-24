const { DataTypes } = require('sequelize');
const sequelize = require('../db')

const Comment = sequelize.define('Comment', {
    cid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    PlaylistPid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ownerUsername: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
});



module.exports = Comment
