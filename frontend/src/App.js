import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./componet/ProtectedRoute";

import Bodycard from "./componet/Home.js";
import About from "./componet/About.jsx";
import Services from "./componet/Services.jsx";
import Book from "./componet/Book";
import MyBookings from "./componet/MyBookings";
import Package from "./componet/Package.jsx";
import PackageDetail from "./componet/PackageDetail.jsx";

import ScrollToTop from "./componet/ScrollToTop.jsx";

// Auth pages
import Login from "./componet/Login.jsx";
import Register from "./componet/Registration.jsx";

// Admin page
import Admin from "./Admin/Admin";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book/:pkgId" element={<Book />} />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<Admin />} />

        {/* Protected pages */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Bodycard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book"
          element={
            <ProtectedRoute>
              <Book />
            </ProtectedRoute>
          }
        />
        <Route
          path="/package"
          element={
            <ProtectedRoute>
              <Package />
            </ProtectedRoute>
          }
        />
        <Route
          path="/package/:id"
          element={
            <ProtectedRoute>
              <PackageDetail />
            </ProtectedRoute>
          }
        />


        {/* Admin routes (only accessible to Admin role) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="Admin">
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/packages"
          element={
            <ProtectedRoute role="Admin">
              <Admin initialView="packages" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute role="Admin">
              <Admin initialView="bookings" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/routes"
          element={
            <ProtectedRoute role="Admin">
              <Admin initialView="routes" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/buses"
          element={
            <ProtectedRoute role="Admin">
              <Admin initialView="buses" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bus-bookings"
          element={
            <ProtectedRoute role="Admin">
              <Admin initialView="bus_bookings" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hotels"
          element={
            <ProtectedRoute role="Admin">
              <Admin initialView="hotels" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hotel-bookings"
          element={
            <ProtectedRoute role="Admin">
              <Admin initialView="hotel_bookings" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute role="Admin">
              <Admin initialView="reviews" />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
