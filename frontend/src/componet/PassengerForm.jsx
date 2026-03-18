import React, { useState } from "react";
import { API_BASE_URL } from "../config";
import { User, Phone, Mail, AlertCircle } from "lucide-react";

export default function PassengerForm({ bus, routeId, seatNumbers, date, onComplete }) {
  const [form, setForm] = useState({
    passenger_name: "",
    phone: "",
    email: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const bookingData = {
      bus_id: bus.id,
      route_id: routeId,
      seat_numbers: seatNumbers, // Array
      travel_date: date,
      ...form
    };

    try {
      const res = await fetch(`${API_BASE_URL}/book_seat.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });
      const result = await res.json();
      
      if (result.success) {
        onComplete({
          ...bookingData,
          booking_id: result.booking_id
        });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="passenger-form-wrapper">
      <div className="booking-summary-card">
        <span className="summary-title">Booking Summary</span>
        <div className="summary-details">
          <p>
            Seats: <strong>{seatNumbers.join(', ')}</strong> ({seatNumbers.length} seat{seatNumbers.length > 1 ? 's' : ''})
          </p>
          <p>
            Bus: <strong>{bus.bus_name}</strong>
          </p>
          <p>
            Route: <strong>{bus.source_city} → {bus.destination_city}</strong>
          </p>
          <p>
            Date: <strong>{date}</strong>
          </p>
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Price per Seat</span>
              <strong>₹{bus.price || 750}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
              <span>Total Amount</span>
              <strong>₹{(bus.price || 750) * seatNumbers.length}</strong>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label>Passenger Name</label>
          <div className="passenger-input-wrapper">
            <User size={18} className="input-icon" />
            <input 
              type="text" 
              className="form-control"
              required 
              value={form.passenger_name}
              onChange={(e) => setForm({...form, passenger_name: e.target.value})}
              placeholder="Enter full name"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <div className="passenger-input-wrapper">
            <Phone size={18} className="input-icon" />
            <input 
              type="text" 
              inputMode="numeric"
              pattern="[0-9]*"
              className="form-control"
              required 
              value={form.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setForm({...form, phone: val});
              }}
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Email (Optional)</label>
          <div className="passenger-input-wrapper">
            <Mail size={18} className="input-icon" />
            <input 
              type="email" 
              className="form-control"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              placeholder="Enter email address"
            />
          </div>
        </div>

        {error && (
          <div className="form-error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={submitting}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {submitting ? "Processing..." : `Confirm Booking for ${seatNumbers.length} Seat${seatNumbers.length > 1 ? 's' : ''}`}
        </button>
      </form>
    </div>
  );
}
