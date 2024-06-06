import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; 
function Footer() {
  return (
    <footer className="footer mt-auto py-3" style={{ backgroundColor: '#ef9c4e', color: '#fff' }}>
      <div className="container text-center">
        <div className="row">
          <div className="col">
            <span>© 2024 Patinhas - Todos os direitos reservados</span>
          </div>
          <div className="col">
            <a href="https://www.facebook.com" className="text-white me-2"><FaFacebook /></a>
            <a href="https://www.twitter.com" className="text-white me-2"><FaTwitter /></a>
            <a href="https://www.instagram.com" className="text-white"><FaInstagram /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
