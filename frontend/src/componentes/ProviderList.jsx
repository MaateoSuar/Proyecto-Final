import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Dentro del componente

const categories = [
  { label: 'Peluquería', value: 'peluqueria' },
  { label: 'Paseo', value: 'paseo' },
  { label: 'Cuidado', value: 'cuidado' },
];
const API_URL = import.meta.env.VITE_API_URL;

// ...

const ProviderList = () => {
  const navigate = useNavigate();

const handleProviderClick = (provider) => {
  navigate(`/proveedor/${provider._id}`, { state: { provider } });
};
  const location = useLocation();
  const [providers, setProviders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchProviders = async (tipoServicio = null) => {
    try {
      const res = await axios.get(`${API_URL}/prestadores`, {
        params: tipoServicio ? { tipoServicio } : {},
      });

      if (res.data.success) {
        const activos = res.data.data.filter(p => p.isActive);
        setProviders(activos);
      } else {
        setProviders([]);
      }
    } catch (error) {
      console.error('Error al cargar prestadores:', error);
      setProviders([]);
    }
  };

  useEffect(() => {
    const filtroInicial = location.state?.filtro || null;
    setSelectedCategory(filtroInicial);
    fetchProviders(filtroInicial);
  }, []);

  const handleCategoryClick = (value) => {
    if (value === selectedCategory) {
      setSelectedCategory(null);
      fetchProviders();
    } else {
      setSelectedCategory(value);
      fetchProviders(value);
    }
  };

  const renderServices = (services) => {
    if (!services || services.length === 0) return 'Sin servicios';
    return services.map(s => s.type).join(', ');
  };

  const randomDistance = () => (Math.random() * 3 + 0.5).toFixed(1);
  return (
    <div style={{ backgroundColor: '#fceecf', minHeight: '100vh', padding: '1rem' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#000' }}>Nuestros Servicios</h2>

      <div className='filtros' style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', overflowX: 'auto' }} >
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => handleCategoryClick(cat.value)}
            style={{
              backgroundColor: selectedCategory === cat.value ? '#d4a373' : '#FEFAE0',
              color: '#000',
              fontWeight: selectedCategory === cat.value ? 'bold' : 'normal',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: '1px solid #ccc',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              margin: '2px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#000' }}>Especialistas disponibles</h3>

      {providers.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#333' }}>No se encontraron proveedores para esta categoría.</p>
      ) : (
        providers.map(provider => (
          <div
            key={provider._id}
            onClick={() => handleProviderClick(provider)} // ← Aquí redirige al perfil
            style={{
              backgroundColor: '#FEFAE0',
              borderRadius: '16px',
              padding: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
              color: '#000',
              cursor: 'pointer' // ← Indicador visual de clic
            }}
          >
            <img
              src={provider.profileImage?.replace(/\u200E|\u202A|\u202C/g, '')}
              alt={provider.name}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                objectFit: 'cover',
                marginRight: '1rem'
              }}
            />
            <div>
              <h3 style={{ margin: 0 }}>{provider.name}</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                {renderServices(provider.services)}
              </p>
              <p style={{ margin: '0.2rem 0', fontSize: '0.85rem' }}>
                ⭐ {provider.rating?.average ?? 'N/A'} · 📍 {randomDistance()} km
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );

};

export default ProviderList;
