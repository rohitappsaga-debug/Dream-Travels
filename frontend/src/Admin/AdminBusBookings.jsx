import React, { useState, useEffect, useMemo } from "react";
import { API_BASE_URL } from "../config";
import AdminBadge from "./components/AdminBadge";
import { RefreshCcw, Search, Filter, Phone, Mail, MapPinned, Calendar, User } from "lucide-react";

export default function AdminBusBookings({ showToast }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchBookings = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/get_bus_bookings.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBookings(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bus bookings:", err);
        if (showToast) showToast("Error fetching bookings", "error");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/update_bus_booking_status.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        if (showToast) showToast(data.message, "success");
        fetchBookings();
      } else {
        if (showToast) showToast(data.message, "error");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      if (showToast) showToast("Failed to update status", "error");
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch = 
        b.passenger_name.toLowerCase().includes(filterQuery.toLowerCase()) ||
        b.phone.includes(filterQuery) ||
        b.bus_name.toLowerCase().includes(filterQuery.toLowerCase()) ||
        b.seat_numbers.includes(filterQuery);
      
      const matchesStatus = statusFilter === "" || b.booking_status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [bookings, filterQuery, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Bus Reservations</h2>
            <p className="text-sm text-slate-500 mt-1">Manage all passenger seat bookings across routes</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                loading 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
              onClick={fetchBookings} 
              disabled={loading}
            >
              <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by passenger, phone or bus code..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>
          <div className="relative sm:w-64">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-white font-medium text-slate-600 appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-sans">Updating live bookings...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center bg-slate-50/30 rounded-2xl m-6 border-2 border-dashed border-slate-100 text-slate-400 font-sans">
              No matching bus bookings found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Passenger Info</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bus & Route</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Seats</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                          {b.passenger_name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">#{b.id} - {b.passenger_name}</div>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                            <span className="flex items-center gap-1"><Phone size={12} />{b.phone}</span>
                            <span className="flex items-center gap-1"><Mail size={12} />{b.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                           <MapPinned size={14} className="text-slate-400" />
                           <span>{b.source_city} → {b.destination_city}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
                          <span className="bg-slate-100 px-2 py-0.5 rounded uppercase font-bold text-slate-500 tracking-tight">{b.bus_code}</span>
                          <span className="flex items-center gap-1"><Calendar size={12} />{b.travel_date}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold font-mono">
                        {b.seat_numbers || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <AdminBadge status={b.booking_status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {b.booking_status === "Confirmed" ? (
                          <button 
                            className="px-4 py-2 bg-rose-50 text-rose-600 text-xs font-bold rounded-xl hover:bg-rose-100 transition-all border border-rose-100" 
                            onClick={() => handleStatusChange(b.id, "Cancelled")}
                          >
                            Cancel
                          </button>
                        ) : (
                          <button 
                            className="px-4 py-2 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-xl hover:bg-emerald-100 transition-all border border-emerald-100" 
                            onClick={() => handleStatusChange(b.id, "Confirmed")}
                          >
                            Restore
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
