export const BrokenRobot = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="70" y="80" width="60" height="50" rx="8" fill="#94A3B8" />
    <circle cx="85" cy="100" r="8" fill="#EF4444" className="animate-pulse" />
    <circle cx="115" cy="100" r="8" fill="#1E293B" />
    <path d="M85 115h30" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
    <path d="M100 80V60" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
    <circle cx="100" cy="55" r="5" fill="#F59E0B" />
    <path d="M70 105H50M130 105h20" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" />
    <path d="M85 130v30M115 130v30" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" />
    <path d="M140 70l10-10M150 80l15-5M135 90l10 10" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
  </svg>
);
