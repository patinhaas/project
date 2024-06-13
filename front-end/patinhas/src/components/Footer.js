import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer py-3" style={{ backgroundColor: '#ef9c4e', color: '#fff', textAlign: 'center', position: 'fixed', bottom: 0, width: '100%', zIndex: 50 }}>
      <div className="container">
        <span>© 2024 Patinhas - Todos os direitos reservados</span>
        <div className="mt-2">
          <a href="https://www.facebook.com" className="text-white me-2"><FaFacebook /></a>
          <a href="https://www.twitter.com" className="text-white me-2"><FaTwitter /></a>
          <a href="https://www.instagram.com" className="text-white"><FaInstagram /></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
