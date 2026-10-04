export const Hourglass = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M70 50h60v10l-30 40-30-40V50z" fill="#94A3B8" />
    <path d="M70 150h60v-10l-30-40-30 40v10z" fill="#94A3B8" />
    <path d="M60 40h80v10H60V40z" fill="#1E293B" />
    <path d="M60 150h80v10H60v-10z" fill="#1E293B" />
    <path d="M75 55l25 30 25-30" fill="#F59E0B" fillOpacity="0.5" />
    <path d="M75 145l25-30 25 30H75z" fill="#F59E0B" />
    <circle cx="100" cy="100" r="3" fill="#F59E0B" />
    <path d="M100 100v20" stroke="#F59E0B" strokeWidth="4" strokeDasharray="4 4" className="animate-pulse" />
  </svg>
);
