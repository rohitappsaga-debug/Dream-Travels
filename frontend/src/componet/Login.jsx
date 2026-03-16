import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import { API_BASE_URL } from "../config";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (_) {
        console.error("Login: invalid server response", text.slice(0, 200));
        alert("⚠️ Invalid server response. Please try again.");
        return;
      }

      if (result.status === "success") {
        alert("✅ " + result.message);
        localStorage.setItem("user", JSON.stringify(result.user));
        window.location.href = "/home";
      } else {
        alert("❌ " + result.message);
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("⚠️ Server error. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>🔑 Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>
        <p>
          Don’t have an account?{" "}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}


// import React, { useState } from "react";
// import { Link } from "react-router-dom"; // ✅ import Link
// import "./Auth.css";


// export default function Login() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   // 🔹 Handles input changes for email & password fields
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // 🔹 Handles form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // prevent page refresh

//     try {
//       // 🔹 Send login request to backend
//       const response = await fetch(
//         "http://localhost:8000/login.php",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             email: formData.email,
//             password: formData.password,
//           }),
//         }
//       );

//       const result = await response.json(); // parse backend response
//       console.log("✅ Login response:", result);

//               if (result.status === "success") {
//           alert("✅ " + result.message);

//           // ✅ Just store a flag
//           localStorage.setItem("user", "true");

//           // ✅ Redirect to Home
//           window.location.href = "/home";
//         } else {
//           alert("❌ " + result.message);
//         }
//     } catch (err) {
//       console.error("Login Error:", err);
//       alert("⚠️ Server error. Please try again.");
//     }
//   };

//   return (
//        <div className="auth-page">
//     <div className="auth-container">
//       <h2>🔑 Login</h2>
//       <form onSubmit={handleSubmit} className="auth-form">
//         <input
//           type="email"
//           name="email"
//           placeholder="Email Address"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit" className="auth-btn">Login</button>
//       </form>
//       <p>
//         Don’t have an account? {" "}
//           <Link to="/register">Register here</Link>
//       </p>
//     </div>
//     </div>
//   );
// }
