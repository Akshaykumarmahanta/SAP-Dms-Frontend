import { useState, useEffect, useRef } from "react";

const CONF_COLORS = {
  High: "text-green-500",
  Mid:  "text-orange-400",
  Low:  "text-red-400",
};

const CONF_DOT = {
  High: "bg-green-500",
  Mid:  "bg-orange-400",
  Low:  "bg-red-400",
};

const OCR_FIELD_LABELS = [
  { key: "invoiceNumber", label: "Invoice Number" },
  { key: "invoiceDate",   label: "Invoice Date" },
  { key: "poNumber",      label: "PO Number" },
  { key: "vendorName",    label: "Vendor Name" },
  { key: "subTotal",      label: "Sub Total" },
  { key: "gstAmount",     label: "GST Amount" },
  { key: "totalAmount",   label: "Total Amount" },
  { key: "plant",         label: "Plant" },
  { key: "costCenter",    label: "Cost Center" },
  { key: "glAccount",     label: "GL Account" },
];

const LOG_COLORS = {
  SUCCESS:    "text-green-400",
  PROCESSING: "text-yellow-300",
  FAILED:     "text-red-400",
  INFO:       "text-blue-300",
};

const LOG_PREFIX = {
  SUCCESS:    "✓",
  PROCESSING: "⟳",
  FAILED:     "✗",
  INFO:       "›",
};

export default function DocumentViewer({ documentId, fileName, onClose }) {
  const [status, setStatus]     = useState(null);   // OCR fields
  const [logs, setLogs]         = useState([]);
  const [polling, setPolling]   = useState(true);
  const [version]               = useState("v1.0");
  const [activeTab, setActiveTab] = useState("ocr"); // "ocr" | "log"
  const logsEndRef              = useRef(null);

  // Poll status + activity every 2s until COMPLETED or FAILED
  useEffect(() => {
    if (!documentId) return;
    let timer;

    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [statusRes, activityRes] = await Promise.all([
          fetch(`/api/documents/${documentId}/status`, { headers }),
          fetch(`/api/documents/${documentId}/activity`, { headers }),
        ]);

        const statusData   = await statusRes.json();
        const activityData = await activityRes.json();

        if (statusData.success) {
          setStatus(statusData);
          if (
            statusData.status === "OCR_COMPLETED" ||
            statusData.status === "COMPLETED" ||
            statusData.status === "FAILED"
          ) {
            setPolling(false);
          }
        }

        if (activityData.success) {
          setLogs(activityData.logs || []);
        }
      } catch (e) {
        console.error("Poll error:", e);
      }
    };

    fetchAll();
    if (polling) {
      timer = setInterval(fetchAll, 2000);
    }
    return () => clearInterval(timer);
  }, [documentId, polling]);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const fields = status?.metadata?.fields || null;

  const highCount = fields
    ? Object.values(fields).filter((f) => f.confidence === "High").length
    : 0;
  const midCount = fields
    ? Object.values(fields).filter((f) => f.confidence === "Mid").length
    : 0;

  return (
    <div className="flex flex-col h-full bg-[#1A2433] text-white rounded-xl overflow-hidden border border-slate-700">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700 bg-[#151E2C]">
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-slate-300 font-medium truncate max-w-[200px]">
            {fileName || "Document"}
          </span>
          <button className="text-[11px] px-3 py-1 border border-slate-600 rounded text-slate-400 hover:text-white hover:border-slate-400 transition-colors">
            ↓ Download
          </button>
          <button className="text-[11px] px-3 py-1 border border-slate-600 rounded text-slate-400 hover:text-white hover:border-slate-400 transition-colors">
            ↑ New Ver
          </button>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white text-[18px] transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-slate-700 bg-[#151E2C]">
        <button
          onClick={() => setActiveTab("ocr")}
          className={`px-5 py-2 text-[12px] font-semibold border-b-2 transition-colors ${
            activeTab === "ocr"
              ? "border-blue-500 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          OCR Extracted Data
        </button>
        <button
          onClick={() => setActiveTab("log")}
          className={`px-5 py-2 text-[12px] font-semibold border-b-2 transition-colors ${
            activeTab === "log"
              ? "border-blue-500 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Activity Log
          {polling && (
            <span className="ml-2 inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* ── OCR Tab ── */}
      {activeTab === "ocr" && (
        <div className="flex-1 overflow-y-auto">
          {/* Subheader */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700/60">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-white">OCR Extracted Data</span>
              <span className="text-[11px] text-slate-400 bg-slate-700 px-2 py-[2px] rounded">
                {version}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-slate-400">Conf:</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                <span className="text-green-400">High</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                <span className="text-orange-400">Mid</span>
              </span>
            </div>
          </div>

          {/* Status badge */}
          {status?.status && (
            <div className="px-5 py-2 text-[11px] text-slate-400 border-b border-slate-700/40">
              Status:{" "}
              <span
                className={`font-semibold ${
                  status.status === "COMPLETED"
                    ? "text-green-400"
                    : status.status === "FAILED"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {status.status.replace(/_/g, " ")}
              </span>
              {polling && (
                <span className="ml-2 text-yellow-400 animate-pulse">
                  ● processing…
                </span>
              )}
            </div>
          )}

          {/* Fields */}
          {!fields ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-slate-500">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-[12px]">Extracting OCR data…</span>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {OCR_FIELD_LABELS.map(({ key, label }) => {
                const field = fields[key];
                const conf  = field?.confidence || "Low";
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between px-5 py-[14px] hover:bg-slate-700/20 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-[11px] text-slate-400 mb-[6px]">{label}</p>
                      <input
                        readOnly
                        value={field?.value || "—"}
                        className="w-full bg-[#0F1923] border border-slate-700 rounded-md px-3 py-[7px] text-[13px] text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="ml-4 flex flex-col items-center gap-1 min-w-[40px]">
                      <span className={`w-2 h-2 rounded-full ${CONF_DOT[conf]}`} />
                      <span className={`text-[10px] font-bold ${CONF_COLORS[conf]}`}>
                        {conf}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Summary bar */}
          {fields && (
            <div className="flex items-center gap-4 px-5 py-3 bg-[#0F1923] border-t border-slate-700 text-[11px]">
              <span className="text-green-400 font-semibold">{highCount} High</span>
              <span className="text-orange-400 font-semibold">{midCount} Mid</span>
              <span className="text-slate-500 ml-auto">
                {highCount + midCount}/{OCR_FIELD_LABELS.length} fields extracted
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Activity Log Tab (terminal style) ── */}
      {activeTab === "log" && (
        <div className="flex-1 overflow-y-auto bg-[#0A1018] font-mono">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-700/50 bg-[#0F1923]">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-3 text-[11px] text-slate-500">document-pipeline — activity</span>
          </div>

          <div className="p-4 space-y-[6px] min-h-[200px]">
            {logs.length === 0 && (
              <span className="text-[12px] text-slate-600">Waiting for activity…</span>
            )}
            {logs.map((log, i) => {
              const st  = log.status || "INFO";
              const ts  = log.timestamp
                ? new Date(log.timestamp).toLocaleTimeString()
                : "";
              return (
                <div key={i} className="flex items-start gap-2 text-[12px] leading-relaxed">
                  <span className="text-slate-600 min-w-[70px] text-[10px] mt-[1px]">
                    {ts}
                  </span>
                  <span className={`font-bold ${LOG_COLORS[st] || "text-slate-400"} w-4`}>
                    {LOG_PREFIX[st] || "›"}
                  </span>
                  <span className={LOG_COLORS[st] || "text-slate-300"}>
                    {log.message}
                  </span>
                </div>
              );
            })}
            {polling && (
              <div className="flex items-center gap-2 text-[12px] text-yellow-400">
                <span className="animate-pulse">▋</span>
                <span className="text-slate-500 text-[10px]">live</span>
              </div>
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}