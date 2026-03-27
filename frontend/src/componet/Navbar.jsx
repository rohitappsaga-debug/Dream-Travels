import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Plane, LogOut, LayoutDashboard } from "lucide-react";
import AlertPopup from "./AlertPopup";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoutMsg, setLogoutMsg] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    const userName = user?.name || "Traveler";
    setLogoutMsg(`Thank you, ${userName}! See you soon.`);
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleCloseLogoutAlert = () => {
    setLogoutMsg("");
    window.location.href = "/login";
  };

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Book", path: "/book" },
    { name: "Package", path: "/package" },

    { name: "Services", path: "/services" },
    { name: "About Us", path: "/about" },
    { name: "My Bookings", path: "/my-bookings" },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
          isScrolled 
            ? "bg-white/40 backdrop-blur-xl border-b border-white/20 py-2 shadow-lg shadow-black/5" 
            : "bg-black/10 backdrop-blur-md py-4"
        }`}
      >
        {/* Navbar Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <NavLink to="/home" className="flex items-center gap-2 group">
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  isScrolled ? "bg-blue-600 shadow-lg shadow-blue-600/20" : "bg-white/10 backdrop-blur-md"
                }`}>
                  <Plane size={24} className={isScrolled ? "text-white" : "text-blue-500"} />
                </div>
                <div className="flex flex-col">
                  <span className={`text-xl font-extrabold leading-tight tracking-tight transition-colors duration-300 ${
                    isScrolled ? "text-slate-900" : "text-white"
                  }`}>
                    <span className="text-blue-500">D</span>ream <span className="text-blue-500">T</span>ravelers
                  </span>
                  <span className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-colors duration-300 ${
                    isScrolled ? "text-slate-400" : "text-white/60"
                  }`}>Explore the World</span>
                </div>
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? isScrolled 
                          ? "text-blue-600 bg-blue-50" 
                          : "text-white bg-white/20"
                        : isScrolled
                          ? "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {user?.role === "Admin" && (
                <NavLink
                  to="/admin"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                    isScrolled ? "text-slate-600 hover:text-blue-600 hover:bg-slate-50" : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <LayoutDashboard size={16} />
                  Admin
                </NavLink>
              )}

              <div className={`h-6 w-px mx-4 transition-colors duration-300 ${
                isScrolled ? "bg-slate-200" : "bg-white/20"
              }`} />

              {user ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLogout}
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      isScrolled 
                        ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50" 
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Login
                </NavLink>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-xl transition-colors ${
                  isScrolled ? "text-slate-600 hover:bg-slate-100" : "text-white hover:bg-white/10"
                }`}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed inset-x-0 top-[72px] bg-white/80 backdrop-blur-2xl border-b border-white/20 shadow-2xl transition-all duration-500 ease-in-out origin-top ${
            isOpen ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
          }`}
        >
          <div className="px-4 pt-4 pb-8 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-6 py-4 rounded-2xl text-base font-bold transition-all ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            {user?.role === "Admin" && (
              <NavLink
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block px-6 py-4 rounded-2xl text-base font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Admin Dashboard
              </NavLink>
            )}
            <div className="pt-6 flex flex-col gap-3 border-t border-slate-100 mt-4">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 text-rose-600 bg-rose-50 rounded-2xl font-bold transition-all"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              ) : (
                <NavLink
                  to="/login"
                  className="w-full text-center px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20"
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>
      {logoutMsg && (
        <AlertPopup
          message={logoutMsg}
          type="success"
          onClose={handleCloseLogoutAlert}
        />
      )}
    </>
  );
}
