import { useContext, useState } from 'react'
import ListItem from '@mui/material/ListItem';
import { Box, Card, CardActionArea, CardActions, CardHeader, IconButton } from '@mui/material';
import GlobalStoreContext from '../store';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

function PrivateSongCard(props) {
    const { song, index, sortedSongs, list, setSong } = props;
    const { store } = useContext(GlobalStoreContext);
    const [ draggedTo, setDraggedTo ] = useState(0);

    const isPlaying = store.playingSongIndex !== -1 && store.playingSongs.length > 0 && store.playingSongs[store.playingSongIndex].sid === song.sid;

    const handleStartPlaying = () => {
        store.startPlaying(index, sortedSongs, list);
    }

    const handleDragStart = (event) => {
        event.dataTransfer.setData("song", index);
    }

    const handleDragOver = (event) => {
        event.preventDefault();
    }

    const handleDragEnter = (event) => {
        event.preventDefault();
        setDraggedTo(true);
    }

    const handleDragLeave = (event) => {
        event.preventDefault();
        setDraggedTo(false);
    }

    const handleDrop = (event) => {
        event.preventDefault();
        let targetIndex = index;
        let sourceIndex = Number(event.dataTransfer.getData("song"));
        setDraggedTo(false);
        store.addMoveSongTransaction(sourceIndex, targetIndex);
    }

    const handleDoubleClick = () => {
        setSong(song);
        store.showEditSongModal(index, song);
    }

    let cardElement =
        <ListItem
            id={song.sid}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
        >
            <Card 
                sx={{width: '100%', bgcolor: isPlaying ? '#dddffe' : 'white'}}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                draggable="true"
            >
                <CardActionArea onDoubleClick={handleDoubleClick}>
                    <CardHeader title={`${index + 1}. ` + song.title} subheader={"By " + song.artist} action={
                        <MenuRoundedIcon sx={{color: 'dimgray', fontSize: '3.5em', opacity: '0.3'}} />
                    }/>
                </CardActionArea>
                <CardActions sx={{display: 'flex', borderTop: '#A6B0B26E solid 1px'}}>
                    <Box flex={1} />
                    <IconButton onClick={handleStartPlaying}>
                        <PlayArrowRoundedIcon />
                    </IconButton>
                </CardActions>
            </Card>
        </ListItem>

    return (
        cardElement
    );
}

export default PrivateSongCard;