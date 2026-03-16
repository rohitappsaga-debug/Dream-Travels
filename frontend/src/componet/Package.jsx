import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Package.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { API_BASE_URL } from "../config";
import { MapPin, Calendar, Clock, Plane } from "lucide-react";

export default function Package() {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/get_packages.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.data)) {
          setPackages(data.data);
        }
      })
      .catch((err) => console.error("Error fetching packages:", err));
  }, []);

  const handleBookNow = (pkg) => {
    localStorage.setItem("selectedPackage", JSON.stringify(pkg));
    navigate("/book");
  };

  const handleViewDetails = (pkg) => {
    navigate(`/package/${pkg.id}`);
  };

  return (
    <div className="package-page-wrapper">
      <Navbar />
      
      <div className="package-hero">
        <h2>Expertly Curated Packages</h2>
        <p>Discover handpicked destinations and unforgettable experiences tailored just for you.</p>
      </div>

      <div className="package-container">
        <div className="package-list">
          {packages.map((pkg) => (
            <div key={pkg.id} className="package-card">
              <div className="package-image-wrapper">
                {pkg.image && (
                  <img src={pkg.image} alt={pkg.title} className="package-image" />
                )}
                <div className="package-badge">
                  {pkg.duration_days} Days
                </div>
              </div>
              
              <div className="package-content">
                <h3 className="package-name">{pkg.title}</h3>
                <p className="package-description">{pkg.description}</p>
                
                <div className="package-meta-grid">
                  <div className="package-meta-item">
                    <MapPin size={16} />
                    <span>{pkg.start_location || "Various"}</span>
                  </div>
                  <div className="package-meta-item">
                    <Clock size={16} />
                    <span>{pkg.duration_days}D / {pkg.nights || pkg.duration_days - 1}N</span>
                  </div>
                  <div className="package-meta-item">
                    <Plane size={16} />
                    <span>{pkg.main_transport || "Multiple"}</span>
                  </div>
                  <div className="package-meta-item">
                    <Calendar size={16} />
                    <span>Seasonal</span>
                  </div>
                </div>

                <div className="package-footer">
                  <div className="package-price">
                    ₹{pkg.price} <span>/ person</span>
                  </div>
                </div>

                <div className="package-actions">
                  <button
                    className="package-btn primary"
                    onClick={() => handleBookNow(pkg)}
                  >
                    Book Now
                  </button>
                  <button
                    className="package-btn secondary"
                    onClick={() => handleViewDetails(pkg)}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}




// import React, { useEffect, useState } from "react";
// import "./Package.css"; // ✅ Make sure you create this file for styles
// import Navbar from "./Navbar";
// import Footer from "./Footer";

// export default function Package() {
//   const [packages, setPackages] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:8000/get_packages.php")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.status === "success") {
//           setPackages(data.data);
//         } else {
//           alert("Failed to fetch packages");
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching packages:", err);
//       });
//   }, []);

//   return (
//     <div>
//       <Navbar />
//     <div className="package-container">
//       <h2 className="package-title">🌍 Our Travel Packages</h2>
//       <div className="package-list">
//         {packages.map((pkg) => (
//           <div key={pkg.id} className="package-card">
//             {pkg.image && (
//               <img src={pkg.image} alt={pkg.title} className="package-image" />
//             )}
//             <h3 className="package-name">{pkg.title}</h3>
//             <p className="package-description">{pkg.description}</p>
//             <p className="package-price">💰 ₹{pkg.price}</p>
//             <button className="package-btn">Book Now</button>
//           </div>
//         ))}
//       </div>
//     </div>
//     <Footer />
//     </div>
//   );
// }
