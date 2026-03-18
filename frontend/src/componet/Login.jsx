import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import { API_BASE_URL } from "../config";
import { Eye, EyeOff } from "lucide-react";
import AlertPopup from "./AlertPopup";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseAlert = () => {
    const isSuccess = alert.type === "success";
    setAlert({ message: "", type: "" });
    if (isSuccess) {
      window.location.href = "/home";
    }
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
        setAlert({ message: "Invalid server response. Please try again.", type: "error" });
        return;
      }

      if (result.status === "success") {
        setAlert({ message: "Login successful!", type: "success" });
        localStorage.setItem("user", JSON.stringify(result.user));
      } else {
        setAlert({ message: result.message, type: "error" });
      }
    } catch (err) {
      console.error("Login Error:", err);
      setAlert({ message: "Server error. Please try again.", type: "error" });
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
          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>
        <p>
          Don’t have an account?{" "}
          <Link to="/register">Register here</Link>
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
