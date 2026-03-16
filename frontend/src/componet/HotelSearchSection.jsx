import React, { useState } from "react";
import "./HotelSearchSection.css";

export default function HotelSearchSection({ onSearch }) {
  const [search, setSearch] = useState({
    city: "",
    checkIn: new Date().toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    guests: 2,
    rooms: 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(search);
  };

  return (
    <div className="book-section">
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label>City / Location</label>
          <input
            type="text"
            className="form-control"
            placeholder="Where are you going?"
            value={search.city}
            onChange={(e) => setSearch({...search, city: e.target.value})}
            required
          />
        </div>

        <div className="row" style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Check-in</label>
            <input
              type="date"
              className="form-control"
              value={search.checkIn}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSearch({...search, checkIn: e.target.value})}
              required
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>Check-out</label>
            <input
              type="date"
              className="form-control"
              value={search.checkOut}
              min={search.checkIn}
              onChange={(e) => setSearch({...search, checkOut: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="row" style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Guests</label>
            <input
              type="number"
              className="form-control"
              min="1"
              value={search.guests}
              onChange={(e) => setSearch({...search, guests: e.target.value})}
              required
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>Rooms</label>
            <input
              type="number"
              className="form-control"
              min="1"
              value={search.rooms}
              onChange={(e) => setSearch({...search, rooms: e.target.value})}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-primary">
           Search Hotels
        </button>
      </form>
    </div>
  );
}
