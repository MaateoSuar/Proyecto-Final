export default function TarjetaMascotas() {
    return (
      <div className="pets-box">
        <div className="pets">
          <div className="pet-img" style={{ backgroundImage: "url('/img/dog.jpg')" }}></div>
          <div className="pet-img" style={{ backgroundImage: "url('/img/cat.jpg')" }}></div>
          <div className="pet-add">+</div>
        </div>
      </div>
    );
  }
  