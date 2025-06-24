// test/PaginaUsuario.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaginaUsuario from '../../src/paginas/PaginaUsuario';
import { MemoryRouter } from 'react-router-dom';

// Mock del useNavigate
const navigateMock = vi.fn(); 

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useLocation: () => ({ search: '' }), // para evitar errores de location
  };
});

describe('Integración - Botón Cerrar Sesión', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'fake-token');
    navigateMock.mockClear();
  });

  it('debería borrar el localStorage y redirigir al login', async () => {
    render(
      <MemoryRouter>
        <PaginaUsuario />
      </MemoryRouter>
    );

    const logoutBtn = screen.getByText(/cerrar sesión/i);
    await userEvent.click(logoutBtn);

    expect(localStorage.getItem('token')).toBeNull();
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });
});
// test/PaginaUsuario.test.js