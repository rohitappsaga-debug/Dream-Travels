import React from "react";

const AdminBadge = ({ children, status = "confirmed" }) => {
  const getStatusStyles = (s) => {
    const sLower = s.toLowerCase();
    switch (sLower) {
      case "confirmed":
      case "active":
      case "success":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "pending":
      case "upcoming":
      case "warning":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "cancelled":
      case "error":
      case "danger":
      case "inactive":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyles(
        status
      )}`}
    >
      {children || status}
    </span>
  );
};

export default AdminBadge;
