import { TENANTS } from "../SuperAdmin/Superadmincontext";

export default function Billing() {
  const totalRevenue = "₹1,20,000";
  const nextInvoice = "01-Jun-2024";

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-[15px] font-bold text-slate-800 dark:text-slate-100">Billing</h2>
          <p className="text-[11px] text-slate-400 mt-px">Revenue and subscription management</p>
        </div>
        <button className="px-4 py-[8px] bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold rounded-lg transition">
          ↓ Download Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl p-4 transition-colors hover:shadow-md hover:-translate-y-px duration-200">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Active Tenants</div>
          <div className="text-[28px] font-bold text-slate-800 dark:text-slate-100">3</div>
        </div>
        <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl p-4 transition-colors hover:shadow-md hover:-translate-y-px duration-200">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Monthly Revenue</div>
          <div className="text-[28px] font-bold text-blue-600 dark:text-blue-400">{totalRevenue}</div>
        </div>
        <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl p-4 transition-colors hover:shadow-md hover:-translate-y-px duration-200">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Next Invoice</div>
          <div className="text-[22px] font-bold text-slate-800 dark:text-slate-100">{nextInvoice}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden transition-colors">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Subscription Details</h3>
        </div>

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#151E2B]">
                {["Tenant", "Plan", "Users", "Amount", "Status"].map(h => (
                  <th key={h} className="text-left px-4 py-[9px] text-[11px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TENANTS.map((t, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-[10px]">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                        {t.code.slice(0, 2)}
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-[2px] rounded">{t.plan}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{t.users}</td>
                  <td className="px-4 py-4 font-bold text-slate-800 dark:text-slate-200">{t.amount}</td>
                  <td className="px-4 py-4">
                    <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 px-2 py-[2px] rounded-full">
                      Paid
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 dark:bg-[#151E2B] border-t-2 border-slate-200 dark:border-slate-600">
                <td colSpan={3} className="px-4 py-3 text-[12px] font-bold text-slate-700 dark:text-slate-300">Total Monthly</td>
                <td className="px-4 py-3 text-[14px] font-bold text-blue-600 dark:text-blue-400">{totalRevenue}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700">
          {TENANTS.map((t, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">{t.code.slice(0,2)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 truncate">{t.name}</div>
                <div className="flex items-center gap-2 mt-px">
                  <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-[1px] rounded">{t.plan}</span>
                  <span className="text-[10px] text-slate-400">{t.users} users</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[12px] font-bold text-slate-800 dark:text-slate-200">{t.amount}</div>
                <span className="text-[10px] font-bold text-green-600 dark:text-green-400">Paid</span>
              </div>
            </div>
          ))}
          <div className="px-4 py-3 bg-slate-50 dark:bg-[#151E2B] flex justify-between items-center">
            <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">Total Monthly</span>
            <span className="text-[14px] font-bold text-blue-600 dark:text-blue-400">{totalRevenue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}