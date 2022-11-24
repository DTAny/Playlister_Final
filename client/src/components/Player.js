import { useContext, useEffect } from 'react'
import AuthContext from '../auth'
import { useNavigate } from 'react-router-dom';
import { Box, CssBaseline, Grid, IconButton, Paper, Slide, Tab, Tabs, Typography } from '@mui/material';
import TopBar from './TopBar';
import YouTubePlayer from './YouTubePlayer';
import GlobalStoreContext from '../store';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import FastRewindRoundedIcon from '@mui/icons-material/FastRewindRounded';
import FastForwardRoundedIcon from '@mui/icons-material/FastForwardRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';

export default function Player() {
    const { store } = useContext(GlobalStoreContext);

    let playerPart = <Typography color={'white'} sx={{fontSize: '2rem', textAlign: 'center', fontStyle: 'italic', fontFamily: "'Segoe Script'"}}>
        Pick A Playlist You Like!
    </Typography>

    let controlPanel = <Typography color={'black'} sx={{fontSize: '2rem', textAlign: 'center', fontStyle: 'italic', fontFamily: "'Segoe Script'"}}>
        And Enjoy Your Time!
    </Typography>

    const handlePreviousSong = () => {
        let length = store.playingList.length;
        let index = (store.playingSongIndex + length - 1) % length;
        store.startPlaying(index, store.playingList, store.playingList[index].name);
    }
    const handleStartPlaying = () => {
        store.player.playVideo();
        store.startPlaying(store.playingSongIndex, store.playingList, store.playingListName);
    }
    const handlePausePlaying = () => {
        store.player.pauseVideo();
        store.pausePlaying();
    }
    const handleNextSong = () => {
        let length = store.playingList.length;
        let index = (store.playingSongIndex + 1) % length
        store.startPlaying(index, store.playingList, store.playingList[index].name);
    }

    if (store.playingList.length > 0) {
        playerPart = <YouTubePlayer />
        controlPanel = <Grid container sx={{height: '100%'}}>
            <Grid item md={12}>
                <Tabs centered>
                    <Tab label="Controller" />
                    <Tab label="Comment" />
                </Tabs>
            </Grid>
            <Grid item md={12} sx={{height: 'calc(100% - 9em)', overflowY: 'scroll', borderTop: '#A6B0B26E solid 2px', p: '0.5em'}}>
                <Typography variant='h5' textAlign={'center'} sx={{fontFamily: "'Segoe Script'"}}>
                    Now Playing
                </Typography>
                <Typography variant='h5' sx={{fontFamily: "'Segoe Script'"}}>
                    {`Playlist: ${store.playingListName}`}
                </Typography>
                <Typography variant='h5' sx={{fontFamily: "'Segoe Script'"}}>
                    {`Song #: ${store.playingSongIndex + 1}`}
                </Typography>
                <Typography variant='h5' sx={{fontFamily: "'Segoe Script'"}}>
                    {`Title: ${store.playingList[store.playingSongIndex].title}`}
                </Typography>
                <Typography variant='h5' sx={{fontFamily: "'Segoe Script'"}}>
                    {`Artist: ${store.playingList[store.playingSongIndex].artist}`}
                </Typography>
            </Grid>
            <Grid item md={12} sx={{p: '0.5em', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '20%'}}>
                <Paper sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50%'}}>
                    <IconButton onClick={handlePreviousSong}>
                        <FastRewindRoundedIcon sx={{fontSize: '1.5em'}} />
                    </IconButton>
                    <IconButton onClick={store.isPlaying ? handlePausePlaying : handleStartPlaying}>
                        {store.isPlaying ? <PauseRoundedIcon sx={{fontSize: '2em'}} /> :  <PlayArrowRoundedIcon sx={{fontSize: '2em'}} />}
                    </IconButton>
                    <IconButton onClick={handleNextSong}>
                        <FastForwardRoundedIcon sx={{fontSize: '1.5em'}} />
                    </IconButton>
                </Paper>
            </Grid>
        </Grid>
    }

    return (
        <Slide in={true} timeout={400} direction={'left'} unmountOnExit>
            <Box sx={{height: '100%'}} >
                <Paper elevation={4} sx={{height: '50%', borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'black'}} >
                    {playerPart}
                </Paper>
                <div style={{height: '5%'}}></div>
                <Paper elevation={4} sx={{height: '45%', borderRadius: '50px', p: '1em', display: 'flex', alignItems: 'center', justifyContent: 'center'}} >
                    {controlPanel}
                </Paper>
            </Box>
        </Slide>
    );
}