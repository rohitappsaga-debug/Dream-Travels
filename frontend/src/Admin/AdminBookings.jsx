import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/get_bookings.php`)
      .then((res) => res.text())
      .then((text) => {
        try {
          const data = JSON.parse(text);
          if (data.status === "success" && Array.isArray(data.data))
            setBookings(data.data);
        } catch (_) {
          console.error("get_bookings: invalid JSON", text?.slice(0, 200));
        }
      })
      .catch((err) => console.error("Error fetching bookings:", err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">📋 All Bookings</h2>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Package</th>
            <th>Date</th>
            <th>Passengers</th>
            <th>Payment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.customer_name}</td>
                <td>{b.package_title}</td>
                <td>{b.travel_date}</td>
                <td>{b.passengers}</td>
                <td>{b.payment_method}</td>
                <td>{b.status ?? "confirmed"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No bookings found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
