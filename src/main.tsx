import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Home from './pages/home';
import SignIn from './pages/auth/signIn';
import SignUp from './pages/auth/signUp';
import AddUser from './pages/auth/addUser';
import Profile from './pages/users/profile';
import AddMagasin from './pages/magasins/userAddMagasin';
import MagasinUser from './pages/magasins/getMagasinsUser';
import MagasinDetail from './pages/magasins/[id]';
import UserAddArticle from './pages/articles/userAddArticle';
import Search from './pages/search/searchPhoto';
import All from './pages/all';

import Navbar from './components/navbar';
import MobileHeader from './components/header';

import './assets/css/index.css';

function AppWrapper() {
  const location = useLocation();

  // Pages d'auth sur lesquelles on ne veut pas afficher navbar / mobile header
  const isAuthPage = ['/signin', '/signUp', '/addUser'].includes(
    location.pathname,
  );

  return (
    <>
      {!isAuthPage && <Navbar />}
      {!isAuthPage && <MobileHeader />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/addUser" element={<AddUser />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/magasin/add" element={<AddMagasin />} />
        <Route path="/magasin" element={<MagasinUser />} />
        <Route path="/magasin/:id" element={<MagasinDetail />} />
        <Route path="/magasin/article/add/:id" element={<UserAddArticle />} />
        <Route path="/search" element={<Search />} />
        <Route path="/all" element={<All />} />
      </Routes>
    </>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  </GoogleOAuthProvider>,
);
