import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PaginaLogin from './paginas/PaginaLogin';
import PaginaRegistro from './paginas/PaginaRegistro';
import PaginaHome from './paginas/PaginaHome'; // nueva

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PaginaLogin />} />
        <Route path="/registro" element={<PaginaRegistro />} />
        <Route path="/inicio" element={<PaginaHome />} />
        <Route path="*" element={<PaginaLogin />} />
      </Routes>
    </BrowserRouter>
  );
}
