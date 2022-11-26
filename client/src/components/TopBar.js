import { useContext } from 'react'
import AuthContext from '../auth'
import { Box, AppBar, Toolbar, styled, alpha, InputBase, Tabs, Tab } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import PublicIcon from '@mui/icons-material/Public';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

export default function TopBar(props) {
    const { auth } = useContext(AuthContext);
    const {setTab, tab, setSearchStr} = props;

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    }));
    
    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));
    
    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        width: '100%',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
        },
    }));

    const handleChange = (event, value) => {
        setTab(value);
    }
    const handleSearch = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        let str = formData.get('searchStr');
        setSearchStr(str);
    }

    return (
        <Box sx={{margin: '1em' }}>
          <AppBar position="static" sx={{backgroundColor: '#788aed', borderRadius: '30px',}}>
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tabs value={tab} onChange={handleChange} textColor="inherit" indicatorColor="secondary">
                      <Tab icon={<QueueMusicIcon />} sx={{color: 'white'}} label="My Playlists" disabled={!auth.loggedIn} />
                      <Tab icon={<PublicIcon />} sx={{color: 'white'}} label="Public Playlists" />
                      <Tab icon={<PersonSearchIcon />} sx={{color: 'white'}} label="Search User" />
                    </Tabs>
                </Box>
                <Box sx={{ flexGrow: 1 }} component='form' onSubmit={handleSearch}>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            name='searchStr'
                        />
                    </Search>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
            </Toolbar>
          </AppBar>
        </Box>
    );
}