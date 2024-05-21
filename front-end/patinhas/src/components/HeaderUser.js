// HeaderUser.js
import React from 'react';
import { Link } from 'react-router-dom';

const HeaderUser = () => {
  const handleLogout = () => {
    // Implemente a lógica para fazer logout aqui
    localStorage.removeItem('user');
    // Redirecione para a página de login após o logout
    window.location.href = '/login';
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/homeuser">Home</Link>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default HeaderUser;
