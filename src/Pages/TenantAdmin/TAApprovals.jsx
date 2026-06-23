import { useState } from "react";

const INITIAL = [
  { id: 1, doc: "INV-2024-01501.pdf", type: "Invoice",     vendor: "PQR Ltd",  amount: "₹67,000", by: "uploader", date: "12-May-2024" },
  { id: 2, doc: "CN-2024-00120.pdf",  type: "Credit Note", vendor: "MNO Ltd",  amount: "₹12,200", by: "manager",  date: "11-May-2024" },
];

const TYPE_COLORS = {
  Invoice:      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Credit Note":"bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
};

export default function TAApprovals() {
  const [queue, setQueue] = useState(INITIAL);

  function approve(id) { setQueue(q => q.filter(x => x.id !== id)); }
  function reject(id)  { setQueue(q => q.filter(x => x.id !== id)); }

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <h2 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
          ✅ Approval Queue
        </h2>

        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-600">
            <span className="text-4xl mb-2">🎉</span>
            <span className="text-[13px] font-semibold">All caught up! No pending approvals.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {queue.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-3 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-[12px] flex-shrink-0">
                  {item.type === "Invoice" ? "IN" : "CN"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200">{item.doc}</span>
                    <span className={`text-[10px] font-bold px-2 py-[2px] rounded-full ${TYPE_COLORS[item.type]}`}>{item.type}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-[2px]">
                    {item.vendor} · {item.amount} · by {item.by} on {item.date}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="text-[13px] text-slate-400 hover:text-blue-600 transition-colors">👁</button>
                  <button
                    onClick={() => approve(item.id)}
                    className="flex items-center gap-1 px-3 py-[6px] bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold rounded-lg transition-colors"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => reject(item.id)}
                    className="flex items-center gap-1 px-3 py-[6px] border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-[11px] font-bold rounded-lg transition-colors"
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}