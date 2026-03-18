import React, { useState } from "react";
import "./Auth.css";
import { API_BASE_URL } from "../config";
import { Eye, EyeOff } from "lucide-react";
import AlertPopup from "./AlertPopup";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseAlert = () => {
    const isSuccess = alert.type === "success";
    setAlert({ message: "", type: "" });
    if (isSuccess) {
      window.location.href = "/login";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // check password match
    if (formData.password !== formData.confirmPassword) {
      setAlert({ message: "Passwords do not match!", type: "error" });
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
        setAlert({ message: "Registration successful!", type: "success" });
        setFormData({ username: "", email: "", password: "", confirmPassword: "" });
      } else {
        setAlert({ message: result.message, type: "error" });
      }
    } catch (err) {
      console.error("Error:", err);
      setAlert({ message: "Server error. Please check backend logs.", type: "error" });
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
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button type="submit" className="auth-btn">
            Register
          </button>
        </form>
        <p>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>

      <AlertPopup
        message={alert.message}
        type={alert.type}
        onClose={handleCloseAlert}
      />
    </div>
  );
}
