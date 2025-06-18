import React, { useState } from 'react';
import '../estilos/home/componentes/footer.css';
import { toast } from 'react-toastify';

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

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  return (
    <footer className="footer petcare-footer">
      <div className="footer-content">
        <div className="footer-section">
          <button
            className="footer-title"
            onClick={() => setOpenAbout((prev) => !prev)}
            aria-expanded={openAbout}
            aria-controls="about-content"
          >
            <h4>Sobre nosotros</h4>
          </button>
          {openAbout && (
            <div id="about-content" className="footer-dropdown">
              <p>
                PetCare es una plataforma dedicada a conectar dueños de mascotas con cuidadores y proveedores de servicios confiables. Nuestro objetivo es brindar tranquilidad y bienestar a tu mascota, con atención personalizada y soporte en todo momento.
              </p>
            </div>
          )}
        </div>
        <div className="footer-section right">
          <button
            className="footer-title"
            onClick={() => setOpenSupport((prev) => !prev)}
            aria-expanded={openSupport}
            aria-controls="support-content"
          >
            <h4>Soporte</h4>
          </button>
          {openSupport && (
            <div id="support-content" className="footer-dropdown">
              <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                Email: {EMAIL}
                <button
                  className="copy-btn"
                  aria-label="Copiar email"
                  onClick={() => handleCopy(EMAIL, 'Email')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 4 }}
                >
                  <CopyIcon />
                </button>
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                Teléfono: {PHONE}
                <button
                  className="copy-btn"
                  aria-label="Copiar teléfono"
                  onClick={() => handleCopy(PHONE, 'Teléfono')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 4 }}
                >
                  <CopyIcon />
                </button>
              </p>
            </div>
          )}
        </div>
        <div className="footer-copyright">
          PetCare &copy; {new Date().getFullYear()} Derechos reservados
        </div>
      </div>
    </footer>
  );
};

export default Footer; 