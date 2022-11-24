import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Slide, Fade } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from '../images/logo.png';

const SplashScreen = () => {
    let [open, setOpen] = useState(true);
    const navigate = useNavigate();

    let handleLogin = async () => {
        setOpen(false);
        setTimeout(() => {
            navigate('/login');
        }, 400);
    }
    let handleRegister = async () => {
        setOpen(false);
        setTimeout(() => {
            navigate('/register');
        }, 400);
    }
    let handleGuest = async () => {
        setOpen(false);
        setTimeout(() => {
            navigate('/home');
        }, 400);
    }

    return (
        <div id='SplashScreen'>
            <Fade in={open} timeout={open ? 700 : 400} unmountOnExit>
                <div id='SplashScreen-welcome'>
                    <Typography color={'white'} sx={{fontSize: '5rem', textAlign: 'center', fontWeight: 'bolder', fontFamily: "'Segoe Script'", textShadow: '0.1em 0.05em 0.2em black'}}>
                        Welcome to
                    </Typography>
                    <img src={logo} alt=''></img>
                </div>
            </Fade>
            <div id='SplashScreen-content'>
                <Slide in={open} timeout={open ? 700 : 400} direction={'right'} unmountOnExit>
                    <div id='SplashScreen-slogen'>
                        <Typography color={'white'} sx={{fontSize: '2rem', textAlign: 'left', fontStyle: 'italic', fontFamily: "'Segoe Script'", textShadow: '0.1em 0.05em 0.2em black'}}>
                            List Your Favourite YouTube Songs ...
                        </Typography>
                        <Typography color={'white'} sx={{fontSize: '2rem', textAlign: 'right', fontStyle: 'italic', fontFamily: "'Segoe Script'", textShadow: '0.1em 0.05em 0.2em black'}}>
                            ... And Share Them With The World!
                        </Typography>
                    </div>
                </Slide>
                <Slide in={open} timeout={open ? 700 : 400} direction={'left'} unmountOnExit>
                    <Card elevation={6} sx={{ 
                        height: '80%', 
                        maxWidth: '30rem',
                        minWidth: '20rem',
                        display: 'grid',
                        alignItems: 'center',
                        justifyItems: 'center',
                        gridTemplateColumns: '100%',
                        gridTemplateRows: '20% 20% 20% 20%',
                        borderRadius: '50px'
                    }}>
                        <AccountCircleIcon
                        color='primary'
                        sx={{
                            fontSize: '4rem'
                        }} 
                        />
                        <Button variant='contained' sx={{width: '70%', fontSize: '24px', textTransform: 'none'}} onClick={handleLogin}>Login</Button>
                        <Button variant='contained' sx={{width: '70%', fontSize: '24px', textTransform: 'none'}} onClick={handleRegister}>Create Account</Button>
                        <Button variant='outlined' sx={{width: '70%', fontSize: '24px', textTransform: 'none'}} onClick={handleGuest}>Continue as Guest</Button>
                        <Typography color={'GrayText'} fontSize='small'>Developed by Tianao Deng - Stony Brook University</Typography>
                    </Card>
                </Slide>
            </div>
        </div>
    );
}

export default SplashScreen