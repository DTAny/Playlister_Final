import { useContext } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, TextField, Typography } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '800px',
    minWidth: '400px',
    bgcolor: 'background.paper',
    borderRadius: '30px',
    boxShadow: 24,
    p: 4,
};

export default function MUIEditSongModal() {
    const { store } = useContext(GlobalStoreContext);

    const song = store.currentSong;

    function handleConfirmEditSong(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        let newSongData = {
            title: formData.get('title'),
            artist: formData.get('artist'),
            youtubeId: formData.get('youtubeId')
        }
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youtubeId: song.youtubeId
        }
        store.addUpdateSongTransaction(store.currentSongIndex, newSongData, oldSongData);
    }

    function handleCancelEditSong() {
        store.hideModals();
    }

    return (
        <Modal
            open={store.status === "EDITING_SONG"}
        >
            <Box sx={style}>
                <Box>
                    <Typography variant='h4'>
                        Edit Song
                    </Typography>
                </Box>
                <hr></hr>
                <Box component="form" noValidate onSubmit={handleConfirmEditSong}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Title"
                        defaultValue={song.title}
                        autoFocus
                        name="title"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Artist"
                        defaultValue={song.artist}
                        name="artist"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="YouTube Id"
                        defaultValue={song.youtubeId}
                        name="youtubeId"
                    />
                    <Box height={'30px'}></Box>
                    <Box>
                        <Button
                            type='submit'
                            variant='contained'
                            sx={{fontSize: '18px'}}
                        >Confirm</Button>
                        <Button
                            variant='outlined'
                            sx={{float: 'right', fontSize: '18px'}}
                            onClick={handleCancelEditSong}
                        >Cancel</Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}