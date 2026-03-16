import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children, activeView, setActiveView, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <AdminSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={onLogout}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 px-8 flex items-center justify-between">
          <h1 className="text-xl font-semibold capitalize text-slate-800">
            {activeView.replace("_", " ")}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
              AD
            </div>
            <span className="text-sm font-medium text-slate-600">Administrator</span>
          </div>
        </header>
        <div className="p-8">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
