import React from "react";
import { MapPin, Star } from "lucide-react";

export default function HotelList({ hotels, onSelect }) {
  return (
    <section className="hotel-results-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Hotels in {hotels[0]?.city}</h2>
          <p className="section-subtitle">Discover the best places to stay for your trip</p>
        </div>
        
        <div className="hotel-grid">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              <div className="hotel-image-wrapper" style={{ position: "relative", height: "220px", overflow: "hidden" }}>
                <img 
                  src={hotel.image} 
                  alt={hotel.hotel_name} 
                  className="hotel-card-image"
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
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

              <div className="hotel-card-content" style={{ padding: "1.5rem" }}>
                <h3 className="hotel-name" style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.5rem" }}>
                  {hotel.hotel_name}
                </h3>
                <p className="hotel-location" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                  <MapPin size={14} className="text-primary" />
                  {hotel.location}
                </p>
                
                <div className="hotel-card-footer" style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="hotel-price">
                    <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1e293b" }}>₹{hotel.price_per_night}</span>
                    <span style={{ fontSize: "0.875rem", color: "#94a3b8" }}> /night</span>
                  </div>
                  <button 
                    className="view-btn" 
                    onClick={() => onSelect(hotel)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
