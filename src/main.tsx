import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './pages/index';
import SignIn from './pages/auth/signIn';
import SignUp from './pages/auth/signUp';
import AddUser from './pages/auth/addUser';
import Profile from './pages/users/profile';
import AddMagasin from './pages/magasins/addMagasin';
import Navbar from './components/navbar';
import './assets/css/index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/addUser" element={<AddUser />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/magasins/add" element={<AddMagasin />} />
      </Routes>
    </BrowserRouter>
  </GoogleOAuthProvider>,
);
