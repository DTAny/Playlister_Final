const { DataTypes } = require('sequelize');
const sequelize = require('../db')

const Song = sequelize.define('Song', {
    sid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    PlaylistPid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    artist: {
        type: DataTypes.STRING,
        allowNull: false
    },
    youtubeId: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = Song
