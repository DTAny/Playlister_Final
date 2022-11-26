import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

export const createPlaylist = (newListName) => {
    return api.post(`/playlist/`, {
        name: newListName,
    })
}
export const forkPlaylist = (id) => api.post(`/playlist/${id}`)
export const deletePlaylistById = (id) => api.delete(`/playlist/${id}`)
export const getAllPlaylists = () => api.get(`/playlist`)
export const getUserPlaylists = () => api.get(`/playlist/user`)
export const getPlaylistById = (id) => api.get(`/playlist/${id}`)
export const updatePlaylistById = (id, playlist) => {
    return api.put(`/playlist/${id}`, {
        playlist : playlist
    })
}
export const addSongById = (id, index, title, artist, youtubeId) => {
    return api.post(`/playlist/${id}/song/${index}`, {
        title: title,
        artist: artist,
        youtubeId: youtubeId
    })
}
export const deleteSongById = (id, index) => api.delete(`/playlist/${id}/song/${index}`)
export const editSongById = (id, index, title, artist, youtubeId) => {
    return api.put(`/playlist/${id}/song/${index}`, {
        title: title,
        artist: artist,
        youtubeId: youtubeId
    })
}
export const addCommentById = (id, content) => {
    return api.post(`/playlist/${id}/comment`, {
        content: content
    })
}
export const getCommentsById = (id) => api.get(`/playlist/${id}/comment`)
export const addLikeById = (id, isLike) => {
    return api.post(`/playlist/${id}/like`, {
        isLike: isLike
    })
}
export const deleteLikeById = (id) => api.delete(`/playlist/${id}/like`)
export const editLikeById = (id, isLike) => {
    return api.put(`/playlist/${id}/like`, {
        isLike: isLike
    })
}
export const incrPlaysById = (id) => api.put(`/playlist/${id}/play`)
export const publishListById = (id) => api.post(`/playlist/${id}/publish`)

const apis = {
    createPlaylist,
    deletePlaylistById,
    getPlaylistById,
    getAllPlaylists,
    getUserPlaylists,
    updatePlaylistById,
    addSongById,
    deleteSongById,
    editSongById,
    addCommentById,
    getCommentsById,
    addLikeById,
    deleteLikeById,
    editLikeById,
    incrPlaysById,
    publishListById
}

export default apis
