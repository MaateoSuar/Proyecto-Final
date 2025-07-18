import React, { useEffect, useState, useRef } from 'react';
import formatRating from '../utils/formatRating';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaFilter, FaSearch } from 'react-icons/fa';
import '../estilos/ProviderList.css';

const categories = [
  { label: 'Peluquería', value: 'peluqueria' },
  { label: 'Paseo', value: 'paseo' },
  { label: 'Cuidado', value: 'cuidado' },
];

function upper(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // en km
}

const API_URL = import.meta.env.VITE_API_URL;

const ProviderList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userCoords, setUserCoords] = useState({ lat: null, lng: null });
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterRef = useRef();

  const params = new URLSearchParams(location.search);
  const ordenActual = params.get('orden');
  const precioActual = params.get('precio');

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
        const categoriaSeleccionada = params.get('categoria');

        if (categoriaSeleccionada) {
          activos = activos.map(p => {
            const servicio = Array.isArray(p.services)
              ? p.services.find(s => s.type === categoriaSeleccionada)
              : p.services?.type === categoriaSeleccionada
                ? p.services
                : null;

            return {
              ...p,
              precioFiltrado: servicio ? servicio.price : null
            };
          });

          if (precioActual === 'asc') {
            activos.sort((a, b) => (a.precioFiltrado ?? Infinity) - (b.precioFiltrado ?? Infinity));
          } else if (precioActual === 'desc') {
            activos.sort((a, b) => (b.precioFiltrado ?? -Infinity) - (a.precioFiltrado ?? -Infinity));
          }
        }

        if (userCoords.lat && userCoords.lng) {
          activos = activos.map(p => {
            const [lat, lng] = p.location.coordinates.coordinates;
            const distancia = calcularDistancia(userCoords.lat, userCoords.lng, lat, lng);
            return { ...p, distancia };
          });
        }

        if (ordenActual === 'cercania' && userCoords.lat && userCoords.lng) {
          activos.sort((a, b) => a.distancia - b.distancia);
        }
        activos = activos.filter(p => p.precioFiltrado !== null);
        setProviders(activos);
        setFilteredProviders(activos);
      } else {
        setProviders([]);
        setFilteredProviders([]);
      }
    } catch (error) {
      console.error('Error al cargar prestadores:', error);
      setProviders([]);
      setFilteredProviders([]);
    }
  };

  useEffect(() => {
    const ubicacionGuardada = localStorage.getItem('ubicacionSeleccionada');
    if (ubicacionGuardada) {
      try {
        const ubicacion = JSON.parse(ubicacionGuardada);
        setUserCoords({
          lat: ubicacion.coordenadas.lat,
          lng: ubicacion.coordenadas.lng
        });
      } catch (error) {
        console.error('Error al parsear ubicacionSeleccionada:', error);
      }
    }
  }, []);

  useEffect(() => {
    const categoria = params.get('categoria');
    const precio = params.get('precio');
    fetchProviders(categoria, precio);
  }, [location.search, userCoords]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilterMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProviders(providers);
    } else {
      const filtered = providers.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProviders(filtered);
    }
  }, [searchTerm, providers]);

  const handleProviderClick = (provider) => {
    navigate(
      {
        pathname: `/proveedor/${provider._id}`,
        search: location.search
      },
      {
        state: {
          provider,
          from: `${location.pathname}${location.search}`
        }
      }
    );
  };

  const handleCategoryClick = (value) => {
    const currentCategory = params.get('categoria');

    if (currentCategory !== value) {
      params.set('categoria', value);
      navigate({ search: params.toString() }, { replace: true });
    }
    // Si hacen clic en la misma categoría, no hacemos nada (no se puede desmarcar)
  };

  const toggleOrder = (type) => {
    const newParams = new URLSearchParams(location.search);
    const currentOrden = newParams.get('orden');
    const currentPrecio = newParams.get('precio');

    if (type === 'cercania') {
      if (currentOrden === 'cercania') {
        newParams.delete('orden');
      } else {
        newParams.set('orden', 'cercania');
        newParams.delete('precio');
      }
    } else if (type === 'asc' || type === 'desc') {
      if (currentPrecio === type) {
        newParams.delete('precio');
      } else {
        newParams.set('precio', type);
        newParams.delete('orden');
      }
    }

    navigate({ search: newParams.toString() }, { replace: true });
  };

  const renderServices = (services) => {
    if (Array.isArray(services)) {
      if (services.length === 0) return 'Sin servicios';
      return services.map(s => s.type).join(', ');
    }
    if (typeof services === 'object' && services !== null) {
      return services.type || 'Sin servicios';
    }
    return 'Sin servicios';
  };

  const getSelectedCategory = () => {
    return new URLSearchParams(location.search).get('categoria');
  };

  return (
    <div className="provider-list-container" style={{ position: 'relative' }}>
      <button className="back-button" onClick={() => navigate('/inicio')}>
        &larr;
      </button>
      <div className="headerList" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <h2 className="title" style={{ margin: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          Nuestros Servicios
        </h2>
        <div className="filter-container" style={{ position: 'absolute', right: 0 }}>
          <select
            value={ordenActual || precioActual || ''}
            onChange={(e) => {
              const value = e.target.value;
              const newParams = new URLSearchParams(location.search);

              if (value === '') {
                newParams.delete('orden');
                newParams.delete('precio');
              } else if (value === 'cercania') {
                newParams.set('orden', 'cercania');
                newParams.delete('precio');
              } else {
                newParams.set('precio', value);
                newParams.delete('orden');
              }

              navigate({ search: newParams.toString() }, { replace: true });
            }}
            className="order-select"
          >
            <option value="">Ordenar por...</option>
            <option value="asc">Precio: Menor - Mayor</option>
            <option value="desc">Precio: Mayor - Menor</option>
            <option value="cercania">Más cercanos</option>
          </select>
        </div>
      </div>

      <div className="search-container">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="filtros">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => handleCategoryClick(cat.value)}
            className={`category-button ${getSelectedCategory() === cat.value ? 'active' : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <h3 className="subtitle">Especialistas disponibles</h3>

      {filteredProviders.length === 0 ? (
        <p className="no-providers">No se encontraron proveedores para esta búsqueda.</p>
      ) : (
        <div className="providers-grid">
          {filteredProviders.map(provider => (
            <div className="provider-card" key={provider._id} onClick={() => handleProviderClick(provider)}>
              <img
                src={provider.profileImage?.replace(/\u200E|\u202A|\u202C/g, '')}
                alt={provider.name}
                className="provider-image"
              />
              <div className="provider-info">
                <h3>{provider.name}</h3>
                <p>
                  {upper(renderServices(provider.services))} · 💰
                  {provider.precioFiltrado !== null && provider.precioFiltrado !== undefined
                    ? `$${provider.precioFiltrado}`
                    : 'Sin precio'}
                </p>
                <p>
                  ⭐ {formatRating(provider.rating?.average)} · 📍{' '}
                  {provider.distancia ? `${provider.distancia.toFixed(1)} km` : `No disponible`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderList;
