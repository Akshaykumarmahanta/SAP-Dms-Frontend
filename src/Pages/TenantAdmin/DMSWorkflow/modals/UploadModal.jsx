import React, { useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { SAP_BLUE, SAP_DARK, SAP_LIGHT } from "../constants";

export default function UploadModal({ docType, dept, category, onClose, onUploaded }) {
  const [file, setFile]         = useState(null);
  const [title, setTitle]       = useState("");
  const [desc, setDesc]         = useState("");
  const [tags, setTags]         = useState("");
  const [version, setVersion]   = useState("V1");
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleFile = (f) => { setFile(f); if (!title) setTitle(f.name.replace(/\.[^/.]+$/, "")); };

  const handleSubmit = async () => {
    if (!file) { setError("Please select a file."); return; }
    if (!title.trim()) { setError("Document title is required."); return; }
    setLoading(true); setError("");
    try {
      /* --- real API call (uncomment when backend is ready) ---
      const form = new FormData();
      form.append("file", file);
      form.append("documentTypeId", docType.id);
      form.append("title", title);
      form.append("description", desc);
      form.append("tags", tags);
      form.append("version", version);
      const token = localStorage.getItem("accessToken") || "";
      const res   = await fetch("http://localhost:3000/api/documents/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data  = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Upload failed");
      onUploaded(data.documentId, file.name);
      --- */
      // MOCK: simulate upload delay
      await new Promise(r => setTimeout(r, 1200));
      onUploaded("mock-doc-id-" + Date.now(), file.name);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={OVERLAY}>
      <div style={MODAL}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div>
            <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:SAP_DARK }}>Upload Document</h3>
            <p style={{ margin:"3px 0 0", fontSize:11, color:"#64748b" }}>
              {dept?.name} › {category?.name} › {docType?.name}
            </p>
          </div>
          <button onClick={onClose} style={ICON_BTN}><X size={16}/></button>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={e=>{ e.preventDefault(); setDragOver(true); }}
          onDragLeave={()=>setDragOver(false)}
          onDrop={e=>{ e.preventDefault(); setDragOver(false); const f=e.dataTransfer.files[0]; if(f) handleFile(f); }}
          onClick={()=>!loading && document.getElementById("__upload_file__").click()}
          style={{
            border:`2px dashed ${dragOver ? SAP_BLUE : "#cbd5e1"}`,
            borderRadius:10, padding:"20px 16px", textAlign:"center",
            background: dragOver ? SAP_LIGHT : file ? "#f0fdf4" : "#fafbfc",
            cursor: loading ? "default" : "pointer", marginBottom:16, transition:"all 0.2s",
          }}>
          <Upload size={20} color={file ? "#22c55e" : SAP_BLUE} style={{ marginBottom:6 }}/>
          <p style={{ margin:0, fontSize:13, fontWeight:600, color: file ? "#166534" : "#334155" }}>
            {file ? file.name : "Drag & drop or click to choose file"}
          </p>
          {file && <p style={{ margin:"3px 0 0", fontSize:11, color:"#64748b" }}>{(file.size/1024).toFixed(1)} KB</p>}
        </div>
        <input id="__upload_file__" type="file" style={{ display:"none" }}
          onChange={e=>{ const f=e.target.files[0]; e.target.value=""; if(f) handleFile(f); }} />

        {/* Fields */}
        <Field label="Document Title *">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Enter document title" style={INPUT}
            onFocus={e=>e.target.style.borderColor=SAP_BLUE} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
        </Field>
        <Field label="Description">
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Enter description" rows={2}
            style={{ ...INPUT, resize:"vertical" }}
            onFocus={e=>e.target.style.borderColor=SAP_BLUE} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
        </Field>
        <Field label="Tags">
          <input value={tags} onChange={e=>setTags(e.target.value)} placeholder="Enter tags (comma separated)" style={INPUT}
            onFocus={e=>e.target.style.borderColor=SAP_BLUE} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
        </Field>
        <Field label="Version">
          <select value={version} onChange={e=>setVersion(e.target.value)} style={{ ...INPUT, background:"#fff" }}>
            {["V1","V2","V3","V4","V5"].map(v=><option key={v}>{v}</option>)}
          </select>
        </Field>

        {error && (
          <div style={{ padding:"8px 12px", background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:8, color:"#dc2626", fontSize:12, marginBottom:12 }}>
            {error}
          </div>
        )}

        {/* Footer */}
        <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:4 }}>
          <button onClick={onClose} style={BTN_OUTLINE}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{ ...BTN_PRIMARY, opacity:loading?0.75:1 }}>
            {loading ? <><Loader2 size={13} style={{ animation:"spin 1s linear infinite" }}/> Uploading…</> : <><Upload size={13}/> Upload</>}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom:12 }}>
      <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#475569", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>
      {children}
    </div>
  );
}

const OVERLAY = { position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, backdropFilter:"blur(2px)" };
const MODAL   = { background:"#fff", borderRadius:14, padding:28, width:"100%", maxWidth:480, boxShadow:"0 20px 60px rgba(0,0,0,0.2)", maxHeight:"90vh", overflowY:"auto" };
const INPUT   = { width:"100%", border:"1px solid #e2e8f0", borderRadius:8, padding:"8px 12px", fontSize:13, color:"#1e293b", outline:"none", boxSizing:"border-box", fontFamily:"inherit" };
const BTN_OUTLINE = { padding:"9px 20px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", color:"#64748b", fontWeight:600, fontSize:13, cursor:"pointer" };
const BTN_PRIMARY = { padding:"9px 22px", borderRadius:8, border:"none", background:SAP_BLUE, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6 };
const ICON_BTN    = { background:"#f1f5f9", border:"none", borderRadius:8, padding:"6px 8px", cursor:"pointer", display:"flex", color:"#64748b" };