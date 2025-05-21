import HeaderUsuario from '../componentes/HeaderUsuario'; 
import TarjetaMascotas from '../componentes/TarjetaMascotas';
import Busqueda from '../componentes/Busqueda';
import Servicios from '../componentes/Servicios';
import Planes from '../componentes/Planes';
import Cuidadores from '../componentes/Cuidadores';
import '../estilos/home.css';

export default function PaginaHome() {
  return (
    <div className="pagina-home">
      <HeaderUsuario />

      <div className="search-box">
        <Busqueda />
      </div>

      <div className="pets-box">
        <h2 className="section-title">Tus mascotas</h2>
        <TarjetaMascotas />
      </div>

      <div className="services-box">
        <h2 className="section-title" style={{marginBottom: '5px'}}>Servicios</h2>
        <Servicios />
      </div>

      <div className="plans-box">
        <h2 className="section-title">Planes recomendados</h2>
        <Planes />
      </div>

      <div className="care-box">
        <h2 className="section-title">Cuidadores cercanos</h2>
        <Cuidadores />
      </div>

      <div className="footer">
        Amá a tus mascotas con PetCare <span>❤️</span>
      </div>
    </div>
  );
}
