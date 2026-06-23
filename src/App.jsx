import { useState } from "react";
import Login from "./Pages/Login/Login";
import { ThemeProvider } from "./Pages/SuperAdmin/Superadmincontext";
import LandingRouter from "../src/Pages/Home/LandingRouter";

// SuperAdmin
import { Layout } from "./Pages/SuperAdmin/Layout";
import Dashboard from "./Pages/SuperAdmin/Dashboard";
import Tenants from "./Pages/SuperAdmin/Tenants";
import Allusers from "./Pages/SuperAdmin/Allusers";
import Odataplugins from "./Pages/SuperAdmin/Odataplugins";
import Systemaudit from "./Pages/SuperAdmin/Systemaudit";
import Systemsettings from "./Pages/SuperAdmin/Systemsettings";
import Billing from "./Pages/SuperAdmin/Billing";
import DepartmentsPage from "./Pages/SuperAdmin/DepartmentsPage";

// TenantAdmin
import { TenantLayout } from "./Pages/TenantAdmin/TenantLayout";
import TADashboard from "./Pages/TenantAdmin/TADashboard";
import TAUsers from "./Pages/TenantAdmin/TAUsers";
import TAFolder from "./Pages/TenantAdmin/TAFolder";
import TADocuments from "./Pages/TenantAdmin/TADocuments";
import TAWorkflow from "./Pages/TenantAdmin/TAWorkflow";
import TAAudit from "./Pages/TenantAdmin/TAAudit";
import TAApprovals from "./Pages/TenantAdmin/TAApprovals";
import TCodeSearchModal from "./Pages/TenantAdmin/DMSWorkflow/modals/TCodeSearchModal";


// BranchManager
import { BMLayout } from "./Pages/BranchManager/BMLayout";
import BMDashboard from "./Pages/BranchManager/BMDashboard";
import BMUsers from "./Pages/SuperAdmin/Allusers";
import BMDocuments from "./Pages/TenantAdmin/TADocuments";
import BMWorkflow from "./Pages/TenantAdmin/TAWorkflow";
import BMFolders from "./Pages/TenantAdmin/TAFolder";
import BMAudit from "./Pages/TenantAdmin/TAAudit";
import BMApprovals from "./Pages/TenantAdmin/TAApprovals";

// DeptHead
import { DHLayout } from "./Pages/DeptHead/DHLayout";
import DHDashboard from "./Pages/DeptHead/DHDashboard";
import DHDocuments from "./Pages/TenantAdmin/TADocuments";
import DHWorkflow from "./Pages/TenantAdmin/TAWorkflow";
import DHApprovals from "./Pages/TenantAdmin/TAApprovals";
import DHFolders from "./Pages/TenantAdmin/TAFolder";

// Manager
import { MGLayout } from "./Pages/Manager/MGLayout";
import MGDashboard from "./Pages/Manager/MGDashboard";
import MGDocuments from "./Pages/TenantAdmin/TADocuments";
import MGNewDoc from "./Pages/TenantAdmin/TAWorkflow";
import MGApprovals from "./Pages/TenantAdmin/TAApprovals";
import MGFolders from "./Pages/TenantAdmin/TAFolder";

// Uploader
import { UploaderLayout } from "./Pages/Uploader/UploaderLayout";
import UploaderDashboard from "./Pages/Uploader/UploaderDashboard";
import UploaderDocuments from "./Pages/TenantAdmin/TADocuments";

// Viewer
import { ViewerLayout } from "./Pages/Viewer/ViewerLayout";
import ViewerDashboard from "./Pages/viewer/Viewerdashboard";
import ViewerDocuments from "./Pages/TenantAdmin/TADocuments";
import ViewerFolders from "./Pages/TenantAdmin/TAFolder";

// Auditor
import { AuditorLayout } from "./Pages/Auditor/AuditorLayout";
import AuditorDashboard from "./Pages/Auditor/AuditorDashboard";
import AuditorDocuments from "./Pages/TenantAdmin/TADocuments";

// Approver
import { ApproverLayout } from "./Pages/Approver/ApproverLayout";
import ApproverDashboard from "./Pages/Approver/ApproverDashboard";
import ApproverApprovals from "./Pages/Approver/ApproverApprovals";

// ─────────────────────────────────────────────
// PAGE MAPS
// ─────────────────────────────────────────────


const SUPER_ADMIN_PAGES = {
  dashboard: (nav) => <Dashboard onNavigate={nav} />,
  tenants: (nav) => <Tenants onNavigate={nav} />,
  users: (nav) => <Allusers onNavigate={nav} />,
  odata: (nav) => <Odataplugins onNavigate={nav} />,
  audit: (nav) => <Systemaudit onNavigate={nav} />,
  settings: (nav) => <Systemsettings onNavigate={nav} />,
  billing: (nav) => <Billing onNavigate={nav} />,
  departments: (nav) => <DepartmentsPage onNavigate={nav} />,
};

const TENANT_ADMIN_PAGES = {
  dashboard: (nav) => <TADashboard onNavigate={nav} />,
  users: (nav) => <TAUsers onNavigate={nav} />,
  folder: (nav) => <TAFolder onNavigate={nav} />,
  documents: (nav) => <TADocuments onNavigate={nav} />,
  workflow: (nav) => <TAWorkflow onNavigate={nav} />,
  audit: (nav) => <TAAudit onNavigate={nav} />,
  approvals: (nav) => <TAApprovals onNavigate={nav} />,
};

const BRANCH_MANAGER_PAGES = {
  dashboard: (nav) => <BMDashboard onNavigate={nav} />,
  users: (nav) => <BMUsers onNavigate={nav} />,
  documents: (nav) => <BMDocuments onNavigate={nav} />,
  workflow: (nav) => <BMWorkflow onNavigate={nav} />,
  folders: (nav) => <BMFolders onNavigate={nav} />,
  audit: (nav) => <BMAudit onNavigate={nav} />,
  approvals: (nav) => <BMApprovals onNavigate={nav} />,
};

const DEPT_HEAD_PAGES = {
  dashboard: (nav) => <DHDashboard onNavigate={nav} />,
  documents: (nav) => <DHDocuments onNavigate={nav} />,
  workflow: (nav) => <DHWorkflow onNavigate={nav} />,
  approvals: (nav) => <DHApprovals onNavigate={nav} />,
  folders: (nav) => <DHFolders onNavigate={nav} />,
};

const MANAGER_PAGES = {
  dashboard: (nav) => <MGDashboard onNavigate={nav} />,
  newdoc: (nav) => <MGNewDoc onNavigate={nav} />,
  documents: (nav) => <MGDocuments onNavigate={nav} />,
  approvals: (nav) => <MGApprovals onNavigate={nav} />,
  folders: (nav) => <MGFolders onNavigate={nav} />,
};

const UPLOADER_PAGES = {
  dashboard: (nav) => <UploaderDashboard onNavigate={nav} />,
  upload: (nav) => <TAWorkflow onNavigate={nav} />,
  documents: (nav) => <UploaderDocuments onNavigate={nav} />,
};

const VIEWER_PAGES = {
  dashboard: (nav) => <ViewerDashboard onNavigate={nav} />,
  documents: () => <ViewerDocuments />,
  folders: () => <ViewerFolders />,
};

const AUDITOR_PAGES = {
  dashboard: (nav) => <AuditorDashboard onNavigate={nav} />,
  documents: () => <AuditorDocuments />,
  auditlog: (nav) => <TAAudit onNavigate={nav} />,
};

const APPROVER_PAGES = {
  dashboard: (nav) => <ApproverDashboard onNavigate={nav} />,
  approvals: () => <ApproverApprovals />,
  documents: (nav) => <TADocuments onNavigate={nav} />,
};

const PAGE_TITLES = {
  dashboard: "Dashboard",
  users: "User Management",
  folder: "Folder Structure",
  documents: "Documents",
  workflow: "DMS Workflow",
  audit: "Audit Log",
  approvals: "Approvals",
  tenants: "Tenants",
  odata: "OData Plugins",
  settings: "System Settings",
  billing: "Billing",
  departments: "Department Master",
  newdoc: "New Document",
  folders: "Folders",
  auditlog: "Full Audit Log",
};

const doLogout = (setUser) => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  setUser(null);
};

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        email: payload.email,
        role: payload.role || "Viewer",
        name: payload.name || payload.email,
        tenantId: payload.tenantId || null,
      };
    } catch {
      return null;
    }
  });

  const [activePage, setActivePage] = useState("dashboard");
  const [showLanding, setShowLanding] = useState(true);
  const [landingPage, setLandingPage] = useState("home"); // ← ADD
  const [showTCodeSearch, setShowTCodeSearch] = useState(false);


  // STEP 1 — Landing Page
  if (showLanding && !user) {
    return <LandingRouter onGetStarted={() => setShowLanding(false)} />;
  }

  // STEP 2 — Login Page
  if (!user) {
    return (
      <Login
        onLogin={(u) => {
          setUser(u);
          setActivePage("dashboard");
        }}
      />
    );
  }

  // STEP 3 — Role Based Dashboard
  return (
    <ThemeProvider>
      {user.role === "SuperAdmin" && (
        <Layout
          activePage={activePage}
          onNavigate={setActivePage}
          onLogout={() => doLogout(setUser)}
          title={PAGE_TITLES[activePage] || activePage}
        >
          {(SUPER_ADMIN_PAGES[activePage] ?? SUPER_ADMIN_PAGES.dashboard)(
            setActivePage,
          )}
        </Layout>
      )}

      {user.role === "TenantAdmin" && (
  <>
    <TenantLayout
      activePage={activePage}
      onNavigate={setActivePage}
      onLogout={() => doLogout(setUser)}
      title={PAGE_TITLES[activePage] || activePage}
      user={user}
      onTCodeSearch={() => setShowTCodeSearch(true)}  // ← add karo
    >
      {(TENANT_ADMIN_PAGES[activePage] ?? TENANT_ADMIN_PAGES.dashboard)(setActivePage)}
    </TenantLayout>

    {showTCodeSearch && (
      <TCodeSearchModal
        onClose={() => setShowTCodeSearch(false)}
        onViewDoc={(doc, action) => console.log(action, doc)}
      />
    )}
  </>
)}

      {user.role === "BranchManager" && (
        <BMLayout
          activePage={activePage}
          onNavigate={setActivePage}
          onLogout={() => doLogout(setUser)}
          title={PAGE_TITLES[activePage] || activePage}
          user={user}
        >
          {(BRANCH_MANAGER_PAGES[activePage] ?? BRANCH_MANAGER_PAGES.dashboard)(
            setActivePage,
          )}
        </BMLayout>
      )}

      {user.role === "DeptHead" && (
        <DHLayout
          activePage={activePage}
          onNavigate={setActivePage}
          onLogout={() => doLogout(setUser)}
          title={PAGE_TITLES[activePage] || activePage}
          user={user}
        >
          {(DEPT_HEAD_PAGES[activePage] ?? DEPT_HEAD_PAGES.dashboard)(
            setActivePage,
          )}
        </DHLayout>
      )}

      {user.role === "Manager" && (
        <MGLayout
          activePage={activePage}
          onNavigate={setActivePage}
          onLogout={() => doLogout(setUser)}
          title={PAGE_TITLES[activePage] || activePage}
          user={user}
        >
          {(MANAGER_PAGES[activePage] ?? MANAGER_PAGES.dashboard)(
            setActivePage,
          )}
        </MGLayout>
      )}

      {user.role === "Uploader" && (
        <UploaderLayout
          activePage={activePage}
          onNavigate={setActivePage}
          onLogout={() => doLogout(setUser)}
          title={PAGE_TITLES[activePage] || activePage}
          user={user}
        >
          {(UPLOADER_PAGES[activePage] ?? UPLOADER_PAGES.dashboard)(
            setActivePage,
          )}
        </UploaderLayout>
      )}

      {user.role === "Viewer" && (
        <ViewerLayout
          activePage={activePage}
          onNavigate={setActivePage}
          onLogout={() => doLogout(setUser)}
          title={PAGE_TITLES[activePage] || activePage}
          user={user}
        >
          {(VIEWER_PAGES[activePage] ?? VIEWER_PAGES.dashboard)(setActivePage)}
        </ViewerLayout>
      )}

      {user.role === "Auditor" && (
        <AuditorLayout
          activePage={activePage}
          onNavigate={setActivePage}
          onLogout={() => doLogout(setUser)}
          title={PAGE_TITLES[activePage] || activePage}
          user={user}
        >
          {(AUDITOR_PAGES[activePage] ?? AUDITOR_PAGES.dashboard)(
            setActivePage,
          )}
        </AuditorLayout>
      )}

      {user.role === "Approver" && (
        <ApproverLayout
          activePage={activePage}
          onNavigate={setActivePage}
          onLogout={() => doLogout(setUser)}
          title={PAGE_TITLES[activePage] || activePage}
          user={user}
        >
          {(APPROVER_PAGES[activePage] ?? APPROVER_PAGES.dashboard)(
            setActivePage,
          )}
        </ApproverLayout>
      )}
    </ThemeProvider>
  );
}
