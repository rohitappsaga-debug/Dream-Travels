import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import AdminRooms from "./AdminRooms";
import { Hotel, Plus, Trash2, Edit3, X, MapPin, Star, IndianRupee, Bed, Image as ImageIcon, Sparkles } from "lucide-react";

export default function AdminHotels({ showToast }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [form, setForm] = useState({
    hotel_name: "",
    city: "",
    location: "",
    rating: 4.0,
    price_per_night: 0,
    total_rooms: 0,
    image: "",
    description: "",
    amenities: ""
  });

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/manage_hotels.php`);
      const data = await res.json();
      if (data.status === "success") setHotels(data.data);
    } catch (err) {
      showToast("Failed to fetch hotels", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/manage_hotels.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      showToast(data.message, data.status === "success" ? "success" : "error");
      if (data.status === "success") {
        setForm({
          hotel_name: "", city: "", location: "", rating: 4.0,
          price_per_night: 0, total_rooms: 0, image: "", 
          description: "", amenities: ""
        });
        fetchHotels();
      }
    } catch (err) {
      showToast("Server error", "error");
    }
  };

  const handleEdit = (hotel) => {
    setForm(hotel);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hotel? This action cannot be undone.")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/manage_hotels.php?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      showToast(data.message, data.status === "success" ? "success" : "error");
      if (data.status === "success") fetchHotels();
    } catch (err) {
      showToast("Server error", "error");
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Hotel size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              {form.id ? "Edit Hotel Listing" : "Register New Hotel"}
            </h2>
          </div>
          {form.id && (
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
              onClick={() => setForm({ 
                hotel_name: "", city: "", location: "", rating: 4.0, 
                price_per_night: 0, total_rooms: 0, image: "", 
                description: "", amenities: "" 
              })}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Hotel Name</label>
              <div className="relative">
                <Hotel className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  name="hotel_name"
                  placeholder="e.g. Grand Hyatt Regency"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  value={form.hotel_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">City</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Mumbai"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Address / Location</label>
              <input
                type="text"
                name="location"
                placeholder="Enter complete address..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Guest Rating</label>
              <div className="relative">
                <Star className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" size={18} />
                <input
                  type="number"
                  step="0.1"
                  max="5"
                  min="1"
                  name="rating"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  value={form.rating}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Base Price (Per Night)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  name="price_per_night"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  value={form.price_per_night}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Total Rooms</label>
              <div className="relative">
                <Bed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  name="total_rooms"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  value={form.total_rooms}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Cover Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  name="image"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  value={form.image}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Detailed Description</label>
            <textarea
              name="description"
              rows="3"
              placeholder="Tell guests about the hotel's charm and unique features..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Amenities</label>
            <div className="relative">
              <Sparkles className="absolute left-3.5 top-10 text-slate-400" size={18} />
              <input
                type="text"
                name="amenities"
                placeholder="WiFi, AC, Swimming Pool, Parking, Breakfast Included..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                value={form.amenities}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 active:scale-95 transition-all"
            >
              {form.id ? "Update Hotel Listing" : "Register Hotel"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/30">
          <h2 className="text-lg font-bold text-slate-800">Hotel Management</h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium font-sans">Refreshing directory...</div>
          ) : hotels.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-sans">No hotels registered in the directory.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hotel Details</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Rating</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pricing</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {hotels.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/30 transition-colors group text-sm">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          {h.image ? (
                            <img src={h.image} alt={h.hotel_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300"><Hotel size={20} /></div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{h.hotel_name}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin size={10} /> {h.city}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full text-xs">
                        <Star size={12} fill="currentColor" /> {h.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700">₹{parseFloat(h.price_per_night).toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400">per night / base</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{h.total_rooms} Rooms</span>
                        <div className="w-16 h-1 mt-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all text-[11px] font-bold border border-emerald-100" 
                          onClick={() => setSelectedHotel(h)}
                        >
                          Manage Rooms
                        </button>
                        <button 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          onClick={() => handleEdit(h)}
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" 
                          onClick={() => handleDelete(h.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedHotel && (
        <AdminRooms 
          hotel={selectedHotel} 
          onClose={() => setSelectedHotel(null)} 
          showToast={showToast} 
        />
      )}
    </div>
  );
}
