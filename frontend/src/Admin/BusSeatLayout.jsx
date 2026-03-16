import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { Info } from "lucide-react";

export default function BusSeatLayout({ busId, showToast }) {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeats = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/get_bus_seats.php?bus_id=${busId}`);
        const data = await res.json();
        if (data.status === "success") setSeats(data.data);
      } catch (err) {
        showToast("Failed to fetch seats", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, [busId, showToast]);

  if (loading) return <div className="p-8 text-center text-slate-400 animate-pulse">Mapping seats...</div>;

  const rows = [];
  for (let i = 0; i < 7; i++) {
    rows.push(seats.slice(i * 4, i * 4 + 4));
  }
  const lastSeat = seats[28];

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-inner">
        <div className="mb-10 text-center py-4 bg-white rounded-2xl border border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-widest shadow-sm">
          Driver Dashboard / Front
        </div>
        
        <div className="space-y-4">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-between items-center gap-4">
              <div className="flex gap-2">
                {row[0] && <Seat seat={row[0]} />}
                {row[1] && <Seat seat={row[1]} />}
              </div>
              <div className="flex-1 h-10 border-x border-slate-100 bg-slate-100/30 rounded-full"></div>
              <div className="flex gap-2">
                {row[2] && <Seat seat={row[2]} />}
                {row[3] && <Seat seat={row[3]} />}
              </div>
            </div>
          ))}
          {lastSeat && (
            <div className="flex justify-start items-center gap-4 mt-8 pt-6 border-t border-slate-200/50">
               <Seat seat={lastSeat} />
               <div className="text-[10px] font-bold text-slate-400 uppercase">Observer Seat</div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <div className="w-4 h-4 rounded bg-emerald-100 border border-emerald-200"></div> Available
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <div className="w-4 h-4 rounded bg-rose-500 shadow-sm"></div> Booked
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <div className="w-4 h-4 rounded bg-amber-400 shadow-sm shadow-amber-500/20"></div> Reserved
        </div>
      </div>
    </div>
  );
}

function Seat({ seat }) {
  const status = seat.seat_status.toLowerCase();
  
  const statusClasses = {
    available: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100",
    booked: "bg-rose-500 text-white border-rose-600 shadow-md",
    reserved: "bg-amber-400 text-white border-amber-500 shadow-md",
  };

  return (
    <div 
      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold border transition-all cursor-default ${statusClasses[status] || 'bg-slate-100 text-slate-400'}`}
      title={`Seat ${seat.seat_number} - ${seat.seat_status}`}
    >
      {seat.seat_number}
    </div>
  );
}
