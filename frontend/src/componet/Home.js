import React, { useState, useEffect } from "react";
import "./Home.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PackagePopup from "./packagePopup";
import { API_BASE_URL } from "../config";


export default function Home() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/get_packages.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          // Map backend 'image' to frontend 'img' for compatibility with existing code
          const mappedData = data.data.map(pkg => ({
            ...pkg,
            img: pkg.image
          }));
          setPackages(mappedData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching packages:", err);
        setLoading(false);
      });
  }, []);

   return (
    <div className="home-container">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop" 
            alt="Hero Background" 
            className="hero-image"
          />
        </div>

        <div className="hero-content">
          <div className="hero-text-container">
            <h1 className="hero-title">
              Explore the World with <span>Dream Travelers</span>
            </h1>
            <p className="hero-subtitle">
              Book travel packages, buses, and hotels in one place with a premium experience.
            </p>
            <div className="hero-actions">
              <a href="/book" className="hero-primary-btn">Plan Your Trip</a>
              <a href="/package" className="hero-secondary-btn">View Packages</a>
            </div>
          </div>
        </div>
      </section>

      {/* Poster Section */}


      {/* Destination / Explore Section */}
      <section className="destinations-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Explore Top Destinations</h2>
            <p className="section-subtitle">Handpicked locations for your next adventure</p>
          </div>
          <div className="destinations-grid">
            {[
              { name: "Mountains", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" },
              { name: "Goa", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1974&auto=format&fit=crop" },
              { name: "Kerala", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1932&auto=format&fit=crop" },
              { name: "Rajasthan", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1969&auto=format&fit=crop" },
              { name: "Andaman", img: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=2001&auto=format&fit=crop" },
              { name: "Kashmir", img: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=2070&auto=format&fit=crop" }
            ].map((dest, idx) => (
              <div className="destination-card" key={idx}>
                <img src={dest.img} alt={dest.name} />
                <div className="dest-overlay">
                  <h3>{dest.name}</h3>
                  <button 
                    className="book-now-btn" 
                    onClick={() => {
                      const matchingPkg = packages.find(p => 
                        p.title.toLowerCase().includes(dest.name.toLowerCase()) || 
                        dest.name.toLowerCase().includes(p.title.toLowerCase())
                      );
                      if (matchingPkg) {
                        localStorage.setItem("selectedPackage", JSON.stringify(matchingPkg));
                      }
                      window.location.href = "/book";
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="packages-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Featured Travel Packages</h2>
            <p className="section-subtitle">Exclusive deals on the world's most beautiful places</p>
          </div>
          
          <div className="packages-grid">
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Curating best packages for you...</p>
              </div>
            ) : packages.length === 0 ? (
              <p className="no-data">No packages available at the moment.</p>
            ) : (
              packages.map((pkg, i) => (
                <div className="premium-package-card" key={i}>
                  <div className="card-image-box">
                    <img src={pkg.img} alt={pkg.title} />
                    <div className="card-badge">Featured</div>
                  </div>
                  <div className="card-content">
                    <div className="card-meta">
                      <span className="duration">5 Days / 4 Nights</span>
                      <span className="rating">★ 4.8</span>
                    </div>
                    <h3 className="card-title">{pkg.title}</h3>
                    <p className="card-desc">
                      {pkg.description || "Experience the magic of this destination with our all-inclusive package."}
                    </p>
                    <div className="card-footer" style={{ flexDirection: 'column', gap: '1rem', alignItems: 'stretch' }}>
                      <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="price-box">
                          <span className="price-label">Starts from</span>
                          <span className="price-value">₹{pkg.price || "15,999"}</span>
                        </div>
                        <button
                          className="view-details-btn"
                          onClick={() => setSelectedPackage(pkg)}
                        >
                          View Details
                        </button>
                      </div>
                      <button
                        className="book-now-btn-premium"
                        onClick={() => {
                          localStorage.setItem("selectedPackage", JSON.stringify(pkg));
                          window.location.href = "/book";
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-us-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Why Travel With Us</h2>
            <p className="section-subtitle">We provide the best travel experiences for our customers</p>
          </div>
          <div className="features-grid">
            {[
              { title: "Best Price Guarantee", desc: "Find a lower price? We'll match it and give you more.", icon: "💰" },
              { title: "Secure Booking", desc: "Your data and transactions are safe with our encrypted systems.", icon: "🔒" },
              { title: "24/7 Support", desc: "Round-the-clock assistance for all your travel needs.", icon: "🎧" },
              { title: "Curated Packages", desc: "Expertly designed itineraries to ensure you see the best.", icon: "✨" }
            ].map((feature, idx) => (
              <div className="feature-card" key={idx}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Bus + Hotel Promotion Section */}
      <section className="promotions-section">
        <div className="section-container">
          <div className="promo-grid">
            <div className="promo-card bus-promo">
              <div className="promo-content">
                <span className="promo-tag">Fast & Reliable</span>
                <h3>Book Buses Across India</h3>
                <p>Comfortable seats, real-time tracking, and best prices for your intercity travel.</p>
                <div className="promo-actions">
                  <a href="/book" className="promo-btn">Book Bus Now</a>
                </div>
              </div>
              <div className="promo-image">
                <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2017&auto=format&fit=crop" alt="Bus Booking" />
              </div>
            </div>
            <div className="promo-card hotel-promo">
              <div className="promo-content">
                <span className="promo-tag">Luxury Stays</span>
                <h3>Top Rated Hotels & Resorts</h3>
                <p>From budget stays to 5-star luxury, find the perfect room for your trip.</p>
                <div className="promo-actions">
                  <a href="/book" className="promo-btn">Find Hotels</a>
                </div>
              </div>
              <div className="promo-image">
                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop" alt="Hotel Booking" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">What Our Travelers Say</h2>
            <p className="section-subtitle">Real experiences from our happy explorers</p>
          </div>
          <div className="testimonials-grid">
            {[
              { name: "Rahul Sharma", role: "Solo Traveler", review: "Dream Travelers made my Kashmir trip unforgettable. The itinerary was perfect and the support was 24/7.", rating: 5, img: "https://i.pravatar.cc/150?u=rahul" },
              { name: "Priya Patel", role: "Family Trip", review: "Best bus booking experience! The seats were comfortable and the journey was on time. Highly recommended.", rating: 5, img: "https://i.pravatar.cc/150?u=priya" },
              { name: "Amit Kumar", role: "Business Traveler", review: "I always use this platform for my hotel bookings. Great discounts and very reliable service every single time.", rating: 4, img: "https://i.pravatar.cc/150?u=amit" }
            ].map((t, idx) => (
              <div className="testimonial-card" key={idx}>
                <div className="user-info">
                  <img src={t.img} alt={t.name} className="user-avatar" />
                  <div>
                    <h4>{t.name}</h4>
                    <span>{t.role}</span>
                  </div>
                </div>
                <div className="rating">{"★".repeat(t.rating)}{"☆".repeat(5-t.rating)}</div>
                <p className="review">"{t.review}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* World Map CTA Section */}
      <section className="world-map-cta">
        <div className="cta-overlay"></div>
        <div className="cta-content">
          <h2>Start Your Journey Today</h2>
          <p>Discover amazing destinations and book your perfect trip with just a few clicks.</p>
          <div className="cta-buttons">
            <a href="/book" className="cta-primary">Book Now</a>
            <a href="/package" className="cta-secondary">Explore Packages</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      <PackagePopup
        data={selectedPackage}
        onClose={() => setSelectedPackage(null)}
      />
    </div>
  );
}
