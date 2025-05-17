export default function Planes() {
    return (
        <div className="plans">
          <div className="plan-card">
            <div className="card-header">
              <div className="date">15 Mayo • San Miguel de Tucumán</div>
            </div>
            <div className="card-content">
              <strong>Baño Canino</strong>
              <div>Mateo Suar</div>
              <div><a href="#" className="view-btn">Ver ubicación</a></div>
            </div>
            <div className="service-icon">
              <img src="/img/grooming.png" alt="Baño de Perros" />
            </div>
          </div>
          <div className="plan-card">
            <div className="card-header">
              <div className="date">20 Mayo • Yerba Buena</div>
            </div>
            <div className="card-content">
              <strong>Guardería</strong>
              <div>Enzo Fernandez</div>
              <div><a href="#" className="view-btn">Ver ubicación</a></div>
            </div>
            <div className="service-icon">
              <img src="/img/housing.png" alt="Guardería de Perros" />
            </div>
          </div>
          <div className="plan-card">
            <div className="card-header">
              <div className="date">25 Mayo • San Miguel de Tucumán</div>
            </div>
            <div className="card-content">
              <strong>Peluquería</strong>
              <div>Tomas Niziolek</div>
              <div><a href="#" className="view-btn">Ver ubicación</a></div>
            </div>
            <div className="service-icon">
              <img src="/img/walking.png" alt="Paseo de Perros" />
            </div>
          </div>
        </div>
    );
  }
  