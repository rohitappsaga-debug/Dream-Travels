import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { Calendar, MapPin, Bus, Hotel, Package, XCircle, Clock, AlertCircle, CheckCircle, ArrowLeft, Info, User, Phone, Mail, CreditCard, Hash } from 'lucide-react';
import './MyBookings.css';

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postponeId, setPostponeId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setError("Please login to view your bookings.");
      setLoading(false);
      return;
    }
    fetchBookings();
  }, [userId]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/get_user_bookings.php?user_id=${userId}`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, type, action, date = '') => {
    setActionLoading(id);
    try {
      const res = await fetch(`${API_BASE_URL}/update_booking_action.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type, action, new_date: date })
      });
      const data = await res.json();
      if (data.success) {
        fetchBookings();
        setPostponeId(null);
        setNewDate('');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Action failed. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="my-bookings-loading">Loading your journeys...</div>;

  return (
    <div className="my-bookings-container">
      <div className="my-bookings-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h1>My Bookings</h1>
        <p>Manage your upcoming and past travel experiences</p>
      </div>

      {error ? (
        <div className="bookings-empty">
          <AlertCircle size={48} />
          <p>{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bookings-empty">
          <Package size={48} />
          <p>No bookings found. Start your first adventure today!</p>
          <button className="btn-primary" onClick={() => window.location.href='/'}>Explore Packages</button>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={`${booking.type}-${booking.id}`} className={`booking-card ${booking.status === 'Cancelled' ? 'cancelled' : ''}`}>
              <div className="booking-card-type">
                {booking.type === 'bus' && <Bus size={18} />}
                {booking.type === 'hotel' && <Hotel size={18} />}
                {booking.type === 'package' && <Package size={18} />}
                <span>{booking.type.toUpperCase()}</span>
              </div>
              
              <div className="booking-card-content">
                <h3>{booking.title}</h3>
                
                <div className="booking-meta">
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>{booking.date} {booking.end_date ? `to ${booking.end_date}` : ''}</span>
                  </div>
                  {booking.type === 'bus' && (
                    <div className="meta-item">
                      <Clock size={14} />
                      <span>Seats: {booking.seat_numbers}</span>
                    </div>
                  )}
                  {booking.type === 'hotel' && (
                    <div className="meta-item">
                      <MapPin size={14} />
                      <span>Room: {booking.room_type}</span>
                    </div>
                  )}
                </div>

                <div className="status-badge">
                  {booking.status === 'Cancelled' ? (
                    <span className="status-cancelled"><XCircle size={14} /> Cancelled</span>
                  ) : (
                    <span className="status-confirmed"><CheckCircle size={14} /> Confirmed</span>
                  )}
                </div>
              </div>

              <div className="booking-card-footer">
                <button 
                  className="btn-view-details" 
                  onClick={() => setSelectedBooking(booking)}
                >
                  <Info size={14} />
                  <span>View Details</span>
                </button>
              </div>

              {booking.status !== 'Cancelled' && (
                <div className="booking-card-actions">
                  {postponeId === booking.id ? (
                    <div className="postpone-form">
                      <input 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]} 
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="form-control-sm"
                      />
                      <button 
                        className="btn-action-confirm"
                        onClick={() => handleAction(booking.id, booking.type, 'postpone', newDate)}
                        disabled={!newDate || actionLoading === booking.id}
                      >
                        OK
                      </button>
                      <button className="btn-action-cancel" onClick={() => setPostponeId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <>
                      <button 
                        className="btn-postpone" 
                        onClick={() => setPostponeId(booking.id)}
                        disabled={actionLoading === booking.id}
                      >
                        Postpone
                      </button>
                      <button 
                        className="btn-cancel"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to cancel this booking?")) {
                            handleAction(booking.id, booking.type, 'cancel');
                          }
                        }}
                        disabled={actionLoading === booking.id}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedBooking && (
        <div className="booking-detail-modal" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Booking Details</h2>
              <button className="btn-close" onClick={() => setSelectedBooking(null)}><XCircle size={24} /></button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <div className="detail-type-badge">
                  {selectedBooking.type === 'bus' && <Bus size={18} />}
                  {selectedBooking.type === 'hotel' && <Hotel size={18} />}
                  {selectedBooking.type === 'package' && <Package size={18} />}
                  <span>{selectedBooking.type.toUpperCase()}</span>
                </div>
                <h3>{selectedBooking.title}</h3>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <label><Calendar size={14} /> Date</label>
                  <span>{selectedBooking.date} {selectedBooking.end_date ? `to ${selectedBooking.end_date}` : ''}</span>
                </div>
                <div className="detail-item">
                  <label><CheckCircle size={14} /> Status</label>
                  <span className={`status-text ${selectedBooking.status.toLowerCase()}`}>{selectedBooking.status}</span>
                </div>

                {/* Type specific details */}
                {selectedBooking.type === 'bus' && (
                  <>
                    <div className="detail-item">
                      <label><User size={14} /> Passenger</label>
                      <span>{selectedBooking.passenger_name}</span>
                    </div>
                    <div className="detail-item">
                      <label><Phone size={14} /> Mobile</label>
                      <span>{selectedBooking.phone}</span>
                    </div>
                    <div className="detail-item">
                      <label><Mail size={14} /> Email</label>
                      <span>{selectedBooking.email || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label><Hash size={14} /> Seats</label>
                      <span>{selectedBooking.seat_numbers}</span>
                    </div>
                  </>
                )}

                {selectedBooking.type === 'package' && (
                  <>
                    <div className="detail-item">
                      <label><User size={14} /> Customer</label>
                      <span>{selectedBooking.customer_name}</span>
                    </div>
                    <div className="detail-item">
                      <label><Phone size={14} /> Mobile</label>
                      <span>{selectedBooking.customer_phone}</span>
                    </div>
                    <div className="detail-item">
                      <label><User size={14} /> Passengers</label>
                      <span>{selectedBooking.passengers}</span>
                    </div>
                    <div className="detail-item">
                      <label><CreditCard size={14} /> Price</label>
                      <span>₹{selectedBooking.package_price}</span>
                    </div>
                  </>
                )}

                {selectedBooking.type === 'hotel' && (
                  <>
                    <div className="detail-item">
                      <label><User size={14} /> Guest Name</label>
                      <span>{selectedBooking.guest_name}</span>
                    </div>
                    <div className="detail-item">
                      <label><Phone size={14} /> Mobile</label>
                      <span>{selectedBooking.phone}</span>
                    </div>
                    <div className="detail-item">
                      <label><Hash size={14} /> Room Type</label>
                      <span>{selectedBooking.room_type}</span>
                    </div>
                    <div className="detail-item">
                      <label><User size={14} /> Guests</label>
                      <span>{selectedBooking.num_guests} guests, {selectedBooking.num_rooms} rooms</span>
                    </div>
                    <div className="detail-item">
                      <label><CreditCard size={14} /> Total Price</label>
                      <span>₹{selectedBooking.total_price}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="payment-details-section">
                <h4>Payment Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Method</label>
                    <span>{selectedBooking.payment_method || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Payment ID</label>
                    <span>{selectedBooking.razorpay_payment_id || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Payment Status</label>
                    <span className={`payment-status ${selectedBooking.payment_status}`}>{selectedBooking.payment_status || 'Success'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
