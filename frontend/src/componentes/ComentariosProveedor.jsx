import React, { useEffect, useState } from 'react';
import axios from 'axios';
import formatRating from '../utils/formatRating';

const API_URL = import.meta.env.VITE_API_URL;

export default function ComentariosProveedor({ providerId }) {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchComentarios() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/reservas/provider/${providerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Solo mostrar reservas completadas con comentario o rating
        const filtrados = res.data.filter(r => (r.comment && r.comment.trim()) || r.rating);
        setComentarios(filtrados);
      } catch (err) {
        setError('No se pudieron cargar los comentarios');
      } finally {
        setLoading(false);
      }
    }
    if (providerId) fetchComentarios();
  }, [providerId]);

  if (loading) return <div style={{padding:8}}>Cargando comentarios...</div>;
  if (error) return <div style={{padding:8, color:'#dc3545'}}>{error}</div>;
  if (comentarios.length === 0) return <div style={{padding:8, color:'#666'}}>Este proveedor aún no tiene comentarios.</div>;

  return (
    <div style={{marginTop:32}}>
      <h4 style={{marginBottom:12}}>Comentarios recientes</h4>
      <ul style={{listStyle:'none', padding:0}}>
        {comentarios.map((c, i) => (
          <li key={c._id || i} style={{borderBottom:'1px solid #eee', marginBottom:12, paddingBottom:8}}>
            <div style={{display:'flex', alignItems:'center', gap:8}}>
              <span style={{fontWeight:'bold'}}>{c.user?.fullName || c.user?.email || 'Usuario'}</span>
              {c.rating && <span style={{color:'#f5b50a'}}>⭐ {formatRating(c.rating)}</span>}
            </div>
            {c.comment && <div style={{marginTop:7}}>{c.comment}</div>}

          </li>
        ))}
      </ul>
    </div>
  );
}
