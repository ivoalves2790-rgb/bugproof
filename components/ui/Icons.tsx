import React, { type SVGAttributes } from "react";

type IconProps = SVGAttributes<SVGElement> & { size?: number };

const defaultProps = (size: number = 20): SVGAttributes<SVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function IconHome({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
    </svg>
  );
}

export function IconBook({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

export function IconSearch({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

export function IconUser({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function IconHeart({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props} fill="currentColor" stroke="none">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

export function IconFlame({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props} fill="currentColor" stroke="none">
      <path d="M12 23c-3.5 0-7-2.5-7-7 0-3 1.5-5.5 3-7.5.6-.8 1.2-1.5 1.7-2.2.2-.3.6-.3.8 0 .5.7 1 1.5 1.5 2.3 1.5 2.3 3 4.8 3 7.4 0 1-.3 2-.8 2.8-.2.3-.1.7.2.9.3.2.7.1.9-.2A5 5 0 0016 16c0-2-1-4-2-5.5-.2-.3-.1-.7.2-.9.3-.2.7-.1.9.2C16.5 11.8 19 14.5 19 16c0 4.5-3.5 7-7 7z" />
    </svg>
  );
}

export function IconStar({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props} fill="currentColor" stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function IconTerminal({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

export function IconGitBranch({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 01-9 9" />
    </svg>
  );
}

export function IconBug({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M8 2l1.88 1.88M14.12 3.88L16 2M9 7.13v-1a3.003 3.003 0 116 0v1" />
      <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 014-4h4a4 4 0 014 4v3c0 3.3-2.7 6-6 6z" />
      <path d="M12 20v-9M6.53 9C4.6 8.8 3 7.1 3 5M6 13H2M3 21c0-2.1 1.7-3.9 3.8-4M20.97 5c0 2.1-1.6 3.8-3.5 4M22 13h-4M17.2 17c2.1.1 3.8 1.9 3.8 4" />
    </svg>
  );
}

export function IconShield({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function IconServer({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

export function IconDatabase({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

export function IconCloud({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
    </svg>
  );
}

export function IconCheckCircle({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export function IconZap({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export function IconFolderCode({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
      <path d="M10 13l-2 2 2 2M14 13l2 2-2 2" />
    </svg>
  );
}

export function IconBot({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4M8 16h0M16 16h0" />
    </svg>
  );
}

export function IconChevronRight({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function IconChevronLeft({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function IconX({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function IconSettings({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

export function IconThumbsUp({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
    </svg>
  );
}

export function IconThumbsDown({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />
    </svg>
  );
}

export function IconHammer({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M15 12l-8.5 8.5a2.12 2.12 0 01-3-3L12 9" />
      <path d="M17.64 15L22 10.64" />
      <path d="M20.91 11.7l-1.25-1.25a2.12 2.12 0 00-3 0L14 13.17" />
      <path d="M18.71 7.21a3.75 3.75 0 00-5.3 0L12 8.62" />
    </svg>
  );
}

export function IconLock({ size, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

// Map icon name to component
export const COURSE_ICONS: Record<string, (props: IconProps) => React.ReactElement> = {
  "git-branch": IconGitBranch,
  bug: IconBug,
  shield: IconShield,
  server: IconServer,
  database: IconDatabase,
  cloud: IconCloud,
  "check-circle": IconCheckCircle,
  zap: IconZap,
  "folder-code": IconFolderCode,
  bot: IconBot,
  terminal: IconTerminal,
};
