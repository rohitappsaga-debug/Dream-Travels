import React from 'react';
import { NavLink } from 'react-router-dom';
import { Plane, Twitter, Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-col about-col">
              <div className="footer-logo">
                <Plane size={24} className="text-blue-600" />
                <span>Dream Travelers</span>
              </div>
              <p className="footer-about-text">
                Your trusted partner for unforgettable travel experiences. We curate the best packages for your dream getaways.
              </p>
              <div className="footer-socials">
                <a href="#" className="social-icon"><Twitter size={20} /></a>
                <a href="#" className="social-icon"><Facebook size={20} /></a>
                <a href="#" className="social-icon"><Instagram size={20} /></a>
                <a href="#" className="social-icon"><Youtube size={20} /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><NavLink to="/home">Home</NavLink></li>
                <li><NavLink to="/book">Book Trip</NavLink></li>
                <li><NavLink to="/package">Packages</NavLink></li>
                <li><NavLink to="/gallery">Gallery</NavLink></li>
                <li><NavLink to="/about">About Us</NavLink></li>
              </ul>
            </div>

            {/* Services */}
            <div className="footer-col">
              <h4>Our Services</h4>
              <ul className="footer-links">
                <li><a href="#">Package Booking</a></li>
                <li><a href="#">Bus Booking</a></li>
                <li><a href="#">Hotel Booking</a></li>
                <li><a href="#">Custom Itineraries</a></li>
                <li><a href="#">Travel Insurance</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-col">
              <h4>Contact Us</h4>
              <ul className="footer-contact">
                <li>
                  <MapPin size={18} />
                  <span>123 Travel Lane, Adventure City</span>
                </li>
                <li>
                  <Phone size={18} />
                  <span>+91 98765 43210</span>
                </li>
                <li>
                  <Mail size={18} />
                  <span>info@dreamtravelers.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <p>&copy; {new Date().getFullYear()} Dream Travelers. All Rights Reserved.</p>
            <div className="footer-credit">
              Designed By <a href="#">Group 06</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
