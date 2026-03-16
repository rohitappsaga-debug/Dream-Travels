import React, { useState } from "react";
import "./Auth.css";
import { API_BASE_URL } from "../config";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // check password match
    if (formData.password !== formData.confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      // if server doesn’t return JSON (e.g., PHP error), catch it
      const text = await response.text();
      console.log("🔍 Raw server response:", text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (err) {
        throw new Error("Invalid JSON response from server: " + text);
      }

      if (result.status === "success") {
        alert("✅ " + result.message);
        setFormData({ username: "", email: "", password: "", confirmPassword: "" });
        window.location.href = "/login"; // go to login after register
      } else {
        alert("❌ " + result.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("⚠️ Server error. Please check backend logs.");
    }
  };

  return (
    <div className="auth-page">
    <div className="auth-container">
      <h2>📝 Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
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
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit" className="auth-btn">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
    </div>
  );
}
