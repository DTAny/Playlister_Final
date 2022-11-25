import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'

export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    OPEN_LIST: "OPEN_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_LISTS: "LOAD_LISTS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    START_PLAYING: "START_PLAYING",
    PAUSE_PLAYING: "PAUSE_PLAYING",
    PLAYER_READY: "PLAYER_READY",
    LOAD_COMMENTS: "LOAD_COMMENTS",
}

const tps = new jsTPS();

const Status = {
    NONE : "NONE",
    DELETING_LIST : "DELETING_LIST",
    EDITING_SONG : "EDITING_SONG",
    REMOVING_SONG : "REMOVING_SONG"
}

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        lists: [],
        privateLists: [],
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        status: Status.NONE,
        isPlaying: false,
        playingSongs: [],
        playingSongIndex: -1,
        playingList: null,
        markedList: null,
        player: null,
    });
    const navigate = useNavigate();

    const { auth } = useContext(AuthContext);

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    lists: store.lists,
                    privateLists: store.privateLists,
                    currentList: null,
                    currentSongIndex : -1,
                    currentSong : null,
                    status: Status.NONE,
                    isPlaying: false,
                    playingSongs: store.playingSongs,
                    playingSongIndex: store.playingSongIndex,
                    playingList: store.playingList,
                    markedList: null,
                    player: store.player,
                });
            }
            case GlobalStoreActionType.OPEN_LIST: {
                return setStore({
                    lists: store.lists,
                    privateLists: store.privateLists,
                    currentList: payload,
                    currentSongIndex : -1,
                    currentSong : null,
                    status: Status.NONE,
                    isPlaying: store.isPlaying,
                    playingSongs: store.playingSongs,
                    playingSongIndex: store.playingSongIndex,
                    playingList: store.playingList,
                    markedList: null,
                    player: store.player,
                })
            }
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    lists: store.lists,
                    privateLists: store.privateLists,
                    currentList: payload,
                    currentSongIndex : -1,
                    currentSong : null,
                    status: Status.NONE,
                    isPlaying: store.isPlaying,
                    playingSongs: store.playingSongs,
                    playingSongIndex: store.playingSongIndex,
                    playingList: store.playingList,
                    markedList: null,
                    player: store.player,
                })
            }
            case GlobalStoreActionType.LOAD_LISTS: {
                return setStore({
                    lists: payload.lists,
                    privateLists: payload.privateLists,
                    currentList: null,
                    currentSongIndex : -1,
                    currentSong : null,
                    status: Status.NONE,
                    isPlaying: payload.isPlaying,
                    playingSongs: payload.playingSongs,
                    playingSongIndex: payload.playingSongIndex,
                    playingList: payload.playingList,
                    markedList: null,
                    player: payload.player,
                });
            }
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    lists: store.lists,
                    privateLists: store.privateLists,
                    currentList: null,
                    currentSongIndex : -1,
                    currentSong : null,
                    status: Status.DELETING_LIST,
                    isPlaying: store.isPlaying,
                    playingSongs: store.playingSongs,
                    playingSongIndex: store.playingSongIndex,
                    playingList: store.playingList,
                    markedList: payload,
                    player: store.player,
                });
            }
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    lists: store.lists,
                    privateLists: store.privateLists,
                    currentList: payload,
                    currentSongIndex : -1,
                    currentSong : null,
                    status: Status.NONE,
                    isPlaying: store.isPlaying,
                    playingSongs: store.playingSongs,
                    playingSongIndex: store.playingSongIndex,
                    playingList: store.playingList,
                    markedList: null,
                    player: store.player,
                });
            }
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    lists: store.lists,
                    privateLists: store.privateLists,
                    currentList: store.currentList,
                    currentSongIndex : payload.currentSongIndex,
                    currentSong : payload.currentSong,
                    status: Status.EDITING_SONG,
                    isPlaying: store.isPlaying,
                    playingSongs: store.playingSongs,
                    playingSongIndex: store.playingSongIndex,
                    playingList: store.playingList,
                    markedList: null,
                    player: store.player,
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    lists: store.lists,
                    privateLists: store.privateLists,
                    currentList: store.currentList,
                    currentSongIndex : payload.currentSongIndex,
                    currentSong : payload.currentSong,
                    status: Status.REMOVING_SONG,
                    isPlaying: store.isPlaying,
                    playingSongs: store.playingSongs,
                    playingSongIndex: store.playingSongIndex,
                    playingList: store.playingList,
                    markedList: null,
                    player: store.player,
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    lists: store.lists,
                    privateLists: store.privateLists,
                    currentList: store.currentList,
                    currentSongIndex : -1,
                    currentSong : null,
                    status: Status.NONE,
                    isPlaying: store.isPlaying,
                    playingSongs: store.playingSongs,
                    playingSongIndex: store.playingSongIndex,
                    playingList: store.playingList,
                    markedList: null,
                    player: store.player,
                });
            }
            case GlobalStoreActionType.START_PLAYING: {
                return setStore({
                    lists: store.lists,
                    privateLists: store.privateLists,
                    currentList: store.currentList,
                    currentSongIndex : -1,
                    currentSong : null,
                    status: Status.NONE,
                    isPlaying: true,
                    playingSongs: payload.playingSongs,
                    playingSongIndex: payload.playingSongIndex,
                    playingList: payload.playingList,
                    markedList: null,
                    player: store.player,
                });
            }
            case GlobalStoreActionType.PAUSE_PLAYING: {
                return setStore({
                    lists: store.lists,
                    privateLists: store.privateLists,
                    currentList: store.currentList,
                    currentSongIndex : -1,
                    currentSong : null,
                    status: Status.NONE,
                    isPlaying: false,
                    playingSongs: store.playingSongs,
                    playingSongIndex: store.playingSongIndex,
                    playingList: store.playingList,
                    markedList: null,
                    player: store.player,
                });
            }
            case GlobalStoreActionType.PLAYER_READY: {
                return setStore({
                    lists: store.lists,
                    privateLists: store.privateLists,
                    currentList: store.currentList,
                    currentSongIndex : -1,
                    currentSong : null,
                    status: Status.NONE,
                    isPlaying: false,
                    playingSongs: store.playingSongs,
                    playingSongIndex: store.playingSongIndex,
                    playingList: store.playingList,
                    markedList: null,
                    player: payload.player,
                });
            }
            default:
                return store;
        }
    }

    store.changeListName = function (id, newName, setErrMsg, setIsRenaming) {
        async function asyncChangeListName(id, newName) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                response = await api.updatePlaylistById(id, playlist);
                if (response.data.success) {
                    setIsRenaming(false);
                    store.loadLists(true);
                }
                else{
                    setErrMsg(response.data.description);
                }
            }
        }
        asyncChangeListName(id, newName);
    }

    store.closeCurrentList = function () {
        tps.clearAllTransactions();
        store.loadLists();
    }

    store.createNewList = async function () {
        let newListName = "Untitled";
        const response = await api.createPlaylist(newListName);
        console.log("createNewList response: " + response);
        if (response.status === 200) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            });
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    store.loadLists = async (isChange = false) => {
        let response = await api.getAllPlaylists();
        if (response.data.success) {
            let lists = response.data.data;
            let privateLists = [];
            try {
                response = await api.getUserPlaylists();
                if (response.data.success){
                    privateLists = response.data.data;
                }
            }
            catch (e) {}
            if (isChange && store.playingList !== null){
                for (let i = 0; i < store.lists.length; i++){
                    if (store.lists[i].pid === store.playingList.pid){
                        let newList = store.lists[i];
                        let oldList = store.playingList;
                        if (newList.name !== oldList.name || newList.songsOrder !== oldList.songsOrder){
                            storeReducer({
                                type: GlobalStoreActionType.LOAD_LISTS,
                                payload: {
                                    lists: lists,
                                    privateLists: privateLists,
                                    isPlaying: false,
                                    playingSongIndex: -1,
                                    playingSongs: [],
                                    playingList: null,
                                    player: null,
                                }
                            });
                            return;
                        }
                        break;
                    }
                }
            }
            storeReducer({
                type: GlobalStoreActionType.LOAD_LISTS,
                payload: {
                    lists: lists,
                    privateLists: privateLists,
                    isPlaying: store.isPlaying,
                    playingSongIndex: store.playingSongIndex,
                    playingSongs: store.playingSongs,
                    playingList: store.playingList,
                    player: store.player,
                }
            });
        }
        else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
    }
    store.openList = (list) => {
        storeReducer({
            type: GlobalStoreActionType.OPEN_LIST,
            payload: list
        });
    }

    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: playlist
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                store.loadListPrivate();
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.markedList.pid);
        store.hideModals();
    }
    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.status === Status.DELETING_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.status === Status.EDITING_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.status === Status.REMOVING_SONG;
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                })
            }
        }
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.Songs.length;
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    store.createSong = function(index, song) {
        let list = store.currentList;
        list.Songs.splice(index, 0, song);
        store.updateCurrentList();
    }
    store.moveSong = function(start, end) {
        let list = store.currentList;

        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        store.updateCurrentList();
    }
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        store.updateCurrentList();
    }
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "dQw4w9WgXcQ");
    }
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList.pid, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return (store.currentList !== null);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function() {
        return (store.currentList !== null);
    }

    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.showRemoveSongModal = (index, song) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {
                currentSongIndex: index,
                currentSong: song,
            }
        })
    }

    store.playerReady = (player) => {
        storeReducer({
            type: GlobalStoreActionType.PLAYER_READY,
            payload: {
                player: player
            }
        })
    }
    store.startPlaying = (index, songs, list, plays = null, setPlays = null) => {
        async function asyncStartPlaying(){
            if ((store.playingList === null || list.pid !== store.playingList.pid) && list.published){
                let response = await api.incrPlaysById(list.pid);
                if (response.data.success){
                    if (plays !== null && setPlays !== null) setPlays(plays + 1);
                    storeReducer({
                        type: GlobalStoreActionType.START_PLAYING,
                        payload: {
                            playingSongIndex: index,
                            playingSongs: songs,
                            playingList: list
                        }
                    })
                }
            }
            else {
                storeReducer({
                    type: GlobalStoreActionType.START_PLAYING,
                    payload: {
                        playingSongIndex: index,
                        playingSongs: songs,
                        playingList: list
                    }
                })
            }
        }
        asyncStartPlaying();
    }
    store.pausePlaying = () => {
        storeReducer({
            type: GlobalStoreActionType.PAUSE_PLAYING,
            payload: {}
        })
    }
    store.loadComments = (id, setComments) => {
        async function asyncLoadComments(id){
            let response = await api.getCommentsById(id);
            if (response.data.success) {
                setComments(response.data.comments);
            }
        }
        asyncLoadComments(id);
    }
    store.addComment = (id, content, setComments) => {
        async function asyncAddComment(id, content, setComments){
            let response = await api.addCommentById(id, content);
            if (response.data.success) {
                store.loadComments(id, setComments);
            }
        }
        asyncAddComment(id, content, setComments);
    }
    store.publishList = (id) => {
        async function asyncPublishList(id){
            let response = await api.publishListById(id);
            if (response.data.success) {
                store.loadLists();
            }
        }
        asyncPublishList(id);
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };