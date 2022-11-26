import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../auth';

// import EditToolbar from './EditToolbar'

import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import logo from '../images/logo.png';
import { Paper } from '@mui/material';

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        setTimeout(()=>{
            auth.logoutUser();
        }, 150);
    }

    const handleLogin = () => {
        navigate('/login');
        setAnchorEl(null);
    }

    const handleRegister = () => {
        navigate('/register');
        setAnchorEl(null);
    }

    const menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogin}>Login</MenuItem>
            <MenuItem onClick={handleRegister}>Create New Account</MenuItem>
        </Menu>
    );
    const loggedInMenu = 
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>        
    // let editToolbar = "";
    let homeLink = 
        <Typography                        
            variant="h4"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}                        
        >
            <Link style={{ textDecoration: 'none', color: 'white' }} to={auth.loggedIn ? '/home' : '/'}>⌂</Link>
        </Typography>;
    let menu = loggedOutMenu;
    if (auth.loggedIn) {
        menu = loggedInMenu;
        homeLink = "";
        // if (store.currentList) {
        //     editToolbar = <EditToolbar />;
        // }
    }
    
    function getAccountMenu(loggedIn) {
        let userInitials = auth.getUserInitials();
        console.log("userInitials: " + userInitials);
        if (loggedIn) 
            return <div>{userInitials}</div>;
        else
            return <AccountCircle />;
    }

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Paper elevation={4} sx={{marginRight: '2em', height: '50px'}}>
                        <img src={logo} alt='' style={{width: '8.5em'}}></img>
                    </Paper>
                    { homeLink }
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}></Box>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, width: '3em', height: '3em' }}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            { getAccountMenu(auth.loggedIn) }
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {
                menu
            }
        </Box>
    );
}