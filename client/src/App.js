import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import { 
  HomeWrapper,
  AppBanner,
  LoginScreen,
  RegisterScreen,
  HomeScreen
} from './components';

const App = () => {
  return (
    <BrowserRouter>
     <AuthContextProvider>
        <GlobalStoreContextProvider>              
            <AppBanner />
            <Routes>
              <Route path="/" element={ <HomeWrapper/> }/>
              <Route path="/login" element={ <LoginScreen/> }/>
              <Route path="/register" element={ <RegisterScreen/> }/>
              <Route path="/home" element={ <HomeScreen/> }/>
            </Routes>
        </GlobalStoreContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
