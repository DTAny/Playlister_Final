import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Box, AppBar, Toolbar, Slide, Typography} from '@mui/material'

function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    let text ="123";
    if (store.currentList)
        text = store.currentList.name;
    return (
        <Slide in={text === "" ? false : true} timeout={700} direction={'up'}>
            <Box sx={{margin: '1em', height: '64px'}}>
                <AppBar position="static" sx={{backgroundColor: '#788aed', borderRadius: '30px',}}>
                    <Toolbar>
                        <Typography variant='h4' sx={{ flexGrow: 1, textAlign: 'center' }} >
                            {text}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
        </Slide>
    );
}

export default Statusbar;