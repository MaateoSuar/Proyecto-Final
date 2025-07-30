// ComentariosProveedor.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import formatRating from '../utils/formatRating';

const API_URL = import.meta.env.VITE_API_URL;

export default function ComentariosProveedor({ providerId, cantidad }) {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchComentarios() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/prestadores/${providerId}/reviews`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const filtrados = res.data.filter(r => (r.comment && r.comment.trim()) || r.rating);
        setComentarios(filtrados);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los comentarios');
      } finally {
        setLoading(false);
      }
    }

    if (providerId) fetchComentarios();
  }, [providerId]);

  if (loading) return <div style={{ padding: 8 }}>Cargando comentarios...</div>;
  if (error) return <div style={{ padding: 8, color: '#dc3545' }}>{error}</div>;
  if (comentarios.length === 0) return <div style={{ padding: 8, color: '#666' }}>Este proveedor aún no tiene comentarios.</div>;

  const comentariosOrdenados = [...comentarios].sort((a, b) => new Date(b.date) - new Date(a.date));
  const comentariosAMostrar = cantidad ? comentariosOrdenados.slice(0, cantidad) : comentariosOrdenados;

  return (
    <div style={{ marginTop: 0 }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {comentariosAMostrar.map((c, i) => (
          <li key={c._id || i} style={{ borderBottom: '1px solid #eee', marginBottom: 12, paddingBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 'bold' }}>
                {c.user?.fullName || c.user?.email || 'Usuario'}:
              </span>
              {c.comment && <div>{c.comment}</div>}
              {c.rating && (
                <span style={{ color: '#f5b50a' }}>⭐ {formatRating(c.rating)}</span>
              )}
              {c.date && (
                <span style={{ fontSize: 12, color: '#999' }}>
                  ({new Date(c.date).toLocaleDateString()})
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
