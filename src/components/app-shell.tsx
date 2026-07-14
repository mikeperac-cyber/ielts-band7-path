"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Flag,
  LayoutDashboard,
  Menu,
  Settings,
  Target,
  X,
  Timer
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { href: "/dashboard",   label: "Dashboard",      icon: LayoutDashboard },
  { href: "/programme",   label: "Programme",       icon: CalendarDays },
  { href: "/learn/1/1",   label: "Lessons",         icon: BookOpen },
  { href: "/mocks/1/1",   label: "Diagnostics",     icon: ClipboardCheck },
  { href: "/tracker",     label: "Lexical tracker", icon: BarChart3 },
  { href: "/error-log",   label: "Error log",       icon: Flag },
];

/** SVG circular progress ring for the band widget */
function BandRing({ current, target }: { current: number; target: number }) {
  const r = 22;
  const circ = 2 * Math.PI * r; // ≈ 138.2
  const progress = Math.max(0, Math.min(1, (current - 4) / (target - 4))); // 4 = lowest band
  const offset = circ * (1 - progress);
  return (
    <svg width="54" height="54" viewBox="0 0 54 54" style={{ flexShrink: 0 }}>
      <circle cx="27" cy="27" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5" />
      <circle
        cx="27"
        cy="27"
        r={r}
        fill="none"
        stroke="url(#ring-grad)"
        strokeWidth="5"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 27 27)"
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
      />
      <defs>
        <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#64b7ff" />
          <stop offset="100%" stopColor="#1a8fe0" />
        </linearGradient>
      </defs>
      <text x="27" y="32" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" fontFamily="serif">
        {current}
      </text>
    </svg>
  );
}

export function AppShell({ title, testDate, currentBand, children }: { title: string; testDate?: string | null; currentBand: number; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  // Calculate days remaining
  let daysRemaining = null;
  if (testDate) {
    const target = new Date(testDate);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  // Determine dynamic theme class
  let themeClass = "";
  if (pathname.startsWith("/learn")) themeClass = "theme-learn";
  else if (pathname.startsWith("/mocks")) themeClass = "theme-mocks";
  else if (pathname.startsWith("/dashboard")) themeClass = "theme-dashboard";

  return (
    <div className={`app-frame ${themeClass}`}>
      {/* Mobile hamburger */}
      <button
        className="mobile-menu-button"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
      >
        <Menu size={22} />
      </button>

      {/* Mobile backdrop blur overlay */}
      <div
        className={`sidebar-backdrop ${open ? "is-open" : ""}`}
        aria-hidden="true"
        onClick={close}
      />

      {/* Sidebar */}
      <aside
        className={`app-sidebar ${themeClass} ${open ? "is-open" : ""}`}
        aria-label="Programme navigation"
      >
        {/* Brand */}
        <div className="brand-lockup">
          <span className="brand-mark">
            <BookOpen size={20} />
          </span>
          <span>
            <strong>IELTS</strong>
            <small>ACADEMIC</small>
          </span>
          <button className="sidebar-close" aria-label="Close navigation" onClick={close}>
            <X size={20} />
          </button>
        </div>

        <p className="brand-subtitle">Band 9 Path</p>

        {/* Nav items */}
        <nav className="sidebar-nav">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={pathname === href || pathname.startsWith(href.replace("/1/1", "")) ? "active" : ""}
              onClick={close}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Target band + progress ring */}
        <div className="sidebar-target">
          <Target size={19} />
          <div>
            <span>Target band</span>
            <strong>9.0 Overall</strong>
          </div>
          <div className="band-ring-wrap" style={{ clear: "both" }}>
            <BandRing current={currentBand} target={9} />
            <div className="band-ring-labels">
              <span>Current</span>
              <strong>{currentBand.toFixed(1)}</strong>
              <small>→ 9.0 target</small>
            </div>
          </div>
        </div>

        {/* Test Date Countdown */}
        {daysRemaining !== null && (
          <div className="test-date-countdown" aria-label={`${daysRemaining} days until test date`}>
            <Timer size={20} />
            <div>
              <strong>Test date</strong>
              <span>{daysRemaining} days remaining</span>
            </div>
          </div>
        )}

        {/* Settings link */}
        <Link className="sidebar-settings" href="/settings">
          <Settings size={18} />
          Settings
          <ChevronRight size={16} />
        </Link>
      </aside>

      {/* Main content */}
      <main className="app-main">
        {/* Topbar */}
        <header className="app-topbar">
          <span className="topbar-title">{title}</span>
          <div className="topbar-right">
            <ThemeToggle />
            {/* Profile avatar */}
            <Link href="/settings" className="profile-dot" aria-label="Open settings">
              {title.includes("Welcome back") ? title.split(", ")[1]?.[0]?.toUpperCase() ?? "A" : "A"}
            </Link>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

export function SectionHeading({
  number,
  title,
  action,
}: {
  number?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-heading">
      {number && <span className="section-number">{number}</span>}
      <h2>{title}</h2>
      {action && <div className="section-action">{action}</div>}
    </div>
  );
}

export function Metric({
  label,
  value,
  detail,
  icon: Icon,
  progress = 0,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof FileText;
  progress?: number;
}) {
  const barWidth = `${Math.max(0, Math.min(100, progress))}%`;
  return (
    <article className="metric">
      <Icon size={19} />
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
      <div className="metric-bar">
        <i style={{ "--bar-target": barWidth } as React.CSSProperties} />
      </div>
    </article>
  );
}
