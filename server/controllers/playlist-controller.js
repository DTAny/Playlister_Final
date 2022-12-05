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
    let newPlaylist = await Playlist.create({
        UserUid: user.uid,
        name: newName,
        ownerUsername: user.username,
        editedAt: Date.now(),
    });
    await user.save();
    newPlaylist = await Playlist.findByPk(newPlaylist.pid, {include: Song});
    return res.status(200).json({
        playlist: newPlaylist
    });
}

duplicatePlaylist = async (req, res) => {
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
        editedAt: Date.now(),
    });

    let newSongsOrder = [];
    let tmp = playlist.songsOrder;
    for (let i = 0; i < tmp.length; i++){
        let oldSong = await Song.findByPk(tmp[i]);
        let newSong = await Song.create({
            PlaylistPid: newPlaylist.pid,
            title: oldSong.title,
            artist: oldSong.artist,
            youtubeId: oldSong.youtubeId
        })
        newSongsOrder.push(newSong.sid);
    }
    console.log("songsOrder: " + JSON.stringify(newSongsOrder));
    newPlaylist.songsOrder = newSongsOrder;
    await newPlaylist.save();

    return res.status(200).json({
        success: true,
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

getAllPlaylists = async (req, res) => {
    let playlists = await Playlist.findAll({include: [Song, Comment, Like ],});
    return res.status(200).json({ success: true, data: playlists })
}

getUserPlaylists = async (req, res) => {
    let playlists = await Playlist.findAll({where: {UserUid: req.userId}, include: [Song, Comment, Like]});
    return res.status(200).json({ success: true, data: playlists })
}

updatePlaylist = async (req, res) => {
    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    let playlist = await Playlist.findByPk(req.params.id, {include: Song});
    if (!playlist) {
        return res.status(200).json({
            message: 'Playlist not found!',
        });
    }
    if (playlist.UserUid != req.userId){
        console.log("incorrect user!");
        return res.status(200).json({ success: false, description: "authentication error" });
    }
    if (playlist.published){
        console.log("Playlist already published.");
        return res.status(200).json({ success: false, description: "Playlist already published."});
    }
    let existPlaylist = await Playlist.findOne({where: {UserUid: playlist.UserUid, name: body.playlist.name}});
    if (existPlaylist) {
        if (existPlaylist.pid !== body.playlist.pid){
            console.log("Playlist name duplicated.");
            return res.status(200).json({ success: false, description: "Playlist name duplicated."});
        }
    }
    playlist.name = body.playlist.name;
    playlist.songsOrder = body.playlist.songsOrder;
    playlist.editedAt = Date.now();
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
    tmp.splice(req.params.index, 0, song.sid);
    playlist.songsOrder = tmp;
    playlist.editedAt = Date.now();
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
    playlist.editedAt = Date.now();
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
    playlist.editedAt = Date.now();
    playlist.save();
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
    if (!playlist.published){
        console.log("Playlist did not publish.");
        return res.status(400).json({ success: false, description: "Playlist did not publish."});
    }
    let like = await Like.findOne({where: {
        UserUid: req.userId,
        PlaylistPid: req.params.id
    }})
    if (like){
        playlist.likes -= like.isLike ? 1 : 0;
        playlist.dislikes -= like.isLike ? 0 : 1;
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
    if (!playlist.published){
        console.log("Playlist did not publish.");
        return res.status(400).json({ success: false, description: "Playlist did not publish."});
    }
    let like = await Like.findOne({where: {
        PlaylistPid: playlist.pid,
        UserUid: req.userId,
    }});
    if (!like){
        return res.status(404).json({
            message: 'Like not found!',
        });
    }
    playlist.likes += body.isLike - like.isLike;
    playlist.dislikes -= body.isLike - like.isLike
    await playlist.save();
    like.isLike = body.isLike;
    await like.save();
    console.log(JSON.stringify(like));
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

test = async (req, res) => {
    const bcrypt = require('bcryptjs')
    let testList = [
        "_2-Y2WbrKpw",
        "_m-gO0HSCYk",
        "_mVW8tgGY_w",
        "_p2IA0x4QG8",
        "_px0GkJEvcA",
        "_qJjM7ZoSuk",
        "_RRjxHWA338",
        "_tmIbmJeLqE",
        "-6eo5K536lo",
        "-GSI1wFjb-Y",
        "-Sy0C55ryXc",
        "-Yx7akG0lFo",
        "0-rg7EIt1x4",
        "09R8_2nJtjg",
        "0qanF-91aJo",
        "1aOSMxeYQPY",
        "1emA1EFsPMM",
        "1fDTGx1t8aM",
        "1jxt5Vy0hq4",
        "1MvzHGmwgvg",
        "1rwAvUvvQzQ",
        "1uNjO_U9ps4",
        "24bfY7DBdDM",
        "2eeKm5zzJ5o",
        "2Fz3zFqLc3E",
        "2GcKrCnDBf4",
        "2JLMtmUxKZI",
        "2k5w6eTxGXk",
        "2u-n__lHhWU",
        "2UcZWXvgMZE",
        "30ovJaTfpUE",
        "3Cmu1z82kXM",
        "3OdoGBuDoyo",
        "3rzgrP7VA_Q",
        "3SCBYUE_X1U",
        "3sh4kz_zhyo",
        "4_TdJgjh5vQ",
        "4_TdJgjh5vQ",
        "4453Ru7n_Mk",
        "471e8kaGen0",
        "4CuJqtNdcJU",
        "4dnT-kKIO6Y",
        "4gXAcoBT_XI",
        "4iTAkRHGbuM",
        "4nyld2SqleU",
        "4rhp7Q7Ceq8",
        "4RNmG2J--HA",
        "5-ef6XG0MrQ",
        "5a1GZ0fs1Tg",
        "5IpYOF4Hi6Q",
        "5OZ-JOSWx1Q",
        "5rCiLDbDcOc",
        "5yakBpvS9pY",
        "5z3RcFMO_qg",
        "623JGFAYZ3w",
        "65IKNssGRPI",
        "67hw7hj_xkc",
        "68ugkg9RePc",
        "6eWIffP2M3Y",
        "6IZI3f53S6U",
        "6KuLQ4NNtts",
        "6KXyaAt0L1o",
        "6OkneaH-eTA",
        "6TolbTZXDjI",
        "6vnMmB1qp2Y",
        "78VDuGTZdO0",
        "7940nuwCEYA",
        "7j6C9METNm0",
        "7xkM8mWC4Kk",
        "8AYy-BcjRXg",
        "8CwFNFGSQV0",
        "8diNtEqmKhE",
        "8m3Is1t53uE",
        "8n5dJwWXrbo",
        "8Ndzz49NEZY",
        "8Ne7k236ORk",
        "8OkpRK2_gVs",
        "8plwv25NYRo",
        "8rLLm7Kjt-A",
        "8UbNbor3OqQ",
        "8uZGBbic0a4",
        "994e1ebylsA",
        "9bZkp7q19f0",
        "9e_2Ry2RHhI",
        "9E6b3swbnWg",
        "9GVT5qneccU",
        "9wiEM0s4aCQ",
        "9YJk3tTDSXA",
        "9ZEURntrQOg",
        "9ZozITxuNKo",
        "A4BuvEQnT4M",
        "A4JWkW0oROg",
        "a51VH9BYzZA",
        "a7fzkqLozwA",
        "aa9LI4gg9W8",
        "AB6sOhQan9Y",
        "aBkTkxKDduc",
        "aDkUgpCRUS4",
        "AE5hNBEDXvU",
        "aEtqFWKKbbM",
        "AeUeLzBO0go",
        "AeUeLzBO0go",
        "AeUeLzBO0go",
        "amOSaNX7KJg",
        "aMyO6GNkfpo",
        "AQx_KMoCgJU",
        "aSQwI3rDETk",
        "astISOttCQ0",
        "AV9ADodnsoM",
        "axb48YrvRmw",
        "aZLuqufrhNo",
        "b1kbLwvqugk",
        "B1lNhNHdoPI",
        "B4gXEOUdsvo",
        "B6AzPtUy3L8",
        "BEXL80LS0-I",
        "BEXL80LS0-I",
        "beZFLT0Ixag",
        "BHfL4ns7-CM",
        "bJ3EWD6GLck",
        "bJPcjoHWoZg",
        "BpOJyPdolck",
        "bzxjS3R3T3s",
        "c47zK-Ws5mE",
        "c6ASQOwKkhk",
        "cAD9rMrWc_U",
        "cAeC2vlHWqA",
        "ccjZSvweKR4",
        "CD-E-LDc384",
        "CdV6TBoGDhs",
        "CfihYWRWRTQ",
        "Clu-_Izezcg",
        "cNGJ1bf8XUU",
        "cNGJ1bf8XUU",
        "cNPPXKaSgjA",
        "COz9lDCFHjw",
        "CpSnnlzbO9o",
        "cPWBG6_jn4Y",
        "cPWBG6_jn4Y",
        "CRHvTTOR8Ns",
        "cusA8wYBZKU",
        "cvQ2LF3hyuY",
        "cXM1ZjrxlF0",
        "cXM1ZjrxlF0",
        "CYRyaDPXwQE",
        "D-V0EHF30rk",
        "D0ehC_8sQuU",
        "D0ehC_8sQuU",
        "D4lfbKy9ceU",
        "d6BIUn3mh7A",
        "d6h9krFnxxQ",
        "dGZqpVCJP3k",
        "DiV7KrDl1Dc",
        "DmWWqogr_r8",
        "dng9cSDUmuY",
        "dp23xUkfrPE",
        "dQw4w9WgXcQ",
        "dQw4w9WgXcQ",
        "dR4IwtiEbyo",
        "DSWYAclv2I8",
        "duyhQ8a2SO4",
        "dv13gl0a-FA",
        "dvrBEyKdIiU",
        "dVVZaZ8yO6o",
        "DwfPlzQ1x_g",
        "DXuNJ267Vss",
        "DXuNJ267Vss",
        "DXuNJ267Vss",
        "DYed5whEf4g",
        "e0_V8IoYSLU",
        "e1FN047_LT0",
        "E8gmARGvPlI",
        "ecnb7qOl4Pc",
        "eEV4E2ujwns",
        "efrVSI3yVSA",
        "EG_CmgmltWQ",
        "EG_CmgmltWQ",
        "EGXPAoyP_cg",
        "EIG3Dvb4K5k",
        "EigJS-ffwV8",
        "eIh_bxOMjtQ",
        "EIRguVEYPeQ",
        "EJVt8kUAm9Q",
        "EkiIH8kh6HI",
        "emNwnxP0PLk",
        "enuOArEfqGo",
        "eplzPG_7rCE",
        "ESx_hy1n7HA",
        "f_raDpgx_3M",
        "F0B7HDiY-10",
        "F1_OQXNF8b8",
        "F5tSoaJ93ac",
        "fB8TyLTD7EE",
        "fB8TyLTD7EE",
        "fCO7f0SmrDc",
        "FDevFzJFi9w",
        "fe5KbMVL5QI",
        "fEn339bmHuI",
        "FepCyK6YlFw",
        "FepCyK6YlFw",
        "fevB6h3-kfE",
        "fJ9rUzIMcZQ",
        "fKLV8GCrveQ",
        "FKOxIILgSD0",
        "Fl0YWLT6iFE",
        "FlEr0JEw2vg",
        "fLj1VtiweOI",
        "fmI_Ndrxy14",
        "fmNtOgVZXYA",
        "fmNtOgVZXYA",
        "fOSVzv3iioE",
        "FoYK1AinPnE",
        "fP8ElyrwtEc",
        "Fp8msa5uYsc",
        "fRh_vgS2dFE",
        "FsK4rxMO85A",
        "FsK4rxMO85A",
        "FuLWFwfXFwQ",
        "fyifGO5P1Rg",
        "FZGeR5jTrO4",
        "fzQ6gRAEoy0",
        "fzQ6gRAEoy0",
        "g6cIGXthMcA",
        "GfxoC8frUSU",
        "GfxoC8frUSU",
        "GhkSXU-3vjY",
        "GLSM9d3qFXM",
        "gm4hTcRhoqI",
        "GPhCOI2S-2w",
        "GPhCOI2S-2w",
        "gQlMMD8auMs",
        "gsbZ3KX2CR8",
        "GSEsTx3PrrI",
        "gzbLODUb1sA",
        "gzbLODUb1sA",
        "gzbLODUb1sA",
        "GzU8KqOY8YA",
        "h_Gn10GA7ls",
        "h-ueIYcbKtg",
        "h28xpNvW9Yw",
        "h28xpNvW9Yw",
        "H5v3kku4y6Q",
        "hAVRXsYZsqo",
        "Hbb5GPxXF1w",
        "Hg3pdSzbW5Y",
        "HgzGwKwLmgM",
        "Hh9yZWeTmVM",
        "HlL9URwmSCo",
        "hm1na9R2uYA",
        "hnsXHQf0DyA",
        "hqunRm_dSHw",
        "HUhqDKKWHfk",
        "HVmpI3d11oM",
        "HVU27pIZUrQ",
        "hwZNL7QVJjE",
        "HYsz1hP0BFo",
        "HYsz1hP0BFo",
        "i-_1Os7hVDw",
        "I-sH53vXP2A",
        "i0MrGb1hT2U",
        "i1IKnWDecwA",
        "i1IKnWDecwA",
        "i7ouv9AyB_o",
        "iBAEt06J2Ho",
        "IG79CHK1oFQ",
        "IJNR2EpS0jw",
        "iq_d8VSM0nw",
        "IRQS0GEDX-Q",
        "IX1zicNRLmY",
        "IxcxyGDD38E",
        "iYKXdt0LRs8",
        "izGwDsrQ1eQ",
        "J-GJM7KpYXE",
        "J7p4bzqLvCw",
        "JDb3ZZD4bA0",
        "JGwWNGJdvx8",
        "jJvDnYdD8JQ",
        "jK2aIUmmdP4",
        "jlxMRSum3fo",
        "jLXTBbMRxK8",
        "Jm5DjptGtJo",
        "JNM3G5nGf0g",
        "JNsYaefCe-Y",
        "JQhjXXJpjlk",
        "Jrg9KxGNeJY",
        "jvpY3cdwfyo",
        "JwLZjo6as1I",
        "jYSlpC6Ud2A",
        "K19M4o6vRL8",
        "k2B_-LKov7I",
        "K4DyBUG242c",
        "K4DyBUG242c",
        "KAwyWkksXuo",
        "KbN3IQNN4Cc",
        "KE069_SR4EA",
        "KE069_SR4EA",
        "kEAp_Z9cpZ4",
        "kKR3ZWU14X4",
        "KNcaw0Ye69g",
        "kOCkne-Bku4",
        "KPk90OeyZeg",
        "kpnW68Q8ltc",
        "KrNUrgaOsCc",
        "KTdFszcZp-I",
        "KTdFszcZp-I",
        "KuRoG6s2kO4",
        "KuRoG6s2kO4",
        "kvazBqAlx58",
        "Kz3gDpoZsoE",
        "L0wusEVceek",
        "L2xLbDlNhFo",
        "L4dXt2CA8-E",
        "LBr7kECsjcQ",
        "lhX064AiyGg",
        "lk_OmIUdwnM",
        "LK3C9IytrLI",
        "lKyYeghtfXc",
        "lL33M9e-g8Q",
        "lPYEfpAGQxw",
        "LQwfYuIrQF8",
        "lvHZjvIyqsk",
        "lwF169JPI3Q",
        "lWMCP4advDE",
        "lwvV6vOKc7o",
        "lwvV6vOKc7o",
        "m4OnAwaDVTE",
        "M4ZoCHID9GI",
        "M6gcoDN9jBc",
        "M6gcoDN9jBc",
        "M7lIml8-eHU",
        "mBuHQeL-OO8",
        "mDmbEUvQLqU",
        "MEkaqZecpUQ",
        "MeljgyLR2D0",
        "mHPx-nPcMJk",
        "mkR_Qwix4Ho",
        "mmCnQDUSO4I",
        "mobtxEJHhY4",
        "MOWDb2TBYDg",
        "mPGv8L3a_sY",
        "mqmxkGjow1A",
        "MtN1YnoL46Q",
        "MtN1YnoL46Q",
        "mw-i9o2nEbI",
        "mw-i9o2nEbI",
        "MWSR17vEVBw",
        "MX4epLG8XtA",
        "mxygNM3b95M",
        "n5sjpCQhTDk",
        "n61ULEU7CO0",
        "N8LTYhqpEXc",
        "n9ta1Pgeu80",
        "n9Z98wrRnmw",
        "naQjypGoOHY",
        "naQjypGoOHY",
        "nCaqf9WhqOY",
        "nCaqf9WhqOY",
        "njos57IJf-0",
        "nJqMPnVWpkY",
        "NkQrKxTFARM",
        "nM0xDI5R50E",
        "NmUFZupivCQ",
        "NOjLcrmiXpw",
        "np9Ub1LilKU",
        "Ns3YxbIhTRM",
        "Nt81gzIAt18",
        "ntn6q-ODULo",
        "NUiwTwpPGRk",
        "nZuyfvG2L6Y",
        "O6yWLr0z9Qg",
        "O6yWLr0z9Qg",
        "oBpaB2YzX8s",
        "OdFPsSHau_Q",
        "OdFPsSHau_Q",
        "oIk-5C4PW-s",
        "oIk-5C4PW-s",
        "OjNpRbNdR7E",
        "Oll7pr4JVTQ",
        "om4MtG_stsU",
        "omgSWqwVTjY",
        "omzxE07hbwk",
        "ony539T074w",
        "ONYhPrOl5EU",
        "OpTKLNjUdwQ",
        "oUpqD7s2wc",
        "ouUeRx0OHPw",
        "OYD9ThwAbBw",
        "P2l0lbn5TVg",
        "p7ZsBPK656s",
        "PB3XWE57ngs",
        "pbJ0ynnsgn0",
        "PDJLvF1dUek",
        "PEM0Vs8jf1w",
        "PEM0Vs8jf1w",
        "PEM0Vs8jf1w",
        "PEM0Vs8jf1w",
        "PEnJbjBuxnw",
        "phOW1dK-gSg",
        "pifBpLAun6U",
        "PKB4cioGs98",
        "pM-jOfy_1jM",
        "pNfTK39k55U",
        "PNg9LA25zLs",
        "PNgcL_MbiW0",
        "POe9SOEKotk",
        "POe9SOEKotk",
        "POH14-HMGFc",
        "pSDZveD8ZGQ",
        "PUZn1I6llJs",
        "pvpCX9qtyZE",
        "pXUvmxZjTDc",
        "q-74HTjRbuY",
        "q0hyYWKXF0Q",
        "q6kzYPfhilg",
        "Qa9PkDZkyHg",
        "QcIy9NiNbmo",
        "QfAOdrR_6UU",
        "QHRuTYtSbJQ",
        "qkDqCSgbluI",
        "QkfzSDI_eYo",
        "Qq6L2F8ae4Q",
        "QsuAKlNe_rI",
        "qU9mHegkTc4",
        "qUuK1rdmuv4",
        "qUuK1rdmuv4",
        "quYjN57Tycg",
        "QvMzdXxq-LE",
        "QZWmkXC-81g",
        "R_NsDmpu-Wc",
        "R_NsDmpu-Wc",
        "r6zIGXun57U",
        "r6zIGXun57U",
        "r7Rn4ryE_w8",
        "raU_lWbIYSo",
        "Rbgw_rduQpM",
        "re7QZ2JPj8M",
        "RFtRq6t3jOo",
        "rg6CiPI6h2g",
        "rPCEVZjGrmg",
        "rUuusqy50yk",
        "rv8agst9o_0",
        "S2PVsv2K1Bg",
        "S2PVsv2K1Bg",
        "S6Y1gohk5-A",
        "SAXid9er-FM",
        "SAXid9er-FM",
        "sCNrK-n68CM",
        "sd-dK8OqtVU",
        "sFIXA0zALWU",
        "sgLvV2pX9V0",
        "SiImLIcnZq0",
        "skHwjaZPKfs",
        "sLG06iO64VI",
        "soL8JK6kALc",
        "sqQQvXE6Z5w",
        "SRbhLtjOiRc",
        "sUAkklAqqTc",
        "t_B_douwaoc",
        "T_TZrng3pDU",
        "TA6wCQcPNWs",
        "tas0O586t80",
        "tcv0Ct53SKo",
        "TJhlssNwpNw",
        "TNZ7gllxeZs",
        "tPMFAbhlDbU",
        "TQTlCHxyuu8",
        "TxHDgYudt6I",
        "tz82xbLvK_k",
        "tz82xbLvK_k",
        "U2b5i3EYPuU",
        "U2b5i3EYPuU",
        "Uciw0RiY9yU",
        "UctriMuXYS0",
        "UD0DSSM2mCs",
        "uEp2OvxjWP4",
        "UfEQZhEXtIs",
        "ufluHg0S7dE",
        "UfpPTQHtdcM",
        "UFQT5qjpusg",
        "ummqpn35FW8",
        "uSD4vsh1zDA",
        "UsR08cY8k0A",
        "UsR08cY8k0A",
        "uu7j_xljCRY",
        "uu7j_xljCRY",
        "uXqEpWtcaM0",
        "V0HCZ4YGqbw",
        "v0T9q628Uiw",
        "v1K4EAXe2oo",
        "v7HAVTyvLqI",
        "V7UgPHjN9qE",
        "V8RkqQ8fQs4",
        "vfc42Pb5RA8",
        "vJMMf-z25I0",
        "Vk8QSqPC5TA",
        "vL3r-xF6bAQ",
        "vL3r-xF6bAQ",
        "VoDzszACu_c",
        "VP4unOtFwSU",
        "VQLvGljJS64",
        "VXjJiuE2Brw",
        "wcpQ3aarHRU",
        "wEbbIMjPmeE",
        "wEbbIMjPmeE",
        "WfHZUS_ju0E",
        "WILNIXZr2oc",
        "wKz3465xgFE",
        "WM133A3vqLE",
        "WNOppbVkKu8",
        "wO0A0XcWy88",
        "WoCLcJnRcag",
        "WPASycaD8Jg",
        "wsgS6WzAfO8",
        "x_OwcYTNbHs",
        "X_XGxzMrq04",
        "x-IBO22vfaM",
        "x-XtBgTWCuE",
        "x-xTttimcNk",
        "X09Mdwve2XE",
        "X2DUpDxFJyg",
        "x6wxm0POHBE",
        "xBaixGPk8xE",
        "xc_0wfIuuzw",
        "XCiDuy4mrWU",
        "xfeys7Jfnx8",
        "xgiN9zNZCuM",
        "XHQ6M4Pa-50",
        "xKbIQaKEE8s",
        "XKQNJzquduI",
        "xm3YgoEiEDc",
        "xpRgR-tZEpk",
        "XSXVHqP07n4",
        "xTttimcNk",
        "XWlrg-tFWlI",
        "y_sk7tbZCTE",
        "Y0Dwk1vi5Lw",
        "Y6ljFaKRTrI",
        "Y7lmAc3LKWM",
        "y8trd3gjJt0",
        "YA2h9PrIUxs",
        "YA2h9PrIUxs",
        "yCjJyiqpAuU",
        "yehwi5yBylk",
        "yi57SoIygY4",
        "yJg-Y5byMMw",
        "yJvqm-L6P1c",
        "YJyNoFkud6g",
        "YkADj0TPrJA",
        "Ym1sMLvsVes",
        "YqeW9_5kURI",
        "yQLoGiVhE30",
        "yQLoGiVhE30",
        "YRa_I2Wp0mI",
        "YRa_I2Wp0mI",
        "yrKKj5z-Xlc",
        "yrKKj5z-Xlc",
        "yT5Nhm2MpZI",
        "YTFyp3kjisA",
        "YvTJOOGgZKs",
        "yxH0r2Z8ce4",
        "yXl5D2B8nKk",
        "yYPcUkIVWXA",
        "yzqDdXbNuUQ",
        "z2vaSlpliEs",
        "Z3GkhV5Bk78",
        "z4ITR9slvEM",
        "ZEcqHA7dbwM",
        "Zf-qrWoAMX4",
        "zhIScvlFn2w",
        "zhIScvlFn2w",
        "ZJwy9jTiyu4",
        "zL19uMsnpSU",
        "zLYIvO4EZJ4",
        "zP_lAuTRRCI",
        "ZPGi2yBqdqw",
        "zqZt6VNnEIA",
        "ZsmOSHt3MmE",
        "Zxa3CPFCtpI",
        "zyXmsVwZqX4",
        "zyXmsVwZqX4"
    ];
    console.log(JSON.stringify(testList));
    for (let i = 0; i < testList.length; i += 25){
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash('00000000', salt);
        const user = await User.create({
            firstName: `${i / 25 + 1}`, 
            lastName: `${i / 25 + 1}`,
            username: `User ${i / 25 + 1}`, 
            email: `${i / 25 + 1}`, 
            passwordHash: passwordHash
        });
        for (let k = 0; k + i < testList.length && k < 25; k += 5){
            let playlist = await Playlist.create({
                UserUid: user.uid,
                name: "Test Playlist " + ((i + k) / 5),
                ownerUsername: user.username,
                editedAt: Date.now(),
            });
            for (let l = 0; k + i + l < testList.length && l < 5; l++){
                let song = await Song.create({
                    PlaylistPid: playlist.pid,
                    title: "Test Song " + (i + k + l),
                    artist: "Test Artist " + (i + k + l),
                    youtubeId: testList[i + k + l],
                })
                let tmp = playlist.songsOrder;
                tmp.splice(0, 0, song.sid);
                playlist.songsOrder = tmp;
                await playlist.save();
            }
        }
    }
    return res.status(200).json({
        success: true,
    });
}

module.exports = {
    createPlaylist,
    duplicatePlaylist,
    deletePlaylist,
    getPlaylistById,
    getAllPlaylists,
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
    test
}