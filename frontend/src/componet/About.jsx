import React from "react";
import "./About.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Globe, Heart } from "lucide-react";

export default function About() {
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
      </section>
      <Footer />
    </div>
  );
}
