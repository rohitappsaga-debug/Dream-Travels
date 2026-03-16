import React from "react";
import "./Services.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Plane, Hotel, Route, Bus, Umbrella, Headset } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <Plane size={32} />,
      title: "Flight Booking",
      desc: "Best deals on domestic and international flights with hassle-free booking."
    },
    {
      icon: <Hotel size={32} />,
      title: "Hotel Stays",
      desc: "Luxurious and affordable stays at top destinations across the globe."
    },
    {
      icon: <Route size={32} />,
      title: "Custom Tours",
      desc: "Personalized travel packages tailored to your dream vacation."
    },
    {
      icon: <Bus size={32} />,
      title: "Transport",
      desc: "Safe and reliable transport options to make your journey smooth."
    },
    {
      icon: <Umbrella size={32} />,
      title: "Holiday Packages",
      desc: "Special holiday packages to beaches, mountains, and cultural cities."
    },
    {
      icon: <Headset size={32} />,
      title: "24/7 Support",
      desc: "Round-the-clock travel assistance to make your trip stress-free."
    }
  ];

  return (
    <div className="services-page-wrapper">
      <Navbar />
      
      <div className="services-hero">
        <h2>Our Services</h2>
        <p>Comprehensive travel solutions designed to provide you with a seamless and premium experience.</p>
      </div>

      <section className="services-section">
        <div className="services-grid">
          {services.map((srv, i) => (
            <div className="service-card" key={i}>
              <div className="service-icon-wrapper">
                {srv.icon}
              </div>
              <h3>{srv.title}</h3>
              <p>{srv.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
