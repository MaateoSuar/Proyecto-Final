import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../estilos/PaginaSobreNosotros.css';

export default function PaginaSobreNosotros() {
  const navigate = useNavigate();
  return (
    <div className="sobre-hero-bg">
      <span className="back-arrow-sobre" style={{position:'fixed',top:32,left:32,zIndex:1000,cursor:'pointer'}} onClick={() => navigate(-1)}>&larr;</span>
      <section className="sobre-hero">
        <div className="sobre-hero-illustration">
          <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="PetCare" />
        </div>
        <h1 className="sobre-hero-title">¡Bienvenido a PetCare!</h1>
        <p className="sobre-hero-desc">Cuidamos lo que más amas. Conectamos dueños de mascotas con cuidadores y servicios de confianza.</p>
      </section>
      <section className="sobre-blocks">
        <div className="sobre-block sobre-block-mision">
          <div className="sobre-block-icon">
            <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="Misión" />
          </div>
          <h2>Misión</h2>
          <p>Brindar tranquilidad y bienestar a tu mascota, conectándote con cuidadores y proveedores de servicios confiables y profesionales.</p>
        </div>
        <div className="sobre-block sobre-block-vision">
          <div className="sobre-block-icon">
            <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="Visión" />
          </div>
          <h2>Visión</h2>
          <p>Ser la plataforma líder en servicios de cuidado de mascotas, creando una comunidad donde cada mascota reciba el amor y atención que merece.</p>
        </div>
        <div className="sobre-block sobre-block-valores">
          <div className="sobre-block-icon">
            <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="Valores" />
          </div>
          <h2>Valores</h2>
          <p>Confianza, profesionalismo, amor por los animales y compromiso con la excelencia en cada servicio que ofrecemos.</p>
        </div>
      </section>
      <section className="sobre-stats-bg">
        <div className="sobre-stats">
          <div className="sobre-stat">
            <span className="sobre-stat-num">+100</span>
            <span className="sobre-stat-label">Mascotas</span>
          </div>
          <div className="sobre-stat">
            <span className="sobre-stat-num">+50</span>
            <span className="sobre-stat-label">Cuidadores</span>
          </div>
          <div className="sobre-stat">
            <span className="sobre-stat-num">95%</span>
            <span className="sobre-stat-label">Satisfacción</span>
          </div>
        </div>
      </section>
      <section className="sobre-cta-bg">
        <div className="sobre-cta">
          <h2>¿Listo para darle a tu mascota el mejor cuidado?</h2>
          <button className="sobre-cta-btn" onClick={() => navigate('/inicio')}>Comenzar Ahora</button>
      </div>
      </section>
    </div>
  );
} 