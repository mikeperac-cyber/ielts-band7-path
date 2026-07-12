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
} from "lucide-react";
import { useState, type ReactNode } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/programme", label: "Programme", icon: CalendarDays },
  { href: "/learn/1/1", label: "Lessons", icon: BookOpen },
  { href: "/mocks/1/1", label: "Mock exams", icon: ClipboardCheck },
  { href: "/tracker", label: "Lexical tracker", icon: BarChart3 },
  { href: "/error-log", label: "Error log", icon: Flag },
];

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="app-frame">
      <button className="mobile-menu-button" aria-label="Open navigation" onClick={() => setOpen(true)}>
        <Menu size={22} />
      </button>
      <aside className={`app-sidebar ${open ? "is-open" : ""}`} aria-label="Programme navigation">
        <div className="brand-lockup">
          <span className="brand-mark"><BookOpen size={20} /></span>
          <span><strong>IELTS</strong><small>ACADEMIC</small></span>
          <button className="sidebar-close" aria-label="Close navigation" onClick={() => setOpen(false)}><X size={20} /></button>
        </div>
        <p className="brand-subtitle">Band 7 Path</p>
        <nav className="sidebar-nav">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={pathname === href ? "active" : ""} onClick={() => setOpen(false)}>
              <Icon size={18} /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-target">
          <Target size={19} />
          <div><span>Target band</span><strong>7.0 Overall</strong></div>
          <p>Current estimate <b>6.0</b></p>
        </div>
        <Link className="sidebar-settings" href="/settings"><Settings size={18} /> Settings <ChevronRight size={16} /></Link>
      </aside>
      <main className="app-main">
        <header className="app-topbar"><span>{title}</span><Link href="/settings" className="profile-dot" aria-label="Open settings">A</Link></header>
        {children}
      </main>
    </div>
  );
}

export function SectionHeading({ number, title, action }: { number?: string; title: string; action?: ReactNode }) {
  return <div className="section-heading">{number && <span className="section-number">{number}</span>}<h2>{title}</h2>{action && <div className="section-action">{action}</div>}</div>;
}

export function Metric({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: typeof FileText }) {
  return <article className="metric"><Icon size={19} /><span>{label}</span><strong>{value}</strong><small>{detail}</small><div className="metric-bar"><i style={{ width: value }} /></div></article>;
}
