import React, { useContext } from 'react';
import YouTube from 'react-youtube';
import GlobalStoreContext from '../store';

export default function YouTubePlayer(props) {
    const { store } = useContext(GlobalStoreContext);
    
    let playlist = store.playingSongs.map((song) => song.youtubeId);

    let playingSongIndex = store.playingSongIndex;

    const playerOptions = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
        },
    };

    function loadAndPlayCurrentSong(player) {
        let song = playlist[playingSongIndex];
        player.loadVideoById(song);
    }

    function incSong() {
        playingSongIndex++;
        playingSongIndex = playingSongIndex % playlist.length;
    }

    function onPlayerReady(event) {
        loadAndPlayCurrentSong(event.target);
        store.playerReady(event.target);
    }

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