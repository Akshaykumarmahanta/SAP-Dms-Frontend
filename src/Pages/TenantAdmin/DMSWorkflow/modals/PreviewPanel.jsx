import React, { useState, useEffect } from "react";
import { X, Download, Printer, Maximize2, ChevronLeft, ChevronRight, FileText, Loader2 } from "lucide-react";
import { SAP_BLUE, SAP_DARK, SAP_LIGHT, STATUS_COLORS } from "../constants";

const API = "http://localhost:3000/api";
function getToken() { return localStorage.getItem("accessToken") || ""; }
function authHeaders() { return { Authorization: `Bearer ${getToken()}` }; }

export default function PreviewPanel({ doc, allDocs, onClose, onDocChange, onView, onDownload }) {
  const [tab,         setTab]         = useState("details");
  const [currentPage, setCurrentPage] = useState(1);
  const [versions,    setVersions]    = useState([]);
  const [loadingVer,  setLoadingVer]  = useState(false);
  const totalPages = 3;

  const idx     = allDocs.findIndex(d => d.id === doc.id);
  const hasPrev = idx > 0;
  const hasNext = idx < allDocs.length - 1;
  const statusStyle = STATUS_COLORS[doc.uploadStatus] || STATUS_COLORS[doc.status] || { bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" };

  // Fetch version history when tab switches to history
  useEffect(() => {
    if (tab !== "history") return;
    setLoadingVer(true);
    setVersions([]);
    fetch(`${API}/documents/${doc.id}/versions`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => { if (data.success) setVersions(data.data || []); })
      .catch(() => {})
      .finally(() => setLoadingVer(false));
  }, [tab, doc.id]);

  // Reset page on doc change
  useEffect(() => { setCurrentPage(1); setTab("details"); }, [doc.id]);

  const handleDownloadVersion = async (versionDoc) => {
    try {
      const res  = await fetch(`${API}/documents/${versionDoc.id}/download`, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = versionDoc.originalFileName || "document";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Download failed");
    }
  };

  return (
    <div style={PANEL}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid #e2e8f0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <FileText size={15} color={SAP_BLUE} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: SAP_DARK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {doc.originalFileName || doc.name}
          </span>
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button onClick={() => hasPrev && onDocChange(allDocs[idx - 1])} disabled={!hasPrev} style={NAV_BTN(hasPrev)}><ChevronLeft size={14} /></button>
          <button onClick={() => hasNext && onDocChange(allDocs[idx + 1])} disabled={!hasNext} style={NAV_BTN(hasNext)}><ChevronRight size={14} /></button>
          <button onClick={onClose} style={ICON_BTN}><X size={15} /></button>
        </div>
      </div>

      {/* PDF Viewer Mock */}
      <div style={{ position: "relative", background: "#f1f5f9", padding: 16, borderBottom: "1px solid #e2e8f0", flexShrink: 0 }}>
        <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e2e8f0", minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
          <div style={{ width: "100%", padding: "16px 24px", fontFamily: "serif" }}>
            <div style={{ textAlign: "right", marginBottom: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "0.1em", color: "#1e293b" }}>DOCUMENT</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#64748b", marginBottom: 12 }}>
              <div><b>File:</b> {doc.originalFileName || doc.name}</div>
              <div><b>Version:</b> V{doc.version || 1}</div>
            </div>
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 8, fontSize: 11, color: "#94a3b8", textAlign: "center", padding: "20px 0" }}>
              Click "View" to open document
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.35)", borderRadius: 6, padding: "2px 8px", fontSize: 10, color: "#fff" }}>
            Page {currentPage} / {totalPages}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 10 }}>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={NAV_BTN(currentPage > 1)}><ChevronLeft size={13} /></button>
          <span style={{ fontSize: 12, color: "#64748b" }}>{currentPage} / {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={NAV_BTN(currentPage < totalPages)}><ChevronRight size={13} /></button>
        </div>
      </div>

      {/* Action Bar */}
      <div style={{ display: "flex", gap: 8, padding: "10px 16px", borderBottom: "1px solid #e2e8f0", flexShrink: 0, flexWrap: "wrap" }}>
        <ActionBtn
          icon={<Download size={13} />} label="Download"
          color={SAP_BLUE} bg={SAP_LIGHT}
          onClick={() => onDownload ? onDownload(doc) : undefined}
          disabled={doc.uploadStatus !== "COMPLETED"}
        />
        <ActionBtn
          icon={<Maximize2 size={13} />} label="View"
          color="#475569" bg="#f1f5f9"
          onClick={() => onView ? onView(doc) : undefined}
          disabled={doc.uploadStatus !== "COMPLETED"}
        />
        <ActionBtn icon={<Printer size={13} />} label="Print" color="#475569" bg="#f1f5f9" />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", flexShrink: 0 }}>
        {["details", "history"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "10px 0", border: "none", background: "transparent",
            fontWeight: tab === t ? 700 : 500, fontSize: 12,
            color: tab === t ? SAP_BLUE : "#64748b",
            borderBottom: tab === t ? `2px solid ${SAP_BLUE}` : "2px solid transparent",
            cursor: "pointer",
          }}>
            {t === "details" ? "Details" : "Version History"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: "16px", overflowY: "auto", flex: 1 }}>

        {/* ── Details Tab ── */}
        {tab === "details" && (
          <div>
            {[
              ["File Name",    doc.originalFileName || doc.name],
              ["Type",         doc.DocumentType?.name || "—"],
              ["Department",   doc.Department?.name   || "—"],
              ["Category",     doc.Category?.name     || "—"],
              ["Uploaded By",  doc.uploader?.email    || doc.uploadedBy || "—"],
              ["Upload Date",  doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "—"],
              ["Version",      `V${doc.version || 1}`],
              ["TCode",        doc.tcode || "—"],
              ["Status",       null],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f8fafc" }}>
                <span style={{ fontSize: 12, color: "#64748b", flexShrink: 0 }}>{k}</span>
                {k === "Status"
                  ? <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
                      {doc.uploadStatus || doc.status}
                    </span>
                  : k === "TCode" && doc.tcode
                    ? <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: SAP_BLUE }}>{v}</span>
                    : <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", textAlign: "right", maxWidth: 160, wordBreak: "break-all" }}>{v}</span>
                }
              </div>
            ))}
          </div>
        )}

        {/* ── Version History Tab ── */}
        {tab === "history" && (
          <div>
            {loadingVer ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 32, gap: 8, color: "#94a3b8" }}>
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                <span style={{ fontSize: 13 }}>Loading versions…</span>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            ) : versions.length === 0 ? (
              <div style={{ textAlign: "center", padding: 32, color: "#94a3b8", fontSize: 13 }}>
                No version history found
              </div>
            ) : (
              versions.map((vr, i) => {
                const isLatest = i === 0;
                return (
                  <div key={vr.id} style={{ display: "flex", gap: 12, paddingBottom: 16, position: "relative" }}>
                    {i < versions.length - 1 && (
                      <div style={{ position: "absolute", left: 14, top: 28, width: 2, height: "calc(100% - 8px)", background: "#e2e8f0" }} />
                    )}
                    {/* Version circle */}
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: isLatest ? SAP_BLUE : SAP_LIGHT,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: isLatest ? "#fff" : SAP_BLUE,
                      fontSize: 10, fontWeight: 700, zIndex: 1,
                    }}>
                      V{vr.version}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: SAP_DARK }}>Version {vr.version}</span>
                        {isLatest && (
                          <span style={{ fontSize: 10, background: "#f0fdf4", color: "#166534", border: "1px solid #86efac", borderRadius: 20, padding: "1px 8px", fontWeight: 600 }}>
                            Latest
                          </span>
                        )}
                      </div>

                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b" }}>
                        {vr.uploader?.email || vr.uploadedBy || "—"}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8" }}>
                        {vr.createdAt ? new Date(vr.createdAt).toLocaleDateString() : "—"}
                      </p>

                      {/* Status badge */}
                      <div style={{ marginTop: 4 }}>
                        {(() => {
                          const s = STATUS_COLORS[vr.uploadStatus] || { bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" };
                          return (
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                              {vr.uploadStatus}
                            </span>
                          );
                        })()}
                      </div>

                      {/* Download version button — only for COMPLETED */}
                      {vr.uploadStatus === "COMPLETED" && (
                        <button
                          onClick={() => handleDownloadVersion(vr)}
                          style={{ marginTop: 6, fontSize: 11, color: SAP_BLUE, background: "transparent", border: `1px solid ${SAP_BLUE}`, borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <Download size={10} /> Download V{vr.version}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, color, bg, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "6px 12px", borderRadius: 8, border: "none",
        background: disabled ? "#f8fafc" : bg,
        color: disabled ? "#cbd5e1" : color,
        fontWeight: 600, fontSize: 12,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}>
      {icon}{label}
    </button>
  );
}

const PANEL   = { display: "flex", flexDirection: "column", width: 320, minWidth: 280, background: "#fff", borderLeft: "1px solid #e2e8f0", height: "100%" };
const ICON_BTN = { background: "#f1f5f9", border: "none", borderRadius: 7, padding: "5px 7px", cursor: "pointer", display: "flex", color: "#64748b" };
const NAV_BTN  = (active) => ({ background: active ? "#f1f5f9" : "#fafafa", border: "1px solid #e2e8f0", borderRadius: 7, padding: "4px 7px", cursor: active ? "pointer" : "default", display: "flex", color: active ? "#334155" : "#cbd5e1", opacity: active ? 1 : 0.5 });