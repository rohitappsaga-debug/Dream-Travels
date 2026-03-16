import React, { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { API_BASE_URL } from "../config";
import AdminRoutes from "./AdminRoutes";
import AdminBuses from "./AdminBuses";
import AdminBusBookings from "./AdminBusBookings";
import AdminHotels from "./AdminHotels";
import AdminHotelBookings from "./AdminHotelBookings";
import AdminLayout from "./components/AdminLayout";
import AdminStatCard from "./components/AdminStatCard";
import AdminBadge from "./components/AdminBadge";
import { 
  Package, 
  Calendar, 
  IndianRupee, 
  MapPin, 
  TrendingUp,
  User,
  Clock
} from "lucide-react";

const VIEW_DASHBOARD = "dashboard";
const VIEW_PACKAGES = "packages";
const VIEW_BOOKINGS = "bookings";
const VIEW_ROUTES = "routes";
const VIEW_BUSES = "buses";
const VIEW_BUS_BOOKINGS = "bus_bookings";
const VIEW_HOTELS = "hotels";
const VIEW_HOTEL_BOOKINGS = "hotel_bookings";

export default function Admin({ initialView = VIEW_DASHBOARD }) {
  const [activeView, setActiveView] = useState(initialView);
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [form, setForm] = useState({
    id: undefined,
    title: "",
    description: "",
    price: "",
    image: "",
    duration_days: 1,
    nights: 0,
    start_location: "",
    end_location: "",
    main_transport: "mixed",
    highlights: "",
    inclusions: "",
    exclusions: "",
  });
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [bookingFilterStatus, setBookingFilterStatus] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [itineraryDays, setItineraryDays] = useState([]);
  const [itineraryLoading, setItineraryLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);


  useEffect(() => {
    setActiveView(initialView);
  }, [initialView]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    setPackagesLoading(true);
    fetch(`${API_BASE_URL}/get_packages.php`)
      .then((res) => res.text())
      .then((text) => {
        try {
          const data = JSON.parse(text);
          if (data.status === "success" && Array.isArray(data.data))
            setPackages(data.data);
        } catch (_) {
          console.error("get_packages: invalid JSON", text.slice(0, 200));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setPackagesLoading(false));
  }, []);

  const fetchBookings = () => {
    setBookingsLoading(true);
    fetch(`${API_BASE_URL}/get_bookings.php`)
      .then((res) => res.text())
      .then((text) => {
        try {
          const data = JSON.parse(text);
          if (data.status === "success" && Array.isArray(data.data))
            setBookings(data.data);
        } catch (_) {
          console.error("get_bookings: invalid JSON", text.slice(0, 200));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setBookingsLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const dashboardStats = useMemo(() => {
    const totalBookings = bookings.length;
    const byStatus = { confirmed: 0, cancelled: 0, completed: 0, pending: 0 };
    let totalRevenue = 0;
    let upcomingCount = 0;
    bookings.forEach((b) => {
      const s = (b.status || "confirmed").toLowerCase();
      if (byStatus[s] !== undefined) byStatus[s]++;
      if (["confirmed", "completed"].includes(s) && b.package_price)
        totalRevenue += Number(b.package_price);
      if (s === "confirmed" && b.travel_date && b.travel_date >= today)
        upcomingCount++;
    });
    return { totalBookings, byStatus, totalRevenue, upcomingCount };
  }, [bookings, today]);

  const recentBookings = useMemo(
    () => bookings.slice(0, 10),
    [bookings]
  );

  const topPackages = useMemo(() => {
    const count = {};
    bookings.forEach((b) => {
      const key = b.package_title || `Package #${b.package_id}`;
      count[key] = (count[key] || 0) + 1;
    });
    return Object.entries(count)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    let list = bookings;
    if (bookingFilterStatus) {
      list = list.filter(
        (b) => (b.status || "confirmed").toLowerCase() === bookingFilterStatus
      );
    }
    if (bookingSearch.trim()) {
      const q = bookingSearch.trim().toLowerCase();
      list = list.filter(
        (b) =>
          (b.customer_name && b.customer_name.toLowerCase().includes(q)) ||
          (b.package_title && b.package_title.toLowerCase().includes(q))
      );
    }
    return list;
  }, [bookings, bookingFilterStatus, bookingSearch]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${API_BASE_URL}/upload_image.php`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({ ...prev, image: data.url }));
        showToast("Image uploaded successfully", "success");
      } else {
        showToast(data.message || "Upload failed", "error");
      }
    } catch (err) {
      console.error("Upload error:", err);
      showToast("Server error during upload", "error");
    } finally {
      setImageUploading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });


  const handleEdit = (pkg) => {
    setActiveView(VIEW_PACKAGES);
    setForm({
      id: pkg.id,
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      image: pkg.image,
      duration_days: pkg.duration_days ?? 1,
      nights: pkg.nights ?? Math.max(0, (pkg.duration_days ?? 1) - 1),
      start_location: pkg.start_location ?? "",
      end_location: pkg.end_location ?? "",
      main_transport: pkg.main_transport ?? "mixed",
      highlights: pkg.highlights ?? "",
      inclusions: pkg.inclusions ?? "",
      exclusions: pkg.exclusions ?? "",
    });
    loadItinerary(pkg.id);
  };

  const clearForm = () => {
    setForm({
      id: undefined,
      title: "",
      description: "",
      price: "",
      image: "",
      duration_days: 1,
      nights: 0,
      start_location: "",
      end_location: "",
      main_transport: "mixed",
      highlights: "",
      inclusions: "",
      exclusions: "",
    });
    setItineraryDays([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(form.price) < 5000) {
      showToast("Price must be at least 5000", "error");
      return;
    }

    const url = form.id
      ? `${API_BASE_URL}/update_package.php`
      : `${API_BASE_URL}/add_package.php`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (_) {
        console.error("add/update package: invalid response", text.slice(0, 200));
        showToast("Server error", "error");
        return;
      }
      showToast(json.message, json.success ? "success" : "error");
      if (json.success) {
        if (form.id)
          setPackages(
            packages.map((pkg) => (pkg.id === form.id ? { ...form } : pkg))
          );
        else setPackages([...packages, { ...form, id: Date.now() }]);
        clearForm();
      }
    } catch (err) {
      console.error(err);
      showToast("Server error", "error");
    }
  };

  const loadItinerary = async (packageId) => {
    setItineraryLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/get_package_detail.php?id=${packageId}`
      );
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (_) {
        console.error("get_package_detail: invalid JSON", text.slice(0, 200));
        return;
      }
      if (json.status === "success" && json.data?.itinerary) {
        setItineraryDays(json.data.itinerary);
      } else {
        setItineraryDays([]);
      }
    } catch (err) {
      console.error("Error loading itinerary", err);
    } finally {
      setItineraryLoading(false);
    }
  };

  const handleAddDay = () => {
    const nextDay =
      itineraryDays.length > 0
        ? Math.max(...itineraryDays.map((d) => Number(d.day_number) || 0)) + 1
        : 1;
    setItineraryDays([
      ...itineraryDays,
      {
        day_number: nextDay,
        title: "",
        description: "",
        transport_mode: "none",
        meals: "",
        stay_location: "",
      },
    ]);
  };

  const handleUpdateDay = (index, field, value) => {
    setItineraryDays((prev) =>
      prev.map((day, i) =>
        i === index
          ? {
              ...day,
              [field]: field === "day_number" ? Number(value) || 1 : value,
            }
          : day
      )
    );
  };

  const handleRemoveDay = (index) => {
    setItineraryDays((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveItinerary = async () => {
    if (!form.id) {
      showToast("Please select a package to edit itinerary", "error");
      return;
    }
    const days = [...itineraryDays]
      .map((d) => ({
        ...d,
        day_number: Number(d.day_number) || 1,
      }))
      .sort((a, b) => a.day_number - b.day_number);

    try {
      const res = await fetch(`${API_BASE_URL}/save_package_itinerary.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ package_id: form.id, days }),
      });
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (_) {
        showToast("Server error saving itinerary", "error");
        return;
      }
      showToast(json.message, json.success ? "success" : "error");
    } catch (err) {
      console.error("Error saving itinerary", err);
      showToast("Error saving itinerary", "error");
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    if (newStatus === "cancelled" && !window.confirm("Cancel this booking?"))
      return;
    try {
      const res = await fetch(`${API_BASE_URL}/update_booking_status.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookingId, status: newStatus }),
      });
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (_) {
        showToast("Server error", "error");
        return;
      }
      showToast(json.message, json.success ? "success" : "error");
      if (json.success) fetchBookings();
    } catch (err) {
      console.error(err);
      showToast("Failed to update status", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?"))
      return;
    try {
      const res = await fetch(`${API_BASE_URL}/delete_package.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (_) {
        showToast("Server error while deleting", "error");
        return;
      }
      showToast(json.message, json.success ? "success" : "error");
      if (json.success) setPackages(packages.filter((pkg) => pkg.id !== id));
    } catch (err) {
      console.error(err);
      showToast("Server error while deleting package", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <AdminLayout
      activeView={activeView}
      setActiveView={setActiveView}
      onLogout={handleLogout}
    >
      {toast && (
        <div 
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl animate-in slide-in-from-top-4 duration-300 ${
            toast.type === "success" 
              ? "bg-emerald-500 text-white" 
              : toast.type === "error" 
                ? "bg-rose-500 text-white" 
                : "bg-blue-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {activeView === VIEW_DASHBOARD && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdminStatCard
              title="Total Packages"
              value={packages.length}
              icon={Package}
              color="blue"
            >
              <div className="flex items-center gap-1 text-emerald-600 font-medium">
                <TrendingUp size={16} />
                <span>Active Packages</span>
              </div>
            </AdminStatCard>
            <AdminStatCard
              title="Total Bookings"
              value={dashboardStats.totalBookings}
              icon={Calendar}
              color="purple"
            >
              <div className="flex items-center gap-1 text-slate-500">
                <Clock size={16} />
                <span>Lifetime bookings</span>
              </div>
            </AdminStatCard>
            <AdminStatCard
              title="Revenue"
              value={`₹${dashboardStats.totalRevenue.toLocaleString()}`}
              icon={IndianRupee}
              color="green"
            >
              <div className="text-slate-500">Confirmed + Completed</div>
            </AdminStatCard>
            <AdminStatCard
              title="Upcoming Travels"
              value={dashboardStats.upcomingCount}
              icon={MapPin}
              color="orange"
            >
              <div className="text-slate-500">Bookings for today & later</div>
            </AdminStatCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Recent Bookings</h2>
                <button 
                  onClick={() => setActiveView(VIEW_BOOKINGS)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                {bookingsLoading ? (
                  <div className="p-12 text-center text-slate-400">Loading...</div>
                ) : recentBookings.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">No bookings yet.</div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Package</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4 text-sm font-medium text-slate-500 italic">#{b.id}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                <User size={14} />
                              </div>
                              <span className="text-sm font-semibold text-slate-700">{b.customer_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{b.package_title || `#${b.package_id}`}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{b.travel_date}</td>
                          <td className="px-6 py-4 text-right">
                            <AdminBadge status={b.status ?? "confirmed"}>
                              {b.status ?? "confirmed"}
                            </AdminBadge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Top Packages</h2>
              </div>
              <div className="p-6">
                {bookingsLoading ? (
                  <div className="text-center py-8 text-slate-400">Loading...</div>
                ) : topPackages.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">No booking data yet.</div>
                ) : (
                  <div className="space-y-4">
                    {topPackages.map(([name, count], i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </div>
                          <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors line-clamp-1">{name}</span>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-600 group-hover:border-blue-200 group-hover:text-blue-600">
                          {count} Bookings
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

        {activeView === VIEW_PACKAGES && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-800">
                  {form.id ? "Edit Package" : "Add New Package"}
                </h2>
                {form.id && (
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                    onClick={clearForm}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Package Title</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="e.g. Exotic Maldives Escape"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      value={form.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      placeholder="Minimum 5000"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      value={form.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Description</label>
                  <textarea
                    name="description"
                    placeholder="Briefly describe the package experience..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none min-h-[100px]"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Days</label>
                    <input
                      type="number"
                      name="duration_days"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      value={form.duration_days}
                      onChange={handleChange}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Nights</label>
                    <input
                      type="number"
                      name="nights"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      value={form.nights}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Start Location</label>
                    <input
                      type="text"
                      name="start_location"
                      placeholder="e.g. Mumbai"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      value={form.start_location}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">End Location</label>
                    <input
                      type="text"
                      name="end_location"
                      placeholder="e.g. Male"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      value={form.end_location}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Main Transport</label>
                    <select
                      name="main_transport"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-white font-medium text-slate-600"
                      value={form.main_transport}
                      onChange={handleChange}
                    >
                      <option value="mixed">Mixed</option>
                      <option value="bus">Bus</option>
                      <option value="flight">Flight</option>
                      <option value="train">Train</option>
                      <option value="cab">Cab</option>
                      <option value="cruise">Cruise</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Package Image</label>
                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          id="file-upload"
                          className="hidden"
                          disabled={imageUploading}
                        />
                        <label 
                          htmlFor="file-upload"
                          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer text-sm font-medium text-slate-600 ${imageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {imageUploading ? "Uploading..." : "Upload Image"}
                        </label>
                      </div>
                      <input
                        type="text"
                        name="image"
                        placeholder="Or provide URL"
                        className="flex-[2] px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                        value={form.image}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Highlights</label>
                    <textarea
                      name="highlights"
                      placeholder="One per line..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none h-32"
                      value={form.highlights}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Inclusions</label>
                    <textarea
                      name="inclusions"
                      placeholder="What is included?"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none h-32"
                      value={form.inclusions}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Exclusions</label>
                    <textarea
                      name="exclusions"
                      placeholder="What is not included?"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none h-32"
                      value={form.exclusions}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    type="submit" 
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 active:scale-95 transition-all"
                  >
                    {form.id ? "Update Package" : "Create Package"}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Existing Packages</h2>
              </div>
              <div className="overflow-x-auto">
                {packagesLoading ? (
                  <div className="p-12 text-center text-slate-400">Loading packages...</div>
                ) : packages.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">No packages yet. Add one above.</div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Preview</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Package Details</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pricing</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {packages.map((pkg) => (
                        <tr key={pkg.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                              <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <h4 className="text-sm font-bold text-slate-800">{pkg.title}</h4>
                              <p className="text-xs text-slate-500 line-clamp-1">{pkg.description}</p>
                              <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                <span>{pkg.duration_days}D/{pkg.nights ?? Math.max(0, pkg.duration_days - 1)}N</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span>{pkg.main_transport || "mixed"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{Number(pkg.price).toLocaleString()}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                onClick={() => handleEdit(pkg)}
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                              </button>
                              <button
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                onClick={() => handleDelete(pkg.id)}
                                title="Delete"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Itinerary</h3>
                  <p className="text-sm text-slate-500 mt-1">Manage day-by-day plan for "{form.title || 'selected package'}"</p>
                </div>
                {form.id && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      onClick={handleAddDay}
                    >
                      + Add Day
                    </button>
                    <button
                      type="button"
                      className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                      onClick={handleSaveItinerary}
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {itineraryLoading ? (
                <div className="py-12 text-center text-slate-400">Loading itinerary...</div>
              ) : !form.id ? (
                <div className="py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <Package className="mx-auto text-slate-300 mb-4" size={48} />
                  <p className="text-slate-500 font-medium font-sans">Select a package from the table above to edit its itinerary</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {itineraryDays.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 italic">No days added to this itinerary yet.</div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {itineraryDays.map((day, index) => (
                        <div key={index} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-blue-200 transition-colors space-y-6 relative group">
                          <button
                            type="button"
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 transition-colors"
                            onClick={() => handleRemoveDay(index)}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-1 space-y-2">
                              <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Day</label>
                              <input
                                type="number"
                                min="1"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:bg-white transition-all text-center font-bold text-slate-700 outline-none"
                                value={day.day_number}
                                onChange={(e) => handleUpdateDay(index, "day_number", e.target.value)}
                              />
                            </div>
                            <div className="md:col-span-7 space-y-2">
                              <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Activity/Title</label>
                              <input
                                type="text"
                                placeholder="What's happening on this day?"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:bg-white transition-all font-medium text-slate-700 outline-none"
                                value={day.title}
                                onChange={(e) => handleUpdateDay(index, "title", e.target.value)}
                              />
                            </div>
                            <div className="md:col-span-4 space-y-2">
                              <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Transport</label>
                              <select
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:bg-white transition-all font-medium text-slate-600 outline-none bg-white font-sans"
                                value={day.transport_mode || "none"}
                                onChange={(e) => handleUpdateDay(index, "transport_mode", e.target.value)}
                              >
                                <option value="none">No transport</option>
                                <option value="bus">Bus</option>
                                <option value="flight">Flight</option>
                                <option value="train">Train</option>
                                <option value="cab">Cab</option>
                                <option value="ferry">Ferry</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Meals Provided</label>
                              <input
                                type="text"
                                placeholder="e.g. Breakfast, Lunch"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:bg-white transition-all text-sm outline-none"
                                value={day.meals || ""}
                                onChange={(e) => handleUpdateDay(index, "meals", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Stay Location/Hotel</label>
                              <input
                                type="text"
                                placeholder="Where are you staying tonight?"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:bg-white transition-all text-sm outline-none"
                                value={day.stay_location || ""}
                                onChange={(e) => handleUpdateDay(index, "stay_location", e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Detailed Description</label>
                            <textarea
                              placeholder="Describe today's activities in detail..."
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:bg-white transition-all text-sm outline-none min-h-[80px]"
                              value={day.description || ""}
                              onChange={(e) => handleUpdateDay(index, "description", e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === VIEW_BOOKINGS && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-800">Booking Management</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none w-full sm:w-64 font-sans text-sm"
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                  <select
                    value={bookingFilterStatus}
                    onChange={(e) => setBookingFilterStatus(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-white font-medium text-slate-600 text-sm"
                  >
                    <option value="">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                {bookingsLoading ? (
                  <div className="p-12 text-center text-slate-400 font-sans">Loading bookings...</div>
                ) : filteredBookings.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 font-sans">
                    {bookings.length === 0 ? "No bookings found." : "No bookings match the filter."}
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Booking Info</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Package</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Travel Details</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-slate-900">#{b.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                                {b.customer_name?.charAt(0)}
                              </div>
                              <span className="text-sm font-semibold text-slate-700">{b.customer_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-slate-600">{b.package_title || `#${b.package_id}`}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Calendar size={14} className="text-slate-400" />
                                <span>{new Date(b.travel_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                <User size={12} />
                                <span>{b.passengers} pax</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <AdminBadge status={b.status} />
                              <select
                                value={b.status ?? "confirmed"}
                                onChange={(e) => handleStatusChange(b.id, e.target.value)}
                                className="text-xs bg-transparent border-none focus:ring-0 text-slate-400 font-medium hover:text-slate-600 transition-colors outline-none cursor-pointer"
                              >
                                <option value="confirmed">Change to Confirmed</option>
                                <option value="cancelled">Change to Cancelled</option>
                                <option value="completed">Change to Completed</option>
                                <option value="pending">Change to Pending</option>
                              </select>
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
        )}

        {activeView === VIEW_ROUTES && (
          <AdminRoutes showToast={showToast} />
        )}

        {activeView === VIEW_BUSES && (
          <AdminBuses showToast={showToast} />
        )}

        {activeView === VIEW_BUS_BOOKINGS && (
          <AdminBusBookings showToast={showToast} />
        )}

      {activeView === VIEW_HOTEL_BOOKINGS && (
        <AdminHotelBookings showToast={showToast} />
      )}

      {activeView === VIEW_HOTELS && (
        <AdminHotels showToast={showToast} />
      )}
    </AdminLayout>
  );
}
