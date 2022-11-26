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

export default function MUIDeleteListModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    if (store.markedList) {
        name = store.markedList.name;
    }
    function handleDeleteList(event) {
        store.deleteMarkedList();
    }
    function handleCloseModal(event) {
        store.hideModals();
    }

    return (
        <Modal
            open={store.markedList !== null}
        >
            <Box sx={style}>
                <Box>
                    <Typography variant='h4'>
                        Delete <b>{name}</b>?
                    </Typography>
                </Box>
                <hr></hr>
                <Box>
                    <Typography variant='h5'>
                        Delete the <span>{name}</span> Play List?
                    </Typography>
                </Box>
                <Box height={'30px'}></Box>
                <Box>
                    <Button
                        variant='contained'
                        color='error'
                        sx={{fontSize: '18px'}}
                        onClick={handleDeleteList}
                    >Confirm</Button>
                    <Button
                        variant='contained'
                        sx={{float: 'right', fontSize: '18px'}}
                        onClick={handleCloseModal}
                    >Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}