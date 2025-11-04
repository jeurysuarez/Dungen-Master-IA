// Fix: Added SVG icon components and SKILL_ICON_MAP export.
import React from 'react';

// Generic Icon Props
type IconProps = { className?: string; };

export const IconSword: React.FC<IconProps> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 17.5l-10-10l3-3l10 10l-3 3z"/><path d="M5 14l-1 5l5-1"/><path d="M15 9l4-4"/></svg>);
export const IconSnowflake: React.FC<IconProps> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 17.58A5 5 0 0015 15a5 5 0 00-5-5A5 5 0 005 15a5 5 0 00-2.42 9.08"/><path d="M8 15v-3m0 6v-3m4-3v3m0 6v-3m4-3v3m0 6v-3m-8-9l2-2 2 2m-4 6l2-2 2 2"/></svg>);
export const IconDagger: React.FC<IconProps> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 17.5l-10-10l3-3l10 10l-3 3z"/><path d="M5 14l-1.5 1.5M13.5 8.5l-2-2"/></svg>);
export const IconCross: React.FC<IconProps> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>);
export const IconEye: React.FC<IconProps> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>);
export const IconScroll: React.FC<IconProps> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h12a2 2 0 002-2v-2h-3v-5h-2v5H8v2a2 2 0 002 2z"/><path d="M19.5 17.5c0-1.5-2-2.5-2-2.5h-11s-2 1-2 2.5 2 2.5 2 2.5h11s2-1 2-2.5z"/><path d="M4 21V5a2 2 0 012-2h12a2 2 0 012 2v1"/></svg>);
export const IconLeaf: React.FC<IconProps> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 00-10 10c0 3.3 1.7 6.2 4.2 8C10.8 21.3 12 22 12 22s1.2-.7 3.8-2c2.5-1.8 4.2-4.7 4.2-8a10 10 0 00-10-10z"/><path d="M12 12a4 4 0 00-4 4"/></svg>);
export const IconSparkle: React.FC<IconProps> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/></svg>);
export const IconMountain: React.FC<IconProps> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20h18L12 4zM8 12l4 6 4-6"/></svg>);
export const IconHammer: React.FC<IconProps> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 12l-5 5M10 17l-5-5"/><path d="M2 22l5-5"/><path d="M17 7l5 5"/><path d="M9 7l-5 5"/><path d="M22 2l-5 5"/></svg>);
export const IconSkull: React.FC<IconProps> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/></svg>);
export const IconFootprints: React.FC<IconProps> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16v-2.38c0-.62.3-1.21.81-1.61L12 6l7.19 6.01c.51.4.81 1 .81 1.61V16"/><path d="M4 12V8"/><path d="M20 12V8"/><path d="M12 12v-2"/><path d="M7 16v4"/><path d="M17 16v4"/></svg>);

export const IconSoundOn: React.FC<IconProps> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>);
export const IconSoundOff: React.FC<IconProps> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="1" x2="1" y2="23"/></svg>);
export const IconTreasureChest: React.FC<IconProps> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M3 8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4"/><path d="M12 12v4"/><path d="M8 12h8"/></svg>);
export const IconX: React.FC<IconProps> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
export const IconSpinner: React.FC<IconProps> = ({ className }) => (<svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);
export const IconUsers: React.FC<IconProps> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
export const IconSparkles: React.FC<IconProps> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.45 4.1-4.1 1.45 4.1 1.45L12 17l1.45-4.1 4.1-1.45-4.1-1.45Z"/><path d="M5 3v4h4"/><path d="M19 17v4h-4"/></svg>);


// Map from iconName to Component
export const SKILL_ICON_MAP: Record<string, React.FC<IconProps>> = {
    IconSword,
    IconSnowflake,
    IconDagger,
    IconCross,
    IconEye,
    IconScroll,
    IconLeaf,
    IconSparkle,
    IconMountain,
    IconHammer,
    IconSkull,
    IconFootprints,
};