export const SAP_BLUE   = "#0070F2";
export const SAP_DARK   = "#003366";
export const SAP_LIGHT  = "#E8F1FD";
export const SAP_AMBER  = "#E76500";
export const SAP_PURPLE = "#6A1DCB";
export const SAP_GREEN  = "#22c55e";
export const SAP_RED    = "#ef4444";

export const API = "http://localhost:3000/api";

export const STATUS_COLORS = {
  Approved:        { bg: "#f0fdf4", color: "#166534", border: "#86efac" },
  "Pending Approval": { bg: "#fff8f0", color: "#92400e", border: "#fde68a" },
  "OCR Processing":   { bg: "#eff6ff", color: "#1e40af", border: "#bfdbfe" },
  Rejected:        { bg: "#fef2f2", color: "#dc2626", border: "#fca5a5" },
  Completed:       { bg: "#f0fdf4", color: "#166534", border: "#86efac" },
};

export const OCR_FIELD_LABELS = [
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

export const MOCK_DEPARTMENTS = [
  {
    id: "1", name: "Human Resources",
    categories: [
      { id: "c1", name: "Employee Records", documentTypes: [{ id: "dt1", name: "Contracts", count: 14 }, { id: "dt2", name: "Appraisals", count: 9 }] },
      { id: "c2", name: "Payroll", documentTypes: [{ id: "dt3", name: "Salary Slips", count: 32 }] },
    ],
  },
  {
    id: "2", name: "Finance",
    categories: [
      { id: "c3", name: "Invoices", documentTypes: [{ id: "dt4", name: "Vendor Invoice", count: 18 }, { id: "dt5", name: "Client Invoice", count: 11 }] },
      { id: "c4", name: "Reports", documentTypes: [{ id: "dt6", name: "Quarterly Report", count: 6 }] },
    ],
  },
  {
    id: "3", name: "Procurement",
    categories: [
      {
        id: "c5", name: "Vendor Documents",
        documentTypes: [
          { id: "dt7", name: "Vendor Registration", count: 12 },
          { id: "dt8", name: "Vendor KYC", count: 25 },
          { id: "dt9", name: "Vendor Agreement", count: 8 },
          { id: "dt10", name: "Bank Details", count: 15 },
          { id: "dt11", name: "Tax Documents", count: 18 },
        ],
      },
      { id: "c6", name: "Purchase Orders", documentTypes: [{ id: "dt12", name: "PO Documents", count: 20 }] },
      { id: "c7", name: "Contracts", documentTypes: [{ id: "dt13", name: "Supplier Contracts", count: 7 }] },
      { id: "c8", name: "Invoices", documentTypes: [{ id: "dt14", name: "Purchase Invoice", count: 22 }] },
    ],
  },
  {
    id: "4", name: "Engineering",
    categories: [
      { id: "c9", name: "Technical Docs", documentTypes: [{ id: "dt15", name: "Drawings", count: 45 }, { id: "dt16", name: "Specifications", count: 19 }] },
    ],
  },
  { id: "5", name: "Legal", categories: [{ id: "c10", name: "Agreements", documentTypes: [{ id: "dt17", name: "NDAs", count: 8 }] }] },
  { id: "6", name: "IT", categories: [{ id: "c11", name: "IT Policies", documentTypes: [{ id: "dt18", name: "Security Policies", count: 5 }] }] },
  { id: "7", name: "Sales & Marketing", categories: [{ id: "c12", name: "Campaigns", documentTypes: [{ id: "dt19", name: "Brochures", count: 11 }] }] },
  { id: "8", name: "Admin", categories: [{ id: "c13", name: "General", documentTypes: [{ id: "dt20", name: "Circulars", count: 3 }] }] },
];

export const MOCK_DOCUMENTS = [
  { id: "doc1", name: "Vendor_KYC_ABC.pdf", version: "V2", status: "Approved",        uploadedBy: "Akshay", uploadDate: "12-Jun-2026 10:30 AM" },
  { id: "doc2", name: "Vendor_KYC_XYZ.pdf", version: "V1", status: "Pending Approval", uploadedBy: "Rahul",  uploadDate: "12-Jun-2026 11:20 AM" },
  { id: "doc3", name: "Vendor_KYC_MNO.pdf", version: "V1", status: "OCR Processing",  uploadedBy: "Neha",   uploadDate: "12-Jun-2026 12:15 PM" },
  { id: "doc4", name: "Vendor_KYC_PQR.pdf", version: "V3", status: "Approved",        uploadedBy: "Akshay", uploadDate: "11-Jun-2026 05:45 PM" },
  { id: "doc5", name: "Vendor_KYC_DEF.pdf", version: "V1", status: "Rejected",        uploadedBy: "Rahul",  uploadDate: "11-Jun-2026 02:10 PM" },
  { id: "doc6", name: "Vendor_KYC_GHI.pdf", version: "V2", status: "Approved",        uploadedBy: "Neha",   uploadDate: "10-Jun-2026 04:30 PM" },
];