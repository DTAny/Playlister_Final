import { useContext, useState } from 'react'
import ListItem from '@mui/material/ListItem';
import { Card, CardHeader, IconButton } from '@mui/material';
import GlobalStoreContext from '../store';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

function PublicSongCard(props) {
    const { song, index, getSortedSongs, listName } = props;
    const { store } = useContext(GlobalStoreContext);

    const isPlaying = store.playingSongIndex !== -1 && store.playingList.length > 0 && store.playingList[store.playingSongIndex].sid === song.sid;

    const handleStartPlaying = () => {
        store.startPlaying(index, getSortedSongs(), listName);
    }

    let cardElement =
        <ListItem
            id={song.sid}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
        >
            <Card 
                sx={{width: '100%', bgcolor: isPlaying ? '#dddffe' : 'white'}}
            >
                <CardHeader title={`${index + 1}. ` + song.title} subheader={"By " + song.artist} action={
                    <IconButton onClick={handleStartPlaying}>
                        <PlayArrowRoundedIcon sx={{fontSize: '2em'}}/>
                    </IconButton>
                }/>
            </Card>
        </ListItem>

    return (
        cardElement
    );
}

export default PublicSongCard;