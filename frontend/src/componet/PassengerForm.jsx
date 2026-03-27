import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { User, Phone, Mail, AlertCircle } from "lucide-react";
import PaymentSection from "./PaymentSection";

export default function PassengerForm({ bus, routeId, seatNumbers, date, onComplete }) {
  const [form, setForm] = useState({
    passenger_name: "",
    phone: "",
    email: "",
    paymentMethod: "manual",
    paymentDetails: {}
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.phone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      setSubmitting(false);
      return;
    }

    setSubmitting(true);
    setError("");

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?.id;

    const bookingData = {
      type: 'bus',
      bus_id: bus.id,
      user_id: userId ? Number(userId) : 0,
      route_id: routeId,
      seat_numbers: seatNumbers, // Array
      travel_date: date,
      passenger_name: form.passenger_name,
      phone: form.phone,
      email: form.email,
      payment_method: form.paymentMethod,
      payment_details: JSON.stringify(form.paymentDetails),
      amount: (bus.price || 750) * seatNumbers.length
    };

    try {
      if (form.paymentMethod === 'razorpay') {
        const orderRes = await fetch(`${API_BASE_URL}/create_razorpay_order.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        });
        const orderResult = await orderRes.json();
        
        if (!orderResult.success) {
          setError("Failed to create payment order: " + orderResult.message);
          return;
        }

        const options = {
          key: orderResult.key_id,
          amount: orderResult.amount * 100,
          currency: "INR",
          name: "Dream Travels",
          description: `Bus Booking - ${bus.bus_name}`,
          order_id: orderResult.razorpay_order_id,
          handler: async function (response) {
            const verifyRes = await fetch(`${API_BASE_URL}/verify_razorpay_payment.php`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                booking_id: orderResult.booking_id,
                type: 'bus'
              }),
            });
            const verifyResult = await verifyRes.json();
            if (verifyResult.success) {
              onComplete({
                ...bookingData,
                booking_id: orderResult.booking_id
              });
            } else {
              setError("Payment verification failed: " + verifyResult.message);
            }
          },
          prefill: {
            name: form.passenger_name,
            contact: form.phone,
            email: form.email
          },
          theme: { color: "#3B82F6" }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setError("Payment failed: " + response.error.description);
        });
        rzp.open();
        return;
      }

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
      if (form.paymentMethod !== 'razorpay') {
          setSubmitting(false);
      }
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
              pattern="[0-9]{10}"
              minLength="10"
              maxLength="10"
              className="form-control"
              required 
              value={form.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                setForm({...form, phone: val});
              }}
              placeholder="Enter 10-digit phone number"
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

        <PaymentSection 
          method={form.paymentMethod}
          details={form.paymentDetails}
          onChange={(m, d) => setForm({ ...form, paymentMethod: m, paymentDetails: d })}
        />

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
