import React, { useEffect, useState, useRef } from "react";
import { Bell, LogOut, FileText, Loader2, AlertCircle, CheckCircle2, Upload, ChevronRight, Building2, Tag, FolderOpen, RefreshCw } from "lucide-react";

const API = "http://localhost:3000/api";

function getToken() { return localStorage.getItem("accessToken") || ""; }
function authHeaders() { return { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }; }
function decodeToken() {
  try { const t = getToken(); if (!t) return null; return JSON.parse(atob(t.split(".")[1])); } catch { return null; }
}

const SAP_BLUE   = "#0070F2";
const SAP_DARK   = "#003366";
const SAP_LIGHT  = "#E8F1FD";
const SAP_AMBER  = "#E76500";
const SAP_PURPLE = "#6A1DCB";
const SAP_GREEN  = "#22c55e";

const STEPS = ["Dept / Category", "Upload", "OCR Processing", "OCR Review", "TCode & Save"];

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

const LOG_COLOR  = { SUCCESS: "#22c55e", PROCESSING: "#facc15", FAILED: "#ef4444", INFO: "#60a5fa" };
const LOG_PREFIX = { SUCCESS: "✓", PROCESSING: "⟳", FAILED: "✗", INFO: "›" };

// ── Stepper ──────────────────────────────────────────────────
function Stepper({ current }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "20px 32px", marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
        <div style={{ position: "absolute", top: 18, left: "8%", right: "8%", height: 2, background: "#e2e8f0", zIndex: 0 }} />
        {STEPS.map((label, i) => {
          const done   = i < current;
          const active = i === current;
          return (
            <div key={label} style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 13, transition: "all 0.3s",
                ...(done   ? { background: SAP_GREEN, color: "#fff" }
                  : active ? { background: SAP_BLUE, color: "#fff", boxShadow: "0 0 0 5px rgba(0,112,242,0.18)" }
                  : { background: "#fff", color: "#94a3b8", border: "2px solid #e2e8f0" })
              }}>
                {done ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              <span style={{ marginTop: 8, fontSize: 11, fontWeight: active ? 700 : 400, color: active ? SAP_BLUE : done ? SAP_GREEN : "#94a3b8", textAlign: "center" }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Activity Terminal ────────────────────────────────────────
function ActivityTerminal({ logs, polling }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);
  return (
    <div style={{ background: "#0A1018", borderRadius: 10, fontFamily: "monospace", overflow: "hidden", border: "1px solid #1e2d3d" }}>
      <div style={{ background: "#0F1923", padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #1e2d3d" }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", opacity: 0.7, display: "inline-block" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#facc15", opacity: 0.7, display: "inline-block" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: SAP_GREEN, opacity: 0.7, display: "inline-block" }} />
        <span style={{ marginLeft: 8, fontSize: 11, color: "#475569" }}>document-pipeline — activity</span>
        {polling && <span style={{ marginLeft: "auto", fontSize: 10, color: "#facc15" }}>● live</span>}
      </div>
      <div style={{ padding: "12px 16px", minHeight: 120, maxHeight: 220, overflowY: "auto" }}>
        {logs.length === 0 && <span style={{ fontSize: 12, color: "#334155" }}>Waiting for activity…</span>}
        {logs.map((log, i) => {
          const st = log.status || "INFO";
          const ts = log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : "";
          return (
            <div key={i} style={{ display: "flex", gap: 10, fontSize: 12, lineHeight: 1.7, color: LOG_COLOR[st] || "#94a3b8" }}>
              <span style={{ color: "#334155", minWidth: 72, fontSize: 10, marginTop: 1 }}>{ts}</span>
              <span style={{ fontWeight: 700, width: 14 }}>{LOG_PREFIX[st] || "›"}</span>
              <span>{log.message}</span>
            </div>
          );
        })}
        {polling && (
          <div style={{ display: "flex", gap: 8, fontSize: 12, color: "#facc15", marginTop: 4 }}>
            <span style={{ animation: "blink 1s step-end infinite" }}>▋</span>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}

// ── Document Preview (for OCR Review left panel) ─────────────
function DocumentPreview({ file, fileName }) {
  const [objUrl, setObjUrl] = useState(null);
  const isPdf = fileName?.toLowerCase().endsWith(".pdf");

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setObjUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!file || !objUrl) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", background: "#1a1a2e", borderRadius: 10, color: "#475569", gap: 10 }}>
        <FileText size={32} />
        <span style={{ fontSize: 12 }}>No preview available</span>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", borderRadius: 10, overflow: "hidden", background: "#1a1a2e", display: "flex", flexDirection: "column" }}>
      {/* Topbar */}
      <div style={{ background: "#0F1923", padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1e2d3d", flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>{fileName}</span>
        <div style={{ display: "flex", gap: 6 }}>
          <a href={objUrl} download={fileName} style={{ background: "#1e2d3d", border: "none", borderRadius: 6, padding: "4px 10px", color: "#94a3b8", cursor: "pointer", fontSize: 11, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            ↓ Download
          </a>
        </div>
      </div>
      {/* Preview area */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
        {isPdf ? (
          <iframe
            src={objUrl}
            title="Document Preview"
            style={{ width: "100%", height: "100%", border: "none", borderRadius: 6, background: "#fff" }}
          />
        ) : (
          <img
            src={objUrl}
            alt="Document Preview"
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 6, boxShadow: "0 4px 24px rgba(0,0,0,0.5)" }}
          />
        )}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────
export default function UploadWorkflowPage() {
  const [departments, setDepartments]             = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [error, setError]                         = useState("");
  const [selectedDept, setSelectedDept]           = useState(null);
  const [selectedCat, setSelectedCat]             = useState(null);
  const [selectedDocType, setSelectedDocType]     = useState(null);
  const [dragOver, setDragOver]                   = useState(false);
  const [uploading, setUploading]                 = useState(false);
  const [uploadError, setUploadError]             = useState("");

  // Step tracking
  const [step, setStep]                           = useState(0);
  const [documentId, setDocumentId]               = useState(null);
  const [fileName, setFileName]                   = useState("");
  const [uploadedFile, setUploadedFile]           = useState(null); // keep File object for preview
  const [ocrStatus, setOcrStatus]                 = useState(null);
  const [ocrFields, setOcrFields]                 = useState(null);
  const [activityLogs, setActivityLogs]           = useState([]);
  const [polling, setPolling]                     = useState(false);

  // Step 3: editable OCR fields
  const [editedFields, setEditedFields]           = useState({});

  // Step 4: tcode + live terminal for tcode/sap
  const [tcode, setTcode]                         = useState(null);
  const [tcodeLoading, setTcodeLoading]           = useState(false);
  const [finalizing, setFinalizing]               = useState(false);
  const [finalized, setFinalized]                 = useState(false);

  // Live terminal logs for step 4 (tcode gen + SAP save)
  const [step4Logs, setStep4Logs]                 = useState([]);
  const [step4Polling, setStep4Polling]           = useState(false);

  // Load dept tree
  useEffect(() => {
    async function fetchTree() {
      setLoading(true); setError("");
      try {
        const payload = decodeToken();
        if (!payload?.tenantId) throw new Error("Session invalid.");
        const [deptRes, catRes, dtRes] = await Promise.all([
          fetch(`${API}/departments/tenant/${payload.tenantId}`, { headers: authHeaders() }),
          fetch(`${API}/categories`, { headers: authHeaders() }),
          fetch(`${API}/document-types`, { headers: authHeaders() }),
        ]);
        const depts = (await deptRes.json()).data || [];
        const cats  = (await catRes.json()).data  || [];
        const dts   = (await dtRes.json()).data   || [];
        setDepartments(depts.map(d => ({
          ...d,
          categories: cats.filter(c => c.departmentId === d.id).map(c => ({
            ...c, documentTypes: dts.filter(dt => dt.categoryId === c.id).map(dt => ({ id: dt.id, name: dt.name }))
          }))
        })));
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    }
    fetchTree();
  }, []);

  // Poll OCR status + activity while processing (step 2)
  useEffect(() => {
    if (!polling || !documentId) return;
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };
    const timer = setInterval(async () => {
      try {
        const [sRes, aRes] = await Promise.all([
          fetch(`${API}/documents/${documentId}/status`, { headers }),
          fetch(`${API}/documents/${documentId}/activity`, { headers }),
        ]);
        const sData = await sRes.json();
        const aData = await aRes.json();
        if (aData.success) setActivityLogs(aData.logs || []);
        if (sData.success) {
          setOcrStatus(sData.status);
          if (sData.status === "OCR_COMPLETED" || sData.status === "WAITING_FOR_APPROVAL" || sData.status === "COMPLETED") {
            setPolling(false);
            if (sData.metadata?.fields) {
              const f = sData.metadata.fields;
              setOcrFields(f);
              const init = {};
              OCR_FIELD_LABELS.forEach(({ key }) => { init[key] = f[key]?.value || ""; });
              setEditedFields(init);
            }
            setStep(3);
          } else if (sData.status === "FAILED") {
            setPolling(false);
            setStep(3);
          }
        }
      } catch {}
    }, 2000);
    return () => clearInterval(timer);
  }, [polling, documentId]);

  // Poll activity logs for step 4 (tcode + sap)
  useEffect(() => {
    if (!step4Polling || !documentId) return;
    const headers = { Authorization: `Bearer ${getToken()}` };
    const timer = setInterval(async () => {
      try {
        const [sRes, aRes] = await Promise.all([
          fetch(`${API}/documents/${documentId}/status`, { headers }),
          fetch(`${API}/documents/${documentId}/activity`, { headers }),
        ]);
        const sData = await sRes.json();
        const aData = await aRes.json();
        if (aData.success) setStep4Logs(aData.logs || []);
        if (sData.success) {
          if (sData.status === "COMPLETED" || sData.status === "FAILED") {
            setStep4Polling(false);
            if (sData.status === "COMPLETED") setFinalized(true);
          }
        }
      } catch {}
    }, 1500);
    return () => clearInterval(timer);
  }, [step4Polling, documentId]);

  const handleDeptSelect = (d) => { setSelectedDept(d); setSelectedCat(null); setSelectedDocType(null); };
  const handleCatSelect  = (c) => { setSelectedCat(c); setSelectedDocType(null); };
  const handleDocTypeSelect = (dt) => { setSelectedDocType(dt); setStep(1); };

  const handleFileUpload = async (file) => {
    if (!file || !selectedDocType) return;
    setUploading(true); setUploadError(""); setActivityLogs([]);
    setUploadedFile(file); // store for preview
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("documentTypeId", selectedDocType.id);
      const res  = await fetch(`${API}/documents/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: form,
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Upload failed");
      setDocumentId(data.documentId);
      setFileName(file.name);
      setStep(2);
      setPolling(true);
    } catch (e) { setUploadError(e.message); setUploadedFile(null); }
    finally { setUploading(false); }
  };

  const handleGenerateTcode = async () => {
    setTcodeLoading(true);
    // Add initial log entry immediately
    setStep4Logs(prev => [...prev, { message: "Generating TCode...", status: "PROCESSING", timestamp: new Date() }]);
    try {
      const res  = await fetch(`${API}/documents/${documentId}/generate-tcode`, {
        method: "POST", headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setTcode(data.tcode);
        setStep4Logs(prev => [...prev, { message: `TCode generated: ${data.tcode}`, status: "SUCCESS", timestamp: new Date() }]);
        setStep(4);
      }
    } catch {
      setStep4Logs(prev => [...prev, { message: "TCode generation failed", status: "FAILED", timestamp: new Date() }]);
    }
    finally { setTcodeLoading(false); }
  };

  const handleFinalize = async () => {
    setFinalizing(true);
    setStep4Logs(prev => [...prev, { message: "Saving document to SAP...", status: "PROCESSING", timestamp: new Date() }]);
    setStep4Polling(true);
    try {
      const res = await fetch(`${API}/documents/${documentId}/finalize`, {
        method: "POST", headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setStep4Logs(prev => [...prev, { message: "Document archived successfully", status: "SUCCESS", timestamp: new Date() }]);
        setFinalized(true);
        setStep4Polling(false);
      }
    } catch {
      setStep4Logs(prev => [...prev, { message: "SAP save failed", status: "FAILED", timestamp: new Date() }]);
      setStep4Polling(false);
    }
    finally { setFinalizing(false); }
  };

  const handleLogout = () => { localStorage.removeItem("accessToken"); localStorage.removeItem("refreshToken"); window.location.href = "/login"; };

  const resetFlow = () => {
    setStep(0); setSelectedDocType(null); setSelectedCat(null); setSelectedDept(null);
    setDocumentId(null); setFileName(""); setUploadedFile(null);
    setOcrStatus(null); setOcrFields(null);
    setActivityLogs([]); setEditedFields({}); setTcode(null); setFinalized(false);
    setUploadError(""); setStep4Logs([]); setStep4Polling(false);
  };

  const cats  = selectedDept?.categories || [];
  const dts   = selectedCat?.documentTypes || [];

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F8", fontFamily: "'72', Arial, sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.3s ease forwards; }
        .card-hover { transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s; }
        .card-hover:hover { transform: translateY(-2px); }
        .ocr-field-row:hover { background: #f8fafc; }
      `}</style>

      {/* Header */}
      <div style={{ background: SAP_DARK, borderBottom: `3px solid ${SAP_BLUE}`, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>SAP Document Portal</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, padding: "6px 12px", color: "#fff", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><Bell size={14}/> Alerts</button>
          <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, padding: "6px 12px", color: "#fff", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><LogOut size={14}/> Logout</button>
        </div>
      </div>

      <div style={{ padding: "20px 24px", maxWidth: step === 3 ? 1200 : 1000, margin: "0 auto" }}>
        <Stepper current={step} />

        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "28px 32px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

          {/* ══ STEP 0 + 1: Select Dept/Cat/DocType + Upload ══ */}
          {(step === 0 || step === 1) && (<>
            {loading && <div style={{ color: "#94a3b8", fontSize: 14 }}>Loading…</div>}
            {error   && <div style={{ color: "#dc2626", fontSize: 14 }}>{error}</div>}
            {!loading && !error && (
              <div className="fade-up">
                <Label icon={<Building2 size={13} color={SAP_BLUE}/>} text="Select Department" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: 12, marginBottom: 28 }}>
                  {departments.map(d => (
                    <SelectCard key={d.id} label={d.name} sub={`${d.categories.length} categories`} icon={<Building2 size={15}/>}
                      active={selectedDept?.id === d.id} color={SAP_BLUE} lightBg={SAP_LIGHT}
                      onClick={() => handleDeptSelect(d)} />
                  ))}
                </div>
              </div>
            )}

            {selectedDept && (
              <div className="fade-up">
                <Label icon={<Tag size={13} color={SAP_AMBER}/>} text={`Category — ${selectedDept.name}`} />
                {cats.length === 0
                  ? <Empty text="No categories in this department." />
                  : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: 12, marginBottom: 28 }}>
                      {cats.map(c => (
                        <SelectCard key={c.id} label={c.name} sub={`${c.documentTypes.length} doc types`} icon={<Tag size={15}/>}
                          active={selectedCat?.id === c.id} color={SAP_AMBER} lightBg="#FFF8F0"
                          onClick={() => handleCatSelect(c)} />
                      ))}
                    </div>
                }
              </div>
            )}

            {selectedCat && (
              <div className="fade-up">
                <Label icon={<FileText size={13} color={SAP_PURPLE}/>} text={`Document Type — ${selectedCat.name}`} />
                {dts.length === 0
                  ? <Empty text="No document types in this category." />
                  : <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
                      {dts.map(dt => (
                        <SelectCard key={dt.id} label={dt.name} icon={<FileText size={16}/>}
                          active={selectedDocType?.id === dt.id} color={SAP_PURPLE} lightBg="#F5EEFF"
                          onClick={() => handleDocTypeSelect(dt)} />
                      ))}
                    </div>
                }
              </div>
            )}

            {selectedDept && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", padding: "10px 14px", background: "#f8faff", borderRadius: 10, border: "1px solid #e0ecff", marginBottom: 20 }}>
                <Crumb color={SAP_BLUE} bg={SAP_LIGHT} icon={<Building2 size={11}/>} label={selectedDept.name} />
                {selectedCat && <><ChevronRight size={12} color="#94a3b8"/><Crumb color="#7C2D00" bg="#FFF3E0" icon={<Tag size={11}/>} label={selectedCat.name} /></>}
                {selectedDocType && <><ChevronRight size={12} color="#94a3b8"/><Crumb color={SAP_PURPLE} bg="#F5EEFF" icon={<FileText size={11}/>} label={selectedDocType.name} /></>}
              </div>
            )}

            {selectedDocType && (
              <div className="fade-up">
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFileUpload(f); }}
                  onClick={() => !uploading && document.getElementById("__file__").click()}
                  style={{
                    border: `2px dashed ${dragOver ? SAP_BLUE : "#cbd5e1"}`,
                    borderRadius: 12, padding: "32px 20px", textAlign: "center",
                    background: dragOver ? SAP_LIGHT : "#fafbfc",
                    cursor: uploading ? "default" : "pointer", transition: "all 0.2s",
                  }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: SAP_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    {uploading
                      ? <Loader2 size={22} color={SAP_BLUE} style={{ animation: "spin 1s linear infinite" }} />
                      : <Upload size={22} color={SAP_BLUE} />}
                  </div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#334155" }}>{uploading ? "Uploading…" : "Drag & drop or click to upload"}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8" }}>Uploading to: {selectedDocType.name}</p>
                </div>
                <input id="__file__" type="file" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; e.target.value = ""; if (f) handleFileUpload(f); }} />
                {uploadError && (
                  <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "10px 14px", color: "#dc2626", fontSize: 13 }}>
                    <AlertCircle size={15}/> {uploadError}
                  </div>
                )}
              </div>
            )}
          </>)}

          {/* ══ STEP 2: OCR Processing (live terminal) ══ */}
          {step === 2 && (
            <div className="fade-up">
              <SectionTitle title="OCR Processing" sub={`Processing: ${fileName}`} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "10px 16px", background: "#fefce8", border: "1px solid #fde68a", borderRadius: 10 }}>
                <Loader2 size={16} color="#d97706" style={{ animation: "spin 1s linear infinite", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#92400e", fontWeight: 600 }}>OCR running — please wait, this may take a few seconds…</span>
              </div>
              <ActivityTerminal logs={activityLogs} polling={polling} />
            </div>
          )}

          {/* ══ STEP 3: OCR Review — Split Layout ══ */}
          {step === 3 && (
            <div className="fade-up">
              <SectionTitle title="OCR Review" sub={`Extracted from: ${fileName}`} />

              {/* Status bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, padding: "10px 16px", background: ocrStatus === "FAILED" ? "#fef2f2" : "#f0fdf4", border: `1px solid ${ocrStatus === "FAILED" ? "#fca5a5" : "#86efac"}`, borderRadius: 10 }}>
                {ocrStatus === "FAILED"
                  ? <AlertCircle size={15} color="#dc2626"/>
                  : <CheckCircle2 size={15} color={SAP_GREEN}/>}
                <span style={{ fontSize: 13, fontWeight: 600, color: ocrStatus === "FAILED" ? "#dc2626" : "#166534" }}>
                  {ocrStatus === "FAILED" ? "OCR failed — you can still proceed manually" : "OCR completed successfully"}
                </span>
              </div>

              {/* ── Two-column layout: preview left, OCR fields right ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

                {/* Left: Document Preview */}
                <div style={{ height: 520 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <FileText size={12} color={SAP_BLUE}/> Document Preview
                  </div>
                  <div style={{ height: "calc(100% - 28px)" }}>
                    <DocumentPreview file={uploadedFile} fileName={fileName} />
                  </div>
                </div>

                {/* Right: OCR Fields */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 12, height: 12, borderRadius: 2, background: SAP_BLUE, display: "inline-block" }} />
                      OCR Extracted Data
                    </span>
                    <div style={{ display: "flex", gap: 12, fontSize: 11, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: SAP_GREEN, display: "inline-block" }}/> High</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: SAP_AMBER, display: "inline-block" }}/> Mid</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block" }}/> Low</span>
                    </div>
                  </div>

                  <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", flex: 1, overflowY: "auto" }}>
                    {OCR_FIELD_LABELS.map(({ key, label }) => {
                      const conf = ocrFields?.[key]?.confidence || "Low";
                      const dotColor = conf === "High" ? SAP_GREEN : conf === "Mid" ? SAP_AMBER : "#ef4444";
                      return (
                        <div key={key} className="ocr-field-row" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: "1px solid #f1f5f9" }}>
                          <span style={{ width: 110, fontSize: 11, color: "#64748b", flexShrink: 0 }}>{label}</span>
                          <input
                            value={editedFields[key] || ""}
                            onChange={e => setEditedFields(prev => ({ ...prev, [key]: e.target.value }))}
                            style={{ flex: 1, border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#1e293b", outline: "none", minWidth: 0 }}
                            onFocus={e => e.target.style.borderColor = SAP_BLUE}
                            onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                          />
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 32 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor, display: "inline-block" }}/>
                            <span style={{ fontSize: 9, fontWeight: 700, color: dotColor }}>{conf}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Activity log (collapsed) */}
              <details style={{ marginBottom: 20 }}>
                <summary style={{ fontSize: 12, color: "#64748b", cursor: "pointer", marginBottom: 8 }}>View activity log</summary>
                <ActivityTerminal logs={activityLogs} polling={false} />
              </details>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={handleGenerateTcode} disabled={tcodeLoading}
                  style={{ padding: "10px 28px", borderRadius: 10, background: SAP_BLUE, color: "#fff", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, opacity: tcodeLoading ? 0.7 : 1 }}>
                  {tcodeLoading ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }}/> Generating…</> : "Generate TCode →"}
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP 4: TCode + Finalize with Live Terminal ══ */}
          {step === 4 && !finalized && (
            <div className="fade-up">
              <SectionTitle title="TCode & Save to SAP" sub={`Document: ${fileName}`} />

              {/* Two-column: left = preview + terminal, right = summary + actions */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                {/* Left: preview + live terminal */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Mini preview */}
                  <div style={{ height: 260 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                      <FileText size={12} color={SAP_BLUE}/> Document
                    </div>
                    <div style={{ height: "calc(100% - 28px)" }}>
                      <DocumentPreview file={uploadedFile} fileName={fileName} />
                    </div>
                  </div>

                  {/* Live terminal */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: step4Polling ? "#22c55e" : "#475569", display: "inline-block" }} />
                      Pipeline Activity
                    </div>
                    <ActivityTerminal logs={step4Logs} polling={step4Polling} />
                  </div>
                </div>

                {/* Right: tcode display + summary + action buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* TCode display */}
                  {tcode && (
                    <div style={{ padding: "18px 20px", background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 12, display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: SAP_GREEN, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <CheckCircle2 size={20} color="#fff"/>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 11, color: "#166534" }}>Transaction Code Generated</p>
                        <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 800, color: SAP_DARK, fontFamily: "monospace", letterSpacing: "0.05em" }}>{tcode}</p>
                      </div>
                    </div>
                  )}

                  {/* Document Summary */}
                  <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", flex: 1 }}>
                    <div style={{ background: "#f8fafc", padding: "10px 16px", borderBottom: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>Document Summary</span>
                    </div>
                    <div style={{ overflowY: "auto", maxHeight: 280 }}>
                      {OCR_FIELD_LABELS.filter(f => editedFields[f.key]).map(({ key, label }) => (
                        <div key={key} style={{ display: "flex", padding: "9px 16px", borderBottom: "1px solid #f1f5f9" }}>
                          <span style={{ width: 130, fontSize: 11, color: "#64748b" }}>{label}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>{editedFields[key]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setStep(3)} style={{ flex: 1, padding: "10px 16px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                      ← Back
                    </button>
                    <button onClick={handleFinalize} disabled={finalizing}
                      style={{ flex: 2, padding: "10px 20px", borderRadius: 10, background: SAP_DARK, color: "#fff", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: finalizing ? 0.7 : 1 }}>
                      {finalizing ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }}/> Saving to SAP…</> : "Save to SAP ✓"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ FINALIZED ══ */}
          {finalized && (
            <div className="fade-up" style={{ textAlign: "center", padding: "48px 0" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: SAP_GREEN, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <CheckCircle2 size={36} color="#fff"/>
              </div>
              <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800, color: SAP_DARK }}>Document Archived!</h2>
              <p style={{ margin: "0 0 4px", fontSize: 14, color: "#64748b" }}>File: <strong>{fileName}</strong></p>
              <p style={{ margin: "0 0 28px", fontSize: 14, color: "#64748b" }}>TCode: <strong style={{ fontFamily: "monospace", color: SAP_DARK }}>{tcode}</strong></p>
              <button onClick={resetFlow} style={{ padding: "12px 32px", borderRadius: 10, background: SAP_BLUE, color: "#fff", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
                <RefreshCw size={15}/> Upload Another Document
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ── Small helpers ────────────────────────────────────────────
function Label({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
      {icon}
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b" }}>{text}</span>
    </div>
  );
}
function SelectCard({ label, sub, icon, active, color, lightBg, onClick }) {
  return (
    <button onClick={onClick} className="card-hover"
      style={{ borderRadius: 12, border: active ? `2px solid ${color}` : "1.5px solid #e2e8f0", padding: "14px 16px", textAlign: "left", cursor: "pointer", background: active ? lightBg : "#fff", position: "relative", overflow: "hidden", width: "100%" }}>
      {active && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: "12px 12px 0 0" }} />}
      <div style={{ width: 32, height: 32, borderRadius: 8, background: active ? color : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, color: active ? "#fff" : "#64748b" }}>
        {icon}
      </div>
      <div style={{ fontWeight: 700, fontSize: 13, color: "#1e293b" }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{sub}</div>}
    </button>
  );
}
function Crumb({ color, bg, icon, label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: bg, color, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>
      {icon} {label}
    </span>
  );
}
function Empty({ text }) {
  return <div style={{ fontSize: 13, color: "#94a3b8", padding: "12px 16px", background: "#f8fafc", borderRadius: 10, border: "1.5px dashed #e2e8f0", marginBottom: 20 }}>{text}</div>;
}
function SectionTitle({ title, sub }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: `2px solid ${SAP_LIGHT}` }}>
      <div style={{ width: 4, height: 28, background: SAP_BLUE, borderRadius: 4 }} />
      <div>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: SAP_DARK }}>{title}</h2>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>{sub}</p>
      </div>
    </div>
  );
}