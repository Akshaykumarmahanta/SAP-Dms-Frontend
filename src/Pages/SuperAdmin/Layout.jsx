import { useState } from "react";
import { useTheme } from "./Superadmincontext";

// ── SAP DMS Logo ──────────────────────────────────────────────
function DmsLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="2"  y="2"  width="7" height="9" rx="1" fill="white" />
      <rect x="11" y="2"  width="7" height="5" rx="1" fill="white" />
      <rect x="11" y="9"  width="7" height="9" rx="1" fill="white" />
      <rect x="2"  y="13" width="7" height="5" rx="1" fill="white" />
    </svg>
  );
}

// ── Nav icons (inline SVG, no external dep) ───────────────────
const ICONS = {
  dashboard:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>,
  tenants:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  odata:      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>,
  users:      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  departments: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
  audit:      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  settings:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  billing:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  logout:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  bell:       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  sun:        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  moon:       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  menu:       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close:      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

const NAV_MAIN = [
  { key: "dashboard",  label: "Dashboard",     icon: "dashboard" },
  { key: "tenants",    label: "Tenants",        icon: "tenants",  badge: 3 },
  { key: "odata",      label: "OData Plugins",  icon: "odata" },
  { key: "users",      label: "All Users",      icon: "users" },
  { key: "departments",  label: "Departments",     icon: "departments" },
  // { key: "audit",      label: "System Audit",   icon: "audit" },
];
const NAV_CONFIG = [
  { key: "settings",   label: "System Settings",icon: "settings" },
  { key: "billing",    label: "Billing",         icon: "billing" },
];

// ── Sidebar ───────────────────────────────────────────────────
export function Sidebar({ activePage, onNavigate, onLogout, mobileOpen, onMobileClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-40 flex flex-col
        w-[220px] bg-[#1A2433]
        transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0 lg:flex-shrink-0
      `}>
        {/* Logo */}
        <div className="flex items-center gap-[10px] px-4 py-[14px] border-b border-white/10">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center flex-shrink-0">
            <DmsLogo />
          </div>
          <div>
            <div className="text-white text-[13px] font-bold leading-tight">SAP DMS</div>
            <div className="text-white/40 text-[10px]">Global Platform</div>
          </div>
          <button className="ml-auto text-white/40 hover:text-white lg:hidden" onClick={onMobileClose}>
            {ICONS.close}
          </button>
        </div>

        {/* User */}
        <div className="flex items-center gap-2 px-[14px] py-[10px] border-b border-white/10">
          <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">SA</div>
          <div>
            <div className="text-white/90 text-[11px] font-semibold">superadmin</div>
            <div className="text-white/40 text-[10px]">SuperAdmin</div>
          </div>
        </div>

        {/* Main nav */}
        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-[14px] py-[6px] text-[9px] font-bold text-white/30 uppercase tracking-[0.8px]">Main</div>
          {NAV_MAIN.map((item) => (
            <NavItem key={item.key} item={item} active={activePage === item.key} onClick={() => { onNavigate(item.key); onMobileClose?.(); }} />
          ))}
          <div className="px-[14px] pt-3 pb-[6px] text-[9px] font-bold text-white/30 uppercase tracking-[0.8px]">Config</div>
          {NAV_CONFIG.map((item) => (
            <NavItem key={item.key} item={item} active={activePage === item.key} onClick={() => { onNavigate(item.key); onMobileClose?.(); }} />
          ))}
        </div>

        {/* Logout */}
        <div className="border-t border-white/10 p-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-[9px] px-[14px] py-[7px] text-[12px] text-white/50 hover:text-white/80 hover:bg-white/5 rounded transition-all"
          >
            {ICONS.logout}
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

function NavItem({ item, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-[9px] px-[14px] py-[7px] text-[12px] transition-all border-l-[3px] ${
        active
          ? "bg-blue-600/20 text-[#6BB8FF] border-blue-500"
          : "text-white/60 border-transparent hover:bg-white/5 hover:text-white/85"
      }`}
    >
      <span className="flex-shrink-0">{ICONS[item.icon]}</span>
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge && (
        <span className={`text-[10px] font-bold px-[7px] py-px rounded-full ${
          active ? "bg-blue-500 text-white" : "bg-blue-900/40 text-blue-300"
        }`}>
          {item.badge}
        </span>
      )}
    </button>
  );
}

// ── Topbar ────────────────────────────────────────────────────
export function Topbar({ title, onMenuClick }) {
  const { dark, setDark } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="h-[46px] bg-white dark:bg-[#1A2433] border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-3 flex-shrink-0 sticky top-0 z-20 transition-colors">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
      >
        {ICONS.menu}
      </button>

      <h1 className="text-[14px] font-bold text-slate-800 dark:text-slate-100 truncate flex-1">{title}</h1>

      <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[11px] font-bold px-[10px] py-[2px] rounded-full hidden sm:inline">
        SuperAdmin
      </span>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#232F40] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            {ICONS.bell}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full text-[9px] font-bold text-white flex items-center justify-center">3</span>
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-10 w-64 bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300">Notifications</div>
              {["Veda Hospitality activated", "OData connected T002", "New user john.doe@veda"].map((n, i) => (
                <div key={i} className="px-3 py-2 text-[11px] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700 last:border-0 cursor-pointer">{n}</div>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setDark((v) => !v)}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#232F40] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          title={dark ? "Light mode" : "Dark mode"}
        >
          {dark ? ICONS.sun : ICONS.moon}
        </button>

        {/* Logout */}
        <button className="hidden sm:flex items-center gap-[6px] px-3 py-[5px] rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-[11px] font-bold transition-colors">
          {ICONS.logout}
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

// ── Main Layout shell ─────────────────────────────────────────
export function Layout({ activePage, onNavigate, onLogout, title, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-[#0F1623] transition-colors overflow-hidden">
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        onLogout={onLogout}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-5 scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}