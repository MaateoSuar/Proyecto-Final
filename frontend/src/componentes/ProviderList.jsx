import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa';

const categories = [
  { label: 'Peluquería', value: 'peluqueria' },
  { label: 'Paseo', value: 'paseo' },
  { label: 'Cuidado', value: 'cuidado' },
];

const API_URL = import.meta.env.VITE_API_URL;

const ProviderList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [providers, setProviders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(location.state?.selectedCategory || null);
  const [orderPrice, setOrderPrice] = useState(location.state?.orderPrice || null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterRef = useRef();

  const fetchProviders = async (tipoServicio = null, ordenPrecio = null) => {
    try {
      const res = await axios.get(`${API_URL}/prestadores`, {
        params: {
          ...(tipoServicio ? { tipoServicio } : {}),
          ...(ordenPrecio ? { ordenPrecio } : {})
        },
      });

if (res.data.success) {
  let activos = res.data.data.filter(p => p.isActive);

  if (ordenPrecio) {
    activos.sort((a, b) => {
      const precioA = a.services?.[0]?.price ?? Infinity;
      const precioB = b.services?.[0]?.price ?? Infinity;
      return ordenPrecio === 'asc' ? precioA - precioB : precioB - precioA;
    });
  }

  setProviders(activos);
}
 else {
        setProviders([]);
      }
    } catch (error) {
      console.error('Error al cargar prestadores:', error);
      setProviders([]);
    }
  };


useEffect(() => {
  const params = new URLSearchParams(location.search);
  const categoria = params.get('categoria');
  const precio = params.get('precio');
  if (categoria) setSelectedCategory(categoria);
  if (precio) setOrderPrice(precio);
}, [location.search]);



  useEffect(() => {
    fetchProviders(selectedCategory, orderPrice);
  }, [selectedCategory, orderPrice]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilterMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

const handleProviderClick = (provider) => {
  navigate(
    {
      pathname: `/proveedor/${provider._id}`,
      search: location.search
    },
    {
      state: {
        provider,
        from: `${location.pathname}${location.search}`,
        selectedCategory,
        orderPrice
      }
    }
  );
};



const handleCategoryClick = (value) => {
  const newCategory = value === selectedCategory ? null : value;
  setSelectedCategory(newCategory);

  const params = new URLSearchParams(location.search);
  if (newCategory) {
    params.set('categoria', newCategory);
  } else {
    params.delete('categoria');
  }
  navigate({ search: params.toString() }, { replace: true });
};


  const renderServices = (services) => {
    if (!services || services.length === 0) return 'Sin servicios';
    return services.map(s => s.type).join(', ');
  };

  const randomDistance = () => (Math.random() * 3 + 0.5).toFixed(1);

  return (
    <div style={{ backgroundColor: '#fceecf', minHeight: '100vh', padding: '1rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h2 style={{ fontSize: '1.2rem', color: '#000' }}>Nuestros Servicios</h2>

        {/* Filtro de precio */}
        <div ref={filterRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            style={{
              backgroundColor: '#FEFAE0',
              border: '1px solid #ccc',
              borderRadius: '50%',
              padding: '0.5rem',
              cursor: 'pointer',
              color: '#000'
            }}
          >
            <FaFilter />
          </button>
          {showFilterMenu && (
            <div style={{
              position: 'absolute',
              top: '2.5rem',
              right: 0,
              backgroundColor: '#FEFAE0',
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
              zIndex: 10,
              fontSize: '0.9rem',
              color: '#000',
              minWidth: '180px'
            }}>
              <div
            onClick={() => {
             const params = new URLSearchParams(location.search);
             params.set('precio', 'asc');                        
              navigate({ search: params.toString() }, { replace: true });
              setOrderPrice('asc');
              setShowFilterMenu(false);
              }}

                style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
              >
                Precio: Menor - Mayor
              </div>
              <div
                onClick={() => {
               const params = new URLSearchParams(location.search); // 🔁 CAMBIO
               params.set('precio', 'desc');                        // 🔁 CAMBIO
                navigate({ search: params.toString() }, { replace: true }); // 🔁 CAMBIO
               setOrderPrice('desc');
               setShowFilterMenu(false);
              }}

                style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
              >
                Precio: Mayor - Menor
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='filtros' style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        overflowX: 'auto'
      }}>
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
            onClick={() => handleProviderClick(provider)}
            style={{
              backgroundColor: '#FEFAE0',
              borderRadius: '16px',
              padding: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
              color: '#000',
              cursor: 'pointer'
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
