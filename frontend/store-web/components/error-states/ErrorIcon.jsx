import React from "react";

export function ErrorIcon({ type }) {
  // Map types to Google Material Symbols
  let iconName = "error";
  let iconColor = "text-slate-400";
  let bgColor = "bg-[#1a192b]";
  let borderColor = "border-[#2d2c45]";
  let animation = "";

  switch (type) {
    case "not-found":
      iconName = "travel_explore";
      iconColor = "text-[#8C63F5]";
      animation = "animate-bounce";
      break;
    case "server-error":
      iconName = "dns";
      iconColor = "text-rose-500";
      animation = "animate-pulse";
      break;
    case "network-error":
      iconName = "wifi_off";
      iconColor = "text-amber-500";
      animation = "animate-pulse";
      break;
    case "account-locked":
      iconName = "lock";
      iconColor = "text-amber-500";
      animation = "animate-bounce"; // Or a custom shake animation if we had one
      break;
    case "session-expired":
      iconName = "hourglass_empty";
      iconColor = "text-[#8C63F5]";
      animation = "animate-[spin_4s_linear_infinite]";
      break;
    default:
      break;
  }

  return (
    <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center mb-8 border-4 ${bgColor} ${borderColor}`}>
      <span className={`material-symbols-outlined text-[80px] ${iconColor} ${animation}`}>
        {iconName}
      </span>
    </div>
  );
}
