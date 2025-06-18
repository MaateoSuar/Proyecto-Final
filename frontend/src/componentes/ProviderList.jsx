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

const API_URL = import.meta.env.VITE_API_URL;

const ProviderList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Cargar proveedores cuando cambian los parámetros de la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoria = params.get('categoria');
    const precio = params.get('precio');
    fetchProviders(categoria, precio);
  }, [location.search]);

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
    const params = new URLSearchParams(location.search);
    const currentCategory = params.get('categoria');
    
    if (currentCategory === value) {
      params.delete('categoria');
    } else {
      params.set('categoria', value);
    }
    
    navigate({ search: params.toString() }, { replace: true });
  };

  const handlePriceFilter = (order) => {
    const params = new URLSearchParams(location.search);
    params.set('precio', order);
    navigate({ search: params.toString() }, { replace: true });
  };

  const renderServices = (services) => {
    if (!services || services.length === 0) return 'Sin servicios';
    return services.map(s => s.type).join(', ');
  };

  const randomDistance = () => (Math.random() * 3 + 0.5).toFixed(1);

  const getSelectedCategory = () => {
    const params = new URLSearchParams(location.search);
    return params.get('categoria');
  };

  return (
    <div className="provider-list-container">
      <div className="headerList" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <button
          className="back-button"
          style={{ position: 'relative', left: 0 }}
          onClick={() => navigate('/inicio')}
        >
          &larr;
        </button>
        <h2 className="title" style={{ margin: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          Nuestros Servicios
        </h2>
        <div className="filter-container" ref={filterRef} style={{ position: 'relative', right: 0 }}>
          <button className="filter-button" onClick={() => setShowFilterMenu(!showFilterMenu)}>
            <FaFilter />
          </button>
          {showFilterMenu && (
            <div className="filter-menu">
              <div
                className="filter-option"
                onClick={() => {
                  handlePriceFilter('asc');
                  setShowFilterMenu(false);
                }}
              >
                Precio: Menor - Mayor
              </div>
              <div
                className="filter-option"
                onClick={() => {
                  handlePriceFilter('desc');
                  setShowFilterMenu(false);
                }}
              >
                Precio: Mayor - Menor
              </div>
            </div>
          )}
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
            <div
              className="provider-card"
              key={provider._id}
              onClick={() => handleProviderClick(provider)}
            >
              <img
                src={provider.profileImage?.replace(/\u200E|\u202A|\u202C/g, '')}
                alt={provider.name}
                className="provider-image"
              />
              <div className="provider-info">
                <h3>{provider.name}</h3>
                <p>{upper(renderServices(provider.services))}</p>
                <p>⭐ {formatRating(provider.rating?.average)} · 📍 {randomDistance()} km</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderList;
