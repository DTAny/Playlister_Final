const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const auth = require('../auth')
const router = express.Router()

router.post('/playlist', auth.verify, PlaylistController.createPlaylist)
router.post('/playlist/:id', auth.verify, PlaylistController.duplicatePlaylist)
router.delete('/playlist/:id', auth.verify, PlaylistController.deletePlaylist)
router.get('/playlist', PlaylistController.getAllPlaylists)
router.get('/playlist/user', auth.verify, PlaylistController.getUserPlaylists)
router.get('/playlist/:id', PlaylistController.getPlaylistById)
router.put('/playlist/:id', auth.verify, PlaylistController.updatePlaylist)

router.post('/playlist/:id/song/:index', auth.verify, PlaylistController.addSong)
router.delete('/playlist/:id/song/:index', auth.verify, PlaylistController.deleteSong)
router.put('/playlist/:id/song/:index', auth.verify, PlaylistController.editSong)

router.post('/playlist/:id/comment', auth.verify, PlaylistController.addComment)
router.get('/playlist/:id/comment', PlaylistController.getComments)

router.post('/playlist/:id/like', auth.verify, PlaylistController.addLike)
router.delete('/playlist/:id/like', auth.verify, PlaylistController.deleteLike)
router.put('/playlist/:id/like', auth.verify, PlaylistController.editLike)

router.post('/playlist/:id/publish', auth.verify, PlaylistController.publishPlaylist)

router.put('/playlist/:id/play', PlaylistController.incrPlays)

router.all('/test', PlaylistController.test)


module.exports = router