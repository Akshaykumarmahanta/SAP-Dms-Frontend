import React, { useEffect, useRef } from "react";
import { Eye, Download, Clock, RefreshCw, Edit3, Move, Trash2, FileSearch, Share2 } from "lucide-react";

const ACTIONS = [
  { id:"view",     icon:<Eye size={14}/>,        label:"View" },
  { id:"download", icon:<Download size={14}/>,   label:"Download" },
  { id:"history",  icon:<Clock size={14}/>,      label:"Version History" },
  { id:"replace",  icon:<RefreshCw size={14}/>,  label:"Replace Document" },
  { id:"metadata", icon:<Edit3 size={14}/>,      label:"Edit Metadata" },
  { id:"move",     icon:<Move size={14}/>,       label:"Move Document" },
  { id:"delete",   icon:<Trash2 size={14}/>,     label:"Delete Document", danger:true },
  { id:"audit",    icon:<FileSearch size={14}/>, label:"Audit Log" },
  { id:"share",    icon:<Share2 size={14}/>,     label:"Share Document" },
];

export default function ActionMenu({ position, doc, onAction, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Adjust position so menu doesn't overflow screen
  const left = Math.min(position.x, window.innerWidth  - 200);
  const top  = Math.min(position.y, window.innerHeight - (ACTIONS.length * 36 + 16));

  return (
    <div ref={ref} style={{
      position:"fixed", top, left, zIndex:2000,
      background:"#fff", borderRadius:12, border:"1px solid #e2e8f0",
      boxShadow:"0 8px 32px rgba(0,0,0,0.14)", padding:"6px", minWidth:190,
    }}>
      {ACTIONS.map((a, i) => (
        <React.Fragment key={a.id}>
          {a.id === "delete" && <div style={{ height:1, background:"#f1f5f9", margin:"4px 0" }}/>}
          <button
            onClick={() => { onAction(a.id, doc); onClose(); }}
            style={{
              display:"flex", alignItems:"center", gap:10, width:"100%",
              padding:"8px 12px", border:"none", background:"transparent", borderRadius:8,
              cursor:"pointer", fontSize:13, fontWeight:500,
              color: a.danger ? "#dc2626" : "#334155",
              textAlign:"left",
            }}
            onMouseEnter={e => e.currentTarget.style.background = a.danger ? "#fef2f2" : "#f8fafc"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span style={{ color: a.danger ? "#dc2626" : "#64748b" }}>{a.icon}</span>
            {a.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}