//src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaginaLogin from './paginas/PaginaLogin';
import PaginaRegistro from './paginas/PaginaRegistro';
import PaginaHome from './paginas/PaginaHome';
import PaginaUsuario from './paginas/PaginaUsuario';
import DetalleCuidador from "./paginas/DetalleCuidador";
import PaginaRegistroMascotas from './paginas/PaginaRegistroMascota';
import PaginaEditarMascota from './paginas/PaginaEditarMascota';
import PaginaPerfilProveedor from './paginas/PaginaPerfilProveedor';
import ProviderList from './componentes/ProviderList';
import PerfilProveedor from './componentes/PerfilProveedor';

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{
          '--toastify-color-success': '#a57449',
          '--toastify-color-error': '#dc3545',
          '--toastify-color-warning': '#ffc107',
          '--toastify-color-info': '#17a2b8',
        }}
      />
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
        <Route path="/proveedor/:id" element={<PerfilProveedor />} />
        <Route path="*" element={<PaginaLogin />} />
      </Routes>
    </BrowserRouter>
  );
}
