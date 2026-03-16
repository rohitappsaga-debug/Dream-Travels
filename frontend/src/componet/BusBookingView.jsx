import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import BusSeatSelector from "./BusSeatSelector";
import PassengerForm from "./PassengerForm";
import { Bus as BusIcon, Info, Users, CheckCircle, ChevronLeft } from "lucide-react";

export default function BusBookingView({ searchCriteria, onClose }) {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]); // Array
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/search_buses.php?source=${searchCriteria.source}&destination=${searchCriteria.destination}&travel_date=${searchCriteria.date}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBuses(data.data);
        }
        setLoading(false);
      });
  }, [searchCriteria]);

  const handleBookingComplete = (details) => {
    setBookingSuccess(details);
  };

  if (bookingSuccess) {
    return (
      <div className="booking-overlay">
        <div className="booking-modal success-modal">
          <div className="success-icon-wrapper">
            <CheckCircle size={48} />
          </div>
          <h2>Booking Successful!</h2>
          <p>Your journey is confirmed. Thank you for choosing Dream Travellers!</p>
          
          <div className="booking-summary-card" style={{ textAlign: "left" }}>
            <span className="summary-title">Ticket Information</span>
            <div className="summary-details">
              <p>Booking ID: <strong>#{bookingSuccess.booking_id}</strong></p>
              <p>Bus Title: <strong>{selectedBus.bus_name}</strong></p>
              <p>Seat Numbers: <strong>{selectedSeats.join(', ')}</strong></p>
              <p>Passenger: <strong>{bookingSuccess.passenger_name}</strong></p>
              <p>Route: <strong>{searchCriteria.source} → {searchCriteria.destination}</strong></p>
              <p>Travel Date: <strong>{searchCriteria.date}</strong></p>
            </div>
          </div>
          
          <button className="btn-primary" style={{ width: '100%' }} onClick={onClose}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-overlay">
      <div className="booking-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        {loading ? (
          <div className="text-center p-4">
            <p>Finding the best buses for you...</p>
          </div>
        ) : !selectedBus ? (
          <>
            <div className="modal-header">
              <h2 className="modal-title">Available Buses</h2>
              <p className="modal-subtitle">Showing results for {searchCriteria.source} to {searchCriteria.destination}</p>
            </div>
            
            <div className="bus-results">
              {buses.length === 0 ? (
                <div className="no-results">
                  <Info size={48} className="mb-3" />
                  <p>No buses available for this route on the selected date.</p>
                </div>
              ) : (
                buses.map(bus => (
                  <div key={bus.id} className={`bus-card ${bus.available_seats === 0 ? 'full' : ''}`}>
                    <div className="bus-info">
                      <div className="bus-header">
                        <BusIcon size={20} className="text-primary" />
                        <h4>{bus.bus_name}</h4>
                      </div>
                      <p className="bus-code">Service #{bus.bus_code}</p>
                      <div className="available-info">
                        <div className={`status-indicator ${
                          bus.available_seats === 0 ? 'status-full' : 
                          bus.available_seats < 5 ? 'status-low' : 'status-available'
                        }`} />
                        <span style={{ color: 
                          bus.available_seats === 0 ? '#ef4444' : 
                          bus.available_seats < 5 ? '#f59e0b' : '#10b981'
                        }}>
                          {bus.available_seats === 0 ? 'Sold Out' : `${bus.available_seats} Seats Available`}
                        </span>
                      </div>
                    </div>
                    <div className="bus-actions">
                      <button 
                        className="view-btn" 
                        disabled={bus.available_seats === 0}
                        onClick={() => setSelectedBus(bus)}
                      >
                        Book Seat
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : selectedSeats.length === 0 ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px" }}>
              <button 
                className="back-btn-link" 
                onClick={() => setSelectedBus(null)} 
                style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", display: 'flex', alignItems: 'center' }}
              >
                <ChevronLeft size={24} />
              </button>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Select Seats - {selectedBus.bus_name}</h2>
            </div>
            <BusSeatSelector 
              busId={selectedBus.id} 
              date={searchCriteria.date} 
              onSelect={setSelectedSeats} 
            />
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px" }}>
              <button 
                className="back-btn-link" 
                onClick={() => setSelectedSeats([])} 
                style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", display: 'flex', alignItems: 'center' }}
              >
                <ChevronLeft size={24} />
              </button>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Passenger Details</h2>
            </div>
            <PassengerForm 
              bus={selectedBus}
              routeId={selectedBus.route_id}
              seatNumbers={selectedSeats}
              date={searchCriteria.date}
              onComplete={handleBookingComplete}
            />
          </>
        )}
      </div>
    </div>
  );
}
