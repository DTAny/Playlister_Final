import { useContext } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, Typography } from '@mui/material';

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

export default function MUIRemoveSongModal() {
    const { store } = useContext(GlobalStoreContext);

    function handleConfirmRemoveSong () {
        store.addRemoveSongTransaction();
    }

    function handleCancelRemoveSong () {
        store.hideModals();
    }
    let songTitle = "";
    if (store.currentSong) {
        songTitle = store.currentSong.title;
    }

    return (
        <Modal
            open={store.status === "REMOVING_SONG"}
        >
            <Box sx={style}>
                <Box>
                    <Typography variant='h4'>
                        Remove <b>{songTitle}</b>?
                    </Typography>
                </Box>
                <hr></hr>
                <Box>
                    <Typography variant='h5'>
                    Are you sure you wish to permanently remove <span>{songTitle}</span> from the playlist?
                    </Typography>
                </Box>
                <Box height={'30px'}></Box>
                <Box>
                    <Button
                        variant='contained'
                        color='error'
                        sx={{fontSize: '18px'}}
                        onClick={handleConfirmRemoveSong}
                    >Confirm</Button>
                    <Button
                        variant='contained'
                        sx={{float: 'right', fontSize: '18px'}}
                        onClick={handleCancelRemoveSong}
                    >Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}