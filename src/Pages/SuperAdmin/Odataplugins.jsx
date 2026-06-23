import { useState } from "react";
import { ODATA_CONNECTIONS } from "../SuperAdmin/Superadmincontext";

export default function ODataPlugins() {
  const [connections, setConnections] = useState(ODATA_CONNECTIONS);
  const [testing, setTesting] = useState(null);
  const [connecting, setConnecting] = useState(null);

  function handleTest(i) {
    setTesting(i);
    setTimeout(() => setTesting(null), 1500);
  }

  function handleConnect(i) {
    setConnecting(i);
    setTimeout(() => {
      setConnections((prev) =>
        prev.map((c, idx) => idx === i ? { ...c, status: "Connected", lastSync: "just now" } : c)
      );
      setConnecting(null);
    }, 1800);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[15px] font-bold text-slate-800 dark:text-slate-100">OData Plugin Manager</h2>
          <p className="text-[11px] text-slate-400 mt-px">SAP OData connection management</p>
        </div>
        <button className="px-4 py-[8px] bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold rounded-lg transition">+ Add Connection</button>
      </div>

      {/* Summary pills */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-[11px] font-semibold px-3 py-[6px] rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          {connections.filter(c => c.status === "Connected").length} Connected
        </div>
        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-[11px] font-semibold px-3 py-[6px] rounded-full">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          {connections.filter(c => c.status === "Pending").length} Pending
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden transition-colors">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
          <span className="text-[13px] font-bold text-slate-800 dark:text-slate-100">⚡ OData Plugin Connections</span>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#151E2B]">
                {["Tenant", "OData Endpoint", "Auth", "Status", "Last Sync", "Action"].map((h) => (
                  <th key={h} className="text-left px-4 py-[9px] text-[11px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap border-b border-slate-100 dark:border-slate-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {connections.map((c, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{c.tenant}</td>
                  <td className="px-4 py-3">
                    <code className="text-[11px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-[2px] rounded">{c.endpoint}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-[2px] rounded">{c.auth}</span>
                  </td>
                  <td className="px-4 py-3">
                    {c.status === "Connected" ? (
                      <span className="text-[11px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 px-[10px] py-[3px] rounded-full">Connected</span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 px-[10px] py-[3px] rounded-full">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{c.lastSync}</td>
                  <td className="px-4 py-3">
                    {c.status === "Connected" ? (
                      <button
                        onClick={() => handleTest(i)}
                        disabled={testing === i}
                        className="px-3 py-[5px] bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-[11px] font-bold rounded-lg transition"
                      >
                        {testing === i ? "Testing…" : "Test"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConnect(i)}
                        disabled={connecting === i}
                        className="px-3 py-[5px] bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-[11px] font-bold rounded-lg transition"
                      >
                        {connecting === i ? "Connecting…" : "Connect"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700">
          {connections.map((c, i) => (
            <div key={i} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[12px] text-slate-800 dark:text-slate-200">{c.tenant}</span>
                {c.status === "Connected" ? (
                  <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-[2px] rounded-full border border-green-200 dark:border-green-800">Connected</span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-[2px] rounded-full border border-amber-200 dark:border-amber-800">Pending</span>
                )}
              </div>
              <code className="block text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">{c.endpoint}</code>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Last sync: {c.lastSync}</span>
                {c.status === "Connected" ? (
                  <button onClick={() => handleTest(i)} className="px-3 py-[5px] bg-blue-600 text-white text-[11px] font-bold rounded-lg">{testing === i ? "Testing…" : "Test"}</button>
                ) : (
                  <button onClick={() => handleConnect(i)} className="px-3 py-[5px] bg-green-600 text-white text-[11px] font-bold rounded-lg">{connecting === i ? "Connecting…" : "Connect"}</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}