import { useContext, useState, useEffect } from 'react'
import AuthContext from '../auth'
import { useNavigate } from 'react-router-dom';
import { Box, CssBaseline, Grid, Tabs } from '@mui/material';
import TopBar from './TopBar';
import Statusbar from './Statusbar';
import PublicList from './PublicList';
import Player from './Player';
import GlobalStoreContext from '../store';
import UserList from './UserList';
import PrivateList from './PrivateList';
import ListWorkspace from './ListWorkspace';
import MUIDeleteListModal from './MUIDeleteListModal';

export default function HomeScreen() {
    const [tab, setTab] = useState(1);
    const { store } = useContext(GlobalStoreContext);
    const [searchStr, setSearchStr] = useState(null);

    useEffect(()=>{
        store.loadLists();
    },[]);

    return (
        <Box sx={{display: 'flex', height: '100%', flexDirection: 'column'}}>
            <CssBaseline/>
            <TopBar tab={tab} setTab={setTab} setSearchStr={setSearchStr} />
            <Grid container sx={{height: '100%', padding: '0 1.5em', flex: 1, flexGrow: 1}} spacing={5}>
                <Grid item md={6} sx={{height: '100%'}}>
                    {
                        store.currentList ? 
                        <ListWorkspace tab={tab} index={0} /> : 
                        <PrivateList tab={tab} searchStr={searchStr} setSearchStr={setSearchStr} index={0} /> 
                    }
                    <PublicList tab={tab} searchStr={searchStr} setSearchStr={setSearchStr} index={1} />
                    <UserList tab={tab} searchStr={searchStr} setSearchStr={setSearchStr} index={2} />
                </Grid>
                <Grid item md={6}>
                    <Player/>
                </Grid>
            </Grid>
            <Statusbar />
            {store.markedList === null ? "" : (
                <MUIDeleteListModal />
            )}
        </Box>
    );
}