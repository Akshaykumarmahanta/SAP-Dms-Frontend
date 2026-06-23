import { useState, useRef, useEffect, useCallback } from "react";
import {
  Folder, FolderOpen, ChevronRight, Plus, X, FileText,
  Building2, Loader2, AlertCircle, Tag, File,
} from "lucide-react";

const API = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("accessToken") || "";
}
function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// ── Decode JWT (no /me route needed) ─────────────────────────
function decodeToken() {
  try {
    const token = getToken();
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

// ── Node type config ──────────────────────────────────────────
const NODE_TYPE = {
  DEPARTMENT:    "DEPARTMENT",
  CATEGORY:      "CATEGORY",
  DOCUMENT_TYPE: "DOCUMENT_TYPE",
};

function nodeLabel(type) {
  if (type === NODE_TYPE.DEPARTMENT)    return "Department";
  if (type === NODE_TYPE.CATEGORY)      return "Category";
  if (type === NODE_TYPE.DOCUMENT_TYPE) return "Document Type";
  return "";
}

function NodeIcon({ type, open, className = "" }) {
  if (type === NODE_TYPE.DEPARTMENT)
    return open
      ? <FolderOpen className={`w-4 h-4 text-blue-400 ${className}`} />
      : <Folder     className={`w-4 h-4 text-blue-400 ${className}`} />;
  if (type === NODE_TYPE.CATEGORY)
    return open
      ? <FolderOpen className={`w-4 h-4 text-amber-400 ${className}`} />
      : <Folder     className={`w-4 h-4 text-amber-400 ${className}`} />;
  return <File className={`w-4 h-4 text-purple-400 ${className}`} />;
}

function TypeBadge({ type }) {
  const styles = {
    [NODE_TYPE.DEPARTMENT]:    "bg-blue-50   dark:bg-blue-900/30   text-blue-600   dark:text-blue-300   border-blue-200   dark:border-blue-800",
    [NODE_TYPE.CATEGORY]:      "bg-amber-50  dark:bg-amber-900/30  text-amber-600  dark:text-amber-300  border-amber-200  dark:border-amber-800",
    [NODE_TYPE.DOCUMENT_TYPE]: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  };
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${styles[type]}`}>
      {nodeLabel(type)}
    </span>
  );
}

// ── Inline Input ──────────────────────────────────────────────
function InlineInput({ depth, inputRef, value, onChange, onConfirm, onCancel, placeholder }) {
  return (
    <div className="flex items-center gap-2 py-1.5 pr-3" style={{ paddingLeft: `${12 + depth * 20}px` }}>
      <span className="w-3.5 flex-shrink-0" />
      <Folder className="w-4 h-4 text-gray-300 flex-shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter")  { e.preventDefault(); onConfirm(); }
          if (e.key === "Escape") { e.preventDefault(); onCancel(); }
        }}
        placeholder={placeholder || "Name..."}
        className="flex-1 text-sm border-b border-blue-400 outline-none bg-transparent text-gray-700 dark:text-slate-200"
      />
    </div>
  );
}

// ── Inline Rename ─────────────────────────────────────────────
function InlineRename({ depth, renameRef, value, onChange, onConfirm, onCancel }) {
  return (
    <div className="flex items-center gap-2 py-1.5 pr-3" style={{ paddingLeft: `${12 + depth * 20}px` }}>
      <span className="w-3.5 flex-shrink-0" />
      <FolderOpen className="w-4 h-4 text-amber-400 flex-shrink-0" />
      <input
        ref={renameRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter")  { e.preventDefault(); onConfirm(); }
          if (e.key === "Escape") { e.preventDefault(); onCancel(); }
        }}
        className="flex-1 text-sm border-b border-amber-400 outline-none bg-transparent text-gray-700 dark:text-slate-200 font-medium"
      />
    </div>
  );
}

// ── Delete Modal ──────────────────────────────────────────────
function DeleteModal({ name, type, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" style={{ backdropFilter: "blur(4px)" }}>
      <div className="bg-white dark:bg-[#1A2433] border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl p-6">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
          <X className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 text-center mb-1">
          Delete {nodeLabel(type)}?
        </h3>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 text-center mb-5">
          <span className="font-bold text-slate-700 dark:text-slate-200">"{name}"</span> permanently delete ho jayega.
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel}  className="flex-1 py-[9px] rounded-xl border border-slate-200 dark:border-slate-600 text-[12px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-[9px] rounded-xl bg-red-600 hover:bg-red-700 text-white text-[12px] font-bold transition">Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Tree Node ─────────────────────────────────────────────────
function TreeNode({ node, depth, ctx }) {
  const {
    selectedId, expandedIds, addingTo, addingType,
    renamingId, renameValue, newName,
    onSelect, onToggle, onStartAdd, onChangeName, onConfirmAdd, onCancelAdd,
    onStartRename, onRenameChange, onConfirmRename, onCancelRename,
    onDeleteRequest, inputRef, renameRef, savingId, deletingId,
  } = ctx;

  const isSelected  = selectedId === node.id;
  const isExpanded  = expandedIds.has(node.id);
  const isRenaming  = renamingId === node.id;
  const isAddingHere = addingTo === node.id;
  const isSaving    = savingId === node.id;
  const isDeleting  = deletingId === node.id;

  const isDept    = node.type === NODE_TYPE.DEPARTMENT;
  const isCat     = node.type === NODE_TYPE.CATEGORY;
  const isDocType = node.type === NODE_TYPE.DOCUMENT_TYPE;

  const hasChildren = node.children?.length > 0 || isAddingHere;
  const canAddChild = isDept || isCat; // DocType has no children

  if (isRenaming) {
    return (
      <div>
        <InlineRename
          depth={depth}
          renameRef={renameRef}
          value={renameValue}
          onChange={onRenameChange}
          onConfirm={onConfirmRename}
          onCancel={onCancelRename}
        />
        {isExpanded && node.children?.map((child) => (
          <TreeNode key={child.id} node={child} depth={depth + 1} ctx={ctx} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 py-1.5 pr-3 cursor-pointer group transition-colors
          ${isSelected
            ? "bg-blue-50 dark:bg-blue-950/30"
            : "hover:bg-gray-50 dark:hover:bg-slate-700/30"
          }`}
        style={{ paddingLeft: `${12 + depth * 20}px` }}
        onClick={() => onSelect(node)}
      >
        {/* Chevron */}
        {hasChildren ? (
          <ChevronRight
            className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isExpanded ? "rotate-90 text-gray-500" : "text-gray-400"}`}
            onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}
          />
        ) : (
          <span className="w-3.5 flex-shrink-0" />
        )}

        {/* Icon */}
        <NodeIcon type={node.type} open={isExpanded && hasChildren} />

        {/* Name */}
        <span className={`text-sm flex-1 select-none truncate ${
          isSelected
            ? "text-blue-700 dark:text-blue-300 font-medium"
            : isDept
              ? "text-slate-700 dark:text-slate-200 font-semibold"
              : "text-gray-700 dark:text-slate-300"
        }`}>
          {node.name}
          {node.code && <span className="ml-1 text-[10px] text-slate-400 font-mono">({node.code})</span>}
        </span>

        {/* Type badge — subtle */}
        <TypeBadge type={node.type} />

        {/* Saving/Deleting spinner */}
        {(isSaving || isDeleting) && <Loader2 className="w-3 h-3 animate-spin text-slate-400 ml-1" />}

        {/* Actions */}
        {!isSaving && !isDeleting && (
          <div className="flex items-center gap-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Rename — not for dept (SuperAdmin owns it) */}
            {!isDept && (
              <button
                title="Rename"
                className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-slate-600"
                onClick={(e) => { e.stopPropagation(); onStartRename(node); }}
              >
                <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            )}

            {/* Add child */}
            {canAddChild && (
              <button
                title={isDept ? "Add Category" : "Add Document Type"}
                className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-slate-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(node.id, true);
                  onStartAdd(node);
                }}
              >
                <Plus className="w-3 h-3 text-gray-400" />
              </button>
            )}

            {/* Delete — not for dept */}
            {!isDept && (
              <button
                title="Delete"
                className="p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/20"
                onClick={(e) => { e.stopPropagation(); onDeleteRequest(node); }}
              >
                <X className="w-3 h-3 text-red-500" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Children */}
      {isExpanded && (
        <div>
          {node.children?.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} ctx={ctx} />
          ))}
          {isAddingHere && (
            <InlineInput
              depth={depth + 1}
              inputRef={inputRef}
              value={newName}
              onChange={onChangeName}
              onConfirm={onConfirmAdd}
              onCancel={onCancelAdd}
              placeholder={isDept ? "Category name..." : "Document Type name..."}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────
function StatusBadge({ status }) {
  const active = status === "ACTIVE";
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
      active
        ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
        : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
    }`}>
      {active ? "Active" : "Inactive"}
    </span>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function FolderStructurePage() {
  const [tenantInfo, setTenantInfo] = useState(null); // { id, email, role }
  const [tree,       setTree]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");

  const [selectedNode, setSelectedNode] = useState(null);
  const [expandedIds,  setExpandedIds]  = useState(new Set());

  // Add state
  const [addingTo,  setAddingTo]  = useState(null); // node object
  const [newName,   setNewName]   = useState("");

  // Rename state
  const [renamingNode, setRenamingNode] = useState(null);
  const [renameValue,  setRenameValue]  = useState("");

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null); // node object

  // Loading per-node
  const [savingId,   setSavingId]   = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const inputRef  = useRef(null);
  const renameRef = useRef(null);

  // ── Init: decode JWT ────────────────────────────────────────
  useEffect(() => {
    const payload = decodeToken();
    if (!payload?.tenantId) {
      setError("Session invalid. Please login again.");
      setLoading(false);
      return;
    }
    setTenantInfo({ id: payload.tenantId, email: payload.email, role: payload.role });
  }, []);

  // ── Fetch full tree ─────────────────────────────────────────
  useEffect(() => {
    if (!tenantInfo?.id) return;
    fetchTree();
  }, [tenantInfo?.id]);

  async function fetchTree() {
    setLoading(true);
    setError("");
    try {
      // 1. Departments assigned to this tenant
      const deptRes  = await fetch(`${API}/departments/tenant/${tenantInfo.id}`, { headers: authHeaders() });
      const deptData = await deptRes.json();
      if (!deptRes.ok) throw new Error(deptData.message || "Failed to load departments");
      const depts = deptData.data || [];

      // 2. Categories for this tenant (?departmentId= not used — get all, group by dept)
      const catRes  = await fetch(`${API}/categories`, { headers: authHeaders() });
      const catData = await catRes.json();
      const cats    = catData.data || catData || [];

      // 3. Document Types
      const dtRes  = await fetch(`${API}/document-types`, { headers: authHeaders() });
      const dtData = await dtRes.json();
      const dts    = dtData.data || dtData || [];

      // ── Build tree ────────────────────────────────────────
      const builtTree = depts.map((dept) => {
        const deptCats = cats.filter((c) => c.departmentId === dept.id);
        return {
          id:       `dept_${dept.id}`,
          _id:      dept.id,
          name:     dept.name,
          code:     dept.code,
          status:   dept.status,
          type:     NODE_TYPE.DEPARTMENT,
          children: deptCats.map((cat) => {
            const catDts = dts.filter((d) => d.categoryId === cat.id);
            return {
              id:       `cat_${cat.id}`,
              _id:      cat.id,
              name:     cat.name,
              type:     NODE_TYPE.CATEGORY,
              departmentId: dept.id,
              children: catDts.map((dt) => ({
                id:         `dt_${dt.id}`,
                _id:        dt.id,
                name:       dt.name,
                type:       NODE_TYPE.DOCUMENT_TYPE,
                categoryId: cat.id,
                children:   [],
              })),
            };
          }),
        };
      });

      setTree(builtTree);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Toggle ──────────────────────────────────────────────────
  const handleToggle = useCallback((id, forceOpen = false) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (forceOpen) { next.add(id); return next; }
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  // ── Start Add ───────────────────────────────────────────────
  const onStartAdd = useCallback((node) => {
    setAddingTo(node);
    setNewName("");
  }, []);

  const onCancelAdd = useCallback(() => {
    setAddingTo(null);
    setNewName("");
  }, []);

  // ── Confirm Add ─────────────────────────────────────────────
  const onConfirmAdd = useCallback(async () => {
    const name = newName.trim();
    if (!name || !addingTo) { onCancelAdd(); return; }

    setSavingId(addingTo.id);
    setAddingTo(null);
    setNewName("");

    try {
      if (addingTo.type === NODE_TYPE.DEPARTMENT) {
        // Create Category under this dept
        const res  = await fetch(`${API}/categories`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ name, departmentId: addingTo._id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to create category");
      } else if (addingTo.type === NODE_TYPE.CATEGORY) {
        // Create Document Type under this category
        const res  = await fetch(`${API}/document-types`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ name, categoryId: addingTo._id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to create document type");
      }
      await fetchTree();
      setExpandedIds((prev) => new Set([...prev, addingTo.id]));
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }, [newName, addingTo, tenantInfo]);

  // ── Rename ──────────────────────────────────────────────────
  const onStartRename = useCallback((node) => {
    setRenamingNode(node);
    setRenameValue(node.name);
  }, []);

  const onCancelRename = useCallback(() => {
    setRenamingNode(null);
    setRenameValue("");
  }, []);

  const onConfirmRename = useCallback(async () => {
    const name = renameValue.trim();
    if (!name || !renamingNode) { onCancelRename(); return; }

    setSavingId(renamingNode.id);
    setRenamingNode(null);
    setRenameValue("");

    try {
      if (renamingNode.type === NODE_TYPE.CATEGORY) {
        const res  = await fetch(`${API}/categories/${renamingNode._id}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({ name }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to rename");
      } else if (renamingNode.type === NODE_TYPE.DOCUMENT_TYPE) {
        const res  = await fetch(`${API}/document-types/${renamingNode._id}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({ name }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to rename");
      }
      await fetchTree();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }, [renamingNode, renameValue]);

  // ── Delete ──────────────────────────────────────────────────
  const onDeleteRequest = useCallback((node) => setDeleteTarget(node), []);

  const onDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    const node = deleteTarget;
    setDeleteTarget(null);
    setDeletingId(node.id);

    try {
      if (node.type === NODE_TYPE.CATEGORY) {
        const res  = await fetch(`${API}/categories/${node._id}`, { method: "DELETE", headers: authHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to delete");
      } else if (node.type === NODE_TYPE.DOCUMENT_TYPE) {
        const res  = await fetch(`${API}/document-types/${node._id}`, { method: "DELETE", headers: authHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to delete");
      }
      if (selectedNode?.id === node.id) setSelectedNode(null);
      await fetchTree();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }, [deleteTarget, selectedNode]);

  // Focus inputs
  useEffect(() => { if (addingTo)      setTimeout(() => inputRef.current?.focus(),  0); }, [addingTo]);
  useEffect(() => { if (renamingNode)  setTimeout(() => renameRef.current?.focus(), 0); }, [renamingNode]);

  const ctx = {
    selectedId:     selectedNode?.id,
    expandedIds,
    addingTo:       addingTo?.id,
    addingType:     addingTo?.type,
    renamingId:     renamingNode?.id,
    renameValue,
    newName,
    onSelect:       setSelectedNode,
    onToggle:       handleToggle,
    onStartAdd,
    onChangeName:   setNewName,
    onConfirmAdd,
    onCancelAdd,
    onStartRename,
    onRenameChange: setRenameValue,
    onConfirmRename,
    onCancelRename,
    onDeleteRequest,
    inputRef,
    renameRef,
    savingId,
    deletingId,
  };

  // ── Find ancestor dept of selected node ────────────────────
  function findAncestorDept(nodeId) {
    function search(nodes, targetId) {
      for (const n of nodes) {
        if (n.id === targetId) return n.type === NODE_TYPE.DEPARTMENT ? n : null;
        if (n.children?.length) {
          const found = search(n.children, targetId);
          if (found) return found;
          // Check if this dept has the target as descendant
          function hasDesc(node, id) {
            if (node.id === id) return true;
            return node.children?.some((c) => hasDesc(c, id));
          }
          if (n.type === NODE_TYPE.DEPARTMENT && hasDesc(n, targetId)) return n;
        }
      }
      return null;
    }
    return search(tree, nodeId);
  }

  const selectedDept = selectedNode ? findAncestorDept(selectedNode.id) : null;

  return (
    <div className="flex gap-4 items-start">
      {/* ── LEFT: Tree Panel ── */}
      <div className="w-1/2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden flex flex-col min-h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-4 py-3.5 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Folder Structure
            </span>
          </div>
          {tenantInfo && (
            <span className="text-[10px] text-slate-400 font-mono">{tenantInfo.email}</span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-50 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          {[
            { type: NODE_TYPE.DEPARTMENT,    label: "Department (SuperAdmin)" },
            { type: NODE_TYPE.CATEGORY,      label: "Category" },
            { type: NODE_TYPE.DOCUMENT_TYPE, label: "Document Type" },
          ].map(({ type, label }) => (
            <div key={type} className="flex items-center gap-1">
              <NodeIcon type={type} open={false} />
              <span className="text-[9px] text-slate-400">{label}</span>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 py-2 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-16 gap-2 text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-[12px]">Loading...</span>
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center gap-2 mx-3 mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2 text-[12px] font-semibold text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Tenant root */}
              <div className="flex items-center gap-1.5 px-3 py-1.5">
                <span className="w-3.5" />
                <Building2 className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  {tenantInfo?.email?.split("@")[1] || "My Workspace"}
                </span>
              </div>

              {tree.length === 0 ? (
                <div className="text-center py-10 text-[11px] text-slate-400">
                  Koi department assign nahi hai.
                </div>
              ) : (
                tree.map((node) => (
                  <TreeNode key={node.id} node={node} depth={1} ctx={ctx} />
                ))
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && tree.length > 0 && (
          <div className="px-4 py-2.5 border-t border-gray-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <p className="text-[10px] text-slate-400">
              📁 Departments SuperAdmin se assign hote hain · + icon se Category / Document Type banayein
            </p>
          </div>
        )}
      </div>

      {/* ── RIGHT: Detail Panel ── */}
      <div className="w-1/2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden min-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3.5 border-b border-gray-100 dark:border-slate-700">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {selectedNode ? selectedNode.name : "Folder Contents"}
          </span>
          {selectedNode && <TypeBadge type={selectedNode.type} />}
          {selectedDept?.status && <StatusBadge status={selectedDept.status} />}
        </div>

        {/* Breadcrumb */}
        {selectedNode && (
          <div className="px-4 py-2 border-b border-gray-50 dark:border-slate-700 bg-slate-50 dark:bg-[#151E2B] flex items-center gap-1.5 flex-wrap">
            {selectedDept && (
              <>
                <span className="text-[10px] font-bold text-blue-500 font-mono">{selectedDept.code}</span>
                <span className="text-[10px] text-slate-400">·</span>
                <span className="text-[11px] text-slate-500">{selectedDept.name}</span>
              </>
            )}
            {selectedNode.type !== NODE_TYPE.DEPARTMENT && (
              <>
                <span className="text-[10px] text-slate-400">›</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">{selectedNode.name}</span>
              </>
            )}
          </div>
        )}

        {/* Info cards for selected node */}
        {selectedNode && (
          <div className="px-4 pt-4 pb-2 flex flex-col gap-3">
            <div className="rounded-xl border border-gray-100 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 mb-3">
                <NodeIcon type={selectedNode.type} open />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{selectedNode.name}</span>
                {selectedNode.code && (
                  <span className="text-[10px] font-mono text-slate-400">({selectedNode.code})</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Type</p>
                  <TypeBadge type={selectedNode.type} />
                </div>
                {selectedDept?.status && (
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Status</p>
                    <StatusBadge status={selectedDept.status} />
                  </div>
                )}
                {selectedNode.type === NODE_TYPE.DEPARTMENT && (
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Categories</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {selectedNode.children?.length || 0}
                    </p>
                  </div>
                )}
                {selectedNode.type === NODE_TYPE.CATEGORY && (
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Document Types</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {selectedNode.children?.length || 0}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Children list */}
            {selectedNode.children?.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {selectedNode.type === NODE_TYPE.DEPARTMENT ? "Categories" : "Document Types"}
                </p>
                <div className="flex flex-col gap-1">
                  {selectedNode.children.map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors"
                      onClick={() => setSelectedNode(child)}
                    >
                      <NodeIcon type={child.type} open={false} />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{child.name}</span>
                      {child.children?.length > 0 && (
                        <span className="ml-auto text-[10px] text-slate-400">{child.children.length} items</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!selectedNode && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
            <Folder className="w-10 h-10 text-slate-200 dark:text-slate-700" />
            <p className="text-sm text-slate-400">Left side se folder select karo</p>
            <p className="text-[11px] text-slate-300 dark:text-slate-600">Department → Category → Document Type</p>
          </div>
        )}

        {/* Document table (only for Document Type) */}
        {selectedNode?.type === NODE_TYPE.DOCUMENT_TYPE && (
          <div className="flex-1 border-t border-gray-100 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700">
                  {["Document", "Type", "Date", "Status", "Action"].map((col) => (
                    <th key={col} className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 px-4 py-3">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="text-center py-12 text-sm text-gray-400">
                    Is Document Type mein koi document nahi hai
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          type={deleteTarget.type}
          onConfirm={onDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}