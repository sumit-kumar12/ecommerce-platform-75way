"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../../../../lib/api";

const TABS = ["All", "Images", "Videos", "Documents"];
const TYPE_ICONS = { image: "image", video: "play_circle", document: "description", other: "attach_file" };
const TYPE_COLORS = { image: "#8C63F5", video: "#06b6d4", document: "#f59e0b", other: "#94a3b8" };

function getFileType(file) {
  const type = file.type || file.mimeType || "";
  if (type.startsWith("image/") || /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(file.name || "")) return "image";
  if (type.startsWith("video/") || /\.(mp4|webm|mov)$/i.test(file.name || "")) return "video";
  if (type.includes("pdf") || type.includes("document") || /\.(pdf|doc|docx|csv)$/i.test(file.name || "")) return "document";
  return "other";
}

function MediaCard({ file, onDelete, onSetPrimary, isPrimary }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileType = getFileType(file);
  const icon = TYPE_ICONS[fileType];
  const iconColor = TYPE_COLORS[fileType];

  return (
    <div className={`group relative bg-[#1a192b] border rounded-xl overflow-hidden transition-all ${isPrimary ? "border-[#8C63F5]" : "border-[#2d2c45] hover:border-[#8C63F5]/40"}`}>
      {isPrimary && (
        <div className="absolute top-2 left-2 z-10 bg-[#8C63F5] text-white text-[9px] font-black px-2 py-0.5 rounded-full">PRIMARY</div>
      )}
      {/* Thumbnail */}
      <div className="aspect-square bg-[#121121] flex items-center justify-center overflow-hidden">
        {fileType === "image" && file.url ? (
          <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
        ) : (
          <span className="material-symbols-outlined text-5xl" style={{ color: iconColor }}>{icon}</span>
        )}
      </div>
      {/* Info */}
      <div className="p-2.5">
        <p className="text-white text-xs font-semibold truncate mb-0.5">{file.name || file.filename || "File"}</p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500">{file.size ? `${(file.size / 1024).toFixed(1)} KB` : fileType}</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${iconColor}20`, color: iconColor }}>{fileType}</span>
        </div>
      </div>
      {/* Actions overlay */}
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity">
        {!isPrimary && fileType === "image" && (
          <button onClick={() => onSetPrimary(file.id)} className="px-3 py-1.5 bg-[#8C63F5] text-white text-xs font-bold rounded-lg hover:bg-[#7c3aed] transition-colors">
            Set Primary
          </button>
        )}
        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} className="px-3 py-1.5 bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold rounded-lg hover:bg-rose-500/30 transition-colors">
            Delete
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => onDelete(file.id)} className="px-3 py-1.5 bg-rose-500 text-white text-xs font-bold rounded-lg">Confirm</button>
            <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 bg-slate-700 text-white text-xs rounded-lg">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MediaLibraryPage() {
  const { id } = useParams();
  const [tab, setTab] = useState("All");
  const [files, setFiles] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState(null);
  const [primaryId, setPrimaryId] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const prodRes = await apiRequest(`/admin/products/${id}`);
        const p = prodRes?.product || prodRes;
        setProduct(p);
        if (p?.images?.length) {
          setFiles(p.images.map(img => ({ id: img.id, url: img.url, name: img.url?.split("/").pop() || "image.jpg", type: "image/jpeg", isPrimary: img.isPrimary })));
          const primary = p.images.find(i => i.isPrimary) || p.images[0];
          if (primary) setPrimaryId(primary.id);
        }
      } catch (err) {
        console.error("Media load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const filteredFiles = files.filter((f) => {
    if (tab === "All") return true;
    const t = getFileType(f);
    if (tab === "Images") return t === "image";
    if (tab === "Videos") return t === "video";
    if (tab === "Documents") return t === "document";
    return true;
  });

  const uploadFiles = useCallback(async (fileList) => {
    const arr = Array.from(fileList);
    if (!arr.length) return;
    setUploading(true);
    try {
      for (const file of arr) {
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });

        const resp = await apiRequest(`/admin/products/${id}/images`, {
          method: "POST",
          body: {
            imageBase64: base64,
            mimeType: file.type || "image/jpeg",
            originalName: file.name
          }
        });

        if (resp && resp.product) {
          const p = resp.product;
          setProduct(p);
          if (p?.images?.length) {
            setFiles(p.images.map(img => ({ id: img.id, url: img.url, name: img.url?.split("/").pop() || "image.jpg", type: "image/jpeg", isPrimary: img.isPrimary })));
            const primary = p.images.find(i => i.isPrimary) || p.images[0];
            if (primary) setPrimaryId(primary.id);
          }
        }
      }
      showToast("Files uploaded successfully!");
    } catch (err) {
      showToast(err.message || "Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  }, [id]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  }, [uploadFiles]);

  const handleDelete = async (fileId) => {
    try {
      await apiRequest(`/admin/products/${id}/images/${fileId}`, { method: "DELETE" });
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      showToast("File deleted.");
    } catch (err) {
      showToast(err.message || "Delete failed.", "error");
    }
  };

  const handleSetPrimary = async (fileId) => {
    try {
      await apiRequest(`/admin/products/${id}/images/${fileId}/primary`, { method: "PATCH" });
      setPrimaryId(fileId);
      showToast("Primary image updated!");
    } catch (err) {
      showToast(err.message || "Failed to set primary.", "error");
      setPrimaryId(fileId); // optimistic
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0910] px-4 py-6 md:px-8">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-xl flex items-center gap-2 ${toast.type === "error" ? "bg-rose-500/20 border border-rose-500/40 text-rose-300" : "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"}`}>
          <span className="material-symbols-outlined text-[18px]">{toast.type === "error" ? "error" : "check_circle"}</span>
          {toast.message}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/products" className="hover:text-slate-300 transition-colors">Products</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link href={`/products/${id}`} className="hover:text-slate-300 transition-colors">{product?.name || "Product"}</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-300">Media Library</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Media Library</h1>
          <p className="text-slate-400 text-sm mt-1">Manage product images, videos & documents · {files.length} files</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#8C63F5] hover:bg-[#7c3aed] text-white rounded-xl text-sm font-black shadow-lg shadow-[#8C63F5]/20 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">upload</span>
            Upload Files
          </button>
          <Link href={`/products/${id}/media`} className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-[#1a192b] border border-[#2d2c45] text-slate-300 rounded-xl text-sm font-bold hover:border-[#8C63F5]/40 transition-colors">
            <span className="material-symbols-outlined text-[18px]">view_module</span>
            View
          </Link>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center mb-6 transition-all ${dragOver ? "border-[#8C63F5] bg-[#8C63F5]/5" : "border-[#2d2c45] hover:border-[#8C63F5]/40"}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <input ref={fileInputRef} type="file" multiple className="hidden" accept="image/*,video/*,.pdf,.doc,.docx,.csv" onChange={(e) => uploadFiles(e.target.files)} />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#8C63F5] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#8C63F5] font-bold text-sm">Uploading files...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 cursor-pointer">
            <div className="w-14 h-14 bg-[#8C63F5]/10 border border-[#8C63F5]/30 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[#8C63F5] text-[28px]">cloud_upload</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Drag & drop files here</p>
              <p className="text-slate-500 text-xs mt-1">or click to browse · PNG, JPG, MP4, PDF, CSV</p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#121121] border border-[#2d2c45] rounded-xl p-1 mb-5 w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === t ? "bg-[#8C63F5] text-white" : "text-slate-400 hover:text-white"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-[#121121] border border-[#2d2c45] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-600 mb-4">photo_library</span>
          <p className="text-white font-bold mb-1">No {tab !== "All" ? tab.toLowerCase() : "files"} yet</p>
          <p className="text-slate-500 text-sm">Upload files to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredFiles.map((file) => (
            <MediaCard
              key={file.id}
              file={file}
              onDelete={handleDelete}
              onSetPrimary={handleSetPrimary}
              isPrimary={file.id === primaryId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
