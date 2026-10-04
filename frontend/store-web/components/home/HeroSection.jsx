"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiRequest } from "../../lib/api";

export default function HeroSection() {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const payload = await apiRequest("/campaigns", { csrf: false });
        const campaigns = payload.campaigns || [];
        if (campaigns.length > 0) {
          setCampaign(campaigns[0]);
        }
      } catch (err) {
        console.error("Failed to load campaigns:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-[#110] to-[#121] overflow-hidden pt-16 pb-12 md:pt-32 md:pb-24">
      {/* Background with gradient and glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-[#8B5CF6]/20 rounded-full blur-[80px] md:blur-[120px] opacity-50 pointer-events-none"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10 bg-repeat bg-[length:30px_30px] md:bg-[length:40px_40px] pointer-events-none"></div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16">
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left max-w-2xl">
          <span className="inline-block px-3 py-1 mb-3 md:mb-4 text-xs md:text-sm font-medium rounded-full bg-purple-500/10 text-purple-400">
            {campaign ? campaign.name : "Premium Marketplace"}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
            {campaign ? (
              <>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
                  {campaign.title || "Special Offer"}
                </span>
                <br/>
                Don't Miss Out.
              </>
            ) : (
              <>
                Shop Smart. <br/>
                Shop Secure. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
                  Shop Katabazaar.
                </span>
              </>
            )}
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 md:mb-8 max-w-xl mx-auto md:mx-0 line-clamp-3">
            {campaign && campaign.description 
              ? campaign.description 
              : "Premium products. Trusted by millions. Protected by next-gen security."}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 justify-center md:justify-start">
            <Link 
              href="/products" 
              className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-3.5 bg-[#8B5CF6] hover:bg-[#7e53db] text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all transform hover:scale-[1.02] text-sm md:text-base"
            >
              Shop Now
            </Link>
            <Link 
              href="/deals" 
              className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-3.5 bg-transparent border border-white/20 text-white hover:border-[#8B5CF6]/50 hover:bg-white/5 transition-all font-semibold rounded-lg text-sm md:text-base"
            >
              Explore Deals
            </Link>
          </div>
        </div>

        {/* Right Graphic */}
        <div className="flex-1 flex justify-center relative w-full max-w-sm sm:max-w-md md:max-w-none mt-8 md:mt-0">
          {campaign && campaign.mediaBase64 ? (
            <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[400px] md:max-w-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/20 to-transparent rounded-2xl blur-xl md:blur-2xl"></div>
              <img 
                src={`data:image/jpeg;base64,${campaign.mediaBase64}`} 
                alt={campaign.name}
                className="relative z-10 w-full h-full object-cover rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.15)] md:shadow-[0_0_40px_rgba(139,92,246,0.15)] border border-[#8B5CF6]/20"
              />
            </div>
          ) : (
            <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[400px] md:max-w-[500px]">
              {/* Pulsing ring behind shield */}
              <div className="absolute inset-2 md:inset-4 rounded-full border border-[#8B5CF6]/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/20 to-transparent rounded-full blur-xl md:blur-2xl"></div>
              
              {/* The 3D Shield / Premium Graphic */}
              <div className="relative z-10 w-full h-full flex items-center justify-center backdrop-blur-sm border border-[#8B5CF6]/20 rounded-full bg-white/5 shadow-[0_0_30px_rgba(139,92,246,0.15)] md:shadow-[0_0_40px_rgba(139,92,246,0.15)] overflow-hidden">
                 <img 
                   src="/images/hero-graphic.jpg" 
                   alt="Premium Marketplace"
                   className="w-full h-full object-cover scale-[1.02]"
                 />
              </div>
              
              {/* Floating particles (simulated with absolute divs) */}
              <div className="absolute top-5 md:top-10 left-5 md:left-10 w-2 md:w-3 h-2 md:h-3 bg-[#10B861] rounded-full blur-[1px] animate-pulse"></div>
              <div className="absolute bottom-10 md:bottom-20 right-5 md:right-10 w-3 md:w-4 h-3 md:h-4 bg-[#8B5CF6] rounded-full blur-[2px] animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 -right-2 md:-right-4 w-1.5 md:w-2 h-1.5 md:h-2 bg-[#F59E0B] rounded-full blur-[1px] animate-bounce"></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
