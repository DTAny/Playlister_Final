const Playlist = require('../models/playlist-model')
const User = require('../models/user-model');
const Song = require('../models/song-model')
const Comment = require('../models/comment-model')
const Like = require('../models/like-model')

User.hasMany(Playlist, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Playlist.belongsTo(User);

Playlist.hasMany(Song, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Song.belongsTo(Playlist);

Playlist.hasMany(Comment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Comment.belongsTo(Playlist);

User.hasMany(Like, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Playlist.hasMany(Like, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Like.belongsTo(User);
Like.belongsTo(Playlist);

createPlaylist = async (req, res) => {
    const body = req.body;
    console.log("createPlaylist body: " + JSON.stringify(body));

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }
    const user = await User.findByPk(req.userId, {include: Playlist});
    console.log("user found: " + JSON.stringify(user));
    let existPlaylist = [];
    let newName = "";
    do {
        newName = body.name + " " + user.nextNum.toString();
        existPlaylist = user.Playlists.filter((v)=>{
            return v.name === newName;
        })
        user.nextNum++;
    }
    while(existPlaylist.length !== 0);
    const newPlaylist = await Playlist.create({
        UserUid: user.uid,
        name: newName,
        ownerUsername: user.username,
    });
    await user.save();
    return res.status(200).json({
        playlist: newPlaylist
    });
}

forkPlaylist = async (req, res) => {
    const user = await User.findByPk(req.userId, {include: Playlist});
    console.log("user found: " + JSON.stringify(user));
    const playlist = await Playlist.findByPk(req.params.id);
    if (!playlist) {
        return res.status(404).json({
            success: false,
            error: 'Playlist not found.',
        })
    }
    let existPlaylist = [];
    let newName = "";
    let nextNum = 0;
    do {
        newName = playlist.name + " " + nextNum.toString();
        existPlaylist = user.Playlists.filter((v)=>{
            return v.name === newName;
        })
        nextNum++;
    }
    while(existPlaylist.length !== 0);

    const newPlaylist = await Playlist.create({
        UserUid: user.uid,
        name: newName,
        ownerUsername: user.username,
    });

    let newSongsOrder = [];
    let tmp = playlist.songsOrder;
    tmp.forEach(async (sid)=>{
        let oldSong = await song.findByPk(sid);
        let newSong = await Song.create({
            PlaylistPid: newPlaylist.UserUid,
            title: oldSong.title,
            artist: oldSong.artist,
            youtubeId: oldSong.youtubeId
        })
        newSongsOrder.push(newSong.sid);
    })
    newPlaylist.songsOrder = newSongsOrder;
    await newPlaylist.save();

    return res.status(200).json({
        playlist: newPlaylist
    });
}

deletePlaylist = async (req, res) => {
    console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    let num = await Playlist.destroy({ where: {pid: req.params.id, UserUid: req.userId}});
    if (num == 0){
        return res.status(404).json({
            errorMessage: 'Playlist not found!',
        })
    }
    return res.status(200).json({
        success: true
    });
}

getPlaylistById = async (req, res) => {
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    let playlist = await Playlist.findByPk(req.params.id, {include: [Song, Comment, Like]});
    if (!playlist){
        return res.status(400).json({ success: false, errorMessage: 'Playlist not found.'});
    }
    return res.status(200).json({ success: true, playlist: playlist })
}

getAllPlaylistsPublished = async (req, res) => {
    let playlists = await Playlist.findAll({where: {published: true}, include: [Song, Comment, Like ],});
    return res.status(200).json({ success: true, data: playlists })
}

getUserPlaylists = async (req, res) => {
    let playlists = await Playlist.findAll({where: {UserUid: req.userId}, include: [Song, Comment, Like]});
    return res.status(200).json({ success: true, data: playlists })
}

updatePlaylist = async (req, res) => {
    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));
    console.log("req.body.name: " + req.body.name);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    let playlist = await Playlist.findByPk(req.params.id, {include: Song});
    if (!playlist) {
        return res.status(404).json({
            message: 'Playlist not found!',
        });
    }
    if (playlist.UserUid != req.userId){
        console.log("incorrect user!");
        return res.status(400).json({ success: false, description: "authentication error" });
    }
    if (playlist.published){
        console.log("Playlist already published.");
        return res.status(400).json({ success: false, description: "Playlist already published."});
    }
    let existPlaylist = await Playlist.findOne({where: {UserUid: playlist.UserUid, name: body.name}});
    if (existPlaylist) {
        console.log("Playlist name duplicated.");
        return res.status(400).json({ success: false, description: "Playlist name duplicated."});
    }
    playlist.name = body.playlist.name;
    playlist.songsOrder = body.playlist.songsOrder;
    await playlist.save();
    console.log("SUCCESS!!!");
    return res.status(200).json({
        success: true,
        playlist: playlist,
        message: 'Playlist updated!',
    });
}

addSong = async (req, res) => {
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to add song',
        })
    }
    let playlist = await Playlist.findByPk(req.params.id, {include: Song});
    console.log("playlist found: " + JSON.stringify(playlist));
    if (!playlist) {
        return res.status(404).json({
            message: 'Playlist not found!',
        });
    }
    if (playlist.UserUid != req.userId){
        console.log("incorrect user!");
        return res.status(400).json({ success: false, description: "authentication error" });
    }
    if (playlist.published){
        console.log("Playlist already published.");
        return res.status(400).json({ success: false, description: "Playlist already published."});
    }
    let song = await Song.create({
        PlaylistPid: playlist.pid,
        title: body.title,
        artist: body.artist,
        youtubeId: body.youtubeId
    })
    let tmp = playlist.songsOrder;
    tmp.splice(body.index, 0, song.sid);
    playlist.songsOrder = tmp;
    console.log(JSON.stringify(playlist));
    await playlist.save();
    return res.status(200).json({
        success: true,
        song: song,
        message: 'Song added!',
    });
}

deleteSong = async (req, res) => {
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));
    let playlist = await Playlist.findByPk(req.params.id);
    console.log("playlist found: " + JSON.stringify(playlist));
    if (!playlist) {
        return res.status(404).json({
            message: 'Playlist not found!',
        });
    }
    if (playlist.UserUid != req.userId){
        console.log("incorrect user!");
        return res.status(400).json({ success: false, description: "authentication error" });
    }
    let tmp = playlist.songsOrder;
    let sid = tmp.splice(req.params.index, 1);
    playlist.songsOrder = tmp;
    await playlist.save();
    await Song.destroy({where: {sid: sid}});
    return res.status(200).json({
        success: true,
        message: 'Song deleted!',
    });
}

editSong = async (req, res) => {
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to add song',
        })
    }
    let playlist = await Playlist.findByPk(req.params.id);
    console.log("playlist found: " + JSON.stringify(playlist));
    if (!playlist) {
        return res.status(404).json({
            message: 'Playlist not found!',
        });
    }
    if (playlist.UserUid != req.userId){
        console.log("incorrect user!");
        return res.status(400).json({ success: false, description: "authentication error" });
    }
    if (playlist.published){
        console.log("Playlist already published.");
        return res.status(400).json({ success: false, description: "Playlist already published."});
    }
    let song = await Song.findByPk(playlist.songsOrder[req.params.index]);
    if (!song) {
        return res.status(404).json({
            message: 'Song not found!',
        });
    }
    song.title = body.title;
    song.artist = body.artist;
    song.youtubeId = body.youtubeId;
    await song.save();

    return res.status(200).json({
        success: true,
        song: song,
        message: 'Song edited!',
    });
}

addComment = async (req, res) => {
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to add comment',
        })
    }
    let playlist = await Playlist.findByPk(req.params.id);
    console.log("playlist found: " + JSON.stringify(playlist));
    if (!playlist) {
        return res.status(404).json({
            message: 'Playlist not found!',
        });
    }
    if (playlist.UserUid != req.userId){
        console.log("incorrect user!");
        return res.status(400).json({ success: false, description: "authentication error" });
    }
    if (!playlist.published){
        console.log("Playlist did not publish.");
        return res.status(400).json({ success: false, description: "Playlist did not publish."});
    }
    let user = await User.findByPk(req.userId);
    let comment = await Comment.create({
        PlaylistPid: playlist.pid,
        ownerUsername: user.username,
        content: body.content,
    });
    console.log(JSON.stringify(comment));
    return res.status(200).json({
        success: true,
        comment: comment,
        message: 'Comment added!',
    });
}

addLike = async (req, res) => {
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to add comment',
        })
    }
    let playlist = await Playlist.findByPk(req.params.id);
    console.log("playlist found: " + JSON.stringify(playlist));
    if (!playlist) {
        return res.status(404).json({
            message: 'Playlist not found!',
        });
    }
    if (playlist.UserUid != req.userId){
        console.log("incorrect user!");
        return res.status(400).json({ success: false, description: "authentication error" });
    }
    if (!playlist.published){
        console.log("Playlist did not publish.");
        return res.status(400).json({ success: false, description: "Playlist did not publish."});
    }
    let like = await Like.create({
        PlaylistPid: playlist.pid,
        UserUid: req.userId,
        isLike: body.isLike,
    });
    console.log(JSON.stringify(like));
    playlist.likes += body.isLike ? 1 : 0;
    playlist.dislikes += body.isLike ? 0 : 1;
    await playlist.save();
    return res.status(200).json({
        success: true,
        like: like,
        message: 'Like added!',
    });
}

deleteLike = async (req, res) => {
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to add comment',
        })
    }
    let playlist = await Playlist.findByPk(req.params.id);
    console.log("playlist found: " + JSON.stringify(playlist));
    if (!playlist) {
        return res.status(404).json({
            message: 'Playlist not found!',
        });
    }
    if (playlist.UserUid != req.userId){
        console.log("incorrect user!");
        return res.status(400).json({ success: false, description: "authentication error" });
    }
    if (!playlist.published){
        console.log("Playlist did not publish.");
        return res.status(400).json({ success: false, description: "Playlist did not publish."});
    }
    let like = await Like.findOne({where: {
        UserUid: req.userId,
        Playlist: res.params.id
    }})
    if (like){
        playlist.likes -= body.isLike ? 1 : 0;
        playlist.dislikes -= body.isLike ? 0 : 1;
        await playlist.save();
        await like.destroy();
    }
    return res.status(200).json({
        success: true,
        message: 'Like deleted!',
    });
}

editLike = async (req, res) => {
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to add comment',
        })
    }
    let playlist = await Playlist.findByPk(req.params.id);
    console.log("playlist found: " + JSON.stringify(playlist));
    if (!playlist) {
        return res.status(404).json({
            message: 'Playlist not found!',
        });
    }
    if (playlist.UserUid != req.userId){
        console.log("incorrect user!");
        return res.status(400).json({ success: false, description: "authentication error" });
    }
    if (!playlist.published){
        console.log("Playlist did not publish.");
        return res.status(400).json({ success: false, description: "Playlist did not publish."});
    }
    let like = await Like.findOne({
        PlaylistPid: playlist.pid,
        UserUid: req.userId,
    });
    if (!like){
        return res.status(404).json({
            message: 'Like not found!',
        });
    }
    like.isLike = body.isLike;
    await like.save();
    console.log(JSON.stringify(like));
    playlist.likes += body.isLike ? 1 : 0;
    playlist.dislikes += body.isLike ? 0 : 1;
    await playlist.save();
    return res.status(200).json({
        success: true,
        like: like,
        message: 'Like edited!',
    });
}
publishPlaylist = async (req, res) => {
    console.log("Publish Playlist with id: " + JSON.stringify(req.params.id));
    let playlist = await Playlist.findByPk(req.params.id);
    if (!playlist) {
        return res.status(404).json({
            message: 'Playlist not found!',
        });
    }
    if (playlist.UserUid != req.userId){
        console.log("incorrect user!");
        return res.status(400).json({ success: false, description: "authentication error" });
    }
    if (playlist.published){
        console.log("Playlist already published.");
        return res.status(400).json({ success: false, description: "Playlist already published."});
    }
    playlist.published = true;
    playlist.publishedAt = Date.now();
    await playlist.save();
    return res.status(200).json({
        success: true
    });
}
incrPlays = async (req, res) => {
    console.log("Play Playlist with id: " + JSON.stringify(req.params.id));
    let playlist = await Playlist.findByPk(req.params.id);
    if (!playlist) {
        return res.status(404).json({
            message: 'Playlist not found!',
        });
    }
    if (!playlist.published){
        console.log("Playlist did not publish.");
        return res.status(400).json({ success: false, description: "Playlist did not publish."});
    }
    await playlist.increment('plays');
    return res.status(200).json({
        success: true
    });
}
getComments = async (req, res) => {
    console.log("Play Playlist with id: " + JSON.stringify(req.params.id));
    let playlist = await Playlist.findByPk(req.params.id, {include: Comment});
    if (!playlist) {
        return res.status(404).json({
            message: 'Playlist not found!',
        });
    }
    if (!playlist.published){
        console.log("Playlist did not publish.");
        return res.status(400).json({ success: false, description: "Playlist did not publish."});
    }
    return res.status(200).json({
        success: true,
        comments: playlist.Comments
    });
}

module.exports = {
    createPlaylist,
    forkPlaylist,
    deletePlaylist,
    getPlaylistById,
    getAllPlaylistsPublished,
    getUserPlaylists,
    updatePlaylist,
    addSong,
    deleteSong,
    editSong,
    addComment,
    addLike,
    deleteLike,
    editLike,
    publishPlaylist,
    incrPlays,
    getComments,
}