import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

export default function BusSeatSelector({ busId, date, onSelect }) {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/get_available_seats.php?bus_id=${busId}&travel_date=${date}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSeats(data.data);
        }
        setLoading(false);
      });
  }, [busId, date]);

  const handleSeatClick = (seat) => {
    if (seat.status === "Available") {
      setSelectedSeats(prev => {
        if (prev.includes(seat.seat_number)) {
          return prev.filter(s => s !== seat.seat_number);
        } else {
          return [...prev, seat.seat_number].sort((a, b) => a - b);
        }
      });
    }
  };

  const confirmSelection = () => {
    if (selectedSeats.length > 0) {
      onSelect(selectedSeats);
    }
  };

  // 2+2 Layout Logic
  const rows = [];
  for (let i = 0; i < seats.length; i += 4) {
    rows.push(seats.slice(i, i + 4));
  }

  if (loading) return <p>Loading seat layout...</p>;

  return (
    <div className="seat-selector-container">
      <div className="legend" style={{ display: "flex", gap: "20px", justifyContent: "center", marginBottom: "30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: "20px", height: "20px", background: "#28a745", borderRadius: "4px" }}></div>
          <span>Available</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: "20px", height: "20px", background: "#dc3545", borderRadius: "4px" }}></div>
          <span>Booked</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: "20px", height: "20px", background: "#007bff", borderRadius: "4px" }}></div>
          <span>Selected</span>
        </div>
      </div>

      <div className="bus-internal" style={{ 
        maxWidth: "300px", margin: "0 auto", padding: "20px", 
        border: "2px solid #333", borderRadius: "15px 15px 5px 5px",
        background: "#fdfdfd", position: "relative"
      }}>
        {/* Driver Section */}
        <div className="driver-section" style={{ 
          borderBottom: "1px solid #ddd", marginBottom: "20px", paddingBottom: "10px", 
          textAlign: "right" 
        }}>
          <span style={{ padding: "5px 10px", background: "#eee", borderRadius: "3px", fontSize: "0.8rem" }}>DRIVER</span>
        </div>

        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="seat-row" style={{ 
            display: "flex", justifyContent: "space-between", marginBottom: "15px" 
          }}>
            <div className="seat-pair" style={{ display: "flex", gap: "10px" }}>
              {row.slice(0, 2).map(seat => (
                <div 
                  key={seat.seat_number} 
                  className={`seat-box ${seat.status.toLowerCase()} ${selectedSeats.includes(seat.seat_number) ? 'selected' : ''}`}
                  onClick={() => handleSeatClick(seat)}
                  style={{
                    width: "40px", height: "40px", display: "flex", alignItems: "center",
                    justifyContent: "center", borderRadius: "6px", cursor: seat.status === "Available" ? "pointer" : "not-allowed",
                    fontSize: "0.8rem", fontWeight: "bold", color: "#fff",
                    background: selectedSeats.includes(seat.seat_number) ? "#007bff" : (seat.status === "Booked" ? "#dc3545" : "#28a745")
                  }}
                >
                  {seat.seat_number}
                </div>
              ))}
            </div>
            
            <div className="seat-pair" style={{ display: "flex", gap: "10px" }}>
              {row.slice(2, 4).map(seat => (
                <div 
                  key={seat.seat_number} 
                  className={`seat-box ${seat.status.toLowerCase()} ${selectedSeats.includes(seat.seat_number) ? 'selected' : ''}`}
                  onClick={() => handleSeatClick(seat)}
                  style={{
                    width: "40px", height: "40px", display: "flex", alignItems: "center",
                    justifyContent: "center", borderRadius: "6px", cursor: seat.status === "Available" ? "pointer" : "not-allowed",
                    fontSize: "0.8rem", fontWeight: "bold", color: "#fff",
                    background: selectedSeats.includes(seat.seat_number) ? "#007bff" : (seat.status === "Booked" ? "#dc3545" : "#28a745")
                  }}
                >
                  {seat.seat_number}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <p>Selected Seats: <strong>{selectedSeats.length > 0 ? selectedSeats.join(', ') : "None"}</strong></p>
        <button 
          className="view-btn" 
          disabled={selectedSeats.length === 0} 
          onClick={confirmSelection}
        >
          Confirm {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
}
