import React, { useState } from "react";
import '../estilos/perfilproveedor.css';

const proveedorData = {
  name: "Jose Fridman",
  role: "Dog Walker",
  experience: "3 years",
  price: "$2500",
  distance: "2.5 Km",
  image: "https://imgs.search.brave.com/Vn5G0eCb08Z2_JpfRAJDj0O7-Ym7nRPESGROclpMHXQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTM2/NDkxNzU2My9lcy9m/b3RvL2hvbWJyZS1k/ZS1uZWdvY2lvcy1z/b25yaWVuZG8tY29u/LWxvcy1icmF6b3Mt/Y3J1emFkb3Mtc29i/cmUtZm9uZG8tYmxh/bmNvLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz1OcU1ITEY4/VDRSelBhQkVfV01u/ZmxTR0JfMS1rWlpU/UWdBa2VrVXh1bVpn/PQ",
  about:
    "Jose is a highly experienced walker with 3 years of dedicated practice, showing a love for dogs and excellent service.",
  availableDays: ["Fri, 6", "Sat, 7", "Sun, 8", "Mon, 9", "Tue, 10"],
  availableTimes: ["09.00", "15.00", "19.00"],
};

const PerfilProveedor = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleBook = () => {
    if (!selectedDay || !selectedTime) {
      alert("Please select a day and time before booking.");
      return;
    }

    alert(
      `✅ Booking confirmed for ${proveedorData.name} on ${selectedDay} at ${selectedTime}.`
    );
  };

  return (
    <div className="profile-container">
      <div className="header">
        <button className="back-button">&larr;</button>
        <h2 className="section-title">Perfil Proveedor</h2>
      </div>

      <div className="image-container">
        <img
          src={proveedorData.image}
          alt="Dog Walker"
          className="walker-image"
        />
      </div>

      <div className="profile-content">
        <h3 className="walker-name">{proveedorData.name}</h3>
        <p className="walker-role">{proveedorData.role}</p>

        <div className="info-cards">
          <div className="info-card">
            <p className="info-main">{proveedorData.experience}</p>
            <p className="info-label">Experience</p>
          </div>
          <div className="info-card">
            <p className="info-main">{proveedorData.price}</p>
            <p className="info-label">Price</p>
          </div>
          <div className="info-card">
            <p className="info-main">{proveedorData.distance}</p>
            <p className="info-label">Location</p>
          </div>
        </div>

        <div className="about-section">
          <h4>About</h4>
          <p>{proveedorData.about}</p>
        </div>

        <div className="availability">
          <h4>Available Days</h4>
          <div className="days">
            {proveedorData.availableDays.map((day) => (
              <button
                key={day}
                className={`day-button ${
                  selectedDay === day ? "selected" : ""
                }`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </button>
            ))}
          </div>

          <h4>Available Time</h4>
          <div className="times">
            {proveedorData.availableTimes.map((time) => (
              <button
                key={time}
                className={`time-button ${
                  selectedTime === time ? "selected" : ""
                }`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div className="buttons">
          <button
            className="location-button"
            onClick={() => alert("Showing location...")}
          >
            📍 See Location
          </button>
          <button className="book-button" onClick={handleBook}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfilProveedor;
