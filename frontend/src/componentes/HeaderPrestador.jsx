import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/HeaderUsuario.css";

export default function HeaderPrestador() {
    const navigate = useNavigate();
    const prestador = JSON.parse(localStorage.getItem('prestador'));
    return (<>
        <div className="headerUsuario">
            <div className="avatar">
                {prestador.img ? <img src={prestador.img} alt="Avatar" /> : <span>+</span>}
            </div>
            <div className="greeting">
                <div className="name">Hola{prestador.name ? `, ${prestador.name}` : ""}</div>
                <div className="subtext">¡Buenos días!</div>
            </div>
        </div>
        <div><button onClick={() => {
            localStorage.clear();
            navigate('/login-cuidador');
        }}>Cerrar Sesion</button></div>
        </>
    );
}
