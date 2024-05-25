import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HeaderUser from './components/HeaderUser';
import Cadastro from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import HomeUser from './components/HomeUser';
import Profile from './components/Profile';
import RegisterDonation from './components/RegisterDonation';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('user') !== null;
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div>
        {/* Renderiza o Header apropriado com base no estado de login */}
        {isLoggedIn ? <HeaderUser handleLogout={handleLogout} /> : <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/homeuser"
            element={isLoggedIn ? <HomeUser /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={isLoggedIn ? <Profile /> : <Navigate to="/profile" />}
          />
          <Route
            path="/profile"
            element={isLoggedIn ? <Profile /> : <Navigate to="/profile" />}
          />
          <Route
            path="/registerDonation"
            element={isLoggedIn ? <RegisterDonation /> : <Navigate to="/registerDonation" />}
          />

        </Routes>
      </div>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

export default App;
