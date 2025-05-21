//src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PaginaLogin from './paginas/PaginaLogin';
import PaginaRegistro from './paginas/PaginaRegistro';
import PaginaHome from './paginas/PaginaHome'; // nueva
import PaginaUsuario from './paginas/PaginaUsuario';
import DetalleCuidador from "./paginas/DetalleCuidador";
import PaginaRegistroMascotas from './paginas/PaginaRegistroMascota';
import PaginaEditarMascota from './paginas/PaginaEditarMascota';
import PaginaPerfilProveedor from './paginas/PaginaPerfilProveedor';
import ProviderList from './componentes/ProviderList';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PaginaLogin />} />
        <Route path="/registro" element={<PaginaRegistro />} />
        <Route path="/inicio" element={<PaginaHome />} />
        <Route path="/profile" element={<PaginaUsuario />} />
        <Route path="/detalle-cuidador" element={<DetalleCuidador />} />
        <Route path="/registromascota" element={<PaginaRegistroMascotas />} />
        <Route path="/editar-mascota/:id" element={<PaginaEditarMascota />} />
        <Route path="/perfil-proveedor" element={<PaginaPerfilProveedor />} />
        <Route path="/proveedores" element={<ProviderList />} />
        <Route path="*" element={<PaginaLogin />} />
      </Routes>
    </BrowserRouter>
  );
}
