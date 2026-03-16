import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Bus, 
  Star, 
  Check, 
  XCircle, 
  Calendar,
  CreditCard,
  Utensils,
  Home
} from "lucide-react";
import "./PackageDetail.css";
import { API_BASE_URL } from "../config";

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchDetail = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/get_package_detail.php?id=${id}`
        );
        const text = await res.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch (_) {
          console.error("get_package_detail: invalid JSON", text.slice(0, 200));
          return;
        }
        if (json.status === "success" && json.data) {
          setPkg(json.data.package);
          setItinerary(json.data.itinerary || []);
        }
      } catch (err) {
        console.error("Error fetching package detail", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleBookNow = () => {
    if (!pkg) return;
    localStorage.setItem("selectedPackage", JSON.stringify(pkg));
    navigate("/book");
  };

  const handleBack = () => {
    navigate("/package");
  };

  if (loading) {
    return (
      <div className="package-detail-wrapper">
        <Navbar />
        <div className="package-detail-container" style={{ paddingTop: '150px' }}>
          <div className="package-main-content">
            <p className="loading-text">Loading premium package experience...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="package-detail-wrapper">
        <Navbar />
        <div className="package-detail-container" style={{ paddingTop: '150px' }}>
          <div className="package-main-content text-center">
            <XCircle size={64} className="text-red-500 mb-4 mx-auto" />
            <h2 className="text-2xl font-bold mb-4">Package not found</h2>
            <button className="package-btn primary" onClick={handleBack}>
              Back to Packages
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const durationDays = pkg.duration_days || 1;
  const nights = pkg.nights != null ? pkg.nights : Math.max(0, durationDays - 1);

  return (
    <div className="package-detail-wrapper">
      <Navbar />
      
      {/* Immersive Hero Section */}
      <section className="package-detail-hero">
        {pkg.image && <img src={pkg.image} alt={pkg.title} className="hero-image-bg" />}
        <div className="hero-overlay"></div>
        <div className="hero-content-container">
          <button onClick={handleBack} className="back-link">
            <ArrowLeft size={18} /> Back to Exploring
          </button>
          <h1 className="hero-title-main">{pkg.title}</h1>
          <div className="hero-meta-row">
            <div className="hero-meta-item">
              <Clock size={20} className="text-blue-400" />
              <span>{durationDays} Days / {nights} Nights</span>
            </div>
            {(pkg.start_location || pkg.end_location) && (
              <div className="hero-meta-item">
                <MapPin size={20} className="text-blue-400" />
                <span>{pkg.start_location || "Source"} → {pkg.end_location || "Destination"}</span>
              </div>
            )}
            <div className="hero-meta-item">
              <Bus size={20} className="text-blue-400" />
              <span>{pkg.main_transport || "Premium Transport"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar Layout */}
      <div className="package-detail-container">
        <main className="package-main-content">
          {/* Highlights Section */}
          {pkg.highlights && (
            <section className="detail-section">
              <h3><Star size={24} className="text-amber-500" /> Highlights</h3>
              <div className="highlights-list">
                {pkg.highlights.split('\n').filter(h => h.trim()).map((highlight, idx) => (
                  <div key={idx} className="highlight-item">
                    <span className="text-amber-500">✦</span>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Inclusions & Exclusions */}
          <section className="detail-section">
            <div className="inc-exc-grid">
              {pkg.inclusions && (
                <div>
                  <h3><Check size={24} className="text-green-500" /> Inclusions</h3>
                  <div className="inc-list">
                    {pkg.inclusions.split('\n').filter(i => i.trim()).map((item, idx) => (
                      <div key={idx} className="inc-item">
                        <Check size={16} /> <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {pkg.exclusions && (
                <div>
                  <h3><XCircle size={24} className="text-red-500" /> Exclusions</h3>
                  <div className="exc-list">
                    {pkg.exclusions.split('\n').filter(e => e.trim()).map((item, idx) => (
                      <div key={idx} className="exc-item">
                        <XCircle size={16} /> <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Itinerary Timeline */}
          <section className="detail-section">
            <h3><Calendar size={24} className="text-blue-500" /> Detailed Itinerary</h3>
            {itinerary.length === 0 ? (
              <p className="text-gray-400 py-4 italic">No detailed itinerary available for this package.</p>
            ) : (
              <div className="timeline">
                {itinerary.map((day) => (
                  <div key={day.day_number} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <span className="timeline-day">Day {day.day_number}</span>
                      <h4 className="timeline-title">{day.title}</h4>
                      
                      <div className="timeline-meta">
                        {day.transport_mode && day.transport_mode !== "none" && (
                          <span><Bus size={14} /> {day.transport_mode}</span>
                        )}
                        {day.meals && (
                          <span><Utensils size={14} /> {day.meals}</span>
                        )}
                        {day.stay_location && (
                          <span><Home size={14} /> Stay: {day.stay_location}</span>
                        )}
                      </div>

                      {day.description && (
                        <p className="timeline-desc">{day.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        {/* Sticky Sidebar */}
        <aside className="package-sidebar">
          <div className="booking-card">
            <div className="sidebar-price-tag">
              <span className="label">Package Price</span>
              <span className="value">₹{pkg.price}</span>
              <span className="suffix"> / Per Person</span>
            </div>

            <button className="book-now-btn" onClick={handleBookNow}>
              Book This Journey
            </button>

            <div className="sidebar-info-list">
              <div className="sidebar-info-item">
                <CreditCard size={18} className="text-gray-400" />
                <span>Best Price Guaranteed</span>
              </div>
              <div className="sidebar-info-item">
                <Star size={18} className="text-gray-400" />
                <span>Premium Experiences</span>
              </div>
              <div className="sidebar-info-item">
                <Clock size={18} className="text-gray-400" />
                <span>24/7 Expert Support</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
      
      <Footer />
    </div>
  );
}

