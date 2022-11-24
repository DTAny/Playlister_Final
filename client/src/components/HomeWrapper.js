import { useContext, useEffect } from 'react'
import SplashScreen from './SplashScreen'
import AuthContext from '../auth'
import { useNavigate } from 'react-router-dom';

export default function HomeWrapper() {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    console.log("HomeWrapper auth.loggedIn: " + auth.loggedIn);

    useEffect(()=>{
        if (auth.loggedIn) navigate('/home');
    }, []);
    return <SplashScreen />
}