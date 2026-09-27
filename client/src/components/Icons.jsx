export function Icon({ d, size = 20, className = '' }) {
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d}
    </svg>
  );
}

export const Cake = (p) => <Icon {...p} d={<><path d="M8 14v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M4 14h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M12 6V3"/><path d="M8 6V4"/><path d="M16 6V4"/></>} />;
export const Sparkle = (p) => <Icon {...p} d={<><path d="M12 3l1.2 4.8L18 9l-4.8 1.2L12 15l-1.2-4.8L6 9l4.8-1.2z"/><path d="M19 15l.6 2.4L22 18l-2.4.6L19 21l-.6-2.4L16 18l2.4-.6z"/></>} />;
export const Gift = (p) => <Icon {...p} d={<><rect x="3" y="10" width="18" height="11" rx="2"/><path d="M12 10v11"/><path d="M3 10h18"/><path d="M12 10s-2-5-5-4 1 4 5 4"/><path d="M12 10s2-5 5-4-1 4-5 4"/></>} />;
export const Flower = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="3"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></>} />;
export const Copy = (p) => <Icon {...p} d={<><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></>} />;
export const Eye = (p) => <Icon {...p} d={<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>} />;
export const LinkIcon = (p) => <Icon {...p} d={<><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 1 0 7 7l1-1"/></>} />;
export const Heart = (p) => <Icon {...p} d={<path d="M20 8.5c0 4.5-8 10.5-8 10.5S4 13 4 8.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 1.5z" />} />;
export const Check = (p) => <Icon {...p} d={<path d="M5 12l4 4 10-10" />} />;
export const Trash = (p) => <Icon {...p} d={<><path d="M4 7h16"/><path d="M9 7V5h6v2"/><path d="M7 7l1 13h8l1-13"/></>} />;
export const WhatsApp = (p) => <Icon {...p} d={<><path d="M21 12a9 9 0 0 1-12.6 8.2L4 21l1-4.2A9 9 0 1 1 21 12z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></>} />;
export const ShieldCheck = (p) => <Icon {...p} d={<><path d="M12 3l7 3v6c0 4.4-2.9 8.6-7 10-4.1-1.4-7-5.6-7-10V6l7-3z"/><path d="M9.5 12.5l1.6 1.6 3.4-4"/></>} />;
export const Rocket = (p) => <Icon {...p} d={<><path d="M14 3c3.8 1.2 6.8 4.2 8 8-2.8 1.3-5.4 1.3-8 0L14 3z"/><path d="M9 15l-5 5 4-1 2-4"/><path d="M13 11l5-5"/><path d="M11 13l-5 5"/></>} />;
export const Users = (p) => <Icon {...p} d={<><path d="M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1"/><circle cx="10" cy="7" r="3"/><path d="M20 19v-1a4 4 0 0 0-3-3.87"/><path d="M16 4.13a4 4 0 0 1 0 7.75"/></>} />;
export const Star = (p) => <Icon {...p} d={<path d="M12 2.5l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.8-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 2.5z" />} />;
