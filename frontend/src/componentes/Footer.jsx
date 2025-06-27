import React, { useState } from 'react';
import '../estilos/home/componentes/footer.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EMAIL = 'soporte@petcare.com';
const PHONE = '+54 381 123-4567';

const CopyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}>
    <rect x="7" y="7" width="10" height="10" rx="2" fill="#875e39"/>
    <rect x="3" y="3" width="10" height="10" rx="2" stroke="#875e39" strokeWidth="2" fill="none"/>
  </svg>
);

const Footer = () => {
  const [openAbout, setOpenAbout] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);
  const navigate = useNavigate();

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  return (
    <footer className="footer petcare-footer">
      <div className="footer-content centered-footer">
        <span className="footer-petcare">PetCare <span className="footer-c">©</span></span>
        <img src="/vite.png" alt="PetCare Logo" className="footer-logo" />
        <div className="footer-links">
          <button className="footer-link-btn" onClick={() => navigate('/sobre-nosotros')}>Sobre nosotros</button>
          <button className="footer-link-btn" onClick={() => navigate('/contacto')}>Contacto</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 