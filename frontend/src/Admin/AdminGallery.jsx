import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { Image as ImageIcon, Plus, Trash2, X, Upload } from "lucide-react";

export default function AdminGallery({ showToast }) {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    image: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/get_gallery.php`);
      const data = await res.json();
      if (data.status === "success") setGallery(data.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch gallery items", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/add_gallery.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      showToast(data.message, data.success ? "success" : "error");
      if (data.success) {
        setForm({ title: "", image: "" });
        fetchData();
      }
    } catch (err) {
      showToast("Server error", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gallery item?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/delete_gallery.php`, {
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
            <ImageIcon size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Add Gallery Image</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Image Title</label>
              <input
                type="text"
                placeholder="e.g. Beautiful Santorini Sunrise"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Gallery Image</label>
              <div className="flex items-center gap-4">
                <div 
                  className="flex-1 border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-blue-400 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden group"
                  onClick={() => document.getElementById('gallery-upload').click()}
                >
                  {form.image ? (
                    <>
                      <img src={form.image} alt="Preview" className="h-20 w-full object-cover rounded-lg" />
                      <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload size={20} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload size={24} className="text-slate-400" />
                      <span className="text-xs font-medium text-slate-500">{imageUploading ? "Uploading..." : "Click to upload image"}</span>
                    </>
                  )}
                </div>
                <input 
                  id="gallery-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={imageUploading || !form.image}
              className={`flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg transition-all ${
                imageUploading || !form.image ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700 active:scale-95"
              }`}
            >
              <Plus size={18} />
              Add to Gallery
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/30">
          <h2 className="text-lg font-bold text-slate-800">Gallery Items</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 text-slate-400 font-medium font-sans">Refreshing gallery...</div>
          ) : gallery.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-medium font-sans italic">No images in your gallery yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {gallery.map((item) => (
                <div key={item.id} className="group relative bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <div className="p-4 bg-white/90 backdrop-blur-md absolute bottom-0 left-0 right-0 border-t border-slate-100 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-slate-800 truncate">{item.title}</p>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                        title="Delete Image"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
