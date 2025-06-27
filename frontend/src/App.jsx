import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UbicacionProvider } from './context/UbicacionContext';

import PaginaLogin from './paginas/PaginaLogin';
import PaginaRegistro from './paginas/PaginaRegistro';
import PaginaHome from './paginas/PaginaHome';
import PaginaUsuario from './paginas/PaginaUsuario';
import DetalleCuidador from './paginas/DetalleCuidador';
import PaginaRegistroMascotas from './paginas/PaginaRegistroMascota';
import PaginaEditarMascota from './paginas/PaginaEditarMascota';
import PaginaPerfilProveedor from './paginas/PaginaPerfilProveedor';
import ProviderList from './componentes/ProviderList';
import Reservar from './componentes/Reservar';
import PaginaAdmin from './paginas/PaginaAdmin';
import RutaProtegidaAdmin from './componentes/RutaProtegidaAdmin';
import RutaProtegida from './componentes/RutaProtegida';
import RutaPublica from './componentes/RutaPublica';
import HistorialReservas from './componentes/HistorialReservas';
import Footer from './componentes/Footer';
import PaginaSobreNosotros from './paginas/PaginaSobreNosotros';
import PaginaContacto from './paginas/PaginaContacto';

export default function App() {
  return (
    <BrowserRouter>
      <UbicacionProvider>
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
          <Route 
            path="/login" 
            element={
              <RutaPublica>
                <PaginaLogin />
              </RutaPublica>
            } 
          />
          <Route 
            path="/registro" 
            element={
              <RutaPublica>
                <PaginaRegistro />
              </RutaPublica>
            } 
          />
          <Route 
            path="/inicio" 
            element={
              <RutaProtegida>
                <PaginaHome />
              </RutaProtegida>
            } 
          />
          <Route path="/" element={<Navigate to="/inicio" replace />} />
          <Route 
            path="/profile" 
            element={
              <RutaProtegida>
                <PaginaUsuario />
              </RutaProtegida>
            } 
          />
          <Route 
            path="/detalle-cuidador" 
            element={
              <RutaProtegida>
                <DetalleCuidador />
              </RutaProtegida>
            } 
          />
          <Route 
            path="/registromascota" 
            element={
              <RutaProtegida>
                <PaginaRegistroMascotas />
              </RutaProtegida>
            } 
          />
          <Route 
            path="/editar-mascota/:id" 
            element={
              <RutaProtegida>
                <PaginaEditarMascota />
              </RutaProtegida>
            } 
          />
          <Route 
            path="/perfil-proveedor" 
            element={
              <RutaProtegida>
                <PaginaPerfilProveedor />
              </RutaProtegida>
            } 
          />
          <Route 
            path="/proveedores" 
            element={
              <RutaProtegida>
                <ProviderList />
              </RutaProtegida>
            } 
          />
          <Route 
            path="/proveedor/:id" 
            element={
              <RutaProtegida>
                <Reservar />
              </RutaProtegida>
            } 
          />
          <Route 
            path="/mis-reservas" 
            element={
              <RutaProtegida>
                <HistorialReservas />
              </RutaProtegida>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <RutaProtegidaAdmin>
                <PaginaAdmin />
              </RutaProtegidaAdmin>
            } 
          />
          <Route 
            path="/sobre-nosotros" 
            element={<PaginaSobreNosotros />} 
          />
          <Route 
            path="/contacto" 
            element={<PaginaContacto />} 
          />
          <Route path="*" element={<Navigate to="/inicio" replace />} />
        </Routes>
        <Footer />
      </UbicacionProvider>
    </BrowserRouter>
  );
}
