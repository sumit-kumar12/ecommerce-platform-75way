import Image from "next/image";
import { BrandConfig } from "./branding";

export function BrandLogo({ width = 40, height = 40, className = "", showText = true, isAdmin = false }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center overflow-hidden rounded-lg" style={{ width, height }}>
        <Image 
          src={BrandConfig.logoSrc} 
          alt={BrandConfig.name} 
          width={768} 
          height={768} 
          className="w-full h-full object-contain"
          priority
        />
      </div>
      {showText && (
        <span className="font-bold tracking-tight text-current">
          {BrandConfig.name}
        </span>
      )}
    </div>
  );
}
