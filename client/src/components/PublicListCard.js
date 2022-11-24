import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import { Card, CardActions, CardContent, CardHeader, Collapse, Divider, List, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbDownRoundedIcon from '@mui/icons-material/ThumbDownRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import PublicSongCard from './PublicSongCard';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import AuthContext from '../auth';

function PublicListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const { list } = props;
    const [expanded, setExpanded] = useState(false);
    const [plays, setPlays] = useState(0);

    const ExpandMore = styled((props) => {
        const { expand, ...other } = props;
        return <IconButton {...other} />;
    })(({ theme, expand }) => ({
        transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
        }),
    }));

    let sortedSongs = [];
    list.songsOrder.forEach((sid)=>{
        for (let i = 0; i < list.Songs.length; i++){
            let song = list.Songs[i]
            if (song.sid.toString() === sid) {
                sortedSongs.push(song);
            }
        }
    });

    const songCards = sortedSongs.map((song, index)=>{
        return <PublicSongCard key={"song-" + song.sid} index={index} song={song} sortedSongs={sortedSongs} list={list} plays={plays} setPlays={setPlays} />
    })

    const isPlaying = store.playingSongIndex !== -1 && store.playingSongs.length > 0 && store.playingSongs[store.playingSongIndex].PlaylistPid === list.pid;

    const handleStartPlaying = () => {
        store.startPlaying(0, sortedSongs, list, plays, setPlays);
    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    let cardElement =
        <ListItem
            id={list.pid}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
        >
            <Card 
                sx={{width: '100%', bgcolor: isPlaying ? '#c2dfff' : 'white'}}
            >
                <CardHeader title={list.name} subheader={"By " + list.ownerUsername} action={
                    <IconButton onClick={handleStartPlaying}>
                        <PlayArrowRoundedIcon sx={{fontSize: '2em'}}/>
                    </IconButton>
                }/>
                <CardActions>
                    <IconButton disabled={!auth.loggedIn}>
                        <ThumbUpRoundedIcon sx={{fontSize: '1.2em'}}/>
                    </IconButton>
                    <Typography variant='h6' color={'text.secondary'} ml={1}>
                    {list.likes}
                    </Typography>
                    <IconButton disabled={!auth.loggedIn}>
                        <ThumbDownRoundedIcon sx={{fontSize: '1.2em'}}/>
                    </IconButton>
                    <Typography variant='h6' color={'text.secondary'} ml={1}>
                    {list.dislikes}
                    </Typography>
                    <Box sx={{flex: 1}} />
                    <IconButton disabled={!auth.loggedIn}>
                        <ContentCopyRoundedIcon sx={{fontSize: '1.2em'}}/>
                    </IconButton>
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreRoundedIcon sx={{fontSize: '1.2em'}}/>
                    </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Box sx={{display: 'flex'}}>
                            <Typography color={'GrayText'}>
                                {`Published at ${new Date(Date.parse(list.publishedAt)).toLocaleDateString()}`}
                            </Typography>
                            <Box sx={{flex: 1}}/>
                            <Typography color={'GrayText'}>
                                {`Listens ${list.plays + plays}`}
                            </Typography>
                        </Box>
                        <Divider/>
                        <List>
                            {songCards}
                        </List>
                    </CardContent>
                </Collapse>
            </Card>
        </ListItem>

    return (
        cardElement
    );
}

export default PublicListCard;