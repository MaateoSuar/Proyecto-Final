import { useNavigate } from 'react-router-dom';
export default function Servicios() {
  const navigate = useNavigate();
  const irFiltrado = (filtro) => {
    navigate('/proveedores', { state: { filtro } });
  };
  return (
    <div className="services">
      <div className="service-card" onClick={() => irFiltrado('peluqueria')}>
        <img src="/img/grooming.png" alt="Peluquería" />
      </div>
      <div className="service-card" onClick={() => irFiltrado('paseo')}>
        <img src="/img/walking.png" alt="Paseo" />
      </div>
      <div className="service-card" onClick={() => irFiltrado('cuidado')}>
        <img src="/img/housing.png" alt="Cuidado" />
      </div>
    </div>
  );
}
