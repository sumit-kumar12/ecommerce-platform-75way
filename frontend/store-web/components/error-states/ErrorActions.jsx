import React from "react";
import Link from "next/link";

export function ErrorActions({ children }) {
  return (
    <div className="flex flex-col md:flex-row justify-center gap-4 mt-12 w-full">
      {children}
    </div>
  );
}

export function PrimaryButton({ href, onClick, children }) {
  const className = "w-full md:w-auto bg-[#8C63F5] hover:bg-[#7c3aed] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-[#8C63F5]/20 flex justify-center items-center";
  
  if (href) {
    return <Link href={href} className={className}>{children}</Link>;
  }
  return <button onClick={onClick} className={className}>{children}</button>;
}

export function OutlineButton({ href, onClick, children }) {
  const className = "w-full md:w-auto bg-transparent border border-[#8C63F5] text-[#8C63F5] hover:bg-[#8C63F5]/10 font-bold py-3 px-8 rounded-xl transition-all flex justify-center items-center";
  
  if (href) {
    return <Link href={href} className={className}>{children}</Link>;
  }
  return <button onClick={onClick} className={className}>{children}</button>;
}
