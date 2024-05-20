import React from 'react';
import { Link } from 'react-router-dom';
import './css/Header.css'; 

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src="/imgs/logo.png" alt="Logo" />
      </div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/cadastro">Cadastro</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
