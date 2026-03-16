import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { BedDouble, Plus, Trash2, X, Info, IndianRupee, Hash } from "lucide-react";

export default function AdminRooms({ hotel, onClose, showToast }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    hotel_id: hotel.id,
    room_type: "",
    price_per_night: "",
    total_rooms: "",
    description: "",
    image: ""
  });

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/manage_rooms.php?hotel_id=${hotel.id}`);
      const data = await res.json();
      if (data.status === "success") setRooms(data.data);
    } catch (err) {
      showToast("Failed to fetch rooms", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [hotel.id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/manage_rooms.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      showToast(data.message, data.status === "success" ? "success" : "error");
      if (data.status === "success") {
        setForm({ hotel_id: hotel.id, room_type: "", price_per_night: "", total_rooms: "", description: "", image: "" });
        fetchRooms();
      }
    } catch (err) {
      showToast("Server error", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this room type? This will remove all associated availability data.")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/manage_rooms.php?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      showToast(data.message, data.status === "success" ? "success" : "error");
      if (data.status === "success") fetchRooms();
    } catch (err) {
      showToast("Server error", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <BedDouble size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Room Inventory</h3>
              <p className="text-xs text-slate-500">{hotel.hotel_name}</p>
            </div>
          </div>
          <button 
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all shadow-sm"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-8 bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Plus size={16} /> Add Room Category
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1">Room Type</label>
                  <select 
                    name="room_type" 
                    value={form.room_type} 
                    onChange={handleChange} 
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-white text-sm font-medium"
                  >
                    <option value="">Select Type</option>
                    <option value="Single">Single Room</option>
                    <option value="Double">Double Room</option>
                    <option value="Deluxe">Deluxe Room</option>
                    <option value="Suite">Suite</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1">Price / Night</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="number" 
                      name="price_per_night" 
                      placeholder="0.00" 
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm"
                      value={form.price_per_night} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1">Inventory Count</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="number" 
                      name="total_rooms" 
                      placeholder="Total available" 
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm"
                      value={form.total_rooms} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                >
                  {form.id ? "Update Category" : "Add Room Category"}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Info size={16} className="text-blue-500" /> Active Inventory
            </h4>
            <div className="border border-slate-100 rounded-2xl overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-slate-400 text-sm font-sans">Syncing room data...</div>
              ) : rooms.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm font-sans bg-slate-50/50">No room categories defined for this hotel.</div>
              ) : (
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 font-sans">
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Rate</th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Total</th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Available</th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {rooms.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700">{r.room_type}</td>
                        <td className="px-6 py-4 font-medium text-slate-600 whitespace-nowrap">₹{parseFloat(r.price_per_night).toLocaleString()} / night</td>
                        <td className="px-6 py-4 text-center font-bold text-slate-500">{r.total_rooms}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            parseInt(r.available_rooms) > 5 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                          }`}>
                            {r.available_rooms} Left
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100" 
                            onClick={() => handleDelete(r.id)}
                            title="Remove Category"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex justify-end">
          <button 
            className="px-6 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all"
            onClick={onClose}
          >
            Finished
          </button>
        </div>
      </div>
    </div>
  );
}
