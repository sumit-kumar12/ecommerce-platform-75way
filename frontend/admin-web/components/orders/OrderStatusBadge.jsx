export function OrderStatusBadge({ status }) {
  const getStyle = () => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20";
      case "PROCESSING":
        return "bg-[#8C63F5]/10 text-[#8C63F5] border-[#8C63F5]/20";
      case "SHIPPED":
        return "bg-[#00DAFF]/10 text-[#00DAFF] border-[#00DAFF]/20";
      case "DELIVERED":
        return "bg-[#10B861]/10 text-[#10B861] border-[#10B861]/20";
      case "CANCELLED":
        return "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const getIcon = () => {
    switch (status?.toUpperCase()) {
      case "PENDING": return "pending_actions";
      case "PROCESSING": return "autorenew";
      case "SHIPPED": return "local_shipping";
      case "DELIVERED": return "check_circle";
      case "CANCELLED": return "cancel";
      default: return "help";
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStyle()}`}>
      <span className="material-symbols-outlined text-[14px]">{getIcon()}</span>
      {status || "UNKNOWN"}
    </span>
  );
}
