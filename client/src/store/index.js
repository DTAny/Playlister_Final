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
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_LIST_PUBLISHED: "LOAD_LIST_PUBLISHED",
    LOAD_LIST_PRIVATE: "LOAD_LIST_PRIVATE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    START_PLAYING: "START_PLAYING",
    PAUSE_PLAYING: "PAUSE_PLAYING",
    PLAYER_READY: "PLAYER_READY"
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
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        status: Status.NONE,
        isPlaying: false,
        playingList: [],
        playingSongIndex: -1,
        playingListName: null,
        markedList: null,
        player: null,
    });
    const navigate = useNavigate();

    console.log("inside useGlobalStore");

    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    lists: payload,
                    currentList: null,
                    currentSongIndex : -1,
                    currentSong : null,
                    status: Status.NONE,
                    isPlaying: false,
                    playingList: store.playingList,
                    playingSongIndex: store.playingSongIndex,
                    playingListName: store.playingListName,
                    markedList: null,
                    player: store.player
                });
            }
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    lists: store.lists,
                    currentList: null,
                    currentSongIndex : -1,
                    currentSong : null,
                    status: Status.NONE,
                    isPlaying: store.isPlaying,
                    playingList: store.playingList,
                    playingSongIndex: store.playingSongIndex,
                    playingListName: store.playingListName,
                    markedList: null,
                    player: store.player
                })
            }
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    lists: null,
                    currentList: payload,
                    currentSongIndex : -1,
                    currentSong : null,
                    status: Status.NONE,
                    isPlaying: store.isPlaying,
                    playingList: store.playingList,
                    playingSongIndex: store.playingSongIndex,
                    playingListName: store.playingListName,
                    markedList: null,
                    player: store.player
                })
            }
            case GlobalStoreActionType.LOAD_LIST_PUBLISHED: {
                return setStore({
                    lists: payload,
                    currentList: null,
                    currentSongIndex : -1,
                    currentSong : null,
                    status: Status.NONE,
                    isPlaying: store.isPlaying,
                    playingList: store.playingList,
                    playingSongIndex: store.playingSongIndex,
                    playingListName: store.playingListName,
                    markedList: null,
                    player: store.player
                });
            }
            case GlobalStoreActionType.LOAD_LIST_PRIVATE: {
                return setStore({
                    lists: payload,
                    currentList: null,
                    currentSongIndex : -1,
                    currentSong : null,
                    status: Status.NONE,
                    isPlaying: store.isPlaying,
                    playingList: store.playingList,
                    playingSongIndex: store.playingSongIndex,
                    playingListName: store.playingListName,
                    markedList: null,
                    player: store.player
                });
            }
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    lists: store.lists,
                    currentList: null,
                    currentSongIndex : -1,
                    currentSong : null,
                    status: Status.DELETING_LIST,
                    isPlaying: store.isPlaying,
                    playingList: store.playingList,
                    playingSongIndex: store.playingSongIndex,
                    playingListName: store.playingListName,
                    markedList: payload,
                    player: store.player
                });
            }
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    lists: store.lists,
                    currentList: payload,
                    currentSongIndex : -1,
                    currentSong : null,
                    status: Status.NONE,
                    isPlaying: store.isPlaying,
                    playingList: store.playingList,
                    playingSongIndex: store.playingSongIndex,
                    playingListName: store.playingListName,
                    markedList: null,
                    player: store.player
                });
            }
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    lists: store.lists,
                    currentList: store.currentList,
                    currentSongIndex : payload.currentSongIndex,
                    currentSong : payload.currentSong,
                    status: Status.EDITING_SONG,
                    isPlaying: store.isPlaying,
                    playingList: store.playingList,
                    playingSongIndex: store.playingSongIndex,
                    playingListName: store.playingListName,
                    markedList: null,
                    player: store.player
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    lists: store.lists,
                    currentList: store.currentList,
                    currentSongIndex : payload.currentSongIndex,
                    currentSong : payload.currentSong,
                    status: Status.REMOVING_SONG,
                    isPlaying: store.isPlaying,
                    playingList: store.playingList,
                    playingSongIndex: store.playingSongIndex,
                    playingListName: store.playingListName,
                    markedList: null,
                    player: store.player
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    lists: store.lists,
                    currentList: store.currentList,
                    currentSongIndex : -1,
                    currentSong : null,
                    status: Status.NONE,
                    isPlaying: store.isPlaying,
                    playingList: store.playingList,
                    playingSongIndex: store.playingSongIndex,
                    playingListName: store.playingListName,
                    markedList: null,
                    player: store.player
                });
            }
            case GlobalStoreActionType.START_PLAYING: {
                return setStore({
                    lists: store.lists,
                    currentList: store.currentList,
                    currentSongIndex : -1,
                    currentSong : null,
                    status: Status.NONE,
                    isPlaying: true,
                    playingList: payload.playingList,
                    playingSongIndex: payload.playingSongIndex,
                    playingListName: payload.playingListName,
                    markedList: null,
                    player: store.player
                });
            }
            case GlobalStoreActionType.PAUSE_PLAYING: {
                return setStore({
                    lists: store.lists,
                    currentList: store.currentList,
                    currentSongIndex : -1,
                    currentSong : null,
                    status: Status.NONE,
                    isPlaying: false,
                    playingList: store.playingList,
                    playingSongIndex: store.playingSongIndex,
                    playingListName: store.playingListName,
                    markedList: null,
                    player: store.player
                });
            }
            case GlobalStoreActionType.PLAYER_READY: {
                return setStore({
                    lists: store.lists,
                    currentList: store.currentList,
                    currentSongIndex : -1,
                    currentSong : null,
                    status: Status.NONE,
                    isPlaying: false,
                    playingList: store.playingList,
                    playingSongIndex: store.playingSongIndex,
                    playingListName: store.playingListName,
                    markedList: null,
                    player: payload.player
                });
            }
            default:
                return store;
        }
    }

    store.changeListName = function (id, newName) {
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(id, playlist);
                    if (response.data.success) {
                        async function getList() {
                            response = await api.getUserPlaylists();
                            if (response.data.success) {
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        lists: response.data,
                                    }
                                });
                            }
                        }
                        getList();
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
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
            }
            );
            navigate(`/private/${newList.pid}`);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    store.loadListPublished = function () {
        async function asyncLoadListPublished() {
            const response = await api.getAllPlaylistsPublished();
            if (response.data.success) {
                console.log("Published List: ", JSON.stringify(response.data));
                storeReducer({
                    type: GlobalStoreActionType.LOAD_LIST_PUBLISHED,
                    payload: response.data.data
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadListPublished();
    }

    store.loadListPrivate = function () {
        async function asyncLoadListPrivate() {
            const response = await api.getUserPlaylists();
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.LOAD_LIST_PRIVATE,
                    payload: response.data.data
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadListPrivate();
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
    store.startPlaying = (index, list, name) => {
        storeReducer({
            type: GlobalStoreActionType.START_PLAYING,
            payload: {
                playingSongIndex: index,
                playingList: list,
                playingListName: name
            }
        })
    }
    store.pausePlaying = () => {
        storeReducer({
            type: GlobalStoreActionType.PAUSE_PLAYING,
            payload: {}
        })
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