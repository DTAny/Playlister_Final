import { useContext, useState } from 'react'
import AuthContext from '../auth'
import { Box,Grid, IconButton, InputBase, List, Paper, Slide, styled, Tab, Tabs, Typography } from '@mui/material';
import YouTubePlayer from './YouTubePlayer';
import GlobalStoreContext from '../store';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import FastRewindRoundedIcon from '@mui/icons-material/FastRewindRounded';
import FastForwardRoundedIcon from '@mui/icons-material/FastForwardRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PublicCommentCard from './PublicCommentCard';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';

export default function Player() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [tab, setTab] = useState(0);
    const [comments, setComments] = useState([]);

    let playerPart = <Typography color={'white'} sx={{fontSize: '2rem', textAlign: 'center', fontStyle: 'italic', fontFamily: "'Segoe Script'"}}>
        Pick A Playlist You Like!
    </Typography>

    let controlPanel = <Typography color={'black'} sx={{fontSize: '2rem', textAlign: 'center', fontStyle: 'italic', fontFamily: "'Segoe Script'"}}>
        And Enjoy Your Time!
    </Typography>

    let commentsPart = <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
        <Typography color={'black'} sx={{fontSize: '2rem', textAlign: 'center', fontStyle: 'italic', fontFamily: "'Segoe Script'"}}>
            Share Your Feel!
        </Typography>
    </Box>

    const handlePreviousSong = () => {
        let length = store.playingSongs.length;
        let index = (store.playingSongIndex + length - 1) % length;
        store.startPlaying(index, store.playingSongs, store.playingList);
    }
    const handleStartPlaying = () => {
        store.player.playVideo();
        store.startPlaying(store.playingSongIndex, store.playingSongs, store.playingList);
    }
    const handlePausePlaying = () => {
        store.player.pauseVideo();
        store.pausePlaying();
    }
    const handleNextSong = () => {
        let length = store.playingSongs.length;
        let index = (store.playingSongIndex + 1) % length
        store.startPlaying(index, store.playingSongs, store.playingList);
    }

    const handleChange = (event, newValue) => {
        setTab(newValue);
        if (newValue === 1){
            store.loadComments(store.playingList.pid, setComments);
        }
    };

    if (comments.length > 0) {
        commentsPart = <List hidden={tab !== 1} disablePadding={true} sx={{height: '100%'}}>
            {comments.map((comment) => <PublicCommentCard key={`comment-${comment.cid}`} comment={comment}/>)}
        </List>
    }

    const CommentInput = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: 'whitesmoke',
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    }));
    
    const IconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));
    
    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        width: '100%',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
        },
    }));

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        store.addComment(store.playingList.pid, formData.get('comment'), setComments);
    }

    if (store.playingSongs.length > 0) {
        playerPart = <YouTubePlayer />
        controlPanel = <Grid container sx={{height: '100%', p: '0.5em'}}>
            <Grid item md={4} sx={{height: '100%', display: 'flex', flexDirection: 'column', borderRight: '#A6B0B26E solid 2px'}}>
                <Tabs value={tab} onChange={handleChange} orientation={'vertical'}>
                    <Tab label="Info" />
                    <Tab label="Comment" />
                </Tabs>
                <Box flex={1} /> 
                <Box hidden={store.player === null} sx={{width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Paper sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <IconButton onClick={handlePreviousSong}>
                            <FastRewindRoundedIcon sx={{fontSize: '1.5em'}} />
                        </IconButton>
                        <IconButton onClick={store.player === null || store.player.getPlayerState() === 1 ? handlePausePlaying : handleStartPlaying}>
                            {store.player === null || store.player.getPlayerState() === 1 ? <PauseRoundedIcon sx={{fontSize: '2em'}} /> :  <PlayArrowRoundedIcon sx={{fontSize: '2em'}} />}
                        </IconButton>
                        <IconButton onClick={handleNextSong}>
                            <FastForwardRoundedIcon sx={{fontSize: '1.5em'}} />
                        </IconButton>
                    </Paper>
                </Box>
            </Grid>
            <Grid item md={8}>
                <Box sx={{height: 'calc(38vh - 8em)', overflowY: 'scroll'}}>
                    <Box hidden={tab !== 0} sx={{height: '100%', pl: '1em'}}>
                        <Typography variant='h5' textAlign={'center'} sx={{fontFamily: "'Segoe Script'"}}>
                            Now Playing
                        </Typography>
                        <Typography variant='h5' sx={{fontFamily: "'Segoe Script'"}}>
                            {`Playlist: ${store.playingList.name}`}
                        </Typography>
                        <Typography variant='h5' sx={{fontFamily: "'Segoe Script'"}}>
                            {`Song #: ${store.playingSongIndex + 1}`}
                        </Typography>
                        <Typography variant='h5' sx={{fontFamily: "'Segoe Script'"}}>
                            {`Title: ${store.playingSongs[store.playingSongIndex].title}`}
                        </Typography>
                        <Typography variant='h5' sx={{fontFamily: "'Segoe Script'"}}>
                            {`Artist: ${store.playingSongs[store.playingSongIndex].artist}`}
                        </Typography>
                    </Box>
                    {commentsPart}
                </Box>
                <Box component={'form'} hidden={tab !== 1} sx={{width: '100%'}} onSubmit={handleSubmit}>
                    <CommentInput>
                        <IconWrapper>
                            <ChatRoundedIcon/>
                        </IconWrapper>
                        <StyledInputBase 
                            placeholder={auth.loggedIn ? "Say something..." : "Login to comment"}
                            inputProps={{ 'aria-label': 'comment' }}
                            disabled={!auth.loggedIn}
                            name='comment'
                        />
                    </CommentInput>
                </Box>
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