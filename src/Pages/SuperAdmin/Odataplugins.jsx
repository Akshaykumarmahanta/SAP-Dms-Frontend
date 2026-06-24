import { useEffect, useMemo, useState,useRef } from "react";
import axios from "axios";
import {
  Plug,
  Plus,
  X,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  CircleSlash,
  ChevronRight,
  Server,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
} from "lucide-react";

// ──────────────────────────────────────────────────────────────────
// Real API wiring — talks to your existing erpConfigRoutes.js
//   GET    /api/erp-configs        → listErpConfigs
//   POST   /api/erp-configs        → createErpConfig
//   PUT    /api/erp-configs/:id    → updateErpConfig
//   DELETE /api/erp-configs/:id    → deleteErpConfig (soft → INACTIVE)
//   POST   /api/erp-configs/:id/test → testConnection
// All routes require auth + role("SuperAdmin"), so this UI assumes
// the logged-in user already holds a SuperAdmin token.
// ──────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:3000/api";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const api = axios.create({ baseURL: API_BASE });

// Pull a usable message out of either axios errors or plain Error objects
function extractError(err, fallback) {
  return (
    err?.response?.data?.message ||
    err?.message ||
    fallback
  );
}

const STATUS_META = {
  CONNECTED: { label: "Connected", color: "var(--ok)", icon: CheckCircle2 },
  PENDING: { label: "Pending", color: "var(--warn)", icon: Clock },
  FAILED: { label: "Failed", color: "var(--bad)", icon: XCircle },
  INACTIVE: { label: "Inactive", color: "var(--mute)", icon: CircleSlash },
   ACTIVE: {
    label: "Active",
    color: "var(--ok)",
    icon: CheckCircle2,
  },
};

const ERP_TYPE_META = {
  SAP: { dot: "#7DD3A8" },
  ORACLE: { dot: "#E8B86D" },
  CUSTOM: { dot: "#8FB4E0" },
};

function timeAgo(iso) {
  if (!iso) return "never";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const emptyForm = {
  name: "",
  erpType: "SAP",
  baseUrl: "",
  sapClient: "100",
  authType: "BASIC",
  username: "",
  password: "",
  apiKey: "",
  description: "",
};

export default function ErpConsole() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [panel, setPanel] = useState(null); // null | { mode: 'add'|'edit', data }
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [saving, setSaving] = useState(false);
  const [deactivatingId, setDeactivatingId] = useState(null);
  const logRef = useRef(null);

  async function fetchConnections() {
    try {
      setLoading(true);
      const res = await api.get("/erp-configs", { headers: authHeaders() });
      setConnections(res.data?.data || []);
    } catch (err) {
      setToast({ type: "bad", msg: extractError(err, "Failed to load ERP configurations") });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  if (logRef.current) {
    logRef.current.scrollTop = logRef.current.scrollHeight;
  }
}, [logs]);

  useEffect(() => {
    fetchConnections();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const counts = useMemo(() => {
    const c = { CONNECTED: 0, PENDING: 0, FAILED: 0, INACTIVE: 0 , ACTIVE: 0,};
    connections.forEach((x) => {
      c[x.status] = (c[x.status] || 0) + 1;
    });
    return c;
  }, [connections]);

  const filtered = useMemo(() => {
    if (filter === "ALL") return connections;
    return connections.filter((c) => c.status === filter);
  }, [connections, filter]);

  function openAdd() {
    setForm(emptyForm);
    setFormError("");
    setShowSecret(false);
    setPanel({ mode: "add" });
  }

  function openEdit(item) {
    setForm({
      name: item.name,
      erpType: item.erpType,
      baseUrl: item.baseUrl,
      sapClient: item.sapClient || "100",
      authType: item.authType,
      username: item.username || "",
      password: "",
      apiKey: "",
      description: item.description || "",
      id: item.id,
    });
    setFormError("");
    setShowSecret(false);
    setPanel({ mode: "edit", data: item });
  }

  function closePanel() {
    setPanel(null);
    setFormError("");
  }

  // POST /api/erp-configs (add) or PUT /api/erp-configs/:id (edit)
  async function saveConnection() {
    if (!form.name || !form.erpType || !form.baseUrl) {
      setFormError("name, erpType and baseUrl are required");
      return;
    }

    setSaving(true);
    setFormError("");

    const payload = {
      name: form.name,
      erpType: form.erpType,
      baseUrl: form.baseUrl,
      sapClient: form.sapClient,
      authType: form.authType,
      username: form.username,
      description: form.description,
    };
    // Only send secrets if the user actually typed something new —
    // an empty password/apiKey on edit means "keep current value".
    if (form.password) payload.password = form.password;
    if (form.apiKey) payload.apiKey = form.apiKey;

    try {
      if (panel.mode === "add") {
        const res = await api.post("/erp-configs", payload, { headers: authHeaders() });
        setToast({ type: "ok", msg: `${res.data?.data?.name || form.name} added — connection untested` });
      } else {
        const res = await api.put(`/erp-configs/${form.id}`, payload, { headers: authHeaders() });
        setToast({ type: "ok", msg: `${res.data?.data?.name || form.name} updated` });
      }
      closePanel();
      await fetchConnections();
    } catch (err) {
      setFormError(extractError(err, "Failed to save ERP configuration"));
    } finally {
      setSaving(false);
    }
  }

  // DELETE /api/erp-configs/:id (soft delete → INACTIVE)
  async function deactivate(id) {
    const target = connections.find((c) => c.id === id);
    setDeactivatingId(id);
    try {
      await api.delete(`/erp-configs/${id}`, { headers: authHeaders() });
      setToast({ type: "ok", msg: `${target?.name} deactivated` });
      setConfirmDeleteId(null);
      await fetchConnections();
    } catch (err) {
      setToast({ type: "bad", msg: extractError(err, "Failed to deactivate connection") });
    } finally {
      setDeactivatingId(null);
    }
  }

  // POST /api/erp-configs/:id/test
async function testConnection(item) {
  try {
    setTestingId(item.id);
    setLogs([]);

    const response = await fetch(
      `http://localhost:3000/api/erp-configs/${item.id}/test-stream`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split("\n\n");
      buffer = events.pop() || "";

      for (const event of events) {
        const line = event
          .split("\n")
          .find((l) => l.startsWith("data:"));

        if (line) {
          const msg = line.replace("data:", "").trim();

          setLogs((prev) => [...prev, msg]);
        }
      }
    }

    await fetchConnections();
  } catch (err) {
    setLogs((prev) => [...prev, `❌ ${err.message}`]);
  } finally {
    setTestingId(null);
  }
}

  return (
    <div className="erp-console">
      <style>{`
        .erp-console {
          --bg: #0B0E14;
          --panel: #141925;
          --panel-2: #11151F;
          --border: #232A38;
          --border-soft: #1B212C;
          --ok: #7DD3A8;
          --ok-dim: rgba(125,211,168,0.12);
          --warn: #E8B86D;
          --warn-dim: rgba(232,184,109,0.12);
          --bad: #E07A6F;
          --bad-dim: rgba(224,122,111,0.12);
          --mute: #5C6478;
          --text: #E6E9F0;
          --text-dim: #8B93A7;
          --accent: #8FB4E0;
          font-family: 'Inter', -apple-system, sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          padding: 28px;
          box-sizing: border-box;
          position: relative;
          overflow-x: hidden;
        }
        .erp-console * { box-sizing: border-box; }
        .mono { font-family: 'JetBrains Mono', 'SF Mono', Consolas, monospace; }

        .top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 26px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .title-block { display: flex; align-items: flex-start; gap: 12px; }
        .title-icon {
          width: 38px; height: 38px;
          border-radius: 8px;
          background: var(--panel);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--accent);
          flex-shrink: 0;
        }
        h1 {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          letter-spacing: -0.01em;
        }
        .subtitle {
          color: var(--text-dim);
          font-size: 13px;
          margin-top: 4px;
          font-family: 'JetBrains Mono', monospace;
        }
        .add-btn {
          display: flex; align-items: center; gap: 6px;
          background: var(--accent);
          color: #0B0E14;
          border: none;
          padding: 9px 14px;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
        }
        .add-btn:hover { opacity: 0.88; }
        .add-btn:active { transform: scale(0.98); }
        .add-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

        .stat-row {
          display: flex;
          gap: 10px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .stat-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--panel);
          border: 1px solid var(--border-soft);
          border-radius: 7px;
          padding: 8px 13px;
          font-size: 12.5px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .stat-chip:hover { border-color: var(--border); }
        .stat-chip.active { border-color: var(--chip-color); background: var(--chip-dim); }
        .stat-chip:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        .stat-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--chip-color); flex-shrink:0; }
        .stat-num { font-family: 'JetBrains Mono', monospace; font-weight: 600; color: var(--text); }
        .stat-label { color: var(--text-dim); }

        .panel-frame {
          background: var(--panel);
          border: 1px solid var(--border-soft);
          border-radius: 10px;
          overflow: hidden;
        }
        .panel-head {
          display: grid;
          grid-template-columns: 22px 1.4fr 0.7fr 1.6fr 0.6fr 0.9fr 110px;
          gap: 14px;
          padding: 11px 18px;
          background: var(--panel-2);
          border-bottom: 1px solid var(--border-soft);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--mute);
          font-weight: 600;
        }
        .row {
          display: grid;
          grid-template-columns: 22px 1.4fr 0.7fr 1.6fr 0.6fr 0.9fr 110px;
          gap: 14px;
          padding: 13px 18px;
          border-bottom: 1px solid var(--border-soft);
          align-items: center;
          position: relative;
          transition: background 0.15s;
        }
        .row:last-child { border-bottom: none; }
        .row:hover { background: rgba(255,255,255,0.014); }
        .row:hover .row-actions { opacity: 1; }
        .severity-bar {
          width: 3px;
          height: 22px;
          border-radius: 2px;
          background: var(--sev-color);
          margin: 0 auto;
        }
        .erp-name { font-weight: 600; font-size: 13.5px; }
        .erp-desc { font-size: 11.5px; color: var(--text-dim); margin-top: 2px; }
        .default-tag {
          font-size: 9.5px;
          color: var(--accent);
          border: 1px solid rgba(143,180,224,0.35);
          padding: 1px 5px;
          border-radius: 4px;
          margin-left: 7px;
          font-family: 'JetBrains Mono', monospace;
          vertical-align: middle;
        }
        .type-pill {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 500;
        }
        .type-dot { width: 6px; height: 6px; border-radius: 50%; }
        .url-cell {
          font-size: 11.5px;
          color: var(--text-dim);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .client-cell { font-size: 12.5px; color: var(--text-dim); }
        .status-cell { display: flex; flex-direction: column; gap: 3px; }
        .status-line { display: flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 500; }
        .status-time { font-size: 10.5px; color: var(--mute); }
        .pulse {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--status-color);
          flex-shrink: 0;
          position: relative;
        }
        .pulse.live::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: var(--status-color);
          animation: pulse-ring 1.6s ease-out infinite;
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        .row-actions { display: flex; gap: 5px; justify-content: flex-end; opacity: 0.85; }
        .icon-btn {
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 6px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--text-dim);
          cursor: pointer;
          transition: all 0.15s;
        }
        .icon-btn:hover { background: var(--border-soft); color: var(--text); border-color: var(--border); }
        .icon-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
        .icon-btn.danger:hover { color: var(--bad); border-color: rgba(224,122,111,0.3); background: var(--bad-dim); }
        .test-btn {
          display: flex; align-items: center; gap: 5px;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 11.5px;
          font-weight: 500;
          padding: 5px 9px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'JetBrains Mono', monospace;
        }
        .test-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
        .test-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .test-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .empty-state {
          padding: 50px 20px;
          text-align: center;
          color: var(--text-dim);
        }
        .empty-state svg { color: var(--mute); margin-bottom: 10px; }
        .empty-state .empty-title { color: var(--text); font-weight: 600; font-size: 14px; margin-bottom: 4px; }
        .empty-state .empty-sub { font-size: 12.5px; }

        .loading-rows { padding: 0; }
        .skel-row {
          height: 54px;
          border-bottom: 1px solid var(--border-soft);
          display: flex;
          align-items: center;
          padding: 0 18px;
        }
        .skel-bar {
          height: 11px;
          border-radius: 4px;
          background: linear-gradient(90deg, var(--border-soft) 0%, var(--border) 50%, var(--border-soft) 100%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* Side panel */
        .overlay {
          position: fixed; inset: 0;
          background: rgba(5,7,11,0.6);
          backdrop-filter: blur(2px);
          z-index: 40;
          animation: fade-in 0.15s ease;
        }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .side-panel {
          position: fixed;
          top: 0; right: 0;
          width: min(420px, 100vw);
          height: 100vh;
          background: var(--panel);
          border-left: 1px solid var(--border);
          z-index: 41;
          display: flex;
          flex-direction: column;
          animation: slide-in 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: -20px 0 50px rgba(0,0,0,0.4);
        }
        @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .side-head {
          display: flex; justify-content: space-between; align-items: center;
          padding: 18px 20px;
          border-bottom: 1px solid var(--border-soft);
        }
        .side-head h2 { font-size: 15px; margin: 0; font-weight: 600; }
        .side-body { padding: 20px; overflow-y: auto; flex: 1; }
        .field { margin-bottom: 16px; }
        .field label {
          display: block;
          font-size: 11.5px;
          color: var(--text-dim);
          margin-bottom: 6px;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.02em;
        }
        .field input, .field select, .field textarea {
          width: 100%;
          background: var(--panel-2);
          border: 1px solid var(--border);
          color: var(--text);
          padding: 9px 11px;
          border-radius: 6px;
          font-size: 13px;
          font-family: inherit;
        }
        .field input:focus, .field select:focus, .field textarea:focus {
          outline: none;
          border-color: var(--accent);
        }
        .field-row { display: flex; gap: 12px; }
        .field-row .field { flex: 1; }
        .secret-wrap { position: relative; }
        .secret-wrap input { padding-right: 36px; }
        .secret-toggle {
          position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: var(--text-dim); cursor: pointer;
          display: flex;
        }
        .form-error {
          background: var(--bad-dim);
          border: 1px solid rgba(224,122,111,0.3);
          color: var(--bad);
          font-size: 12.5px;
          padding: 9px 11px;
          border-radius: 6px;
          margin-bottom: 16px;
        }
        .side-foot {
          padding: 16px 20px;
          border-top: 1px solid var(--border-soft);
          display: flex;
          gap: 10px;
        }
        .btn-primary {
          flex: 1;
          background: var(--accent);
          color: #0B0E14;
          border: none;
          padding: 10px;
          border-radius: 7px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
        }
        .btn-primary:hover { opacity: 0.9; }
        .btn-ghost {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-dim);
          padding: 10px 16px;
          border-radius: 7px;
          font-size: 13px;
          cursor: pointer;
        }
        .btn-ghost:hover { border-color: var(--text-dim); color: var(--text); }
        .section-divider {
          font-size: 11px;
          color: var(--mute);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin: 22px 0 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section-divider::after { content: ''; flex: 1; height: 1px; background: var(--border-soft); }

        .confirm-box {
          background: var(--panel-2);
          border: 1px solid rgba(224,122,111,0.3);
          border-radius: 8px;
          padding: 14px;
          margin-top: 10px;
        }
        .confirm-box p { font-size: 12.5px; color: var(--text-dim); margin: 0 0 10px; }
        .confirm-actions { display: flex; gap: 8px; }
        .confirm-actions button {
          font-size: 12px; padding: 6px 11px; border-radius: 5px; cursor: pointer;
        }

        .toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: var(--panel);
          border: 1px solid var(--border);
          border-left: 3px solid var(--toast-color);
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 13px;
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
          animation: toast-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          max-width: 320px;
        }
        @keyframes toast-in { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        @media (max-width: 860px) {
          .panel-head { display: none; }
          .row {
            grid-template-columns: 1fr;
            gap: 8px;
            padding: 14px 16px;
          }
          .severity-bar { display: none; }
          .row-actions { justify-content: flex-start; opacity: 1; }
          .url-cell { white-space: normal; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pulse.live::after, .spin, .side-panel, .overlay, .toast { animation: none !important; }
        }
      `}</style>

      {/* Header */}
      <div className="top">
        <div className="title-block">
          <div className="title-icon"><Server size={18} /></div>
          <div>
            <h1>ERP Connections</h1>
            <div className="subtitle">SAP · Oracle · Custom — odata bridge config</div>
          </div>
        </div>
        <button className="add-btn" onClick={openAdd}>
          <Plus size={15} /> Add connection
        </button>
      </div>

      {/* Status filter chips */}
      <div className="stat-row">
        <button
          className={`stat-chip ${filter === "ALL" ? "active" : ""}`}
          style={{ "--chip-color": "#8FB4E0", "--chip-dim": "rgba(143,180,224,0.1)" }}
          onClick={() => setFilter("ALL")}
        >
          <span className="stat-num">{connections.length}</span>
          <span className="stat-label">All</span>
        </button>
        {Object.entries(STATUS_META).map(([key, meta]) => (
          <button
            key={key}
            className={`stat-chip ${filter === key ? "active" : ""}`}
            style={{ "--chip-color": meta.color, "--chip-dim": meta.color + "1A" }}
            onClick={() => setFilter(key)}
          >
            <span className="stat-dot" />
            <span className="stat-num">{counts[key] || 0}</span>
            <span className="stat-label">{meta.label}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="panel-frame">
        {!loading && (
          <div className="panel-head">
            <span></span>
            <span>Connection</span>
            <span>Type</span>
            <span>Endpoint</span>
            <span>Client</span>
            <span>Status</span>
            <span></span>
          </div>
        )}

        {loading ? (
          <div className="loading-rows">
            {[0, 1, 2, 3].map((i) => (
              <div className="skel-row" key={i}>
                <div className="skel-bar" style={{ width: `${60 - i * 8}%` }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Plug size={26} />
            <div className="empty-title">
              {filter === "ALL" ? "No ERP connections yet" : `No ${STATUS_META[filter]?.label.toLowerCase()} connections`}
            </div>
            <div className="empty-sub">
              {filter === "ALL"
                ? "Add a SAP, Oracle, or custom endpoint to start syncing documents."
                : "Switch filters or add a new connection to see it here."}
            </div>
          </div>
        ) : (
          filtered.map((item) => {
            const meta = STATUS_META[item.status];
            const typeMeta = ERP_TYPE_META[item.erpType] || { dot: "#8B93A7" };
            const StatusIcon = meta.icon;
            const isTesting = testingId === item.id;
            return (
              <div className="row" key={item.id}>
                <div className="severity-bar" style={{ "--sev-color": meta.color }} />

                <div>
                  <span className="erp-name">{item.name}</span>
                  {item.isDefault && <span className="default-tag">DEFAULT</span>}
                  {item.description && <div className="erp-desc">{item.description}</div>}
                </div>

                <div className="type-pill">
                  <span className="type-dot" style={{ background: typeMeta.dot }} />
                  {item.erpType}
                </div>

                <div className="url-cell mono" title={item.baseUrl}>{item.baseUrl}</div>

                <div className="client-cell mono">{item.sapClient || "—"}</div>

                <div className="status-cell">
                  <div className="status-line" style={{ color: meta.color }}>
                    <span className={`pulse ${isTesting ? "live" : ""}`} style={{ "--status-color": isTesting ? "var(--accent)" : meta.color }} />
                    {isTesting ? "Testing…" : meta.label}
                  </div>
                  <div className="status-time mono">{timeAgo(item.lastTestedAt)}</div>
                </div>

                <div className="row-actions">
                  <button className="test-btn" disabled={isTesting} onClick={() => testConnection(item)}>
                    {isTesting ? <RefreshCw size={12} className="spin" /> : <Plug size={12} />}
                    {isTesting ? "" : "Test"}
                  </button>
                  <button className="icon-btn" title="Edit" onClick={() => openEdit(item)}>
                    <Pencil size={13} />
                  </button>
                  {item.status !== "INACTIVE" && (
                    <button className="icon-btn danger" title="Deactivate" onClick={() => setConfirmDeleteId(item.id)}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>

                {confirmDeleteId === item.id && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div className="confirm-box">
                      <p>Deactivate <strong>{item.name}</strong>? Document uploads using this connection will stop working until it's reactivated.</p>
                      <div className="confirm-actions">
                        <button
                          style={{ background: "var(--bad)", color: "#0B0E14", border: "none", opacity: deactivatingId === item.id ? 0.6 : 1 }}
                          disabled={deactivatingId === item.id}
                          onClick={() => deactivate(item.id)}
                        >
                          {deactivatingId === item.id ? "Deactivating…" : "Deactivate"}
                        </button>
                        <button
                          className="btn-ghost"
                          style={{ padding: "6px 11px" }}
                          disabled={deactivatingId === item.id}
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Side panel: add / edit */}
      {panel && (
        <>
          <div className="overlay" onClick={closePanel} />
          <div className="side-panel" role="dialog" aria-label="ERP connection form">
            <div className="side-head">
              <h2>{panel.mode === "add" ? "Add ERP connection" : `Edit ${panel.data?.name}`}</h2>
              <button className="icon-btn" onClick={closePanel} aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <div className="side-body">
              {formError && <div className="form-error">{formError}</div>}

              <div className="field">
                <label>Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="SAP-PROD-EU"
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label>ERP type</label>
                  <select
                    value={form.erpType}
                    onChange={(e) => setForm({ ...form, erpType: e.target.value })}
                  >
                    <option value="SAP">SAP</option>
                    <option value="ORACLE">Oracle</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </div>
                {form.erpType === "SAP" && (
                  <div className="field">
                    <label>SAP client</label>
                    <input
                      value={form.sapClient}
                      onChange={(e) => setForm({ ...form, sapClient: e.target.value })}
                      placeholder="100"
                    />
                  </div>
                )}
              </div>

              <div className="field">
                <label>Base URL</label>
                <input
                  className="mono"
                  value={form.baseUrl}
                  onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
                  placeholder="https://host/sap/opu/odata/sap/SERVICE"
                />
              </div>

              <div className="field">
                <label>Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional note about this environment"
                />
              </div>

              <div className="section-divider">Authentication</div>

              <div className="field">
                <label>Auth type</label>
                <select
                  value={form.authType}
                  onChange={(e) => setForm({ ...form, authType: e.target.value })}
                >
                  <option value="BASIC">Basic (username / password)</option>
                  <option value="BEARER">Bearer token</option>
                  <option value="API_KEY">API key</option>
                </select>
              </div>

              {form.authType === "BASIC" && (
                <>
                  <div className="field">
                    <label>Username</label>
                    <input
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      placeholder="DMS_SVC_USER"
                    />
                  </div>
                  <div className="field">
                    <label>Password {panel.mode === "edit" && "(leave blank to keep current)"}</label>
                    <div className="secret-wrap">
                      <input
                        type={showSecret ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder={panel.mode === "edit" ? "••••••••" : ""}
                      />
                      <button type="button" className="secret-toggle" onClick={() => setShowSecret((s) => !s)}>
                        {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {(form.authType === "BEARER" || form.authType === "API_KEY") && (
                <div className="field">
                  <label>
                    {form.authType === "BEARER" ? "Bearer token" : "API key"}
                    {panel.mode === "edit" && " (leave blank to keep current)"}
                  </label>
                  <div className="secret-wrap">
                    <input
                      className="mono"
                      type={showSecret ? "text" : "password"}
                      value={form.apiKey}
                      onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                      placeholder={panel.mode === "edit" ? "••••••••••••" : ""}
                    />
                    <button type="button" className="secret-toggle" onClick={() => setShowSecret((s) => !s)}>
                      {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="side-foot">
              <button className="btn-ghost" onClick={closePanel} disabled={saving}>Cancel</button>
              <button className="btn-primary" onClick={saveConnection} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
                {saving
                  ? (panel.mode === "add" ? "Adding…" : "Saving…")
                  : (panel.mode === "add" ? "Add connection" : "Save changes")}
              </button>
            </div>
          </div>
        </>
      )}
{logs.length > 0 && (
  <div
   ref={logRef}
    style={{
      marginTop: "20px",
      background: "#0d1117",
      color: "#00ff66",
      padding: "15px",
      borderRadius: "8px",
      fontFamily: "monospace",
      height: "220px",
      overflowY: "auto",
      whiteSpace: "pre-wrap",
    }}
  >
    {logs.map((line, index) => (
      <div key={index}>{line}</div>
    ))}
  </div>
)}
      {/* Toast */}
      {toast && (
        <div className="toast" style={{ "--toast-color": toast.type === "ok" ? "var(--ok)" : "var(--bad)" }}>
          {toast.type === "ok" ? <CheckCircle2 size={15} color="var(--ok)" /> : <XCircle size={15} color="var(--bad)" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}