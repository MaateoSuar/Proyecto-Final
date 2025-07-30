import React, { useEffect, useState } from 'react';
import formatRating from '../utils/formatRating';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

export default function Planes() {
  const [providers, setProviders] = useState({
    peluqueria: null,
    cuidado: null,
    paseo: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Debes iniciar sesión para ver los proveedores');
          navigate('/login');
          return;
        }

        const res = await axios.get(`${API_URL}/prestadores`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          const activeProviders = res.data.data.filter(p => p.isActive);

          // Obtener un proveedor aleatorio de cada tipo
          const peluqueros = activeProviders.filter(p => p.services?.some(s => s.type === 'peluqueria'));
          const cuidadores = activeProviders.filter(p => p.services?.some(s => s.type === 'cuidado'));
          const paseadores = activeProviders.filter(p => p.services?.some(s => s.type === 'paseo'));

          setProviders({
            peluqueria: peluqueros[Math.floor(Math.random() * peluqueros.length)],
            cuidado: cuidadores[Math.floor(Math.random() * cuidadores.length)],
            paseo: paseadores[Math.floor(Math.random() * paseadores.length)]
          });
        }
      } catch (error) {
        console.error('Error al cargar proveedores:', error);
        toast.error('Error al cargar los proveedores');
      }
    };

    fetchProviders();
  }, [navigate]);

  const handleProviderClick = (provider) => {
    console.log("Provider clickeado:", provider); // <-- agregá esto

    if (provider) {
      let categoria = '';
      if (provider.services?.some(s => s.type === 'peluqueria')) {
        categoria = 'peluqueria';
      } else if (provider.services?.some(s => s.type === 'cuidado')) {
        categoria = 'cuidado';
      } else if (provider.services?.some(s => s.type === 'paseo')) {
        categoria = 'paseo';
      }

      if (!provider._id) {
        toast.error('Error: proveedor sin ID');
        return;
      }

      navigate(`/proveedor/${provider._id}?categoria=${categoria}&from=inicio`, {
        state: { provider }
      });
    }
  };


  const getServiceType = (provider) => {
    if (!provider?.services) return '';
    const service = provider.services[0];
    switch (service.type) {
      case 'peluqueria':
        return 'Peluquería';
      case 'cuidado':
        return 'Guardería';
      case 'paseo':
        return 'Paseo';
      default:
        return service.type;
    }
  };

  const getButtonText = (provider) => {
    if (!provider?.services) return '';
    const service = provider.services[0];
    switch (service.type) {
      case 'peluqueria':
        return 'Ver peluquero';
      case 'cuidado':
        return 'Ver cuidador';
      case 'paseo':
        return 'Ver paseador';
      default:
        return 'Ver proveedor';
    }
  };

  const getServiceIcon = (provider) => {
    if (!provider?.services) return '';
    const service = provider.services[0];
    switch (service.type) {
      case 'peluqueria':
        return '/img/grooming.png';
      case 'cuidado':
        return '/img/housing.png';
      case 'paseo':
        return '/img/walking.png';
      default:
        return '/img/grooming.png';
    }
  };

  // Si no hay ningún proveedor, mostrar mensaje
  if (!providers.peluqueria && !providers.cuidado && !providers.paseo) {
    return (
      <div className="plans">
        <p className="no-providers">No hay planes recomendados disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className="plans">
      {providers.peluqueria && (
        <div>
          <div style={{ fontSize: '1.1em', color: '#f5b50a', marginBottom: 4 }}>
            ⭐ {formatRating(providers.peluqueria.rating?.average)}
          </div>
          <div className="plan-card" onClick={() => handleProviderClick(providers.peluqueria)}>
            <div className="card-header">
              <div className="date">San Miguel de Tucumán</div>
            </div>
            <div className="card-content">
              <strong>{getServiceType(providers.peluqueria)}</strong>
              <div>{providers.peluqueria.name}</div>
              <div><a href="#" className="view-btn">{getButtonText(providers.peluqueria)}</a></div>
            </div>
            <div className="service-icon">
              <img src={getServiceIcon(providers.peluqueria)} alt={getServiceType(providers.peluqueria)} />
            </div>
          </div>
        </div>
      )}

      {providers.cuidado && (
        <div>
          <div style={{ fontSize: '1.1em', color: '#f5b50a', marginBottom: 4 }}>
            ⭐ {formatRating(providers.cuidado.rating?.average)}
          </div>
          <div className="plan-card" onClick={() => handleProviderClick(providers.cuidado)}>
            <div className="card-header">
              <div className="date">Yerba Buena</div>
            </div>
            <div className="card-content">
              <strong>{getServiceType(providers.cuidado)}</strong>
              <div>{providers.cuidado.name}</div>
              <div><a href="#" className="view-btn">{getButtonText(providers.cuidado)}</a></div>
            </div>
            <div className="service-icon">
              <img src={getServiceIcon(providers.cuidado)} alt={getServiceType(providers.cuidado)} />
            </div>
          </div>
        </div>
      )}

      {providers.paseo && (
        <div>
          <div style={{ fontSize: '1.1em', color: '#f5b50a', marginBottom: 4 }}>
            ⭐ {formatRating(providers.paseo.rating?.average)}
          </div>
          <div className="plan-card" onClick={() => handleProviderClick(providers.paseo)}>
            <div className="card-header">
              <div className="date">San Miguel de Tucumán</div>
            </div>
            <div className="card-content">
              <strong>{getServiceType(providers.paseo)}</strong>
              <div>{providers.paseo.name}</div>
              <div><a href="#" className="view-btn">{getButtonText(providers.paseo)}</a></div>
            </div>
            <div className="service-icon">
              <img src={getServiceIcon(providers.paseo)} alt={getServiceType(providers.paseo)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}