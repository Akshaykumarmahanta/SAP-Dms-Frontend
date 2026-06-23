const USERS_BY_ROLE = [
  { role: "Manager",       count: 5,  max: 20 },
  { role: "Uploader",      count: 18, max: 20 },
  { role: "Viewer",        count: 20, max: 20 },
  { role: "Approver",      count: 8,  max: 20 },
  { role: "Auditor",       count: 4,  max: 20 },
  { role: "DeptHead",      count: 3,  max: 20 },
  { role: "BranchManager", count: 2,  max: 20 },
];

const FOLDER_USAGE = [
  { name: "Legal",            docs: 87  },
  { name: "IT",               docs: 134 },
  { name: "Finance",          docs: 56  },
  { name: "Internal Audit",   docs: 210 },
  { name: "Human Resource",   docs: 43  },
  { name: "Procurement",      docs: 178 },
  { name: "Corporate Affairs",docs: 92  },
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

export default function BMDashboard({ onNavigate }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Users"             value="60"   sub="Active accounts"  icon="👥" />
        <StatCard label="Documents"         value="1420" sub="↑ 42 this week"   icon="📄" />
        <StatCard label="Pending Approvals" value="7"    sub="Needs action" subColor="text-amber-600 dark:text-amber-400" icon="✅" />
        <StatCard
          label="OData Status"
          value={<span className="text-green-600 dark:text-green-400 text-[20px]">✔ Live</span>}
          sub="Connected"
          subColor="text-green-600 dark:text-green-400"
          icon="⚡"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Users by Role */}
        <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <h2 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">👥 Users by Role</h2>
          <div className="space-y-[10px]">
            {USERS_BY_ROLE.map(r => (
              <div key={r.role} className="flex items-center gap-3">
                <div className="w-[110px] text-[12px] text-slate-600 dark:text-slate-400 flex-shrink-0">{r.role}</div>
                <div className="w-8 text-[12px] font-bold text-blue-600 dark:text-blue-400 text-right flex-shrink-0">{r.count}</div>
                <div className="flex-1 h-[6px] bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(r.count / r.max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Folder Usage */}
        <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <h2 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">📁 Folder Usage</h2>
          <div className="space-y-0">
            {FOLDER_USAGE.map(f => (
              <div key={f.name} className="flex items-center gap-3 py-[8px] border-b border-slate-100 dark:border-slate-700 last:border-0">
                <span className="text-amber-500 text-[14px]">📁</span>
                <span className="flex-1 text-[12px] text-slate-700 dark:text-slate-300">{f.name}</span>
                <span className="text-[11px] text-slate-400">{f.docs} docs</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}