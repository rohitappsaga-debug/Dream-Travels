import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import AdminBadge from "./components/AdminBadge";
import { Hotel, Calendar, User, CreditCard, BedDouble, RefreshCcw } from "lucide-react";

export default function AdminHotelBookings({ showToast }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/get_hotel_bookings.php`);
      const data = await res.json();
      if (data.status === "success") setBookings(data.data);
    } catch (err) {
      showToast("Failed to fetch hotel bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Hotel Guest Reservations</h2>
            <p className="text-sm text-slate-500 mt-1">Monitor and manage all upcoming and past hotel stays</p>
          </div>
          <button 
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all ${
              loading 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
            onClick={fetchBookings} 
            disabled={loading}
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            {loading ? "Syncing..." : "Refresh Data"}
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium font-sans animate-pulse">
              Fetching the latest reservation data...
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center bg-slate-50/30 rounded-2xl m-6 border-2 border-dashed border-slate-100 text-slate-400 font-sans">
              No hotel reservations found in the record.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stay Details</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Guest & Accomodation</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Payment</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/30 transition-colors group text-sm">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">#{b.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-bold text-slate-700">
                             <Calendar size={14} className="text-slate-400" />
                             <span>{b.check_in} — {b.check_out}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            {b.hotel_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          <User size={14} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{b.guest_name}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <BedDouble size={12} /> {b.room_type} ({b.num_rooms} Rooms)
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex flex-col items-end">
                         <div className="flex items-center gap-1 font-bold text-slate-800">
                           <CreditCard size={14} className="text-slate-400" />
                           ₹{parseFloat(b.total_price).toLocaleString()}
                         </div>
                         <div className="text-[10px] text-slate-400 uppercase tracking-tighter font-bold">Total Amount</div>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <AdminBadge status={b.status} />
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
