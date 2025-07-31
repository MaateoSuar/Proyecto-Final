import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/HeaderUsuario.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function HeaderPrestador() {
    const navigate = useNavigate();
    const [prestador, setPrestador] = useState(JSON.parse(localStorage.getItem('prestador')));
    const [isUploading, setIsUploading] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            showNotification('Por favor selecciona una imagen válida', 'error');
            return;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('La imagen debe ser menor a 5MB', 'error');
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/prestadores/${prestador.id}/profile-image`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                // Actualizar el estado local y localStorage
                const updatedPrestador = { ...prestador, profileImage: data.data.profileImage };
                setPrestador(updatedPrestador);
                localStorage.setItem('prestador', JSON.stringify(updatedPrestador));
                showNotification('Imagen de perfil actualizada correctamente');
            } else {
                showNotification('Error al actualizar la imagen: ' + data.message, 'error');
            }
        } catch (error) {
            console.error('Error al subir imagen:', error);
            showNotification('Error al subir la imagen. Por favor intenta de nuevo.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('profile-image-input').click();
    };

    return (<>
        <div className="headerUsuario">
            <div className="avatar" onClick={triggerFileInput} style={{ cursor: 'pointer' }}>
                {isUploading ? (
                    <div className="loading">
                        <span>Cargando...</span>
                    </div>
                ) : prestador.profileImage ? (
                    <img src={prestador.profileImage} alt="Avatar" />
                ) : (
                    <span>+</span>
                )}
            </div>
            <div className="greeting">
                <div className="name">Hola{prestador.name ? `, ${prestador.name}` : ""}</div>
                <div className="subtext">¡Buenos días!</div>
            </div>
        </div>
<<<<<<< Updated upstream
        <div><button 
            className="sidebar-item logout"
            onClick={() => {
                localStorage.clear();
                navigate('/login-cuidador');
            }}
        >
            🚪 Cerrar Sesión
        </button></div>
=======
        <div><button onClick={() => {
            localStorage.clear();
            navigate('/login-cuidador');
        }}>Cerrar Sesion</button></div>
        
        {/* Input file oculto */}
        <input
            id="profile-image-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
        />

        {/* Notificación */}
        {notification.show && (
            <div 
                className={`notification ${notification.type}`}
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: 'bold',
                    zIndex: 1000,
                    backgroundColor: notification.type === 'error' ? '#e74c3c' : '#27ae60',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    animation: 'slideIn 0.3s ease'
                }}
            >
                {notification.message}
            </div>
        )}
>>>>>>> Stashed changes
        </>
    );
}
