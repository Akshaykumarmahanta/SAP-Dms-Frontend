import { useState } from "react";

const RECENT_DOCS = [
  { id: 1, name: "INV-2024-01568.pdf", date: "14-May-2024", dept: "Finance",     status: "Posted" },
  { id: 2, name: "GRN-2024-00892.pdf", date: "13-May-2024", dept: "Procurement", status: "Posted" },
  { id: 3, name: "CTR-2024-00045.pdf", date: "10-May-2024", dept: "Legal",       status: "Active" },
];

const STATUS_STYLES = {
  Posted:  "text-green-600 dark:text-green-400 border border-green-300 dark:border-green-700",
  Active:  "text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700",
  Pending: "text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700",
  Draft:   "text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600",
};

const EYE_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

function ViewerDashboard({ onNavigate }) {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl p-5 transition-colors">

        <h2 className="text-[14px] font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
          Read-Only Access — Recent Documents
        </h2>

        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span className="text-[12px] text-blue-700 dark:text-blue-300">
            You have read-only access. Contact your admin to request edit permissions.
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {RECENT_DOCS.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 py-[11px]">
              <div className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-slate-700 dark:text-slate-200 truncate">{doc.name}</div>
                <div className="text-[11px] text-slate-400 mt-[1px]">{doc.date} · {doc.dept}</div>
              </div>
              <span className={`text-[11px] font-bold px-[10px] py-[3px] rounded-full bg-transparent ${STATUS_STYLES[doc.status] || STATUS_STYLES.Draft}`}>
                {doc.status}
              </span>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-blue-500 hover:border-blue-300 transition-all">
                {EYE_ICON}
              </button>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 mt-1">
          <button
            onClick={() => onNavigate && onNavigate("documents")}
            className="text-[12px] text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            View All Documents →
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewerDashboard;