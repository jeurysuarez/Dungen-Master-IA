
import React from 'react';

const iconProps = {
  className: "w-6 h-6 inline-block",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round" as "round",
  strokeLinejoin: "round" as "round",
};

export const IconSword: React.FC = () => (
  <svg {...iconProps}>
    <path d="M14.5 17.5l-10-10" />
    <path d="M20 6.5l-5.5 5.5" />
    <path d="M21 3l-3 3" />
    <path d="M3 21l3-3" />
  </svg>
);

export const IconScroll: React.FC = () => (
  <svg {...iconProps}>
    <path d="M8 21h12a2 2 0 002-2v-2H10v2a2 2 0 11-4 0V5a2 2 0 10-4 0v3h10" />
    <path d="M19 17V5a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2h4" />
  </svg>
);

export const IconDagger: React.FC = () => (
  <svg {...iconProps}>
    <path d="M5 15l7-7 3 3-7 7-3-3z" />
    <path d="M15 6l-3-3 7-4 4 7-4 7-3-3" />
  </svg>
);

export const IconCross: React.FC = () => (
  <svg {...iconProps}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

export const IconSoundOn: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>
);

export const IconSoundOff: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="1" x2="1" y2="23"></line>
    </svg>
);
