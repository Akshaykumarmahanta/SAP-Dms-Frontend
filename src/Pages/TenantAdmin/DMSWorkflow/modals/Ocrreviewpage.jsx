import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, ChevronRight } from "lucide-react";
import { SAP_BLUE, SAP_DARK, SAP_LIGHT, SAP_GREEN, SAP_AMBER, OCR_FIELD_LABELS } from "../constants";

const STEPS = ["Dept / Category","Upload","OCR Processing","OCR Review","TCode & Save"];

const MOCK_OCR_FIELDS = {
  invoiceNumber: { value:"INV-2026-001", confidence:"High" },
  invoiceDate:   { value:"12-Jun-2026",  confidence:"High" },
  poNumber:      { value:"PO-9912",      confidence:"Mid"  },
  vendorName:    { value:"ABC Pvt Ltd",  confidence:"High" },
  subTotal:      { value:"20,500",       confidence:"High" },
  gstAmount:     { value:"3,690",        confidence:"Mid"  },
  totalAmount:   { value:"24,190",       confidence:"High" },
  plant:         { value:"PL-01",        confidence:"Low"  },
  costCenter:    { value:"CC-200",       confidence:"Mid"  },
  glAccount:     { value:"GL-4001",      confidence:"Low"  },
};

function Stepper({ current }) {
  return (
    <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:"20px 32px", marginBottom:20, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", position:"relative" }}>
        <div style={{ position:"absolute", top:18, left:"8%", right:"8%", height:2, background:"#e2e8f0", zIndex:0 }}/>
        {STEPS.map((label,i) => {
          const done   = i < current;
          const active = i === current;
          return (
            <div key={label} style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
              <div style={{
                width:38, height:38, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                fontWeight:700, fontSize:13,
                ...(done   ? { background:SAP_GREEN, color:"#fff" }
                  : active ? { background:SAP_BLUE, color:"#fff", boxShadow:`0 0 0 5px rgba(0,112,242,0.18)` }
                  : { background:"#fff", color:"#94a3b8", border:"2px solid #e2e8f0" })
              }}>
                {done ? <CheckCircle2 size={16}/> : i+1}
              </div>
              <span style={{ marginTop:8, fontSize:11, fontWeight:active?700:400, color:active?SAP_BLUE:done?SAP_GREEN:"#94a3b8", textAlign:"center" }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OCRReviewPage({ documentId, fileName, ocrFields, ocrStatus, dept, category, docType, onGenerateTcode, onBack }) {
  const fields = ocrFields || MOCK_OCR_FIELDS;
  const status = ocrStatus || "OCR_COMPLETED";

  const [editedFields, setEditedFields] = useState(() => {
    const init = {};
    OCR_FIELD_LABELS.forEach(({ key }) => { init[key] = fields[key]?.value || ""; });
    return init;
  });
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      /* --- REAL API ---
      const token = localStorage.getItem("accessToken") || "";
      const res   = await fetch(`http://localhost:3000/api/documents/${documentId}/generate-tcode`, {
        method:"POST", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({ fields: editedFields }),
      });
      const data  = await res.json();
      if (data.success) onGenerateTcode(data.tcode, editedFields);
      --- */
      await new Promise(r => setTimeout(r, 900));
      onGenerateTcode("FB60", editedFields);
    } catch {}
    finally { setLoading(false); }
  };

  const confColor = (c) => c==="High" ? SAP_GREEN : c==="Mid" ? SAP_AMBER : "#ef4444";

  return (
    <div style={{ minHeight:"100vh", background:"#F0F4F8", fontFamily:"'72', Arial, sans-serif" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} .fade-up{animation:fadeUp 0.3s ease forwards} .ocr-row:hover{background:#f8fafc}`}</style>

      {/* Breadcrumb */}
      <div style={{ padding:"8px 24px", background:"#fff", borderBottom:"1px solid #e2e8f0", display:"flex", alignItems:"center", gap:6, fontSize:12 }}>
        <span style={{ color:"#64748b" }}>{dept?.name}</span>
        <ChevronRight size={12} color="#94a3b8"/>
        <span style={{ color:"#64748b" }}>{category?.name}</span>
        <ChevronRight size={12} color="#94a3b8"/>
        <span style={{ color:SAP_BLUE, fontWeight:600 }}>{docType?.name}</span>
        <ChevronRight size={12} color="#94a3b8"/>
        <span style={{ color:"#94a3b8" }}>OCR Review</span>
      </div>

      <div style={{ padding:"20px 24px", maxWidth:960, margin:"0 auto" }}>
        <Stepper current={3}/>

        <div className="fade-up" style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:"28px 32px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
          {/* Title */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24, paddingBottom:16, borderBottom:`2px solid ${SAP_LIGHT}` }}>
            <div style={{ width:4, height:28, background:SAP_BLUE, borderRadius:4 }}/>
            <div>
              <h2 style={{ margin:0, fontSize:17, fontWeight:700, color:SAP_DARK }}>OCR Review</h2>
              <p style={{ margin:"2px 0 0", fontSize:12, color:"#64748b" }}>Extracted from: {fileName}</p>
            </div>
          </div>

          {/* Status */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, padding:"10px 16px", background: status==="FAILED"?"#fef2f2":"#f0fdf4", border:`1px solid ${status==="FAILED"?"#fca5a5":"#86efac"}`, borderRadius:10 }}>
            {status==="FAILED"
              ? <AlertCircle size={15} color="#dc2626"/>
              : <CheckCircle2 size={15} color={SAP_GREEN}/>}
            <span style={{ fontSize:13, fontWeight:600, color:status==="FAILED"?"#dc2626":"#166534" }}>
              {status==="FAILED" ? "OCR failed — you can still fill fields manually" : "OCR completed — review and correct if needed"}
            </span>
          </div>

          {/* Field Table */}
          <div style={{ border:"1px solid #e2e8f0", borderRadius:12, overflow:"hidden", marginBottom:20 }}>
            <div style={{ background:"#f8fafc", padding:"10px 16px", borderBottom:"1px solid #e2e8f0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:12, fontWeight:700, color:"#334155" }}>OCR Extracted Data</span>
              <div style={{ display:"flex", gap:14, fontSize:11 }}>
                {[["High",SAP_GREEN],["Mid",SAP_AMBER],["Low","#ef4444"]].map(([l,c])=>(
                  <span key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <span style={{ width:8,height:8,borderRadius:"50%",background:c,display:"inline-block" }}/>
                    {l} Confidence
                  </span>
                ))}
              </div>
            </div>
            {OCR_FIELD_LABELS.map(({ key, label }) => {
              const conf = fields[key]?.confidence || "Low";
              const dot  = confColor(conf);
              return (
                <div key={key} className="ocr-row" style={{ display:"flex", alignItems:"center", gap:16, padding:"11px 16px", borderBottom:"1px solid #f1f5f9" }}>
                  <span style={{ width:140, fontSize:12, color:"#64748b", flexShrink:0 }}>{label}</span>
                  <input
                    value={editedFields[key] || ""}
                    onChange={e => setEditedFields(prev => ({ ...prev, [key]:e.target.value }))}
                    style={{ flex:1, border:"1px solid #e2e8f0", borderRadius:8, padding:"7px 12px", fontSize:13, color:"#1e293b", outline:"none", fontFamily:"inherit" }}
                    onFocus={e=>e.target.style.borderColor=SAP_BLUE}
                    onBlur={e=>e.target.style.borderColor="#e2e8f0"}
                  />
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, minWidth:42 }}>
                    <span style={{ width:8,height:8,borderRadius:"50%",background:dot,display:"inline-block" }}/>
                    <span style={{ fontSize:10, fontWeight:700, color:dot }}>{conf}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <button onClick={onBack} style={{ padding:"10px 20px", borderRadius:10, border:"1px solid #e2e8f0", background:"#fff", color:"#64748b", fontWeight:600, fontSize:13, cursor:"pointer" }}>
              ← Back
            </button>
            <button onClick={handleGenerate} disabled={loading}
              style={{ padding:"10px 28px", borderRadius:10, background:SAP_BLUE, color:"#fff", border:"none", fontWeight:700, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", gap:8, opacity:loading?0.75:1 }}>
              {loading ? <><Loader2 size={15} style={{ animation:"spin 1s linear infinite" }}/> Generating…</> : "Generate TCode →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}