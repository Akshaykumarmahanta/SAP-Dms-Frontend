import { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const API_BASE = "http://localhost:3000/api";

function getToken() { return localStorage.getItem("accessToken") || ""; }
function authHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` };
}
function decodeToken() {
  try { const t = getToken(); if (!t) return null; return JSON.parse(atob(t.split(".")[1])); }
  catch { return null; }
}

const ROLE_COLORS = {
  TenantAdmin:   "#534AB7", BranchManager: "#185FA5", DeptHead:  "#EF9F27",
  Manager:       "#BA7517", Uploader:      "#1D9E75", Viewer:    "#64748b",
  Auditor:       "#A32D2D", Approver:      "#0F6E56",
};

const STATUS_META = {
  COMPLETED:            { label: "Completed",        color: "text-green-600 dark:text-green-400",  bg: "bg-green-50 dark:bg-green-900/20"  },
  OCR_COMPLETED:        { label: "OCR Done",         color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-900/20"    },
  OCR_PROCESSING:       { label: "OCR Processing",   color: "text-amber-600 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-900/20"  },
  WAITING_FOR_APPROVAL: { label: "Awaiting Approval",color: "text-orange-600 dark:text-orange-400",bg: "bg-orange-50 dark:bg-orange-900/20"},
  SAVING_TO_SAP:        { label: "Saving to SAP",    color: "text-purple-600 dark:text-purple-400",bg: "bg-purple-50 dark:bg-purple-900/20"},
  FAILED:               { label: "Failed",           color: "text-red-600 dark:text-red-400",      bg: "bg-red-50 dark:bg-red-900/20"      },
};

function StatCard({ label, value, sub, subColor = "text-green-600 dark:text-green-400", icon, loading }) {
  return (
    <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      {loading
        ? <div className="h-8 w-16 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
        : <div className="text-[26px] font-bold text-slate-800 dark:text-slate-100 leading-tight">{value}</div>
      }
      {sub && <div className={`text-[11px] font-medium ${subColor}`}>{sub}</div>}
    </div>
  );
}

export default function TADashboard({ onNavigate }) {
  const [users,     setUsers]     = useState([]);
  const [docs,      setDocs]      = useState([]);
  const [depts,     setDepts]     = useState([]);
  const [cats,      setCats]      = useState([]);
  const [dts,       setDts]       = useState([]);
  const [odataOk,   setOdataOk]   = useState(null);
  const [loading,   setLoading]   = useState(true);

  const roleChartRef   = useRef(null);
  const statusChartRef = useRef(null);
  const roleChartInst  = useRef(null);
  const statusChartInst = useRef(null);

  useEffect(() => {
    const payload = decodeToken();
    if (payload?.tenantId) fetchAll(payload.tenantId);
    else setLoading(false);
  }, []);

  async function fetchAll(tenantId) {
    setLoading(true);
    try {
      const [uRes, dRes, cRes, dtRes, docRes] = await Promise.all([
        fetch(`${API_BASE}/users`,                              { headers: authHeaders() }),
        fetch(`${API_BASE}/departments/tenant/${tenantId}`,    { headers: authHeaders() }),
        fetch(`${API_BASE}/categories`,                        { headers: authHeaders() }),
        fetch(`${API_BASE}/document-types`,                    { headers: authHeaders() }),
        fetch(`${API_BASE}/documents`,                         { headers: authHeaders() }),
      ]);
      const uData   = await uRes.json();
      const dData   = await dRes.json();
      const cData   = await cRes.json();
      const dtData  = await dtRes.json();
      const docData = await docRes.json();

      setUsers(uData.success  ? (uData.data  || []) : []);
      setDepts(dData.data     || []);
      setCats (cData.data     || cData     || []);
      setDts  (dtData.data    || dtData    || []);
      setDocs (docData.data   || docData   || []);

      // Check OData/health
      // try {
      //   const hRes = await fetch(`${API_BASE}/health`, { headers: authHeaders() });
      //   setOdataOk(hRes.ok);
      // } catch { setOdataOk(false); }

    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  }

  // ── Derived stats ──────────────────────────────────────────
  const totalUsers    = users.length;
  const activeUsers   = users.filter(u => u.isActive).length;
  const totalDocs     = docs.length;
  const pendingApproval = docs.filter(d =>
    (d.uploadStatus || d.status) === "WAITING_FOR_APPROVAL"
  ).length;

  // Role counts
  const roleCounts = {};
  users.forEach(u => { roleCounts[u.role] = (roleCounts[u.role] || 0) + 1; });
  const rolesArr = Object.entries(roleCounts).sort((a, b) => b[1] - a[1]);
  const maxRole  = rolesArr[0]?.[1] || 1;

  // Status counts
  const statusCounts = {};
  docs.forEach(d => {
    const st = d.uploadStatus || d.status || "UNKNOWN";
    statusCounts[st] = (statusCounts[st] || 0) + 1;
  });
  const statusArr = Object.entries(statusCounts).sort((a, b) => b[1] - a[1]);

  // Per-dept doc counts
  const dtMap = {};
  dts.forEach(dt => { dtMap[dt.id] = dt; });
  const deptDocCount = {};
  docs.forEach(doc => {
    const dt   = dtMap[doc.documentTypeId];
    if (!dt) return;
    const cat  = cats.find(c => c.id === dt.categoryId);
    if (!cat) return;
    const dept = depts.find(d => d.id === cat.departmentId);
    if (!dept) return;
    deptDocCount[dept.id] = (deptDocCount[dept.id] || 0) + 1;
  });
  const maxDeptDocs = Math.max(...Object.values(deptDocCount), 1);

  // ── Role Bar Chart ─────────────────────────────────────────
  useEffect(() => {
    if (!roleChartRef.current || rolesArr.length === 0) return;
    if (roleChartInst.current) roleChartInst.current.destroy();
    roleChartInst.current = new Chart(roleChartRef.current, {
      type: "bar",
      data: {
        labels: rolesArr.map(([r]) => r),
        datasets: [{
          label: "Users",
          data: rolesArr.map(([, c]) => c),
          backgroundColor: rolesArr.map(([r]) => (ROLE_COLORS[r] || "#378ADD") + "cc"),
          borderColor:     rolesArr.map(([r]) =>  ROLE_COLORS[r] || "#378ADD"),
          borderWidth: 1,
          borderRadius: 4,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 35 } },
          y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 10 } }, grid: { color: "rgba(128,128,128,0.1)" } },
        },
      },
    });
    return () => roleChartInst.current?.destroy();
  }, [users]);

  // ── Status Doughnut Chart ──────────────────────────────────
  useEffect(() => {
    if (!statusChartRef.current || statusArr.length === 0) return;
    if (statusChartInst.current) statusChartInst.current.destroy();
    const COLORS = { COMPLETED:"#1D9E75", OCR_COMPLETED:"#185FA5", OCR_PROCESSING:"#EF9F27",
      WAITING_FOR_APPROVAL:"#BA7517", SAVING_TO_SAP:"#534AB7", FAILED:"#A32D2D" };
    statusChartInst.current = new Chart(statusChartRef.current, {
      type: "doughnut",
      data: {
        labels: statusArr.map(([st]) => STATUS_META[st]?.label || st),
        datasets: [{
          data: statusArr.map(([, c]) => c),
          backgroundColor: statusArr.map(([st]) => (COLORS[st] || "#888") + "cc"),
          borderColor:     statusArr.map(([st]) =>  COLORS[st] || "#888"),
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: "62%",
        plugins: {
          legend: {
            display: true, position: "bottom",
            labels: { font: { size: 10 }, boxWidth: 10, padding: 8 },
          },
        },
      },
    });
    return () => statusChartInst.current?.destroy();
  }, [docs]);

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* Refresh button */}
      <div className="flex items-center justify-between">
        <h1 className="text-[15px] font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
        <button
          onClick={() => { const p = decodeToken(); if (p?.tenantId) fetchAll(p.tenantId); }}
          className="text-[11px] text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-1"
        >
          ↻ Refresh
        </button>
      </div>

      {/* ── Stat Cards ── */}
      {/* ── Stat Cards ── */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
  <StatCard loading={loading} label="Users" value={totalUsers} sub={`${activeUsers} active · ${totalUsers - activeUsers} inactive`} icon="👥" />
  <StatCard loading={loading} label="Documents" value={totalDocs} sub={`${statusCounts["COMPLETED"] || 0} completed`} icon="📄" />
  <StatCard loading={loading} label="Pending Approvals" value={pendingApproval}
    sub={pendingApproval > 0 ? "Needs action" : "None pending"}
    subColor={pendingApproval > 0 ? "text-amber-600 dark:text-amber-400" : "text-green-600 dark:text-green-400"}
    icon="✅" />
</div>

      {/* ── Row 2: Role bars + Role chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Users by Role — bar list */}
        <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <h2 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 mb-4">👥 Users by Role</h2>
          {loading
            ? <div className="space-y-3">{[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-[110px] h-3 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
                  <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
                </div>))}</div>
            : rolesArr.length === 0
              ? <p className="text-[12px] text-slate-400">No users found</p>
              : <div className="space-y-[10px]">
                  {rolesArr.map(([role, count]) => (
                    <div key={role} className="flex items-center gap-3">
                      <div className="w-[110px] text-[12px] text-slate-600 dark:text-slate-400 flex-shrink-0">{role}</div>
                      <div className="w-8 text-[12px] font-bold text-blue-600 dark:text-blue-400 text-right flex-shrink-0">{count}</div>
                      <div className="flex-1 h-[5px] bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.round((count / maxRole) * 100)}%`, background: ROLE_COLORS[role] || "#378ADD" }} />
                      </div>
                    </div>
                  ))}
                </div>
          }
        </div>

        {/* Role Bar Chart */}
        <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <h2 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 mb-4">📊 Role Distribution</h2>
          <div style={{ position: "relative", height: 200 }}>
            <canvas ref={roleChartRef}
              role="img"
              aria-label={`Bar chart: ${rolesArr.map(([r,c])=>`${r} ${c}`).join(', ')}`}>
              {rolesArr.map(([r,c])=>`${r}: ${c}`).join(', ')}
            </canvas>
          </div>
        </div>
      </div>

      {/* ── Row 3: Folder usage + Status doughnut ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Folder Usage */}
        <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <h2 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 mb-4">📁 Folder Usage by Department</h2>
          {loading
            ? <div className="space-y-3">{[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
                  <div className="w-16 h-2 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
                </div>))}</div>
            : depts.length === 0
              ? <p className="text-[12px] text-slate-400">No departments assigned</p>
              : <div className="space-y-0">
                  {depts.map(dept => {
                    const cnt     = deptDocCount[dept.id] || 0;
                    const catCnt  = cats.filter(c => c.departmentId === dept.id).length;
                    return (
                      <div key={dept.id} className="flex items-center gap-3 py-[8px] border-b border-slate-100 dark:border-slate-700 last:border-0">
                        <span className="text-amber-500 text-[14px]">📁</span>
                        <span className="flex-1 text-[12px] text-slate-700 dark:text-slate-300 truncate">
                          {dept.name}
                          <span className="ml-1 text-[10px] text-slate-400">({catCnt} cat)</span>
                        </span>
                        <div className="w-[80px] h-[4px] bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex-shrink-0">
                          <div className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${Math.round((cnt / maxDeptDocs) * 100)}%` }} />
                        </div>
                        <span className="text-[11px] text-slate-400 w-14 text-right flex-shrink-0">{cnt} docs</span>
                      </div>
                    );
                  })}
                </div>
          }
        </div>

        {/* Document Status Doughnut */}
        <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <h2 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 mb-4">🍩 Document Status</h2>
          <div style={{ position: "relative", height: 200 }}>
            <canvas ref={statusChartRef}
              role="img"
              aria-label={`Doughnut chart: ${statusArr.map(([s,c])=>`${s} ${c}`).join(', ')}`}>
              {statusArr.map(([s,c])=>`${s}: ${c}`).join(', ')}
            </canvas>
          </div>
        </div>
      </div>

      {/* ── Row 4: Status breakdown pills ── */}
      {!loading && statusArr.length > 0 && (
        <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <h2 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 mb-3">📋 Document Status Breakdown</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {statusArr.map(([st, cnt]) => {
              const meta = STATUS_META[st] || { label: st, color: "text-slate-600", bg: "bg-slate-100" };
              return (
                <div key={st} className={`${meta.bg} rounded-xl p-3 text-center`}>
                  <div className={`text-[20px] font-bold ${meta.color}`}>{cnt}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">{meta.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Row 5: Summary footer ── */}
      {!loading && (
        <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-[11px] text-slate-400 mb-1">Departments</p>
              <p className="text-[20px] font-bold text-slate-800 dark:text-slate-100">{depts.length}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 mb-1">Categories</p>
              <p className="text-[20px] font-bold text-slate-800 dark:text-slate-100">{cats.length}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 mb-1">Document Types</p>
              <p className="text-[20px] font-bold text-slate-800 dark:text-slate-100">{dts.length}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 mb-1">Roles in Use</p>
              <p className="text-[20px] font-bold text-slate-800 dark:text-slate-100">{rolesArr.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}