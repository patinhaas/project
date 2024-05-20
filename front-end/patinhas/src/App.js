import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Cadastro from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import HomeUser from './components/HomeUser';

function App() {
  const isLoggedIn = () => {
    return localStorage.getItem('user') !== null;
  };

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/homeuser"
            element={isLoggedIn() ? <HomeUser /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

export default App;
