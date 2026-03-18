import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  CalendarDays,
  Map,
  Bus,
  Ticket,
  Hotel,
  Bed,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plane,
  Image as ImageIcon,
  MessageSquare
} from "lucide-react";

const AdminSidebar = ({ activeView, setActiveView, onLogout, isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { id: "packages", label: "Packages", icon: Box, path: "/admin/packages" },
    { id: "bookings", label: "Bookings", icon: CalendarDays, path: "/admin/bookings" },
    { id: "routes", label: "Routes", icon: Map, path: "/admin/routes" },
    { id: "buses", label: "Buses", icon: Bus, path: "/admin/buses" },
    { id: "bus_bookings", label: "Bus Bookings", icon: Ticket, path: "/admin/bus-bookings" },
    { id: "hotels", label: "Manage Hotels", icon: Hotel, path: "/admin/hotels" },
    { id: "hotel_bookings", label: "Hotel Bookings", icon: Bed, path: "/admin/hotel-bookings" },
    { id: "gallery", label: "Gallery", icon: ImageIcon, path: "/admin/gallery" },
    { id: "reviews", label: "Reviews", icon: MessageSquare, path: "/admin/reviews" },
  ];

  return (
    <aside
      className={`bg-slate-900 text-slate-300 h-screen sticky top-0 transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-6 flex items-center justify-between border-b border-slate-800/50">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Plane size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">AdminPanel</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg hover:bg-slate-800 transition-colors ${
            isCollapsed ? "mx-auto" : ""
          }`}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={() => setActiveView(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
              activeView === item.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "hover:bg-slate-800 hover:text-white"
            }`}
          >
            <item.icon
              size={20}
              className={`${
                activeView === item.id ? "text-white" : "text-slate-400 group-hover:text-blue-400"
              }`}
            />
            {!isCollapsed && <span className="font-medium text-white">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800/50">
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 ${
            isCollapsed ? "justify-center px-0" : ""
          }`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium text-white">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
