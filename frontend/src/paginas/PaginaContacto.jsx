import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../estilos/PaginaContacto.css';

const EMAIL = 'soporte@petcare.com';
const PHONE = '+54 381 410-1198';
const ADDRESS = 'Av. Juan Domingo Perón 2085, T4107 Yerba Buena, Tucumán';
const HOURS = 'Lunes a Viernes: 9:00 - 18:00';

const ContactIcon = ({ children, className }) => (
  <div className={`contacto-icono ${className}`}>{children}</div>
);

const CopyIcon = ({ onClick }) => (
  <svg onClick={onClick} className="copy-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="9" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="5" y="5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

export default function PaginaContacto() {
  const navigate = useNavigate();
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado al portapapeles');
  };
  return (
    <div className="contacto-hero-bg">
      <span className="back-arrow-sobre" style={{position:'fixed',top:32,left:32,zIndex:1000,cursor:'pointer'}} onClick={() => navigate(-1)}>&larr;</span>
      <section className="contacto-hero">
        <div className="contacto-hero-illustration">
          <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="Contacto" />
        </div>
        <h1 className="contacto-hero-title">¡Contáctanos!</h1>
        <p className="contacto-hero-desc">Estamos aquí para ayudarte y responder todas tus preguntas.</p>
      </section>
      <section className="contacto-blocks">
        <div className="contacto-block contacto-block-email">
          <ContactIcon className="email-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#8B5C2A"/>
            </svg>
          </ContactIcon>
          <h3>Email</h3>
          <p
            className="contacto-info"
            style={{ cursor: 'pointer' }}
            onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=soporte@petcare.com', '_blank')}
          >
            {EMAIL}
            <CopyIcon onClick={(e) => { e.stopPropagation(); handleCopy(EMAIL); }} />
          </p>
          <span className="contacto-desc">Envíanos un mensaje y te responderemos en menos de 24 horas</span>
        </div>
        <div className="contacto-block contacto-block-phone">
          <ContactIcon className="phone-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="#8B5C2A"/>
            </svg>
          </ContactIcon>
          <h3>Teléfono</h3>
          <p className="contacto-info" onClick={() => window.open(`tel:${PHONE}`, '_blank')}>
            {PHONE}
            <CopyIcon onClick={(e) => { e.stopPropagation(); handleCopy(PHONE); }} />
          </p>
          <span className="contacto-desc">Llámanos para atención inmediata y personalizada</span>
        </div>
        <div className="contacto-block contacto-block-location">
          <ContactIcon className="location-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z" fill="#8B5C2A"/>
            </svg>
          </ContactIcon>
          <h3>Ubicación</h3>
          <p
            className="contacto-info"
            style={{ cursor: 'pointer' }}
            onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Av.+Juan+Domingo+Perón+2085,+T4107+Yerba+Buena,+Tucumán', '_blank')}
          >
            {ADDRESS}
          </p>
          <span className="contacto-desc">Nuestra oficina principal en Tucumán</span>
        </div>
        <div className="contacto-block contacto-block-time">
          <ContactIcon className="time-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#8B5C2A"/>
            </svg>
          </ContactIcon>
          <h3>Horarios</h3>
          <p className="contacto-info">{HOURS}</p>
          <span className="contacto-desc">Horarios de atención al cliente</span>
        </div>
      </section>
      <section className="contacto-cta-bg">
        <div className="contacto-cta">
          <h2>¿Necesitas ayuda urgente?</h2>
          <p>Nuestro equipo está disponible para asistirte con cualquier consulta sobre nuestros servicios</p>
          <div className="contacto-cta-btns">
            <button className="contacto-cta-btn-primary" onClick={() => window.open(`mailto:${EMAIL}`, '_blank')}>Enviar Email</button>
            <button className="contacto-cta-btn-secondary" onClick={() => window.open(`tel:${PHONE}`, '_blank')}>Llamar Ahora</button>
          </div>
      </div>
      </section>
    </div>
  );
} 