import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./popup.css";

function PackagePopup({ data, onClose }) {
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);

  if (!data) return null;

  const gallery = [
    data.img,
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  ];

  const hotelImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd"
  ];

  const handleBookNow = () => {
    // Home popup packages have no database id; send user to Packages page to pick a bookable package
    navigate("/package");
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">

        <button className="close-btn" onClick={onClose}>×</button>

        {/* TOP BIG IMAGE */}
        <img
          src={gallery[activeImage]}
          className="popup-main-image"
          alt=""
        />

        {/* SMALL GALLERY */}
        <div className="popup-gallery">
          {gallery.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              onClick={() => setActiveImage(i)}
            />
          ))}
        </div>

        {/* PACKAGE DETAILS */}
        <div className="popup-section">

          <div className="popup-left">
            <img src={gallery[activeImage]} alt="" />
          </div>

          <div className="popup-right">
            <h2>{data.title}</h2>
            <h3 className="price">₹{data.price}</h3>

            <p><b>Hotel:</b> {data.hotel}</p>
            <p><b>Tour Duration:</b> {data.days}</p>

            <p className="desc">{data.description}</p>

            <button className="book-btn" onClick={handleBookNow}>
              Book Now
            </button>
          </div>

        </div>

        {/* HOTEL SECTION */}
        <div className="hotel-section">

          <div className="hotel-images">
            {hotelImages.map((img, i) => (
              <img key={i} src={img} alt="" />
            ))}
          </div>

          <div className="hotel-details">
            <h3>{data.hotel}</h3>

            <p>
              Experience luxury stay with premium rooms, spa services,
              swimming pool, beach view and international cuisine.
            </p>

            <ul>
              <li>✔ Free Breakfast</li>
              <li>✔ Free WiFi</li>
              <li>✔ Swimming Pool</li>
              <li>✔ Airport Pickup</li>
              <li>✔ Beach Access</li>
            </ul>

          </div>

        </div>

      </div>
    </div>
  );
}

export default PackagePopup;