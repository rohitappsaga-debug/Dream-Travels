import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { MapPin, Star, CheckCircle, Info, ChevronLeft } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import PaymentSection from "./PaymentSection";

export default function HotelBookingView({ hotelId, searchCriteria, onClose }) {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [passengerDetails, setPassengerDetails] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("manual");
  const [paymentDetails, setPaymentDetails] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/get_hotel_details.php?id=${hotelId}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setHotel(data.data);
        }
        setLoading(false);
      });
  }, [hotelId]);

  const calculateNights = (inDate, outDate) => {
    const d1 = new Date(inDate);
    const d2 = new Date(outDate);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (passengerDetails.phone.length !== 10) {
      setBookingError("Mobile number must be exactly 10 digits.");
      return;
    }

    setSubmitting(true);
    setBookingError(null);

    const nights = calculateNights(searchCriteria.checkIn, searchCriteria.checkOut);
    const amount = selectedRoom.price_per_night * nights * searchCriteria.rooms;
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?.id;
    
    const bookingData = {
      type: 'hotel',
      hotel_id: hotel.id,
      user_id: userId ? Number(userId) : 0,
      room_id: selectedRoom.id,
      guest_name: passengerDetails.name,
      phone: passengerDetails.phone,
      email: passengerDetails.email,
      check_in: searchCriteria.checkIn,
      check_out: searchCriteria.checkOut,
      num_guests: searchCriteria.guests,
      num_rooms: searchCriteria.rooms,
      payment_method: paymentMethod,
      payment_details: JSON.stringify(paymentDetails),
      amount: amount
    };

    try {
      if (paymentMethod === 'razorpay') {
        const orderRes = await fetch(`${API_BASE_URL}/create_razorpay_order.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        });
        const orderResult = await orderRes.json();
        
        if (!orderResult.success) {
          setBookingError("Failed to create payment order: " + orderResult.message);
          return;
        }

        const options = {
          key: orderResult.key_id,
          amount: orderResult.amount * 100,
          currency: "INR",
          name: "Dream Travels",
          description: `Hotel Booking - ${hotel.hotel_name}`,
          order_id: orderResult.razorpay_order_id,
          handler: async function (response) {
            const verifyRes = await fetch(`${API_BASE_URL}/verify_razorpay_payment.php`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                booking_id: orderResult.booking_id,
                type: 'hotel'
              }),
            });
            const verifyResult = await verifyRes.json();
            if (verifyResult.success) {
              setBookingSuccess({ booking_id: orderResult.booking_id, total_price: amount, nights });
            } else {
              setBookingError("Payment verification failed: " + verifyResult.message);
            }
          },
          prefill: {
            name: passengerDetails.name,
            contact: passengerDetails.phone,
            email: passengerDetails.email
          },
          theme: { color: "#3B82F6" }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setBookingError("Payment failed: " + response.error.description);
        });
        rzp.open();
        return;
      }

      const res = await fetch(`${API_BASE_URL}/book_hotel.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });
      const data = await res.json();
      
      if (data.status === "success") {
        setBookingSuccess({ ...data.data, nights });
        setBookingError(null);
      } else {
        setBookingError(data.message);
      }
    } catch (err) {
      setBookingError("Server error. Please try again later.");
    } finally {
      if (paymentMethod !== 'razorpay') {
          setSubmitting(false);
      }
    }
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById('hotel-reservation-summary');
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.setProperties({
        title: `Hotel_Reservation_${bookingSuccess.booking_id}`,
        subject: 'Hotel Reservation Confirmation',
        author: 'Dream Travelers'
      });
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`Hotel_Reservation_${bookingSuccess.booking_id}.pdf`);
    });
  };

  if (loading) return (
    <div className="booking-overlay">
      <div className="loading-spinner">Searching for hotel details...</div>
    </div>
  );
  
  if (!hotel) return null;

  if (bookingSuccess) {
    return (
      <div className="booking-overlay">
        <div className="booking-modal success-modal">
          <div className="success-icon-wrapper">
            <CheckCircle size={48} />
          </div>
          <h2>Stay Confirmed!</h2>
          <p>Your luxury experience at <strong>{hotel.hotel_name}</strong> is all set.</p>
          
          <div className="booking-summary-card" id="hotel-reservation-summary">
            <span className="summary-title">Reservation Details</span>
            <div className="summary-details">
              <p><span>Booking ID</span> <strong>#{bookingSuccess.booking_id}</strong></p>
              <p><span>Hotel Name</span> <strong>{hotel.hotel_name}</strong></p>
              <p><span>Duration</span> <strong>{searchCriteria.checkIn} to {searchCriteria.checkOut} ({bookingSuccess.nights} nights)</strong></p>
              <p><span>Room Type</span> <strong>{selectedRoom.room_type}</strong></p>
              <p><span>Total Paid</span> <strong>₹{bookingSuccess.total_price}</strong></p>
            </div>
          </div>
          
          <button className="btn-primary" style={{ width: '100%', marginBottom: '1rem', background: '#10b981' }} onClick={handleDownloadPDF}>
            Download Ticket (PDF)
          </button>
          <button className="btn-primary" style={{ width: '100%' }} onClick={onClose}>
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-overlay">
      <div className="booking-modal" style={{ maxWidth: "1000px" }}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div className="hotel-modal-grid">
          {/* Left: Info & Rooms */}
          <div className="hotel-info-pane">
            <div className="hotel-image-header" style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <img 
                src={hotel.image} 
                alt={hotel.hotel_name} 
                style={{ width: "100%", height: '250px', objectFit: 'cover', borderRadius: "1.5rem" }} 
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'; }}
              />
              <div className="rating-badge" style={{ 
                position: "absolute", top: "1rem", right: "1rem",
                background: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)",
                padding: "0.5rem 1rem", borderRadius: "2rem",
                display: "flex", alignItems: "center", gap: "4px",
                fontSize: "0.875rem", fontWeight: "700", color: "#f59e0b"
              }}>
                <Star size={14} fill="#f59e0b" />
                {hotel.rating}
              </div>
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>{hotel.hotel_name}</h2>
            <p className="hotel-location" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-400)', marginBottom: '1.5rem' }}>
              <MapPin size={16} className="text-primary" />
              {hotel.location}
            </p>
            
            {hotel.amenities && (
              <>
                <span className="summary-title" style={{ marginBottom: '0.75rem' }}>Popular Amenities</span>
                <div className="amenities-container">
                  {hotel.amenities.split(',').map((a, index) => (
                    <span key={index} className="amenity-tag">{a.trim()}</span>
                  ))}
                </div>
              </>
            )}

            <span className="summary-title" style={{ marginBottom: '1rem' }}>Available Rooms</span>
            <div className="room-options">
              {hotel.rooms.map(room => (
                <div 
                  key={room.id} 
                  className={`room-card ${selectedRoom?.id === room.id ? 'active' : ''}`}
                  onClick={() => setSelectedRoom(room)}
                >
                  <div className="room-header">
                    <span className="room-type">{room.room_type}</span>
                    <span className="room-price">₹{room.price_per_night} <small>/ night</small></span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.813rem', color: 'var(--gray-400)' }}>Up to {searchCriteria.guests} guests</span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      color: room.available_rooms > 0 ? '#10b981' : '#ef4444' 
                    }}>
                      {room.available_rooms} rooms remaining
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="booking-form-pane" style={{ background: "var(--light)", padding: "2.5rem", borderRadius: "1.5rem" }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Guest Details</h3>
            
            {!selectedRoom ? (
              <div className="no-room-selected">
                <Info size={48} style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
                <p style={{ maxWidth: '250px', margin: '0 auto', lineHeight: 1.6 }}>Choose a room type from the list to begin your reservation</p>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="booking-form">
                {bookingError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                    {bookingError}
                  </div>
                )}
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Enter guest name" 
                    value={passengerDetails.name}
                    onChange={(e) => setPassengerDetails({...passengerDetails, name: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    minLength="10"
                    maxLength="10"
                    className="form-control"
                    placeholder="e.g. 9876543210" 
                    value={passengerDetails.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPassengerDetails({...passengerDetails, phone: val});
                    }}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    className="form-control"
                    placeholder="guest@example.com" 
                    value={passengerDetails.email}
                    onChange={(e) => setPassengerDetails({...passengerDetails, email: e.target.value})}
                  />
                </div>

                <div className="booking-summary-card" style={{ background: '#fff', border: '1px solid var(--gray-200)', borderLeft: '4px solid var(--primary)', marginTop: '2rem', padding: '1.25rem', borderRadius: '1rem' }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)', fontWeight: 600 }}>Duration</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--dark)', fontWeight: 700 }}>{calculateNights(searchCriteria.checkIn, searchCriteria.checkOut)} Nights</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", paddingBottom: '1rem', borderBottom: '1px solid var(--gray-100)' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)', fontWeight: 600 }}>Room ({searchCriteria.rooms})</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--dark)', fontWeight: 700 }}>₹{selectedRoom.price_per_night * searchCriteria.rooms} / night</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800 }}>Total Payable</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>₹{selectedRoom.price_per_night * calculateNights(searchCriteria.checkIn, searchCriteria.checkOut) * searchCriteria.rooms}</span>
                  </div>
                </div>

                <PaymentSection 
                  method={paymentMethod}
                  details={paymentDetails}
                  onChange={(m, d) => {
                    setPaymentMethod(m);
                    setPaymentDetails(d);
                  }}
                />

                <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1.5rem" }}>
                  Confirm Booking
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
