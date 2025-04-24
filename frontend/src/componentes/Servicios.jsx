export default function Servicios() {
  return (
    <div className="services-box">
      {/* Título de sección */}
    

      {/* Solo las imágenes como botones */}
      <div className="services">
        <div className="service-card">
          <img src="/img/grooming.png" alt="Baño" />
        </div>
        <div className="service-card">
          <img src="/img/walking.png" alt="Paseo" />
        </div>
        <div className="service-card">
          <img src="/img/housing.png" alt="Cuidado" />
        </div>
      </div>
    </div>
  );
}
