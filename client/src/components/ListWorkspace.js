import { useContext, useEffect, useState } from 'react'
import AuthContext from '../auth'
import { useNavigate } from 'react-router-dom';
import { Box, Button, ButtonGroup, Grid, IconButton, List, Paper, Slide, Typography } from '@mui/material';
import GlobalStoreContext from '../store';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import RedoRoundedIcon from '@mui/icons-material/RedoRounded';
import PublicSongCard from './PublicSongCard';
import PrivateSongCard from './PrivateSongCard';
import MUIEditSongModal from './MUIEditSongModal';
import MUIRemoveSongModal from './MUIRemoveSongModal';

export default function ListWorkspace(props) {
    const { tab, index,} = props;
    const { store } = useContext(GlobalStoreContext);
    const [isClosing, setIsClosing] = useState(false);
    let isDisplay = tab === index;
    const list = store.currentList;

    const handleClose = () => {
        setIsClosing(true);
        store.closeCurrentList();
    }

    const handleUndo = () => {
        store.undo();
    }

    const handleRedo = () => {
        store.redo();
    }

    const handleNewSong = () => {
        store.addNewSong();
    }

    let listPart = (
        <Box sx={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Typography textAlign={'center'} sx={{fontFamily: "'Segoe Script'", fontSize: '2em'}}>
                {'Add Your Favourite Songs Here!'}
            </Typography>
        </Box>
    )

    if (isDisplay){
        let sortedSongs = [];
        list.songsOrder.forEach((sid)=>{
            for (let i = 0; i < list.Songs.length; i++){
                let song = list.Songs[i]
                if (song.sid.toString() === sid) {
                    sortedSongs.push(song);
                }
            }
        });

        if (list.Songs.length > 0) {
            if (list.published){
                listPart = (
                    <List>
                        {sortedSongs.map((song, index)=> <PublicSongCard key={"private-song-" + song.sid} index={index} song={song} sortedSongs={sortedSongs} list={list} />)}
                    </List>
                )
            }
            else {
                listPart = (
                    <List>
                        {sortedSongs.map((song, index)=> <PrivateSongCard key={"private-song-" + song.sid} index={index} song={song} sortedSongs={sortedSongs} list={list} />)}
                    </List>
                )
            }
        }

        return (
            <Box>
                <Slide in={!isClosing} timeout={400} direction={'right'} unmountOnExit>
                    <Box sx={{height: '100%'}} >
                        <Paper elevation={4} sx={{height: '100%', borderRadius: '50px', padding: '1em 2em 2em 2em'}} >
                            <Grid container>
                                <Grid item md={12} sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    <IconButton onClick={handleClose}>
                                        <ArrowBackIosNewRoundedIcon sx={{fontSize: '1.5em'}} />
                                    </IconButton>
                                    <Typography flex={1} sx={{fontFamily: "'Segoe Script'", display: 'flex', alignItems: 'center', fontSize: '1.2em'}}>
                                        {list.name}
                                    </Typography>
                                    <ButtonGroup variant="outlined" sx={{height: '90%', display: list.published ? 'none' : ''}}>
                                        <Button onClick={handleUndo} disabled={store.canUndo() ? false : true} startIcon={<UndoRoundedIcon />}>Undo</Button>
                                        <Button onClick={handleRedo} disabled={store.canRedo() ? false : true} startIcon={<RedoRoundedIcon />}>Redo</Button>
                                    </ButtonGroup>
                                </Grid>
                                <Grid item md={12} sx={{height: 'calc(100vh - 25em)', overflowY: 'scroll', borderTop: '#A6B0B26E solid 2px', p: '0.5em'}}>
                                    {listPart}
                                </Grid>
                                <Grid item md={12}>
                                    <Button fullWidth variant='contained' color={'info'} sx={{display: list.published ? 'none' : ''}} onClick={handleNewSong}>
                                        Add new song
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                </Slide>
                {store.currentSong === null ? "" : (
                    <Box>
                        <MUIEditSongModal />
                        <MUIRemoveSongModal />
                    </Box>
                )}
            </Box>
        );
    }
    else return "";
}