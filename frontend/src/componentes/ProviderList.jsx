import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa';
import '../estilos/ProviderList.css';

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
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
    <div className="provider-list-container">
      <div className="headerList">
        <h2 className="title">Nuestros Servicios</h2>
        <div className="filter-container" ref={filterRef}>
          <button className="filter-button" onClick={() => setShowFilterMenu(!showFilterMenu)}>
            <FaFilter />
          </button>
          {showFilterMenu && (
            <div className="filter-menu">
              <div
                className="filter-option"
                onClick={() => {
                  const params = new URLSearchParams(location.search);
                  params.set('precio', 'asc');
                  navigate({ search: params.toString() }, { replace: true });
                  setOrderPrice('asc');
                  setShowFilterMenu(false);
                }}
              >
                Precio: Menor - Mayor
              </div>
              <div
                className="filter-option"
                onClick={() => {
                  const params = new URLSearchParams(location.search);
                  params.set('precio', 'desc');
                  navigate({ search: params.toString() }, { replace: true });
                  setOrderPrice('desc');
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
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filtros">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => handleCategoryClick(cat.value)}
            className={`category-button ${selectedCategory === cat.value ? 'active' : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <h3 className="subtitle">Especialistas disponibles</h3>

      {filteredProviders.length === 0 ? (
        <p className="no-providers">No se encontraron proveedores para esta búsqueda.</p>
      ) : (
        filteredProviders.map(provider => (
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
              <p>{renderServices(provider.services)}</p>
              <p>⭐ {provider.rating?.average ?? 'N/A'} · 📍 {randomDistance()} km</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProviderList;
