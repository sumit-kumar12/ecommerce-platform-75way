export const Lock = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="60" y="90" width="80" height="70" rx="10" fill="#8C63F5" />
    <path d="M70 90V70a30 30 0 1160 0v20" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />
    <circle cx="100" cy="120" r="8" fill="#FFFFFF" />
    <path d="M96 120h8v20h-8z" fill="#FFFFFF" />
    <path d="M140 160h10M50 160h10M160 140v10M40 140v10" stroke="#8C63F5" strokeWidth="4" strokeLinecap="round" opacity="0.5" className="animate-pulse" />
  </svg>
);
