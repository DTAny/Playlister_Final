import { useContext, useState, useRef } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import { Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Collapse, Divider, List, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbDownRoundedIcon from '@mui/icons-material/ThumbDownRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import PublicSongCard from './PublicSongCard';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import AuthContext from '../auth';
import useDoubleClick from 'use-double-click';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';

function PrivateListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const { list } = props;
    const [isRenaming, setIsRenaming] = useState(false);
    const [plays, setPlays] = useState(0);
    const [name, setName] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const buttonRef = useRef();

    let sortedSongs = [];
    list.songsOrder.forEach((sid)=>{
        for (let i = 0; i < list.Songs.length; i++){
            let song = list.Songs[i]
            if (song.sid.toString() === sid) {
                sortedSongs.push(song);
            }
        }
    });

    const isPlaying = store.playingSongIndex !== -1 && store.playingSongs.length > 0 && store.playingSongs[store.playingSongIndex].PlaylistPid === list.pid;

    const handleStartPlaying = () => {
        store.startPlaying(0, sortedSongs, list, plays, setPlays);
    }

    const handleClick = () => {
        // alert(JSON.stringify(list));
    };

    const handleDoubleClick = () => {
        if (!list.published) {
            setName(list.name);
            setIsRenaming(true);
        }
    }

    useDoubleClick({
        onSingleClick: handleClick,
        onDoubleClick: handleDoubleClick,
        ref: buttonRef,
        latency: 250
    })

    const handleChangeRename = (event) => {
        setName(event.target.value);
        setErrMsg("");
    }

    const handleRename = async (event) =>{
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        await store.changeListName(list.pid, formData.get('rename'), setErrMsg, setIsRenaming);
    }

    const handleCloseRename = () => {
        setIsRenaming(false);
    }

    const handlePublish = () => {
        store.publishList(list.pid);
    }

    let cardElement =
        <ListItem
            id={list.pid}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
        >
            <Box component={'form'} sx={{width: '100%'}} onSubmit={handleRename}>
                <Card 
                    sx={{width: '100%', bgcolor: isPlaying ? '#c2dfff' : 'white'}}
                >
                    <CardActionArea sx={{display: isRenaming ? 'none' : ''}} ref={buttonRef}>
                        <CardHeader title={list.name} subheader={"By " + list.ownerUsername} action={
                            <Box sx={{display: list.published ? 'flex' : 'none', alignItems: 'center'}} >
                                <ThumbUpRoundedIcon sx={{fontSize: '1.2em'}}/>
                                <Typography display={'inline'} variant='h6' color={'text.secondary'} ml={1}>
                                {list.likes}
                                </Typography>
                                <ThumbDownRoundedIcon sx={{fontSize: '1.2em', ml: '0.5em'}}/>
                                <Typography display={'inline'} variant='h6' color={'text.secondary'} ml={1}>
                                {list.dislikes}
                                </Typography>
                                <PublicRoundedIcon sx={{ml: '0.5em', fontSize: '1.3em', color: '#8882F4'}} />
                            </Box>
                        }/>
                    </CardActionArea>
                    <CardHeader sx={{display: isRenaming ? '' : 'none', p: 0}} title={
                        <TextField 
                            name={'rename'} 
                            variant='filled' 
                            label='Playlist name' 
                            value={name} 
                            onChange={handleChangeRename} 
                            error={errMsg !== ""}
                            helperText={errMsg}
                            fullWidth 
                            InputProps={{sx: {fontSize: '1.5em'}}}
                        />
                    }>
                    </CardHeader>
                    <CardActions sx={{borderTop: '#A6B0B26E solid 1px'}}>
                        <Box display={isRenaming ? 'none' : 'block'}>
                            <Button variant='outlined' onClick={handlePublish} sx={{display: list.published ? 'none' : ''}} startIcon={
                                <PublicRoundedIcon />
                            }>
                                publish
                            </Button>
                            <Typography sx={{fontSize: '0.8em'}} display={list.published ? '' : 'none'} color={'GrayText'}>
                                {`Published At: ${new Date(list.publishedAt).toLocaleString()}`}
                            </Typography>
                        </Box>
                        <Box sx={{flex: 1}} />
                        <Box display={isRenaming ? 'none' : ''}>
                            <IconButton>
                                <DeleteForeverRoundedIcon/>
                            </IconButton>
                            <IconButton>
                                <ContentCopyRoundedIcon/>
                            </IconButton>
                            <IconButton onClick={handleStartPlaying}>
                                <PlayArrowRoundedIcon/>
                            </IconButton>
                        </Box>
                        <Box display={isRenaming ? '' : 'none'}>
                            <Button variant='outlined' onClick={handleCloseRename}>
                                <ClearRoundedIcon/>
                            </Button>
                            <Button type='submit' sx={{ml: '0.5em'}} variant='outlined' color='success'>
                                <CheckRoundedIcon/>
                            </Button>
                        </Box>
                    </CardActions>
                </Card>
            </Box>
        </ListItem>

    return (
        cardElement
    );
}

export default PrivateListCard;