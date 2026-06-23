import { TENANTS, RECENT_ACTIVITY } from "../SuperAdmin/Superadmincontext";

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({ label, value, sub, subColor = "text-green-600 dark:text-green-400", icon, onClick }) {
  return (
    <div onClick={onClick} className={`bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col gap-1 transition-colors hover:shadow-md hover:-translate-y-px duration-200 ${onClick ? "cursor-pointer hover:border-blue-400 dark:hover:border-blue-500" : ""}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-[26px] font-bold text-slate-800 dark:text-slate-100 leading-tight">{value}</div>
      {sub && <div className={`text-[11px] font-medium ${subColor}`}>{sub}</div>}
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────
function StatusBadge({ status }) {
  return status === "Active" ? (
    <span className="text-[10px] font-bold px-2 py-[3px] rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">Active</span>
  ) : (
    <span className="text-[10px] font-bold px-2 py-[3px] rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">Pending</span>
  );
}

// ── Dashboard ─────────────────────────────────────────────────
export default function Dashboard({ onNavigate }) {
  return (
    <div className="space-y-5">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Tenants"     value="3"     sub="↑ 1 this month"    icon="🏢" onClick={() => onNavigate("tenants")} />
<StatCard label="Total Users" value="135"   sub="Across all tenants" icon="👥" onClick={() => onNavigate("users")} />
<StatCard label="Documents"   value="2,940" sub="↑ 142 this week"   icon="📄" onClick={() => onNavigate("documents")} />
<StatCard label="OData Active" value="2/3"  sub="1 pending setup"   subColor="text-amber-600 dark:text-amber-400" icon="⚡" onClick={() => onNavigate("odata")} />
      </div>

      {/* Tenant Status + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
        {/* Tenant Status */}
        <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl p-4 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              🏢 Tenant Status
            </h2>
            <button
              onClick={() => onNavigate("tenants")}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {TENANTS.map((t) => (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0 ${
                  t.status === "Active" ? "bg-blue-600" : "bg-amber-500"
                }`}>
                  {t.code.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-bold text-slate-800 dark:text-slate-200 truncate">{t.name}</div>
                  <div className="text-[10px] text-slate-400">{t.users} users · {t.docs.toLocaleString()} docs</div>
                </div>
                <StatusBadge status={t.status} />
                <button
                  onClick={() => onNavigate("tenants")}
                  className="text-[11px] px-3 py-1 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Manage
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl p-4 transition-colors">
          <h2 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
            📋 Recent Activity
          </h2>
          <div className="space-y-0">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-[9px] border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-[5px] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-slate-700 dark:text-slate-300">{a.msg}</div>
                </div>
                <div className="text-[10px] text-slate-400 flex-shrink-0 whitespace-nowrap">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl p-4 transition-colors">
        <h2 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "+ Register Tenant",  page: "tenants",  color: "bg-blue-600 hover:bg-blue-700 text-white" },
            { label: "+ Add User",         page: "users",    color: "bg-green-600 hover:bg-green-700 text-white" },
            { label: "⚡ OData Plugins",   page: "odata",    color: "bg-white dark:bg-[#232F40] hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600" },
            { label: "📋 System Audit",    page: "audit",    color: "bg-white dark:bg-[#232F40] hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600" },
            { label: "⚙ System Settings",  page: "settings", color: "bg-white dark:bg-[#232F40] hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600" },
          ].map((a) => (
            <button
              key={a.label}
              onClick={() => onNavigate(a.page)}
              className={`px-4 py-[7px] rounded-lg text-[12px] font-semibold transition-all ${a.color}`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}