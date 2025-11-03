
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

export const IconMagic: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={`${iconProps.className} ${className}`}>
        <path d="M12 3v18M18.36 5.64l-12.72 12.72M5.64 5.64l12.72 12.72M21 12H3"/>
        <path d="M12 3l2 4l4 2l-4 2l-2 4l-2-4l-4-2l4-2z"/>
    </svg>
);

export const IconSkill: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={`${iconProps.className} ${className}`}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

export const IconItem: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={`${iconProps.className} ${className}`}>
        <path d="M12 2 L12 5" />
        <path d="M15 5 L9 5" />
        <path d="M10 5 C10 2 14 2 14 5" />
        <path d="M8 8 C8 6 16 6 16 8 L16 19 C16 21 15 22 14 22 L10 22 C9 22 8 21 8 19 Z" />
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
