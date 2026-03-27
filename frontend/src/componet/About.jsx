import React, { useState, useEffect } from "react";
import "./About.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Globe, Heart, Star, MessageSquare, Send, User } from "lucide-react";
import { API_BASE_URL } from "../config";

export default function About() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    rating: 5,
    comment: ""
  });
  const [msg, setMsg] = useState(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/get_reviews.php`);
      const data = await res.json();
      if (data.status === "success") setReviews(data.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.name) {
          setForm(prev => ({ ...prev, name: user.name }));
        }
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/add_review.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setMsg({ text: data.message, type: data.success ? "success" : "error" });
      if (data.success) {
        setForm({ name: "", rating: 5, comment: "" });
        fetchReviews();
        setTimeout(() => setMsg(null), 5000);
      }
    } catch (err) {
      setMsg({ text: "Server error. Please try again later.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="about-page-wrapper">
      <Navbar />
      
      <div className="about-hero">
        <h2>Our Journey</h2>
        <p>Beyond booking, we're your partners in creating lifelong memories.</p>
      </div>

      <section className="about-section">
        <div className="about-container">
          <div className="about-text">
            <h3>Crafting Your Dream Adventures Since 2018</h3>
            <p>
              At <strong>Dream Travellers</strong>, we believe every journey should be an
              unforgettable experience. From breathtaking landscapes to cultural
              adventures, we craft personalized travel packages to make your
              dreams a reality.
            </p>
            <p>
              With a passionate team of travel experts, we offer flights,
              hotels, tours, and 24/7 assistance — ensuring a seamless and
              joyful trip wherever your curiosity takes you.
            </p>
          </div>
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200"
              alt="About Dream Travellers"
            />
          </div>
        </div>

        <div className="mission-section">
          <div className="mission-card">
            <div className="mission-icon-wrapper">
              <Globe size={32} />
            </div>
            <h4>Our Mission</h4>
            <p>
              To connect people with the world through safe, affordable, and
              unforgettable journeys that inspire wonder and growth.
            </p>
          </div>
          <div className="mission-card">
            <div className="mission-icon-wrapper">
              <Heart size={32} />
            </div>
            <h4>Our Vision</h4>
            <p>
              To be the most trusted global travel partner, making every 
              corner of the earth accessible and every trip a memorable adventure.
            </p>
          </div>
        </div>

        <div className="company-info">
          <h3>Organizational Excellence</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Company</span>
              <span className="info-value">Dream Travellers Pvt. Ltd.</span>
            </div>
            <div className="info-item">
              <span className="info-label">Established</span>
              <span className="info-value">2018</span>
            </div>
            <div className="info-item">
              <span className="info-label">Lead Developer</span>
              <span className="info-value">Lashkari HitJumar <span className="highlight">(958)</span></span>
            </div>
            <div className="info-item">
              <span className="info-label">UI/UX Specialist</span>
              <span className="info-value">Vala Dharmesh <span className="highlight">(957)</span></span>
            </div>
            <div className="info-item">
              <span className="info-label">Systems Engineer</span>
              <span className="info-value">Parth Yadav <span className="highlight">(921)</span></span>
            </div>
            <div className="info-item">
              <span className="info-label">Headquarters</span>
              <span className="info-value">Surat, Gujarat, India</span>
            </div>
            <div className="info-item">
              <span className="info-label">Inquiries</span>
              <span className="info-value">contact@dreamtravellers.com</span>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="reviews-container" style={{ marginTop: '5rem' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--dark)' }}>Traveler Experiences</h3>
            <p style={{ color: 'var(--gray-500)', marginTop: '0.5rem' }}>Real stories from real travelers who explored with us.</p>
          </div>

          <div className="reviews-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '2.5rem',
            marginBottom: '5rem'
          }}>
            {loading ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--gray-400)', padding: '3rem' }}>Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--gray-400)', padding: '3rem', fontStyle: 'italic' }}>No reviews yet. Be the first to share your journey!</div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="review-card" style={{ 
                  background: '#fff', 
                  padding: '2.5rem', 
                  borderRadius: '1.5rem', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  border: '1px solid var(--gray-100)',
                  position: 'relative'
                }}>
                  <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--primary)', opacity: 0.1 }}>
                    <MessageSquare size={40} fill="currentColor" />
                  </div>
                  <div className="review-rating" style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.25rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < rev.rating ? "#FFC107" : "none"} stroke={i < rev.rating ? "#FFC107" : "var(--gray-300)"} />
                    ))}
                  </div>
                  <p style={{ color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: '2rem', fontStyle: 'italic' }}>"{rev.comment}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--gray-100)', borderRadius: 'full', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--gray-500)' }}>
                      <User size={20} />
                    </div>
                    <div>
                      <h5 style={{ fontWeight: 700, color: 'var(--dark)' }}>{rev.name}</h5>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{new Date(rev.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Submit Review Form */}
          <div className="review-form-wrapper" style={{ 
            maxWidth: '600px', 
            margin: '0 auto', 
            background: 'var(--gray-50)', 
            padding: '3.5rem', 
            borderRadius: '2rem',
            border: '1px solid var(--gray-200)'
          }}>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>Share Your Experience</h4>
            
            {msg && (
              <div style={{ 
                padding: '1rem 1.5rem', 
                borderRadius: '1rem', 
                background: msg.type === 'success' ? '#ecfdf5' : '#fef2f2', 
                color: msg.type === 'success' ? '#059669' : '#dc2626',
                border: msg.type === 'success' ? '1px solid #10b981' : '1px solid #fecaca',
                marginBottom: '2rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                textAlign: 'center'
              }}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-400)', marginBottom: '0.75rem' }}>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Your Name"
                  required
                  style={{ 
                    width: '100%', 
                    padding: '1rem 1.25rem', 
                    borderRadius: '1rem', 
                    border: '1.5px solid var(--gray-200)', 
                    outline: 'none', 
                    transition: 'all 0.2s',
                    backgroundColor: localStorage.getItem("user") ? 'var(--gray-100)' : 'white',
                    cursor: localStorage.getItem("user") ? 'not-allowed' : 'text'
                  }}
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  readOnly={!!localStorage.getItem("user")}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-400)', marginBottom: '0.75rem' }}>Rating</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1,2,3,4,5].map(num => (
                    <button 
                      key={num}
                      type="button"
                      onClick={() => setForm({...form, rating: num})}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
                    >
                      <Star size={24} fill={num <= form.rating ? "#FFC107" : "none"} stroke={num <= form.rating ? "#FFC107" : "var(--gray-300)"} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-400)', marginBottom: '0.75rem' }}>Your Story</label>
                <textarea 
                  placeholder="Tell us about your trip..."
                  required
                  rows="4"
                  style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: '1rem', border: '1.5px solid var(--gray-200)', outline: 'none', transition: 'all 0.2s', resize: 'none' }}
                  value={form.comment}
                  onChange={(e) => setForm({...form, comment: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                style={{ 
                  marginTop: '1rem',
                  padding: '1.25rem', 
                  background: 'var(--primary)', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '1.25rem', 
                  fontWeight: 800, 
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 10px 20px -5px rgba(37,99,235,0.4)',
                  opacity: submitting ? 0.7 : 1
                }}
              >
                {submitting ? "Sharing..." : "Post Review"} <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
