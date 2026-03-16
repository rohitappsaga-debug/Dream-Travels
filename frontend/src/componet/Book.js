import React, { useEffect, useState } from "react";
import "./Book.css";
import { Plane, Bus, Hotel } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import BusSearchSection from "./BusSearchSection";
import BusBookingView from "./BusBookingView";
import HotelSearchSection from "./HotelSearchSection";
import HotelList from "./HotelList";
import HotelBookingView from "./HotelBookingView";

export default function Book() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packages, setPackages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("package");

  // Bus States
  const [busSearchCriteria, setBusSearchCriteria] = useState(null);
  const [showBusBooking, setShowBusBooking] = useState(false);

  // Hotel States
  const [hotelResults, setHotelResults] = useState([]);
  const [hotelSearchCriteria, setHotelSearchCriteria] = useState(null);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const pkg = JSON.parse(localStorage.getItem("selectedPackage"));
    if (pkg) setSelectedPackage(pkg);

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserId(user.id);
      if (user.name) setCustomerName(user.name);
    }

    fetch(`${API_BASE_URL}/get_packages.php`)
      .then((res) => res.text())
      .then((text) => {
        try {
          const data = JSON.parse(text);
          if (data.status === "success" && Array.isArray(data.data)) {
            setPackages(data.data);
          }
        } catch (e) {
          console.error("Error parsing packages:", e);
        }
      })
      .catch((err) => console.error("Error fetching packages:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // client-side sanity checks before calling backend
    if (!userId) {
      alert("❌ You must be logged in to book a package.");
      return;
    }

    if (!selectedPackage) {
      alert("❌ No package selected.");
      return;
    }

    const pkgId = selectedPackage.id != null ? Number(selectedPackage.id) : 0;
    if (!pkgId || pkgId < 1) {
      alert("❌ Please select a package from the dropdown.");
      return;
    }

    if (!customerName || !customerPhone || !date || !passengers || !paymentMethod) {
      // although inputs have `required`, double-check before sending
      alert("❌ Please fill in all booking fields (including phone for SMS confirmation).");
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];
    if (date < todayStr) {
      alert("❌ Travel date cannot be in the past.");
      return;
    }

    const bookingData = {
      user_id: Number(userId),
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      travel_date: date.trim(),
      passengers: Number(passengers) || 1,
      payment_method: paymentMethod,
      package_id: pkgId,
      package_title: selectedPackage.title || "",
      package_price: selectedPackage.price != null ? Number(selectedPackage.price) : 0,
    };

    // log the payload for debugging network errors
    console.debug("booking payload:", bookingData);

    try {
      const res = await fetch(`${API_BASE_URL}/book_package.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const text = await res.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (_) {
        console.error("Server returned non-JSON:", text.slice(0, 500));
        alert("❌ Server error (invalid response). Check console or backend logs.");
        return;
      }

      if (result.success) {
        alert("✅ Booking Confirmed!");
        localStorage.removeItem("selectedPackage");
        navigate("/home");
      } else {
        alert("❌ Booking failed: " + result.message);
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("❌ Error booking package.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="book-hub-container">
        <h2>
          Plan Your <span>Next Journey</span>
        </h2>

        {/* Tab Navigation */}
        <div className="booking-tabs-nav">
          <button 
            className={`hub-tab ${activeTab === "package" ? "active" : ""}`}
            onClick={() => setActiveTab("package")}
          >
            <Plane size={18} />
            Packages
          </button>
          <button 
            className={`hub-tab ${activeTab === "bus" ? "active" : ""}`}
            onClick={() => setActiveTab("bus")}
          >
            <Bus size={18} />
            Buses
          </button>
          <button 
            className={`hub-tab ${activeTab === "hotel" ? "active" : ""}`}
            onClick={() => setActiveTab("hotel")}
          >
            <Hotel size={18} />
            Hotels
          </button>
        </div>

        <div className="booking-content-area">
          {activeTab === "package" && (
            <div className="book-section">
              <form onSubmit={handleSubmit} className="booking-form">
                <div className="form-group">
                  <label>Customer Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mobile Number (for SMS confirmation)</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="e.g. +919876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Select Package</label>
                  <select
                    className="form-select form-control"
                    value={selectedPackage ? selectedPackage.id : ""}
                    onChange={(e) => {
                      const pkgId = e.target.value;
                      const pkg = packages.find((p) => String(p.id) === String(pkgId));
                      setSelectedPackage(pkg || null);
                      if (pkg) {
                        localStorage.setItem("selectedPackage", JSON.stringify(pkg));
                      } else {
                        localStorage.removeItem("selectedPackage");
                      }
                    }}
                    required
                  >
                    <option value="" disabled>Select Package</option>
                    {packages.length === 0 && selectedPackage ? (
                      <option value={selectedPackage.id}>
                        {selectedPackage.title} - ₹{selectedPackage.price}
                      </option>
                    ) : null}
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.title} - ₹{pkg.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Travel Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Number of Passengers</label>
                  <input
                    type="number"
                    className="form-control"
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    min="1"
                    max="10"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    className="form-select form-control"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  >
                    <option value="credit-card">Credit Card</option>
                    <option value="debit-card">Debit Card</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>

                <button type="submit" className="btn-primary">
                  Confirm Booking
                </button>
              </form>
            </div>
          )}

          {activeTab === "bus" && (
            <div className="bus-booking-tab">
              <BusSearchSection onSearch={(criteria) => {
                setBusSearchCriteria(criteria);
                setShowBusBooking(true);
              }} />
            </div>
          )}

          {activeTab === "hotel" && (
            <div className="hotel-booking-tab">
              <HotelSearchSection onSearch={(criteria) => {
                setHotelSearchCriteria(criteria);
                setLoading(true);
                fetch(`${API_BASE_URL}/get_hotels.php?city=${criteria.city}`)
                  .then(res => res.json())
                  .then(data => {
                    if (data.status === "success") {
                      setHotelResults(data.data);
                    }
                    setLoading(false);
                  });
              }} />
              {loading && <p className="text-center mt-4">Searching for hotels...</p>}
              {hotelResults.length > 0 && (
                <HotelList 
                  hotels={hotelResults} 
                  onSelect={(hotel) => setSelectedHotelId(hotel.id)} 
                />
              )}
            </div>
          )}
        </div>
      </div>

      {showBusBooking && (
        <BusBookingView 
          searchCriteria={busSearchCriteria} 
          onClose={() => setShowBusBooking(false)} 
        />
      )}

      {selectedHotelId && (
        <HotelBookingView 
          hotelId={selectedHotelId}
          searchCriteria={hotelSearchCriteria}
          onClose={() => setSelectedHotelId(null)}
        />
      )}
      <Footer />
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import "./Book.css";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import { useNavigate } from "react-router-dom";

// export default function Book() {
//   const [customerName, setCustomerName] = useState("");
//   const [date, setDate] = useState("");
//   const [passengers, setPassengers] = useState(1);
//   const [paymentMethod, setPaymentMethod] = useState("credit-card");
//   const [selectedPackage, setSelectedPackage] = useState(null);
//   const [userId, setUserId] = useState(null);

//   const navigate = useNavigate();

//   // Load package & user from localStorage
//   useEffect(() => {
//     const pkg = JSON.parse(localStorage.getItem("selectedPackage"));
//     if (pkg) setSelectedPackage(pkg);

//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user) setUserId(user.id);
//   }, []);

//   // Handle form submit → send booking to backend
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!userId) {
//       alert("❌ You must be logged in to book a package.");
//       return;
//     }

//     if (!selectedPackage) {
//       alert("❌ No package selected.");
//       return;
//     }

//     const bookingData = {
//       user_id: userId,                    // foreign key
//       customer_name: customerName,
//       travel_date: date,
//       passengers,
//       payment_method: paymentMethod,
//       package_id: selectedPackage.id,
//       package_title: selectedPackage.title,
//       package_price: selectedPackage.price,
//       service_id: selectedPackage.service_id // ✅ added service_id
//     };

//     try {
//       const res = await fetch(
//         "http://localhost:8000/book_package.php",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(bookingData),
//         }
//       );

//       const result = await res.json();
//       if (result.success) {
//         alert("✅ Booking Confirmed!");
//         localStorage.removeItem("selectedPackage"); // clear stored package
//         navigate("/home"); // redirect to home
//       } else {
//         alert("❌ Booking failed: " + result.message);
//       }
//     } catch (err) {
//       console.error("Booking error:", err);
//       alert("❌ Error booking package.");
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="book-section container">
//         <h2 className="text-center mb-4">
//           <span>B</span>ook <span>Y</span>our <span>D</span>ream <span>V</span>acation
//         </h2>

//         <form onSubmit={handleSubmit} className="booking-form">
//           {/* Customer Name */}
//           <div className="form-group">
//             <label>Customer Name</label>
//             <input
//               type="text"
//               className="form-control"
//               value={customerName}
//               onChange={(e) => setCustomerName(e.target.value)}
//               required
//             />
//           </div>

//           {/* Package Info (Auto-Filled) */}
//           {selectedPackage && (
//             <div className="form-group">
//               <label>Selected Package</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={`${selectedPackage.title} - ₹${selectedPackage.price}`}
//                 readOnly
//               />
//             </div>
//           )}

//           {/* Travel Date */}
//           <div className="form-group">
//             <label>Travel Date</label>
//             <input
//               type="date"
//               className="form-control"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               required
//             />
//           </div>

//           {/* Passengers */}
//           <div className="form-group">
//             <label>Number of Passengers</label>
//             <input
//               type="number"
//               className="form-control"
//               value={passengers}
//               onChange={(e) => setPassengers(e.target.value)}
//               min="1"
//               max="10"
//               required
//             />
//           </div>

//           {/* Payment */}
//           <div className="form-group">
//             <label>Payment Method</label>
//             <select
//               className="form-control"
//               value={paymentMethod}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//               required
//             >
//               <option value="credit-card">Credit Card</option>
//               <option value="debit-card">Debit Card</option>
//               <option value="paypal">PayPal</option>
//             </select>
//           </div>

//           {/* Submit */}
//           <button type="submit" className="btn btn-primary btn-lg btn-block">
//             Confirm Booking
//           </button>
//         </form>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import "./Book.css";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

// export default function Book() {
//   const [customerName, setCustomerName] = useState("");
//   const [date, setDate] = useState("");
//   const [passengers, setPassengers] = useState(1);
//   const [paymentMethod, setPaymentMethod] = useState("credit-card");
//   const [selectedPackage, setSelectedPackage] = useState(null);
//   const [userId, setUserId] = useState(null);

//   // Load package & user from localStorage
//   useEffect(() => {
//     const pkg = JSON.parse(localStorage.getItem("selectedPackage"));
//     if (pkg) setSelectedPackage(pkg);

//     const user = JSON.parse(localStorage.getItem("user")); // logged-in user
//     if (user) setUserId(user.id);
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!userId) {
//       alert("❌ You must be logged in to book a package.");
//       return;
//     }

//     const bookingData = {
//       user_id: userId,
//       customer_name: customerName,
//       travel_date: date,
//       passengers,
//       payment_method: paymentMethod,
//       package_id: selectedPackage?.id,
//       package_title: selectedPackage?.title,
//       package_price: selectedPackage?.price,
//     };

//     try {
//       const res = await fetch(
//         "http://localhost:8000/book_package.php",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(bookingData),
//         }
//       );

//       const result = await res.json();
//       if (result.success) {
//         alert("✅ Booking Confirmed!");
//         localStorage.removeItem("selectedPackage"); // clear stored package
//       } else {
//         alert("❌ Booking failed: " + result.message);
//       }
//     } catch (err) {
//       console.error("Booking error:", err);
//       alert("❌ Error booking package.");
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="book-section container">
//         <h2 className="text-center mb-4">
//           <span>B</span>ook <span>Y</span>our <span>D</span>ream{" "}
//           <span>V</span>acation
//         </h2>

//         <form onSubmit={handleSubmit} className="booking-form">
//           <div className="form-group">
//             <label>Customer Name</label>
//             <input
//               type="text"
//               className="form-control"
//               value={customerName}
//               onChange={(e) => setCustomerName(e.target.value)}
//               required
//             />
//           </div>

//           {selectedPackage && (
//             <div className="form-group">
//               <label>Selected Package</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={`${selectedPackage.title} - ₹${selectedPackage.price}`}
//                 readOnly
//               />
//             </div>
//           )}

//           <div className="form-group">
//             <label>Travel Date</label>
//             <input
//               type="date"
//               className="form-control"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Number of Passengers</label>
//             <input
//               type="number"
//               className="form-control"
//               value={passengers}
//               onChange={(e) => setPassengers(e.target.value)}
//               min="1"
//               max="10"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Payment Method</label>
//             <select
//               className="form-control"
//               value={paymentMethod}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//               required
//             >
//               <option value="credit-card">Credit Card</option>
//               <option value="debit-card">Debit Card</option>
//               <option value="paypal">PayPal</option>
//             </select>
//           </div>

//           <button type="submit" className="btn btn-primary btn-lg btn-block">
//             Confirm Booking
//           </button>
//         </form>
//       </div>
//       <Footer />
//     </div>
//   );
// }
