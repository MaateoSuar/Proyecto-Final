import React, { useState } from 'react';
import './ReviewForm.css';

function StarRating({ rating, setRating }) {
  return (
    <div className="star-rating" style={{ justifyContent: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? 'star filled' : 'star'}
          onClick={() => setRating(star)}
          style={{ cursor: 'pointer', fontSize: '2rem' }}
          role="button"
          aria-label={`Valorar con ${star} estrella${star > 1 ? 's' : ''}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ReviewForm({ reservaId, onClose, onSubmit }) {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ comment, rating });
      onClose();
    } catch (err) {
      setError('Error al enviar la valoración.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Dejar valoración</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Comentario:
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              maxLength={300}
              rows={4}
              className="review-textarea"
            />
          </label>
          <label>
            Puntuación:
            <StarRating rating={rating} setRating={setRating} />
          </label>
          {error && <div className="error">{error}</div>}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '10px' }}>
            <button type="button" className="cancel-modal-btn" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" disabled={loading || rating === 0}>{loading ? 'Enviando...' : 'Enviar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
