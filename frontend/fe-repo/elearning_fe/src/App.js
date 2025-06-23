import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home_page/home.js';
import SignInSide from './pages/signin_page/SignInSide.js';
import SignUpSide from './pages/register_page/SignUp.js';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignInSide />} />
        <Route path="/sign-up" element={<SignUpSide />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
