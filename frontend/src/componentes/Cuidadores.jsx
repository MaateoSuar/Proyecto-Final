export default function Cuidadores() {
    return (
      <div className="care-box">
        <div className="care-card">
          <div className="care-person">
            <div className="care-avatar" style={{ backgroundImage: "url('/img/user1.jpg')" }}></div>
            <div className="care-info">
              <div className="name">Enzo Fernandez</div>
              <div>⭐ 4.7 • $2.500/h • Disponible mañana</div>
            </div>
          </div>
          <div className="care-person">
            <div className="care-avatar" style={{ backgroundImage: "url('/img/user2.jpg')" }}></div>
            <div className="care-info">
              <div className="name">Franco Lemos</div>
              <div>⭐ 4.5 • $2.300/h • Disponible la próxima semana</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  