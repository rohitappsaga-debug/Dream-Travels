import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import "./BusSearchSection.css";

export default function BusSearchSection({ onSearch }) {
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState({
    source: "",
    destination: "",
    date: new Date().toISOString().split("T")[0]
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/get_routes.php`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setRoutes(data.data);
        }
      });
  }, []);

  // Helper to get unique, capitalized city names (fixes duplicates like "Surat" vs "surat")
  const getUniqueCities = (cityList) => {
    const unique = new Set();
    return cityList
      .map(city => city.trim())
      .filter(city => {
        const lower = city.toLowerCase();
        if (unique.has(lower)) return false;
        unique.add(lower);
        return true;
      })
      .sort((a, b) => a.localeCompare(b));
  };

  const sources = getUniqueCities(routes.map(r => r.source_city));
  const destinations = getUniqueCities(routes.map(r => r.destination_city));

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(search);
  };

  return (
    <div className="book-section">
      <form onSubmit={handleSearch} className="booking-form">
        <div className="form-group">
          <label>Source City</label>
          <select 
            className="form-control"
            value={search.source} 
            onChange={(e) => setSearch({...search, source: e.target.value})}
            required
          >
            <option value="">Select Source</option>
            {sources.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Destination City</label>
          <select 
            className="form-control"
            value={search.destination} 
            onChange={(e) => setSearch({...search, destination: e.target.value})}
            required
          >
            <option value="">Select Destination</option>
            {destinations.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Travel Date</label>
          <input 
            type="date" 
            className="form-control"
            value={search.date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setSearch({...search, date: e.target.value})}
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Search Buses
        </button>
      </form>
    </div>
  );
}
