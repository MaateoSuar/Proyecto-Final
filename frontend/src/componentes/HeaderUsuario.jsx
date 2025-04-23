export default function HeaderUsuario() {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || { nombre: 'Usuario' };

  return (
    <div className="header">
      <div className="avatar"></div>
      <div className="greeting">
        <div className="name">Hola, {usuario.nombre}</div>
        <div className="subtext">¡Buenos días!</div>
      </div>
    </div>
  );
}
