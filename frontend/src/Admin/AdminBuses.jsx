import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import BusSeatLayout from "./BusSeatLayout";
import { Bus, Plus, Trash2, Layout, X, Info } from "lucide-react";

export default function AdminBuses({ showToast }) {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState(null);
  const [form, setForm] = useState({
    bus_name: "",
    bus_code: "",
    route_id: "",
    status: "Active",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [busRes, routeRes] = await Promise.all([
        fetch(`${API_BASE_URL}/get_buses.php`),
        fetch(`${API_BASE_URL}/get_routes.php`),
      ]);
      const busData = await busRes.json();
      const routeData = await routeRes.json();
      if (busData.status === "success") setBuses(busData.data);
      if (routeData.status === "success") setRoutes(routeData.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/add_bus.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      showToast(data.message, data.success ? "success" : "error");
      if (data.success) {
        setForm({ bus_name: "", bus_code: "", route_id: "", status: "Active" });
        fetchData();
      }
    } catch (err) {
      showToast("Server error", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This will delete the bus and all its seats.")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/delete_bus.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      showToast(data.message, data.success ? "success" : "error");
      if (data.success) fetchData();
    } catch (err) {
      showToast("Server error", "error");
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Bus size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Add New Bus</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Bus Name</label>
              <input
                type="text"
                name="bus_name"
                placeholder="e.g. Scania Multi-Axle"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                value={form.bus_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Bus Number / Code</label>
              <input
                type="text"
                name="bus_code"
                placeholder="e.g. MH-01-AX-1234"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 font-mono"
                value={form.bus_code}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Assign Route</label>
              <select 
                name="route_id" 
                value={form.route_id} 
                onChange={handleChange} 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-white font-medium text-slate-700"
              >
                <option value="">Select a Route</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>{r.route_name || `${r.source_city} → ${r.destination_city}`}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Operational Status</label>
              <select 
                name="status" 
                value={form.status} 
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-white font-medium text-slate-700"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 active:scale-95 transition-all"
            >
              <Plus size={18} />
              Register Bus
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/30">
          <h2 className="text-lg font-bold text-slate-800">Live Bus Fleet</h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium">Updating fleet status...</div>
          ) : buses.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium">No buses registered in the fleet.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bus Details</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Route</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {buses.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{b.bus_name}</span>
                        <span className="text-[11px] font-mono text-slate-400">{b.bus_code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-600">{b.route_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-500">{b.total_seats} Seats</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        b.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs font-bold" 
                          onClick={() => setSelectedBus(b)}
                        >
                          <Layout size={14} />
                          Layout
                        </button>
                        <button 
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" 
                          onClick={() => handleDelete(b.id)}
                          title="Delete Bus"
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

      {selectedBus && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Layout size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Seat Layout Configuration</h3>
                  <p className="text-xs text-slate-500">{selectedBus.bus_name} • {selectedBus.bus_code}</p>
                </div>
              </div>
              <button 
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all shadow-sm"
                onClick={() => setSelectedBus(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <div className="mb-6 flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800 leading-relaxed font-sans">
                  Configure the seating arrangement for this bus. You can mark seats as available, reserved, or modify the layout structure. Changes are saved automatically.
                </p>
              </div>
              <BusSeatLayout busId={selectedBus.id} showToast={showToast} />
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex justify-end">
              <button 
                className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all"
                onClick={() => setSelectedBus(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
