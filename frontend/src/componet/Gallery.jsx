import React, { useState, useEffect } from "react";
import "./Gallery.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { API_BASE_URL } from "../config";

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/get_gallery.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setGalleryImages(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching gallery:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="gallery-page-wrapper">
      <Navbar />
      
      <div className="gallery-hero">
        <h2>Visual Journeys</h2>
        <p>A glimpse into the breathtaking destinations our travelers have explored.</p>
      </div>

      <section className="gallery-section">
        <div className="section-container">
          {loading ? (
            <div className="text-center py-20 text-slate-400 font-medium">Loading beautiful memories...</div>
          ) : galleryImages.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-medium italic">No gallery items found.</div>
          ) : (
            <div className="gallery-grid">
              {galleryImages.map((item, i) => (
                <div className="gallery-card" key={i}>
                  <img src={item.image} alt={item.title} />
                  <div className="gallery-overlay">
                    <h3>{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
