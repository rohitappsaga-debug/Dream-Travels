import React from "react";
import "./Gallery.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Gallery() {
  const galleryImages = [
    { title: "Santorini", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
    { title: "London", img: "https://businesstraveldestinations.com/wp-content/uploads/2019/04/London-Skyline.jpg" },
    { title: "Dubai", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu-lkRSNMApqSaTXWgHKx5okx94MkrR8prew&s" },
    { title: "Rome", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJBnVtbpRc7UGZZRDdyUdYg7OUbdreTVuXtA&s" },
    { title: "Thailand", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvY8GdmFb3-Ao0NfSnqjAbAbRp10WMx7qRcg&s" },
    { title: "India", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSXesvQ9KeWTbYQkKomXK4JEKcVEbJ1NFPvg&s" },
    { title: "New York", img: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bmV3JTIweW9yayUyMGNpdHklMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D" },
    { title: "Chicago", img: "https://wallpapers.com/images/hd/chicago-river-and-street-lights-city-background-38mjhv2vf5wujbp0.jpg" },
    { title: "UK", img: "https://plus.unsplash.com/premium_photo-1661962726504-fa8f464a1bb8?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dW5pdGVkJTIwa2luZ2RvbXxlbnwwfHwwfHx8MA%3D%3D" },
   
  ];

  return (
    <div className="gallery-page-wrapper">
      <Navbar />
      
      <div className="gallery-hero">
        <h2>Visual Journeys</h2>
        <p>A glimpse into the breathtaking destinations our travelers have explored.</p>
      </div>

      <section className="gallery-section">
        <div className="gallery-grid">
          {galleryImages.map((item, i) => (
            <div className="gallery-card" key={i}>
              <img src={item.img} alt={item.title} />
              <div className="gallery-overlay">
                <h3>{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
