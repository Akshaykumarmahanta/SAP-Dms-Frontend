import { useState } from "react";

const INITIAL_QUEUE = [
  {
    id: 1,
    name: "INV-2024-01501.pdf",
    type: "Invoice",
    vendor: "PQR Ltd",
    amount: "₹67,000",
    uploadedBy: "uploader",
    date: "12-May-2024",
  },
  {
    id: 2,
    name: "CN-2024-00120.pdf",
    type: "Credit Note",
    vendor: "MNO Ltd",
    amount: "₹12,200",
    uploadedBy: "manager",
    date: "11-May-2024",
  },
];

const CHECK_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const X_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const EYE_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const DOC_ICON = (color = "#EA580C") => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
);

function ApproverApprovals() {
  const [items, setItems]     = useState(INITIAL_QUEUE);
  const [actioned, setActioned] = useState([]);

  function handle(id, action) {
    const item = items.find(i => i.id === id);
    setItems(prev => prev.filter(i => i.id !== id));
    setActioned(prev => [...prev, { ...item, action }]);
  }

  return (
    <div className="space-y-4 max-w-4xl">

      {/* Approval Queue Card */}
      <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl transition-colors">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-[14px] font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Approval Queue
          </h2>
          {items.length > 0 && (
            <span className="text-[11px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-[10px] py-[3px] rounded-full">
              {items.length} pending
            </span>
          )}
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14 text-slate-400 gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-[13px]">All documents actioned</span>
          </div>
        )}

        {/* Queue items */}
        <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
          {items.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 px-5 py-[14px]">
              {/* Doc icon */}
              <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                {DOC_ICON()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[13px] font-bold text-slate-800 dark:text-slate-100">{doc.name}</span>
                  <span className="text-[10px] font-semibold px-[8px] py-[2px] rounded-md border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400">
                    {doc.type}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-[3px]">
                  {doc.vendor} · {doc.amount} · by {doc.uploadedBy} on {doc.date}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  title="View document"
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 text-slate-400 hover:text-blue-500 hover:border-blue-300 transition-all"
                >
                  {EYE_ICON}
                </button>
                <button
                  onClick={() => handle(doc.id, "approved")}
                  className="flex items-center gap-[5px] px-4 py-[6px] rounded-lg bg-green-600 hover:bg-green-700 text-white text-[12px] font-bold transition-colors"
                >
                  {CHECK_ICON} Approve
                </button>
                <button
                  onClick={() => handle(doc.id, "rejected")}
                  className="flex items-center gap-[5px] px-4 py-[6px] rounded-lg border border-red-400 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-[12px] font-bold transition-colors"
                >
                  {X_ICON} Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Actioned */}
        {actioned.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-700">
            <div className="px-5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recently Actioned</div>
            {actioned.map((doc, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-[10px] opacity-60">
                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                  {DOC_ICON("#94A3B8")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-slate-600 dark:text-slate-400">{doc.name}</span>
                    <span className="text-[10px] font-semibold px-[8px] py-[2px] rounded-md border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-500">{doc.type}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{doc.vendor} · {doc.amount} · by {doc.uploadedBy} on {doc.date}</div>
                </div>
                <span className={`text-[11px] font-bold px-3 py-[3px] rounded-full flex-shrink-0 ${
                  doc.action === "approved"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                    : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                }`}>
                  {doc.action === "approved" ? "✓ Approved" : "✗ Rejected"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ApproverApprovals;