"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DesignSystemRoot() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/design-system/foundations");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="w-6 h-6 border-[2px] border-slate-200 border-t-indigo-650 rounded-full animate-spin"></div>
    </div>
  );
}

