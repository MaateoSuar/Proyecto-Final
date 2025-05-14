//src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PaginaLogin from './paginas/PaginaLogin';
import PaginaRegistro from './paginas/PaginaRegistro';
import PaginaHome from './paginas/PaginaHome'; // nueva
import PaginaUsuario from './paginas/PaginaUsuario';
import DetalleCuidador from "./paginas/DetalleCuidador";
import PaginaRegistroMascotas from './paginas/PaginaRegistroMascota';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PaginaLogin />} />
        <Route path="/registro" element={<PaginaRegistro />} />
        <Route path="/inicio" element={<PaginaHome />} />
        <Route path="/profile" element={<PaginaUsuario />} />
        <Route path="/detalle-cuidador" element={<DetalleCuidador />} />
        <Route path="*" element={<PaginaLogin />} />
        <Route path="/registromascota" element={<PaginaRegistroMascotas />} />
      </Routes>
    </BrowserRouter>
  );
}
