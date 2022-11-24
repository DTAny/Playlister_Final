import { useContext, useState, useEffect } from 'react'
import AuthContext from '../auth'
import { useNavigate } from 'react-router-dom';
import { Box, CssBaseline, Grid, Tabs } from '@mui/material';
import TopBar from './TopBar';
import Statusbar from './Statusbar';
import PublicList from './PublicList';
import Player from './Player';
import GlobalStoreContext from '../store';

export default function HomeScreen() {
    const [tab, setTab] = useState(1);
    const { store } = useContext(GlobalStoreContext);

    useEffect(()=>{
        store.loadListPublished();
    },[]);

    return (
        <Box sx={{display: 'flex', height: '100%', flexDirection: 'column'}}>
            <CssBaseline/>
            <TopBar tab={tab} setTab={setTab}/>
            <Grid container sx={{height: '100%', padding: '0 1.5em', flex: 1, flexGrow: 1}} spacing={5}>
                <Grid item md={6} sx={{height: '100%'}}>
                    <PublicList tab={tab} index={1}/>
                </Grid>
                <Grid item md={6}>
                    <Player/>
                </Grid>
            </Grid>
            <Statusbar />
        </Box>
    );
}