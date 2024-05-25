import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.png'; 

function Header() {
  return (
    <header className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#80cc28', maxHeight: '8vh' }}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Logo" className="logo img-fluid" style={{ maxHeight: '100%', width: 'auto' }} />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cadastro">Cadastro</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
