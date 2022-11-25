import { useContext, useEffect, useState } from 'react'
import AuthContext from '../auth'
import { useNavigate } from 'react-router-dom';
import { Box, Button, ButtonGroup, Grid, IconButton, Paper, Slide, Typography } from '@mui/material';
import GlobalStoreContext from '../store';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import RedoRoundedIcon from '@mui/icons-material/RedoRounded';

export default function ListWorkspace(props) {
    const { tab, index,} = props;
    const { store } = useContext(GlobalStoreContext);
    let isDisplay = tab === index;

    const handleClose = () => {
        store.closeCurrentList();
    }

    if (isDisplay){
        return (
            <Slide in={true} timeout={400} direction={'right'} unmountOnExit>
                <Box sx={{height: '100%'}} >
                    <Paper elevation={4} sx={{height: '100%', borderRadius: '50px', padding: '1em 2em 2em 2em'}} >
                        <Grid container>
                            <Grid item md={12} sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <IconButton onClick={handleClose}>
                                    <ArrowBackIosNewRoundedIcon sx={{fontSize: '1.5em'}} />
                                </IconButton>
                                <Typography flex={1} sx={{fontFamily: "'Segoe Script'", display: 'flex', alignItems: 'center', fontSize: '1.2em'}}>
                                    {store.currentList.name}
                                </Typography>
                                <Box flex={1} />
                                <ButtonGroup variant="outlined" sx={{height: '90%'}}>
                                    <Button disabled={store.canUndo() ? false : true} startIcon={<UndoRoundedIcon />}>Undo</Button>
                                    <Button disabled={store.canRedo() ? false : true} startIcon={<RedoRoundedIcon />}>Redo</Button>
                                </ButtonGroup>
                            </Grid>
                            <Grid item md={12} sx={{height: 'calc(100vh - 25em)', overflowY: 'scroll', borderTop: '#A6B0B26E solid 2px', p: '0.5em'}}>
                                
                            </Grid>
                            <Grid item md={12}>
                                <Button variant='contained' color={'info'} sx={{width: '100%'}}>
                                    Add new song
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            </Slide>
        );
    }
    else return "";
}