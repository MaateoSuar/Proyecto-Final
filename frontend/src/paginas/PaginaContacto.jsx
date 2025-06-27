import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EMAIL = 'soporte@petcare.com';
const PHONE = '+54 381 123-4567';

const CopyIcon = ({ onClick }) => (
  <svg onClick={onClick} style={{ cursor: 'pointer', marginLeft: 8, verticalAlign: 'middle' }} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="9" width="10" height="10" rx="2" stroke="#875e39" strokeWidth="2" fill="none"/>
    <rect x="5" y="5" width="10" height="10" rx="2" stroke="#875e39" strokeWidth="2" fill="none"/>
  </svg>
);

export default function PaginaContacto() {
  const navigate = useNavigate();
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado al portapapeles');
  };
  return (
    <div style={{ background: '#fdefce', minHeight: '100vh', width: '100%', position: 'relative', color: '#875e39' }}>
      <button
        className="back-button"
        style={{ position: 'fixed', top: 32, left: 32, fontSize: 32, color: '#875e39', zIndex: 1000 }}
        onClick={() => navigate(-1)}
        aria-label="Volver"
      >
        &larr;
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%' }}>
        <h1 style={{ marginBottom: 24, fontSize: '3rem', fontWeight: 700, textAlign: 'center', color: '#875e39' }}>Contacto</h1>
        <h4 style={{ maxWidth: 600, fontSize: 22, textAlign: 'center', fontWeight: 400, margin: 0, color: '#875e39' }}>
          Email: {EMAIL}
          <CopyIcon onClick={() => handleCopy(EMAIL)} />
          <br/>
          Teléfono: {PHONE}
          <CopyIcon onClick={() => handleCopy(PHONE)} />
        </h4>
      </div>
    </div>
  );
} 