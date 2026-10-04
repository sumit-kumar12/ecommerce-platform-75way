export const Astronaut = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="#8C63F5" fillOpacity="0.1" />
    <path d="M140 100c0 22.091-17.909 40-40 40s-40-17.909-40-40 17.909-40 40-40 40 17.909 40 40z" fill="#E2E8F0" />
    <path d="M130 100c0 16.569-13.431 30-30 30S70 116.569 70 100s13.431-30 30-30 30 13.431 30 30z" fill="#0F0E17" />
    <path d="M85 90h30v20H85V90z" fill="#8C63F5" />
    <path d="M100 140v20M80 160h40M70 100H50M150 100h-10" stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" />
    <circle cx="150" cy="50" r="10" fill="#8C63F5" className="animate-pulse" />
    <circle cx="40" cy="140" r="6" fill="#F59E0B" className="animate-bounce" />
  </svg>
);
