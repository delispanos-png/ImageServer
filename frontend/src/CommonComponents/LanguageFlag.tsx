import type { CSSProperties } from 'react';

export type LanguageFlagCode = 'en' | 'el';

interface LanguageFlagProps {
  language: LanguageFlagCode;
  className?: string;
  style?: CSSProperties;
}

const FLAG_STYLE: CSSProperties = {
  width: 18,
  height: 12,
  borderRadius: 2,
  boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.08)',
  flexShrink: 0,
};

export default function LanguageFlag({ language, className, style }: LanguageFlagProps) {
  if (language === 'el') {
    return (
      <svg viewBox="0 0 27 18" aria-hidden="true" className={className} style={{ ...FLAG_STYLE, ...style }}>
        <rect width="27" height="18" fill="#0d5eaf" />
        <rect y="2" width="27" height="2" fill="#ffffff" />
        <rect y="6" width="27" height="2" fill="#ffffff" />
        <rect y="10" width="27" height="2" fill="#ffffff" />
        <rect y="14" width="27" height="2" fill="#ffffff" />
        <rect width="10" height="10" fill="#0d5eaf" />
        <rect x="4" width="2" height="10" fill="#ffffff" />
        <rect y="4" width="10" height="2" fill="#ffffff" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 27 18" aria-hidden="true" className={className} style={{ ...FLAG_STYLE, ...style }}>
      <rect width="27" height="18" fill="#0a4ea1" />
      <polygon points="0,0 3,0 27,14 27,18 24,18 0,4" fill="#ffffff" />
      <polygon points="27,0 24,0 0,14 0,18 3,18 27,4" fill="#ffffff" />
      <polygon points="0,0 1.5,0 27,15 27,18 25.5,18 0,3" fill="#d3202a" />
      <polygon points="27,0 25.5,0 0,15 0,18 1.5,18 27,3" fill="#d3202a" />
      <rect x="11" width="5" height="18" fill="#ffffff" />
      <rect y="6.5" width="27" height="5" fill="#ffffff" />
      <rect x="12" width="3" height="18" fill="#d3202a" />
      <rect y="7.5" width="27" height="3" fill="#d3202a" />
    </svg>
  );
}
