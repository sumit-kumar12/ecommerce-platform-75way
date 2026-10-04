"use client";

import { useState } from "react";

export function ProfileAvatar({ user }) {
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "https://ui-avatars.com/api/?name=John+Doe&background=random");

  const handleFileChange = (e) => {
    // In a real app, upload this file to a server/CDN
    // Here we'll just use a local object URL for preview
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setAvatarUrl(url);
    }
  };

  return (
    <div className="bg-[#1a192b] border border-[#2d2c45] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-8">
      <div className="relative group cursor-pointer">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-[#8C63F5] to-[#00DAFF] p-1 shadow-xl shadow-[#8C63F5]/20">
          <div className="w-full h-full bg-[#121121] rounded-full overflow-hidden border-4 border-[#121121]">
            <img src={avatarUrl} alt="Profile Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
        
        {/* Overlay hover state */}
        <div className="absolute inset-1 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
        </div>
        
        <input 
          type="file" 
          accept="image/*" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          onChange={handleFileChange}
        />
      </div>

      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-bold text-white mb-2">Profile Picture</h2>
        <p className="text-slate-400 text-sm max-w-md mb-4">
          We recommend an image of at least 400x400px. You can upload a JPG, GIF, or PNG file. Max size 5MB.
        </p>
        <div className="flex flex-wrap justify-center sm:justify-start gap-3">
          <button className="bg-[#8C63F5] hover:bg-[#6a64f1] text-white px-5 py-2 rounded-xl font-bold transition-colors shadow-lg shadow-[#8C63F5]/20 relative overflow-hidden">
            <span className="relative z-10 pointer-events-none">Change Photo</span>
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
              onChange={handleFileChange}
            />
          </button>
          <button 
            className="bg-[#121121] border border-[#2d2c45] text-rose-400 hover:text-rose-300 px-5 py-2 rounded-xl font-bold transition-colors"
            onClick={() => setAvatarUrl("https://ui-avatars.com/api/?name=John+Doe&background=random")}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
