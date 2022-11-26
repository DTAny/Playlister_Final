const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Playlist = sequelize.define('Playlist', {
    pid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UserUid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ownerUsername: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    dislikes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    plays: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    editedAt: {
        type: DataTypes.DATE,
        defaultValue: null
    },
    publishedAt: {
        type: DataTypes.DATE,
        defaultValue: null
    },
    songsOrder: {
        type: DataTypes.STRING,
        defaultValue: "",
        get(){
            let str = this.getDataValue('songsOrder');
            if (str === "") return [];
            return str.split(',');
        },
        set(value){
            return this.setDataValue('songsOrder', value.join(','))
        }
    }
});

module.exports = Playlist
