import React, { useContext } from 'react';
import YouTube from 'react-youtube';
import GlobalStoreContext from '../store';

export default function YouTubePlayer() {
    const { store } = useContext(GlobalStoreContext);
    // let playlist = [
    //     "mqmxkGjow1A",
    //     "8RbXIMZmVv8",
    //     "8UbNbor3OqQ"
    // ];
    let playlist = store.playingSongs.map((song) => song.youtubeId);

    // THIS IS THE INDEX OF THE SONG CURRENTLY IN USE IN THE PLAYLIST
    let playingSongIndex = store.playingSongIndex;

    const playerOptions = {
        height: '100%',
        width: '100%',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        let song = playlist[playingSongIndex];
        player.loadVideoById(song);
    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
        playingSongIndex++;
        playingSongIndex = playingSongIndex % playlist.length;
    }

    function onPlayerReady(event) {
        loadAndPlayCurrentSong(event.target);
        store.playerReady(event.target);
    }

    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        let player = event.target;
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            incSong();
            store.startPlaying(playingSongIndex, store.playingSongs, store.playingList);
            loadAndPlayCurrentSong(player);
        } else if (playerStatus === 1) {
            store.startPlaying(playingSongIndex, store.playingSongs, store.playingList);
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            store.pausePlaying();
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            player.playVideo();
            console.log("5 Video cued");
        }
    }

    return <YouTube
        videoId={playlist[playingSongIndex]}
        opts={playerOptions}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange} 
        style={{height: '90%', width: '90%'}}    
    />;
}