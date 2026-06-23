const AUDIT = [
  { time: "10:22", user: "john.doe", action: "Upload",   actionColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",   doc: "INV-2024-01568.pdf", ip: "192.168.1.10" },
  { time: "09:48", user: "priya.k",  action: "Approve",  actionColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300", doc: "INV-2024-01560.pdf", ip: "192.168.1.22" },
  { time: "09:10", user: "manager",  action: "Edit OCR", actionColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", doc: "GRN-2024-00892.pdf", ip: "10.0.0.5"     },
  { time: "08:55", user: "uploader", action: "Upload",   actionColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",     doc: "CTR-2024-00045.pdf", ip: "10.0.0.8"     },
];

export default function TAAudit() {
  return (
    <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
        <h2 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          🛡 Audit Log — Veda Hospitality
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700">
              {["Time","User","Action","Document","IP"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AUDIT.map((a, i) => (
              <tr key={i} className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="px-4 py-3 text-[12px] text-slate-500 dark:text-slate-400">{a.time}</td>
                <td className="px-4 py-3">
                  <span className="text-[12px] font-semibold text-blue-600 dark:text-blue-400">{a.user}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-bold px-2 py-[3px] rounded-full ${a.actionColor}`}>{a.action}</span>
                </td>
                <td className="px-4 py-3 text-[12px] text-slate-700 dark:text-slate-300">{a.doc}</td>
                <td className="px-4 py-3 text-[12px] text-slate-400">{a.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}