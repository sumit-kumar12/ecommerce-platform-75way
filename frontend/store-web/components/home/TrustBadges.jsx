export default function TrustBadges() {
  const badges = [
    { icon: "verified_user", title: "100% Secure Shopping" },
    { icon: "account_balance_wallet", title: "Pay on Delivery Available" },
    { icon: "restart_alt", title: "Easy Returns 7 Days Policy" },
    { icon: "workspace_premium", title: "Best Price Guarantee" },
  ];

  return (
    <section className="border-y border-white/10 bg-[#0F0E17]">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-2 lg:flex lg:flex-row items-center justify-between py-4 gap-4 md:gap-6">
          {badges.map((badge, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-3 w-full lg:w-auto justify-center lg:justify-start">
              <span className="material-symbols-outlined text-xl md:text-2xl text-[#8B5CF6]">{badge.icon}</span>
              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-300 whitespace-normal sm:whitespace-nowrap leading-tight">{badge.title}</span>
              {/* Divider on desktop */}
              {i < badges.length - 1 && (
                <div className="hidden lg:block w-px h-6 bg-white/10 ml-6 xl:ml-12"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
