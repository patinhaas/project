import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HeaderUser from './components/HeaderUser'; // Importe o componente HeaderUser
import Cadastro from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import HomeUser from './components/HomeUser';
import Profile from './components/Profile';
import RegisterDonation from './components/RegisterDonation';

function App() {
  // Defina um estado para verificar se o usuário está logado
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('user') !== null;
  });

  // Função para fazer logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    // Atualize o estado para indicar que o usuário está deslogado
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
