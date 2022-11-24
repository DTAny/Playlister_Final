const { DataTypes } = require('sequelize');
const sequelize = require('../db')

const Like = sequelize.define('Like', {
    lid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    PlaylistPid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    UserUid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isLike: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
});

module.exports = Like
