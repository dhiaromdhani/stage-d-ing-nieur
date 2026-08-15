const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const IconHome = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} {...base} className={p.className}>
    <polyline points="4 11 12 4 20 11" />
    <path d="M6 10v9h5v-5h2v5h5v-9" />
  </svg>
);

export const IconList = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} {...base} className={p.className}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <line x1="8" y1="9" x2="16" y2="9" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="13" y2="17" />
  </svg>
);

export const IconPlusCircle = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} {...base} className={p.className}>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export const IconCheckCircle = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} {...base} className={p.className}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="8 12 11 15 16 9" />
  </svg>
);

export const IconBarChart = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} {...base} className={p.className}>
    <line x1="6" y1="20" x2="6" y2="12" />
    <line x1="12" y1="20" x2="12" y2="6" />
    <line x1="18" y1="20" x2="18" y2="15" />
    <line x1="3" y1="20" x2="21" y2="20" />
  </svg>
);

export const IconPieChart = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} {...base} className={p.className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v9l7 4" />
  </svg>
);

export const IconCalendarPlus = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} {...base} className={p.className}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="8" y1="3" x2="8" y2="7" />
    <line x1="16" y1="3" x2="16" y2="7" />
    <line x1="12" y1="13" x2="12" y2="17" />
    <line x1="10" y1="15" x2="14" y2="15" />
  </svg>
);

export const IconFileText = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} {...base} className={p.className}>
    <path d="M7 3h7l5 5v13H7z" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="15" y2="16" />
  </svg>
);

export const IconLogOut = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} {...base} className={p.className}>
    <path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export const IconBell = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} {...base} className={p.className}>
    <path d="M6 10a6 6 0 0 1 12 0c0 4 2 5 2 5H4s2-1 2-5" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
);

export const IconMapPin = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} {...base} className={p.className}>
    <path d="M12 21s7-6.5 7-11a7 7 0 0 0-14 0c0 4.5 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const IconCalendar = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} {...base} className={p.className}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="8" y1="3" x2="8" y2="7" />
    <line x1="16" y1="3" x2="16" y2="7" />
  </svg>
);

export const IconTarget = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} {...base} className={p.className}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

export const IconGraduationCap = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 22} height={p.size || 22} {...base} className={p.className}>
    <path d="M2 9l10-5 10 5-10 5-10-5z" />
    <path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
  </svg>
);

export const IconUsers = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 22} height={p.size || 22} {...base} className={p.className}>
    <circle cx="9" cy="8" r="3" />
    <path d="M2 20c0-3.3 3-6 7-6s7 2.7 7 6" />
    <circle cx="17" cy="8" r="2.5" />
    <path d="M22 20c0-2.5-2-4.7-4.5-5.5" />
  </svg>
);

export const IconWrench = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 22} height={p.size || 22} {...base} className={p.className}>
    <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-2 2 1 1 2-2" />
  </svg>
);

export const IconMic = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 22} height={p.size || 22} {...base} className={p.className}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="9" y1="22" x2="15" y2="22" />
  </svg>
);

export const IconCheck = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 14} height={p.size || 14} {...base} className={p.className}>
    <polyline points="5 13 9 17 19 7" />
  </svg>
);

export const IconX = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 14} height={p.size || 14} {...base} className={p.className}>
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

export const IconInbox = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} {...base} className={p.className}>
    <path d="M4 12h4l2 3h4l2-3h4" />
    <path d="M4 12l1.5-7A2 2 0 0 1 7.4 3.5h9.2A2 2 0 0 1 18.5 5L20 12" />
    <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
  </svg>
);


export const IconAlertTriangle = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 14} height={p.size || 14} {...base} className={p.className}>
    <path d="M12 3.5l9.5 16.5H2.5L12 3.5z" />
    <line x1="12" y1="9.5" x2="12" y2="14" />
    <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconChevronDown = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 12} height={p.size || 12} {...base} className={p.className}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const IconChevronRight = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 12} height={p.size || 12} {...base} className={p.className}>
    <polyline points="9 6 15 12 9 18" />
  </svg>
);

export const IconMenu = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 20} height={p.size || 20} {...base} className={p.className}>
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="17" x2="20" y2="17" />
  </svg>
);

export const IconChevronLeft = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} {...base} className={p.className}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export const IconFilePdf = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 40} height={p.size || 40} fill="none" className={p.className}>
    <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" fill="#D32F2F" />
    <path d="M14 3v5h5" fill="#B02525" />
    <text x="12" y="17" textAnchor="middle" fontSize="6" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif">PDF</text>
  </svg>
);

export const IconFolder = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 40} height={p.size || 40} fill="none" className={p.className}>
    <path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" fill="#F2A93B" stroke="#D98C1A" strokeWidth="0.5" />
    <path d="M3 9h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" fill="#FBC55C" />
  </svg>
);

export const IconArrowRight = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} {...base} className={p.className}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  </svg>
);
export const IconCoins = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} {...base} className={p.className}>
    <circle cx="9" cy="9" r="5.5" />
    <path d="M14.5 6.5A5.5 5.5 0 1 1 9 17.5" />
  </svg>
);

export const IconClock = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} {...base} className={p.className}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 16 14" />
  </svg>
);