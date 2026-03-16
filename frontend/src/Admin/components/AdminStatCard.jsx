import React from "react";

const AdminStatCard = ({ title, value, icon: Icon, color = "blue", children }) => {
  const getColorStyles = (c) => {
    switch (c) {
      case "blue":
        return "bg-blue-50 text-blue-600";
      case "green":
        return "bg-emerald-50 text-emerald-600";
      case "purple":
        return "bg-purple-50 text-purple-600";
      case "orange":
        return "bg-amber-50 text-amber-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl ${getColorStyles(color)}`}>
          {Icon && <Icon size={24} />}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        </div>
      </div>
      {children && (
        <div className="pt-4 border-t border-slate-50 text-sm text-slate-600">
          {children}
        </div>
      )}
    </div>
  );
};

export default AdminStatCard;
