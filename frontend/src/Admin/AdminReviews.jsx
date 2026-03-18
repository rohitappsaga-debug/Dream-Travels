import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { Star, Trash2, MessageSquare, RefreshCcw, User, Calendar } from "lucide-react";

export default function AdminReviews({ showToast }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/get_reviews.php`);
      const data = await res.json();
      if (data.status === "success") setReviews(data.data);
    } catch (err) {
      if (showToast) showToast("Failed to fetch reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/delete_review.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        if (showToast) showToast(data.message, "success");
        fetchReviews();
      } else {
        if (showToast) showToast(data.message, "error");
      }
    } catch (err) {
      if (showToast) showToast("Failed to delete review", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Customer Reviews</h2>
            <p className="text-sm text-slate-500 mt-1">Monitor and moderate traveler feedback and experiences</p>
          </div>
          <button 
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all ${
              loading 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
            onClick={fetchReviews} 
            disabled={loading}
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            {loading ? "Syncing..." : "Refresh Reviews"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium font-sans animate-pulse">
              Loading customer feedback...
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-12 text-center bg-slate-50/30 rounded-2xl m-6 border-2 border-dashed border-slate-100 text-slate-400 font-sans">
              No customer reviews found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reviewer</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rating & Feedback</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                          {rev.name?.charAt(0)}
                        </div>
                        <div className="font-bold text-slate-800">#{rev.id} - {rev.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2 max-w-xl">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              fill={i < rev.rating ? "#FFC107" : "none"} 
                              stroke={i < rev.rating ? "#FFC107" : "var(--gray-300)"} 
                            />
                          ))}
                          <span className="ml-2 text-xs font-bold text-slate-400">{rev.rating}/5</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed italic line-clamp-2 group-hover:line-clamp-none transition-all">
                          "{rev.comment}"
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(rev.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(rev.id)}
                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete Review"
                      >
                        <Trash2 size={18} />
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
  );
}
