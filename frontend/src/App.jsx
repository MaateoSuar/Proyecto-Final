
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PaginaLogin from './paginas/PaginaLogin';
import PaginaRegistro from './paginas/PaginaRegistro';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PaginaLogin />} />
        <Route path="/registro" element={<PaginaRegistro />} />
        <Route path="*" element={<PaginaLogin />} />
      </Routes>
    </BrowserRouter>
  );
}
