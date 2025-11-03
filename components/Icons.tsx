import React from 'react';

const Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {props.children}
  </svg>
);

export const IconSword: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="m15.2 3.8-3.5 3.5 2.8 2.8 3.5-3.5-2.8-2.8z"/><path d="M12 7.4 2 17.4l3.1 3.1 10-10L12 7.4z"/><path d="m5.1 20.5 3.1-3.1"/><path d="m16.6 8.8 3.1-3.1"/></Icon>
);
export const IconSparkles: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M9.9 2.2 11 0l1.1 2.2 2.2 1.1-2.2 1.1L11 6.6 9.9 4.4 7.7 3.3l2.2-1.1zM22 13l-2.2-1.1-1.1-2.2-1.1 2.2L15.4 13l2.2 1.1 1.1 2.2 1.1-2.2 2.2-1.1zM11 24l-1.1-2.2-2.2-1.1 2.2-1.1L11 17.4l1.1 2.2 2.2 1.1-2.2 1.1L11 24zM2.2 14.1 0 13l2.2-1.1L3.3 9.7l1.1 2.2 2.2 1.1-2.2 1.1-1.1 2.2z"/></Icon>
);
export const IconShadow: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M12 3a9 9 0 0 0-9 9c0 1.4.3 2.7.9 3.9L3 21l5.1-1.1c1.2.5 2.5.8 3.9.8a9 9 0 0 0 9-9 9 9 0 0 0-9-9z"/><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></Icon>
);
export const IconCross: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M12 5v14M5 12h14"/></Icon>
);
export const IconHeart: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props} fill="currentColor"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1 7.8 7.8 7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></Icon>
);
export const IconBook: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v2H6.5a2.5 2.5 0 0 1 0 5H20v2H6.5A2.5 2.5 0 0 1 4 19.5z"/><path d="M4 2v20"/><path d="M20 2v20"/></Icon>
);
export const IconAnvil: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M7 10H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4"/><path d="M11 4L6 9"/><path d="M13 2 8 7"/><path d="M21 8a5 5 0 0 0-9.3 2.7l.2 1.3H10a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2.8l-1.3 1.3a2 2 0 0 0 0 2.8 2 2 0 0 0 2.8 0L20 12l1-1V8z"/></Icon>
);
export const IconBattleaxe: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="m14 12-8.5 8.5a2.1 2.1 0 1 1-3-3L11 9"/><path d="M15 13 9 7l4-4 6 6h3l-3 3z"/></Icon>
);
export const IconFootprint: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 16.8V11a2 2 0 1 1 4 0v5.8"/><path d="M13 20V12a2 2 0 1 1 4 0v8"/><path d="M7 18.2a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"/><path d="M16 22a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"/><path d="m12.5 4.5 3 5"/><path d="m10.5 4.5-3 5"/></Icon>
);
export const IconDragon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M12 2c-3 0-5 2-5 4s2 4 5 4c3 0 5-2 5-4s-2-4-5-4z"/><path d="M10 10c-1.5 0-3 1-3 3v4h6v-4c0-2-1.5-3-3-3z"/><path d="M4 14h16"/><path d="M6 22h12"/><path d="M8 18h8"/></Icon>
);
export const IconGear: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 20.7-.7-.7"/><path d="m7.8 17-.7.7"/><path d="m5 7-.7-.7"/><path d="m16.2 7 .7.7"/><path d="M4 12H2"/><path d="M22 12h-2"/><path d="m17 3.3.7-.7"/><path d="m7.8 7 .7-.7"/></Icon>
);
export const IconHandshake: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M11 17a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2Z"/><path d="m5 15-2-2"/><path d="m19 9 2 2"/><path d="M2 13h2"/><path d="M20 11h2"/><path d="m10 7 1-5 1.6 1.4a6.2 6.2 0 0 1 5.2 2.9l1.2 2.2"/></Icon>
);
export const IconFlame: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M12 2c2.8 0 5.6 2.1 6.5 5.5 .9 3.4-1.2 6.8-4.5 8.5-3.3 1.7-7.5 1.7-10.8 0-3.3-1.7-5.4-5.1-4.5-8.5C.4 4.1 3.2 2 6 2c1.7 0 3.3.8 4.5 2.5C11.3 2.8 11.6 2 12 2z"/><path d="M8 14c0 2.2 1.8 4 4 4s4-1.8 4-4-1.8-4-4-4-4 1.8-4 4z"/></Icon>
);
export const IconSoundOn: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></Icon>
);
export const IconSoundOff: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></Icon>
);
export const IconSettings: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></Icon>
);
export const IconUser: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>
);
export const IconTarget: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></Icon>
);
export const IconBackpack: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M8 8V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"/><path d="M16 14h-2a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2h2"/></Icon>
);
export const IconScroll: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h10V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z"/></Icon>
);
export const IconX: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
);
export const IconTreasureChest: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><rect x="2" y="7" width="20" height="13" rx="2" /><path d="M12 12v5" /><path d="M12 7V4" /><path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" /></Icon>
);

export default Icon;

export const SKILL_ICON_MAP: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    Sword: IconSword,
    Sparkles: IconSparkles,
    Shadow: IconShadow,
    Cross: IconCross,
    Heart: IconHeart,
    Book: IconBook,
    Anvil: IconAnvil,
    Battleaxe: IconBattleaxe,
    Footprint: IconFootprint,
    Dragon: IconDragon,
    Gear: IconGear,
    Handshake: IconHandshake,
    Flame: IconFlame,
};