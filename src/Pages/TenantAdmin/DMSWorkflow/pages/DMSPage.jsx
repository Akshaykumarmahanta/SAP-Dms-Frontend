import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Folder,
  FolderOpen,
  Search,
  MoreVertical,
  Upload,
  ChevronRight,
  Hash,
} from "lucide-react";
import {
  SAP_BLUE,
  SAP_DARK,
  SAP_LIGHT,
  SAP_AMBER,
  SAP_PURPLE,
  SAP_GREEN,
  STATUS_COLORS,
} from "../constants";
import UploadModal from "../modals/UploadModal";
import PreviewPanel from "../modals/PreviewPanel";
import ActionMenu from "../modals/ActionMenu";
// import TCodeSearchModal from "../modals/TCodeSearchModal";

// ─── API helpers ─────────────────────────────────────────────
const API = "http://localhost:3000/api";
function getToken() {
  return localStorage.getItem("accessToken") || "";
}
function authHeaders(extra = {}) {
  return { Authorization: `Bearer ${getToken()}`, ...extra };
}
function decodeToken() {
  try {
    return JSON.parse(atob(getToken().split(".")[1]));
  } catch {
    return null;
  }
}

// ─── Status Badge ─────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || {
    bg: "#f1f5f9",
    color: "#64748b",
    border: "#e2e8f0",
  };
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: 20,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

// ─── TCode Pill ───────────────────────────────────────────────
function TCodePill({ tcode }) {
  const [copied, setCopied] = useState(false);
  if (!tcode) return <span style={{ fontSize: 12, color: "#cbd5e1" }}>—</span>;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(tcode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      title="Click to copy TCode"
      style={{
        fontFamily: "monospace",
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: 6,
        background: copied ? "#f0fdf4" : `${SAP_BLUE}10`,
        color: copied ? "#16a34a" : SAP_BLUE,
        border: `1px solid ${copied ? "#86efac" : `${SAP_BLUE}30`}`,
        cursor: "pointer",
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
        transition: "all 0.15s",
      }}
    >
      {copied ? "✓ Copied" : tcode}
    </button>
  );
}

export default function DMSPage({ onUploadFlow, onTCodeSearch }) {
  // ─── Tree state ───────────────────────────────────────────
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ─── Selection state ──────────────────────────────────────
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState(null);

  // ─── Search state ─────────────────────────────────────────
  const [searchDept, setSearchDept] = useState("");
  const [searchCat, setSearchCat] = useState("");
  const [searchDocType, setSearchDocType] = useState("");
  const [searchDoc, setSearchDoc] = useState("");

  // ─── Docs state ───────────────────────────────────────────
  const [docs, setDocs] = useState([]);
  const [totalDocsCount, setTotalDocsCount] = useState(0);

  const [loadingDocs, setLoadingDocs] = useState(false);

  // ─── UI state ─────────────────────────────────────────────
  const [showUpload, setShowUpload] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [actionMenu, setActionMenu] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  // const [showTCodeSearch, setShowTCodeSearch] = useState(false);

  // ─── Fetch department tree ────────────────────────────────
  useEffect(() => {
    async function fetchTree() {
      setLoading(true);
      setError("");
      try {
        const payload = decodeToken();
        if (!payload?.tenantId)
          throw new Error("Session invalid. Please login again.");

        const [deptRes, catRes, dtRes] = await Promise.all([
          fetch(`${API}/departments/tenant/${payload.tenantId}`, {
            headers: authHeaders(),
          }),
          fetch(`${API}/categories`, { headers: authHeaders() }),
          fetch(`${API}/document-types`, { headers: authHeaders() }),
        ]);

        const deptData = await deptRes.json();
        const catData = await catRes.json();
        const dtData = await dtRes.json();

        if (!deptRes.ok)
          throw new Error(deptData.message || "Failed to load departments");

        const cats = catData.data || catData || [];
        const dts = dtData.data || dtData || [];

        const tree = (deptData.data || []).map((dept) => ({
          id: dept.id,
          name: dept.name,
          code: dept.code,
          categories: cats
            .filter((c) => c.departmentId === dept.id)
            .map((cat) => ({
              id: cat.id,
              name: cat.name,
              documentTypes: dts
                .filter((d) => d.categoryId === cat.id)
                .map((dt) => ({
                  id: dt.id,
                  name: dt.name,
                  count: dt.documentCount ?? dt.count ?? dt.totalDocuments ?? 0,
                })),
            })),
        }));

        setDepartments(tree);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTree();
  }, []);

  // ─── Filtered lists ───────────────────────────────────────
  const filtDepts = departments.filter((d) =>
    d.name.toLowerCase().includes(searchDept.toLowerCase()),
  );
  const filtCats = (selectedDept?.categories || []).filter((c) =>
    c.name.toLowerCase().includes(searchCat.toLowerCase()),
  );
  const filtDocTypes = (selectedCat?.documentTypes || []).filter((dt) =>
    dt.name.toLowerCase().includes(searchDocType.toLowerCase()),
  );
  const filtDocs = docs.filter((d) => {
    const matchName = (d.originalFileName || d.name || "")
      .toLowerCase()
      .includes(searchDoc.toLowerCase());
    const matchTCode = (d.tcode || "")
      .toLowerCase()
      .includes(searchDoc.toLowerCase());
    const matchStatus = filterStatus
      ? (d.uploadStatus || d.status) === filterStatus
      : true;
    return (matchName || matchTCode) && matchStatus;
  });

  // ─── Handlers ─────────────────────────────────────────────
  const handleDeptSelect = (d) => {
    setSelectedDept(d);
    setSelectedCat(null);
    setSelectedDocType(null);
    setSearchCat("");
    setSearchDocType("");
    setDocs([]);
  };
  const handleCatSelect = (c) => {
    setSelectedCat(c);
    setSelectedDocType(null);
    setSearchDocType("");
    setDocs([]);
  };
  const handleDTSelect = async (dt) => {
    setSelectedDocType(dt);
    setSearchDoc("");
    setFilterStatus("COMPLETED");
    setLoadingDocs(true);
    setDocs([]);
    try {
      const res = await fetch(`${API}/documents?documentTypeId=${dt.id}`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      const fetchedDocs = data.data || [];
      setDocs(fetchedDocs);
      setTotalDocsCount(data.total ?? fetchedDocs.length);

      // Count update karo tree mein
      setDepartments((prev) =>
        prev.map((dept) => ({
          ...dept,
          categories: dept.categories.map((cat) => ({
            ...cat,
            documentTypes: cat.documentTypes.map((d) =>
              d.id === dt.id
                ? { ...d, count: data.total ?? fetchedDocs.length }
                : d,
            ),
          })),
        })),
      );
    } catch {
      setDocs([]);
    } finally {
      setLoadingDocs(false);
    }
  };

  // ── View document (open in new tab or inline)
  const handleViewDoc = async (doc) => {
    try {
      const res = await fetch(`${API}/documents/${doc.id}/view`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Failed to load document");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      alert("Could not open document: " + err.message);
    }
  };

  // ── Download document
  const handleDownloadDoc = async (doc) => {
    try {
      const res = await fetch(`${API}/documents/${doc.id}/download`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Failed to download document");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.originalFileName || doc.name || "document";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Could not download document: " + err.message);
    }
  };

  // ── Action menu handler
  const handleAction = (action, doc) => {
    if (action === "view") handleViewDoc(doc);
    if (action === "download") handleDownloadDoc(doc);
    if (action === "delete") {
      if (window.confirm(`Delete ${doc.originalFileName || doc.name}?`)) {
        fetch(`${API}/documents/${doc.id}`, {
          method: "DELETE",
          headers: authHeaders(),
        })
          .then(() => setDocs((prev) => prev.filter((d) => d.id !== doc.id)))
          .catch(() => alert("Delete failed"));
      }
    }
    // Preview stays in-panel
    if (!["view", "download", "delete"].includes(action)) {
      setPreviewDoc(doc);
    }
  };

  // ── TCode search result action (view/download/open)
  const handleTCodeDocAction = (doc, action) => {
    if (action === "view") handleViewDoc(doc);
    if (action === "download") handleDownloadDoc(doc);
    if (action === "open") setPreviewDoc(doc);
  };

  const handleUploaded = (docId, fileName) => {
    setShowUpload(false);
    onUploadFlow &&
      onUploadFlow(docId, fileName, selectedDept, selectedCat, selectedDocType);
  };

  // ─── Breadcrumb ───────────────────────────────────────────
  const breadcrumb = [
    selectedDept && { label: selectedDept.name, color: SAP_BLUE },
    selectedCat && { label: selectedCat.name, color: "#7C2D00" },
    selectedDocType && { label: selectedDocType.name, color: SAP_PURPLE },
  ].filter(Boolean);

  const TABLE_HEADERS = [
    "Document Name",
    "TCode",
    "Version",
    "Status",
    "Uploaded By",
    "Upload Date",
    "Actions",
  ];

  // ─── Render ───────────────────────────────────────────────
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        background: "#F0F4F8",
        fontFamily: "'72', Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes fadeSlide { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        .fade-slide { animation:fadeSlide 0.22s ease forwards; }
        .row-hover:hover { background:#f8faff !important; }
        .panel-item:hover { background:#f1f5f9; cursor:pointer; }
        .panel-item-active { background:${SAP_LIGHT} !important; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#cbd5e1; borderRadius:99px; }
      `}</style>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ── Topbar: breadcrumb + TCode search ── */}
        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid #e2e8f0",
            padding: "0 20px",
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {breadcrumb.length > 0 && (
              <button
                onClick={() => {
                  if (selectedDocType) {
                    setSelectedDocType(null);
                    setDocs([]);
                    setSearchDocType("");
                  } else if (selectedCat) {
                    setSelectedCat(null);
                    setSelectedDocType(null);
                    setSearchCat("");
                    setSearchDocType("");
                  } else if (selectedDept) {
                    setSelectedDept(null);
                    setSelectedCat(null);
                    setSelectedDocType(null);
                    setSearchCat("");
                    setSearchDocType("");
                  }
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                  color: "#64748b",
                  padding: "0 4px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                ‹‹
              </button>
            )}
            {breadcrumb.length === 0 ? (
              <span style={{ fontSize: 13, color: "#94a3b8" }}>Documents</span>
            ) : (
              breadcrumb.map((b, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <ChevronRight size={13} color="#cbd5e1" />}
                  <span
                    onClick={() => {
                      if (i === 0) {
                        handleDeptSelect(selectedDept);
                      }
                      if (i === 1) {
                        handleCatSelect(selectedCat);
                      }
                    }}
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: b.color,
                      cursor: i < breadcrumb.length - 1 ? "pointer" : "default",
                      textDecoration:
                        i < breadcrumb.length - 1 ? "underline" : "none",
                      textUnderlineOffset: 3,
                    }}
                  >
                    {b.label}
                  </span>
                </React.Fragment>
              ))
            )}
          </div>

          {/* TCode Search Button */}
          {/* <button
            onClick={() => setShowTCodeSearch(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 12px", borderRadius: 8,
              border: `1.5px solid ${SAP_BLUE}30`,
              background: `${SAP_BLUE}08`, color: SAP_BLUE,
              fontWeight: 600, fontSize: 12, cursor: "pointer",
            }}>
            <Hash size={13} />
            Search by TCode
          </button> */}
        </div>

        {/* Loading / Error */}
        {loading && (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "#94a3b8",
              fontSize: 14,
            }}
          >
            Loading departments…
          </div>
        )}
        {error && (
          <div
            style={{
              margin: 16,
              padding: "12px 16px",
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              borderRadius: 10,
              color: "#dc2626",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {/* ── 4-Column Explorer ── */}
        {!loading && !error && (
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* Col 1: Departments */}
            <Column
              title="Departments"
              icon={<Folder size={14} color={SAP_BLUE} />}
              borderColor={SAP_BLUE}
              width={selectedDept ? 0 : 180}
            >
              <SearchBox
                value={searchDept}
                onChange={setSearchDept}
                placeholder="Search Department"
              />
              <div style={{ flex: 1, overflowY: "auto" }}>
                {filtDepts.length === 0 ? (
                  <EmptyMsg text="No departments found" />
                ) : (
                  filtDepts.map((d) => (
                    <PanelItem
                      key={d.id}
                      active={selectedDept?.id === d.id}
                      icon={
                        selectedDept?.id === d.id ? (
                          <FolderOpen size={15} color={SAP_BLUE} />
                        ) : (
                          <Folder size={15} color="#64748b" />
                        )
                      }
                      label={d.name}
                      sub={`${d.categories.length} categories`}
                      activeColor={SAP_BLUE}
                      onClick={() => handleDeptSelect(d)}
                    />
                  ))
                )}
              </div>
            </Column>

            {/* Col 2: Categories */}
            <Column
              title="Categories"
              icon={<Folder size={14} color={SAP_AMBER} />}
              borderColor={SAP_AMBER}
              width={selectedCat ? 0 : 180}
            >
              <SearchBox
                value={searchCat}
                onChange={setSearchCat}
                placeholder="Search Category"
              />
              <div style={{ flex: 1, overflowY: "auto" }}>
                {!selectedDept ? (
                  <EmptyMsg text="Select a department" />
                ) : filtCats.length === 0 ? (
                  <EmptyMsg text="No categories found" />
                ) : (
                  filtCats.map((c) => (
                    <PanelItem
                      key={c.id}
                      active={selectedCat?.id === c.id}
                      icon={
                        selectedCat?.id === c.id ? (
                          <FolderOpen size={15} color={SAP_AMBER} />
                        ) : (
                          <Folder size={15} color="#64748b" />
                        )
                      }
                      label={c.name}
                      sub={`${c.documentTypes.length} types`}
                      activeColor={SAP_AMBER}
                      onClick={() => handleCatSelect(c)}
                    />
                  ))
                )}
              </div>
            </Column>

            {/* Col 3: Document Types */}
            <Column
              title="Document Types"
              icon={<FileText size={14} color={SAP_PURPLE} />}
              borderColor={SAP_PURPLE}
              width={160}
            >
              <SearchBox
                value={searchDocType}
                onChange={setSearchDocType}
                placeholder="Search Doc Type"
              />
              <div style={{ flex: 1, overflowY: "auto" }}>
                {!selectedCat ? (
                  <EmptyMsg text="Select a category" />
                ) : filtDocTypes.length === 0 ? (
                  <EmptyMsg text="No document types" />
                ) : (
                  filtDocTypes.map((dt) => (
                    <PanelItem
                      key={dt.id}
                      active={selectedDocType?.id === dt.id}
                      icon={
                        <FileText
                          size={15}
                          color={
                            selectedDocType?.id === dt.id
                              ? SAP_PURPLE
                              : "#64748b"
                          }
                        />
                      }
                      label={dt.name}
                      sub={`${dt.count || 0} docs`}
                      badge={dt.count}
                      activeColor={SAP_PURPLE}
                      onClick={() => handleDTSelect(dt)}
                    />
                  ))
                )}
              </div>
            </Column>

            {/* Col 4: Documents */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                background: "#fff",
                borderLeft: "1px solid #e2e8f0",
                overflow: "hidden",
              }}
            >
              {/* Doc panel header */}
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  flexShrink: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FileText size={15} color={SAP_BLUE} />
                  <span
                    style={{ fontWeight: 700, fontSize: 13, color: SAP_DARK }}
                  >
                    Documents
                  </span>
                  {selectedDocType && (
                    <span
                      style={{
                        fontSize: 11,
                        background: SAP_LIGHT,
                        color: SAP_BLUE,
                        borderRadius: 20,
                        padding: "1px 8px",
                        fontWeight: 600,
                      }}
                    >
                      {totalDocsCount}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ position: "relative" }}>
                    <Search
                      size={13}
                      color="#94a3b8"
                      style={{
                        position: "absolute",
                        left: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />
                    <input
                      value={searchDoc}
                      onChange={(e) => setSearchDoc(e.target.value)}
                      placeholder="Search documents or TCode..."
                      // onKeyDown={(e) => {
                      //   if (e.key === "Enter" && searchDoc.trim()) {
                      //     setShowTCodeSearch(true);
                      //   }
                      // }}
                      style={{
                        padding: "6px 10px 6px 30px",
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                        fontSize: 12,
                        color: "#334155",
                        outline: "none",
                        width: 220,
                      }}
                      onFocus={(e) => (e.target.style.borderColor = SAP_BLUE)}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{
                      padding: "6px 10px",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "#334155",
                      outline: "none",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">All Status</option>
                    {[
                      "OCR_PROCESSING",
                      "OCR_COMPLETED",
                      "WAITING_FOR_APPROVAL",
                      "SAVING_TO_SAP",
                      "COMPLETED",
                      "FAILED",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  {/* {selectedDocType && (
                    <button onClick={() => setShowUpload(true)}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: SAP_BLUE, color: "#fff", border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                      <Upload size={13} /> Upload Document
                    </button>
                  )} */}
                </div>
              </div>

              {/* Table + Preview */}
              <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {!selectedDocType ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        color: "#94a3b8",
                        gap: 8,
                      }}
                    >
                      <FolderOpen size={40} color="#e2e8f0" />
                      <span style={{ fontSize: 13 }}>
                        Select a document type to view files
                      </span>
                    </div>
                  ) : loadingDocs ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        color: "#94a3b8",
                        fontSize: 13,
                      }}
                    >
                      Loading documents…
                    </div>
                  ) : filtDocs.length === 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        color: "#94a3b8",
                        gap: 8,
                      }}
                    >
                      <FileText size={40} color="#e2e8f0" />
                      <span style={{ fontSize: 13 }}>No documents found</span>
                      <button
                        onClick={() => setShowUpload(true)}
                        style={{
                          padding: "8px 18px",
                          borderRadius: 8,
                          background: SAP_BLUE,
                          color: "#fff",
                          border: "none",
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Upload size={13} /> Upload First Document
                      </button>
                    </div>
                  ) : (
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr
                          style={{
                            background: "#f8fafc",
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                          }}
                        >
                          {TABLE_HEADERS.map((h) => (
                            <th
                              key={h}
                              style={{
                                padding: "10px 14px",
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#64748b",
                                textAlign: "left",
                                borderBottom: "1px solid #e2e8f0",
                                whiteSpace: "nowrap",
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtDocs.map((doc) => (
                          <tr
                            key={doc.id}
                            className="row-hover"
                            style={{
                              borderBottom: "1px solid #f1f5f9",
                              background:
                                previewDoc?.id === doc.id ? "#f0f7ff" : "#fff",
                            }}
                            onClick={() => setPreviewDoc(doc)}
                          >
                            {/* Document Name */}
                            <td style={{ padding: "11px 14px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <div
                                  style={{
                                    width: 28,
                                    height: 28,
                                    background: "#fef2f2",
                                    borderRadius: 6,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  <FileText size={14} color="#ef4444" />
                                </div>
                                <span
                                  title={doc.originalFileName || doc.name}
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: "#1e293b",
                                    maxWidth: 280,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    display: "inline-block",
                                  }}
                                >
                                  {doc.originalFileName || doc.name}
                                </span>
                              </div>
                            </td>

                            {/* TCode — clickable copy pill */}
                            <td
                              style={{ padding: "11px 14px" }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <TCodePill tcode={doc.tcode} />
                            </td>

                            {/* Version */}
                            <td style={{ padding: "11px 14px" }}>
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 600,
                                  background: "#f1f5f9",
                                  color: "#475569",
                                  padding: "2px 8px",
                                  borderRadius: 6,
                                }}
                              >
                                {doc.version || "V1"}
                              </span>
                            </td>

                            {/* Status */}
                            <td style={{ padding: "11px 14px" }}>
                              <StatusBadge
                                status={doc.uploadStatus || doc.status}
                              />
                            </td>

                            {/* Uploaded By */}
                            <td
                              style={{
                                padding: "11px 14px",
                                fontSize: 13,
                                color: "#475569",
                              }}
                            >
                              {doc.uploader?.email ||
                                doc.uploadedBy?.email ||
                                doc.uploadedBy ||
                                "—"}
                            </td>

                            {/* Upload Date */}
                            <td
                              style={{
                                padding: "11px 14px",
                                fontSize: 12,
                                color: "#64748b",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {doc.createdAt
                                ? new Date(doc.createdAt).toLocaleDateString()
                                : "—"}
                            </td>

                            {/* Actions */}
                            <td style={{ padding: "11px 14px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  gap: 6,
                                  alignItems: "center",
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {/* Quick View / Download for COMPLETED docs */}
                                {doc.uploadStatus === "COMPLETED" && (
                                  <>
                                    <QuickBtn
                                      label="View"
                                      color={SAP_BLUE}
                                      onClick={() => handleViewDoc(doc)}
                                    />
                                    <QuickBtn
                                      label="↓"
                                      title="Download"
                                      color="#475569"
                                      onClick={() => handleDownloadDoc(doc)}
                                    />
                                  </>
                                )}
                                {/* More actions */}
                                <button
                                  onClick={(e) => {
                                    const r =
                                      e.currentTarget.getBoundingClientRect();
                                    setActionMenu({
                                      x: r.left,
                                      y: r.bottom + 4,
                                      doc,
                                    });
                                  }}
                                  style={{
                                    background: "#f1f5f9",
                                    border: "none",
                                    borderRadius: 7,
                                    padding: "5px 8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    color: "#64748b",
                                  }}
                                >
                                  <MoreVertical size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Preview Panel */}
                {previewDoc && (
                  <PreviewPanel
                    doc={previewDoc}
                    allDocs={filtDocs}
                    onClose={() => setPreviewDoc(null)}
                    onDocChange={(d) => setPreviewDoc(d)}
                    onView={handleViewDoc}
                    onDownload={handleDownloadDoc}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {showUpload && (
        <UploadModal
          docType={selectedDocType}
          dept={selectedDept}
          category={selectedCat}
          onClose={() => setShowUpload(false)}
          onUploaded={handleUploaded}
        />
      )}
      {actionMenu && (
        <ActionMenu
          position={actionMenu}
          doc={actionMenu.doc}
          onAction={handleAction}
          onClose={() => setActionMenu(null)}
        />
      )}
      {/* {showTCodeSearch && (
        <TCodeSearchModal
          onClose={() => setShowTCodeSearch(false)}
          onViewDoc={handleTCodeDocAction}
        />
      )} */}
    </div>
  );
}

// ── Quick inline button ──────────────────────────────────────
function QuickBtn({ label, title, color, onClick }) {
  return (
    <button
      onClick={onClick}
      title={title || label}
      style={{
        padding: "4px 9px",
        borderRadius: 7,
        border: "none",
        background: color === SAP_BLUE ? SAP_LIGHT : "#f1f5f9",
        color,
        fontWeight: 700,
        fontSize: 11,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

// ── Shared sub-components ────────────────────────────────────
function Column({ title, icon, borderColor, width, children }) {
  return (
    <div
      style={{
        width,
        minWidth: width,
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        borderRight: "1px solid #e2e8f0",
        borderTop: `3px solid ${borderColor}`,
        overflow: "hidden",
        transition: "width 0.2s ease",
      }}
    >
      <div
        style={{
          padding: "10px 14px 8px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
        }}
      >
        {icon}
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#334155",
            letterSpacing: "0.03em",
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "8px 6px",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function SearchBox({ value, onChange, placeholder }) {
  return (
    <div style={{ position: "relative", marginBottom: 8, flexShrink: 0 }}>
      <Search
        size={12}
        color="#94a3b8"
        style={{
          position: "absolute",
          left: 9,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "6px 8px 6px 26px",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          fontSize: 12,
          color: "#334155",
          outline: "none",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = SAP_BLUE)}
        onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
      />
    </div>
  );
}

function PanelItem({ label, sub, icon, badge, active, activeColor, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`panel-item${active ? " panel-item-active" : ""}`}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        borderRadius: 8,
        border: active
          ? `1.5px solid ${activeColor}20`
          : "1.5px solid transparent",
        background: active ? `${activeColor}10` : "transparent",
        cursor: "pointer",
        textAlign: "left",
        marginBottom: 2,
      }}
    >
      {icon}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: active ? 700 : 500,
            color: active ? activeColor : "#334155",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
        {sub && (
          <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}>
            {sub}
          </div>
        )}
      </div>
      {badge != null && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            background: active ? activeColor : "#e2e8f0",
            color: active ? "#fff" : "#64748b",
            borderRadius: 20,
            padding: "1px 6px",
            flexShrink: 0,
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function EmptyMsg({ text }) {
  return (
    <div
      style={{
        fontSize: 12,
        color: "#94a3b8",
        textAlign: "center",
        padding: "24px 8px",
      }}
    >
      {text}
    </div>
  );
}
