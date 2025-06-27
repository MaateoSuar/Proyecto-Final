import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaginaSobreNosotros() {
  const navigate = useNavigate();
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
        <h1 style={{ marginBottom: 24, fontSize: '3rem', fontWeight: 700, textAlign: 'center', color: '#875e39' }}>Sobre nosotros</h1>
        <p style={{ maxWidth: 600, fontSize: 22, textAlign: 'center', margin: 0, color: '#875e39' }}>
          PetCare es una plataforma dedicada a conectar dueños de mascotas con cuidadores y proveedores de servicios confiables. Nuestro objetivo es brindar tranquilidad y bienestar a tu mascota, con atención personalizada y soporte en todo momento.
        </p>
      </div>
    </div>
  );
} 