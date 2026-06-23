const RECENT_DOCS = [
  { name: "INV-2024-01568.pdf", type: "Invoice",  typeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",   status: "Posted",  statusColor: "text-green-600 dark:text-green-400" },
  { name: "GRN-2024-00892.pdf", type: "GRN",      typeColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300", status: "Posted",  statusColor: "text-green-600 dark:text-green-400" },
  { name: "CTR-2024-00045.pdf", type: "Contract", typeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300", status: "Active", statusColor: "text-blue-600 dark:text-blue-400" },
  { name: "INV-2024-01501.pdf", type: "Invoice",  typeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",   status: "Pending", statusColor: "text-amber-600 dark:text-amber-400" },
];

const PENDING_APPROVALS = [
  { doc: "INV-2024-01501.pdf", vendor: "PQR Ltd", amount: "₹67,000" },
];

function StatCard({ label, value, sub, subColor = "text-green-600 dark:text-green-400", icon }) {
  return (
    <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col gap-1 transition-colors">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-[26px] font-bold text-slate-800 dark:text-slate-100 leading-tight">{value}</div>
      {sub && <div className={`text-[11px] font-medium ${subColor}`}>{sub}</div>}
    </div>
  );
}

export default function DHDashboard({ onNavigate }) {
  return (
    <div className="space-y-5">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="My Documents"  value="48" sub="This month"     icon="📄" />
        <StatCard label="Approvals"     value="5"  sub="Pending review" subColor="text-amber-600 dark:text-amber-400" icon="✅" />
        <StatCard label="Uploaded"      value="12" sub="This week"      icon="⬆️" />
        <StatCard label="Processing"    value="3"  sub="In workflow"    subColor="text-blue-600 dark:text-blue-400" icon="⏱" />
      </div>

      {/* Recent Docs + Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">

        {/* Recent Documents */}
        <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <h2 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 mb-4">Recent Documents</h2>
          <div className="space-y-2">
            {RECENT_DOCS.map(doc => (
              <div key={doc.name} className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <span className="text-[14px]">📄</span>
                <span className="flex-1 text-[12px] font-semibold text-slate-700 dark:text-slate-300">{doc.name}</span>
                <span className={`text-[10px] font-bold px-2 py-[2px] rounded-full border ${doc.typeColor}`}>{doc.type}</span>
                <span className={`text-[11px] font-bold ${doc.statusColor}`}>{doc.status}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => onNavigate("workflow")}
            className="mt-3 w-full py-[8px] bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold rounded-lg transition-colors"
          >
            + New Document
          </button>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <h2 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 mb-4">Pending Approvals</h2>
          <div className="space-y-3">
            {PENDING_APPROVALS.map(item => (
              <div key={item.doc} className="flex items-center gap-3 p-3 border border-slate-100 dark:border-slate-700 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0">!</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-bold text-slate-800 dark:text-slate-200">{item.doc}</div>
                  <div className="text-[11px] text-slate-400">{item.vendor} · {item.amount}</div>
                </div>
                <button
                  onClick={() => onNavigate("approvals")}
                  className="px-3 py-[6px] bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-colors"
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}