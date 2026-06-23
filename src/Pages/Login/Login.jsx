import { useState, useEffect, useRef } from "react";

const API = "http://localhost:3000/api";

export default function Login({ onLogin }) {
  const [dark, setDark] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pageTurn, setPageTurn] = useState(false);
  const [shake, setShake] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [success, setSuccess] = useState(false);
  const [caps, setCaps] = useState(false);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
    setTimeout(() => setPageTurn(true), 520);
  }, []);

  function triggerError(msg) {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 480);
  }

  function handleMouseMove(e) {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: px * 2.2, y: py * -2.2 });
  }
  function resetTilt() { setTilt({ x: 0, y: 0 }); }

  async function handleLogin() {
    setError("");
    if (!email.trim()) return triggerError("Email address is required.");
    if (!password.trim()) return triggerError("Password is required.");

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        triggerError(data.message || "Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      let userRole = "Viewer";
      let userName = email.split("@")[0];
      let userTenantId = null;

      try {
        const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
        userRole = payload.role || "Viewer";
        userName = payload.name || payload.email || email;
        userTenantId = payload.tenantId || null;
      } catch (_) {}

      setSuccess(true);
      setTimeout(() => {
        if (onLogin) {
          onLogin({ email: email.trim(), role: userRole, name: userName, tenantId: userTenantId });
        }
      }, 650);
    } catch {
      triggerError("Cannot reach server. Is the backend running on port 3000?");
      setLoading(false);
    }
  }

  // ── theme tokens ──────────────────────────────────────────────
  const T = dark ? {
    pageBg:        "#0A1118",
    leftBg:        "linear-gradient(165deg,#0F1E30 0%,#0B1626 100%)",
    leftBorder:    "rgba(255,255,255,0.07)",
    rightBg:       "#0C1A2A",
    spineAccent:   "#3FA9F5",
    headingColor:  "#F4F9FF",
    subColor:      "#5F88A8",
    labelColor:    "#42688A",
    textColor:     "#D7E7F7",
    inputBg:       "rgba(255,255,255,0.035)",
    inputBorder:   "rgba(255,255,255,0.1)",
    inputFocusBg:  "rgba(63,169,245,0.07)",
    placeholderC:  "#24405A",
    iconColor:     "#345575",
    dividerColor:  "rgba(255,255,255,0.06)",
    footerColor:   "#1E3954",
    tagBg:         "rgba(63,169,245,0.1)",
    tagColor:      "#62B5F2",
    toggleBg:      "rgba(255,255,255,0.06)",
    toggleBorder:  "rgba(255,255,255,0.12)",
    toggleColor:   "#6797B8",
    lineBg:        "rgba(255,255,255,0.035)",
    orbA:          "rgba(63,169,245,0.12)",
    orbB:          "rgba(20,80,160,0.09)",
    cardEdge:      "rgba(255,255,255,0.06)",
  } : {
    pageBg:        "#E8F0F9",
    leftBg:        "linear-gradient(165deg,#FFFFFF 0%,#F6FAFF 100%)",
    leftBorder:    "rgba(0,90,158,0.1)",
    rightBg:       "#F2F8FE",
    spineAccent:   "#0078D4",
    headingColor:  "#071525",
    subColor:      "#6A8FAA",
    labelColor:    "#7A9EBE",
    textColor:     "#0D2137",
    inputBg:       "rgba(255,255,255,0.85)",
    inputBorder:   "#C7DDF0",
    inputFocusBg:  "rgba(255,255,255,1)",
    placeholderC:  "#A7C0D4",
    iconColor:     "#9FBED1",
    dividerColor:  "rgba(0,90,158,0.08)",
    footerColor:   "#9FBED4",
    tagBg:         "rgba(0,120,212,0.08)",
    tagColor:      "#0062B0",
    toggleBg:      "rgba(0,0,0,0.04)",
    toggleBorder:  "rgba(0,0,0,0.08)",
    toggleColor:   "#5A7A94",
    lineBg:        "rgba(0,90,158,0.035)",
    orbA:          "rgba(0,120,212,0.07)",
    orbB:          "rgba(0,60,120,0.05)",
    cardEdge:      "rgba(0,90,158,0.07)",
  };

  const inputStyle = (field) => ({
    width: "100%",
    boxSizing: "border-box",
    padding: field === "password" ? "13px 42px 13px 42px" : "13px 14px 13px 42px",
    borderRadius: "11px",
    background: focusedField === field ? T.inputFocusBg : T.inputBg,
    border: `1.5px solid ${focusedField === field ? T.spineAccent : T.inputBorder}`,
    boxShadow: focusedField === field ? `0 0 0 4px ${dark ? "rgba(63,169,245,0.15)" : "rgba(0,120,212,0.1)"}` : "none",
    color: T.textColor,
    fontSize: "13.5px",
    outline: "none",
    transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
    fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.pageBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
        transition: "background 0.4s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ambient orbs, drifting */}
      <div className="dms-orb" style={{ position:"absolute", top:"-10%", right:"-6%", width:"560px", height:"560px", borderRadius:"50%", pointerEvents:"none", background:`radial-gradient(circle,${T.orbA} 0%,transparent 65%)`, animation:"dmsDrift1 14s ease-in-out infinite" }} />
      <div className="dms-orb" style={{ position:"absolute", bottom:"-14%", left:"-8%", width:"580px", height:"580px", borderRadius:"50%", pointerEvents:"none", background:`radial-gradient(circle,${T.orbB} 0%,transparent 65%)`, animation:"dmsDrift2 17s ease-in-out infinite" }} />

      {/* floating document chips — ambient, subject-specific motif */}
      {[
        { top: "10%", left: "6%", rot: -8, delay: "0s" },
        { top: "72%", left: "10%", rot: 10, delay: "1.4s" },
        { top: "18%", left: "92%", rot: 12, delay: "0.7s" },
        { top: "80%", left: "90%", rot: -10, delay: "2.1s" },
      ].map((c, i) => (
        <div key={i} style={{
          position:"absolute", top:c.top, left:c.left, width:"30px", height:"38px",
          borderRadius:"5px", background: dark ? "rgba(63,169,245,0.07)" : "rgba(0,120,212,0.06)",
          border:`1px solid ${dark ? "rgba(63,169,245,0.14)" : "rgba(0,120,212,0.12)"}`,
          transform:`rotate(${c.rot}deg)`, pointerEvents:"none",
          animation:`dmsFloat 6s ease-in-out ${c.delay} infinite`,
        }} />
      ))}

      {/* theme toggle */}
      <button
        onClick={() => setDark(v => !v)}
        aria-label="Toggle dark mode"
        style={{
          position:"absolute", top:"18px", right:"18px", zIndex:20,
          width:"40px", height:"40px", borderRadius:"11px", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          background: T.toggleBg, border:`1px solid ${T.toggleBorder}`,
          color: T.toggleColor, backdropFilter:"blur(8px)", transition:"all 0.25s cubic-bezier(.4,0,.2,1)",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform="scale(1.1) rotate(12deg)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform="scale(1) rotate(0deg)"; }}
      >
        <span style={{ display:"inline-block", transition:"transform 0.4s cubic-bezier(.34,1.56,.64,1)", transform: dark ? "rotate(0deg)" : "rotate(180deg)" }}>
          {dark ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </span>
      </button>

      {/* ── BOOK WRAPPER ───────────────────────────────── */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "880px",
          minHeight: "570px",
          borderRadius: "22px",
          overflow: "hidden",
          boxShadow: dark
            ? "0 40px 90px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)"
            : "0 28px 70px rgba(0,90,158,0.16), 0 0 0 1px rgba(0,90,158,0.08)",
          opacity: mounted ? 1 : 0,
          transform: mounted
            ? `translateY(0) scale(1) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
            : "translateY(28px) scale(0.97)",
          transformStyle: "preserve-3d",
          transition: mounted
            ? "opacity 0.6s ease, transform 0.5s cubic-bezier(.4,0,.2,1), box-shadow 0.4s ease"
            : "opacity 0.6s ease, transform 0.6s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* ── LEFT PAGE – Branding ──────────────────────── */}
        <div
          className="dms-left-page"
          style={{
            flex: "0 0 42%",
            background: T.leftBg,
            borderRight: `1px solid ${T.leftBorder}`,
            padding: "46px 38px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* page-turn sheen sweeping across on mount, subject's signature moment */}
          <div style={{
            position:"absolute", top:0, left: pageTurn ? "120%" : "-40%", bottom:0, width:"55%",
            background:`linear-gradient(100deg, transparent 0%, ${dark ? "rgba(63,169,245,0.14)" : "rgba(255,255,255,0.65)"} 45%, transparent 100%)`,
            transition:"left 0.9s cubic-bezier(.16,1,.3,1)", pointerEvents:"none", zIndex:3,
          }} />

          {/* decorative page lines */}
          {[0,1,2,3,4,5,6,7,8].map(i => (
            <div key={i} style={{
              position:"absolute", left:0, right:0,
              top: `${98 + i * 52}px`, height:"1px",
              background: T.lineBg,
            }} />
          ))}

          {/* top section */}
          <div style={{ position:"relative", zIndex:2 }}>
            {/* logo mark */}
            <div style={{
              width:"56px", height:"56px", borderRadius:"15px", marginBottom:"24px",
              background:"linear-gradient(135deg,#0078D4 0%,#005A9E 100%)",
              boxShadow: mounted ? "0 8px 28px rgba(0,120,212,0.42)" : "none",
              display:"flex", alignItems:"center", justifyContent:"center",
              transform: mounted ? "scale(1) rotate(0deg)" : "scale(0.6) rotate(-12deg)",
              transition:"transform 0.6s cubic-bezier(.34,1.56,.64,1) 0.15s",
            }}>
              <svg width="31" height="31" viewBox="0 0 32 32" fill="none">
                <rect x="3" y="3" width="11" height="14" rx="2" fill="white" opacity="0.95"/>
                <rect x="18" y="3" width="11" height="8" rx="2" fill="white" opacity="0.95"/>
                <rect x="18" y="15" width="11" height="14" rx="2" fill="white" opacity="0.95"/>
                <rect x="3" y="21" width="11" height="8" rx="2" fill="white" opacity="0.95"/>
              </svg>
            </div>

            <h1 style={{ fontSize:"31px", fontWeight:"800", letterSpacing:"-0.8px", color: T.headingColor, margin:"0 0 6px 0", lineHeight:1.15, transition:"color 0.3s" }}>
              DocFlow
            </h1>
            <h1 style={{ fontSize:"31px", fontWeight:"800", letterSpacing:"-0.8px", color:"#0078D4", margin:"0 0 14px 0", lineHeight:1.15 }}>
              DMS
            </h1>
            <p style={{ fontSize:"12.5px", color: T.subColor, margin:"0 0 30px 0", lineHeight:1.65, transition:"color 0.3s" }}>
              Intelligent Document Management<br />seamlessly integrated with SAP
            </p>

            {/* feature tags */}
            {[
              { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", label: "SAP OData Integration" },
              { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", label: "JWT · TLS Encrypted" },
              { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", label: "Multi-Role Access Control" },
              { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", label: "Audit Trail & Compliance" },
            ].map((f, i) => (
              <div
                key={i}
                className="dms-feature-row"
                style={{
                  display:"flex", alignItems:"center", gap:"10px", marginBottom:"11px",
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateX(0)" : "translateX(-14px)",
                  transition:`opacity 0.5s ease ${0.25 + i * 0.08}s, transform 0.5s cubic-bezier(.16,1,.3,1) ${0.25 + i * 0.08}s`,
                }}
              >
                <div style={{ width:"29px", height:"29px", borderRadius:"9px", flexShrink:0, background: T.tagBg, display:"flex", alignItems:"center", justifyContent:"center", transition:"transform 0.2s ease" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.tagColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.icon}/>
                  </svg>
                </div>
                <span style={{ fontSize:"12px", fontWeight:"600", color: T.tagColor }}>{f.label}</span>
              </div>
            ))}
          </div>

          {/* bottom – version */}
          <div style={{ position:"relative", zIndex:2 }}>
            <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
              <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#23C55E", boxShadow:"0 0 8px rgba(35,197,94,0.7)", animation:"dmsPulse 2.2s ease-in-out infinite" }} />
              <span style={{ fontSize:"10px", color: T.footerColor, fontWeight:"600" }}>v2.4.1 · Production · All systems operational</span>
            </div>
          </div>

          {/* spine gradient */}
          <div style={{ position:"absolute", top:0, right:0, bottom:0, width:"3px", background:`linear-gradient(180deg, transparent 0%, ${T.spineAccent}60 30%, ${T.spineAccent}90 60%, transparent 100%)` }} />
          {/* spine inner shadow for book fold illusion */}
          <div style={{ position:"absolute", top:0, right:"-1px", bottom:0, width:"14px", background:`linear-gradient(90deg, transparent 0%, ${dark ? "rgba(0,0,0,0.3)" : "rgba(0,40,80,0.06)"} 100%)`, pointerEvents:"none" }} />
        </div>

        {/* ── RIGHT PAGE – Login Form ───────────────────── */}
        <div
          className="dms-right-page"
          style={{
            flex: 1,
            background: T.rightBg,
            padding: "46px 42px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* top-right page marker */}
          <div style={{ position:"absolute", top:"26px", right:"26px", display:"flex", alignItems:"center", gap:"6px" }}>
            <span style={{ width:"5px", height:"5px", borderRadius:"50%", background: T.spineAccent }} />
            <span style={{ fontSize:"9px", fontWeight:"700", letterSpacing:"1.5px", textTransform:"uppercase", color: T.labelColor }}>Secure Sign-In</span>
          </div>

          <div style={{
            maxWidth:"340px", width:"100%", margin:"0 auto",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(10px)",
            transition:"opacity 0.5s ease 0.2s, transform 0.5s cubic-bezier(.16,1,.3,1) 0.2s",
          }}>
            <h2 style={{ fontSize:"23px", fontWeight:"800", color: T.headingColor, margin:"0 0 4px 0", letterSpacing:"-0.4px", transition:"color 0.3s" }}>
              Welcome back
            </h2>
            <p style={{ fontSize:"13px", color: T.subColor, margin:"0 0 32px 0", lineHeight:1.5, transition:"color 0.3s" }}>
              Sign in with your credentials.<br />Your role and permissions will load automatically.
            </p>

            {/* Email */}
            <div style={{ marginBottom:"16px" }}>
              <label style={{ display:"block", fontSize:"10px", fontWeight:"700", letterSpacing:"1.2px", textTransform:"uppercase", color: T.labelColor, marginBottom:"7px" }}>
                Email Address
              </label>
              <div style={{ position:"relative" }}>
                <div style={{ position:"absolute", left:"13px", top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={focusedField==="email" ? T.spineAccent : T.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition:"stroke 0.2s" }}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="your.email@company.com"
                  style={inputStyle("email")}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom:"10px" }}>
              <label style={{ display:"block", fontSize:"10px", fontWeight:"700", letterSpacing:"1.2px", textTransform:"uppercase", color: T.labelColor, marginBottom:"7px" }}>
                Password
              </label>
              <div style={{ position:"relative" }}>
                <div style={{ position:"absolute", left:"13px", top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={focusedField==="password" ? T.spineAccent : T.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition:"stroke 0.2s" }}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={e => {
                    if (e.key === "Enter") handleLogin();
                    if (typeof e.getModifierState === "function") setCaps(e.getModifierState("CapsLock"));
                  }}
                  onKeyUp={e => { if (typeof e.getModifierState === "function") setCaps(e.getModifierState("CapsLock")); }}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  style={inputStyle("password")}
                />
                <button type="button" onClick={() => setShowPass(v => !v)} style={{
                  position:"absolute", right:"13px", top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", cursor:"pointer", padding:"2px",
                  color: T.iconColor, display:"flex", alignItems:"center", transition:"color 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.color=T.spineAccent}
                  onMouseLeave={e => e.currentTarget.style.color=T.iconColor}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  )}
                </button>
              </div>
              {caps && (
                <div style={{ display:"flex", alignItems:"center", gap:"5px", marginTop:"6px", fontSize:"11px", fontWeight:"600", color:"#D97706" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2 L19 9 L15 9 L15 16 L9 16 L9 9 L5 9 Z"/>
                  </svg>
                  Caps Lock is on
                </div>
              )}
            </div>

            <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:"18px" }}>
              <button type="button" style={{ background:"none", border:"none", cursor:"pointer", fontSize:"11.5px", fontWeight:"600", color: T.spineAccent, padding:0 }}>
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                display:"flex", alignItems:"center", gap:"8px",
                background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.22)",
                borderRadius:"10px", padding:"10px 14px", marginBottom:"16px",
                fontSize:"12px", fontWeight:"600", color:"#F87171",
                animation: shake ? "dmsShake 0.42s ease" : "dmsErrorIn 0.25s ease",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleLogin}
              disabled={loading || success}
              style={{
                width:"100%", padding:"14px",
                background: success
                  ? "linear-gradient(135deg,#1FAE5C 0%,#168A48 100%)"
                  : loading ? "rgba(0,120,212,0.45)" : "linear-gradient(135deg,#0078D4 0%,#005A9E 100%)",
                border:"none", borderRadius:"11px", color:"white",
                fontSize:"14px", fontWeight:"700", letterSpacing:"0.2px",
                cursor: (loading || success) ? "default" : "pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
                boxShadow: success
                  ? "0 4px 20px rgba(31,174,92,0.45)"
                  : loading ? "none" : "0 4px 18px rgba(0,120,212,0.4)",
                transition:"all 0.25s cubic-bezier(.4,0,.2,1)",
                transform: success ? "scale(1.01)" : "scale(1)",
              }}
              onMouseEnter={e => { if (!loading && !success) { e.currentTarget.style.boxShadow="0 6px 26px rgba(0,120,212,0.55)"; e.currentTarget.style.transform="translateY(-1px)"; }}}
              onMouseLeave={e => { if (!success) { e.currentTarget.style.boxShadow="0 4px 18px rgba(0,120,212,0.4)"; e.currentTarget.style.transform="translateY(0)"; }}}
            >
              {success ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ animation:"dmsCheckIn 0.4s cubic-bezier(.34,1.56,.64,1)" }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Signed in
                </>
              ) : loading ? (
                <>
                  <svg style={{ animation:"dmsSpin 0.75s linear infinite" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 2a10 10 0 0 1 10 10"/>
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign in to DocFlow
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="dms-arrow">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>

            {/* Footer note */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"5px", marginTop:"22px" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.footerColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span style={{ fontSize:"10.5px", color: T.footerColor, fontWeight:"500" }}>
                Secured with JWT · TLS encrypted · Role auto-detected
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* global footer */}
      <p style={{ position:"absolute", bottom:"14px", left:0, right:0, textAlign:"center", fontSize:"10.5px", color: dark ? "#16293D" : "#A9C5DC", fontWeight:"500" }}>
        DocFlow DMS · Veda Hospitality · 2025
      </p>

      <style>{`
        @keyframes dmsShake {
          0%,100%{transform:translateX(0)} 20%{transform:translateX(-7px)} 40%{transform:translateX(7px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)}
        }
        @keyframes dmsSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes dmsPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes dmsErrorIn { from{opacity:0; transform:translateY(-4px)} to{opacity:1; transform:translateY(0)} }
        @keyframes dmsCheckIn { from{transform:scale(0.5); opacity:0} to{transform:scale(1); opacity:1} }
        @keyframes dmsFloat {
          0%,100% { transform: translateY(0) rotate(var(--r,0deg)); }
          50% { transform: translateY(-14px) rotate(var(--r,0deg)); }
        }
        @keyframes dmsDrift1 {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(-22px, 18px); }
        }
        @keyframes dmsDrift2 {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(20px, -16px); }
        }
        input::placeholder { color: ${dark ? "#1E3448" : "#A0BACE"}; }
        * { -webkit-font-smoothing: antialiased; }
        button:focus-visible, input:focus-visible {
          outline: 2px solid ${T.spineAccent};
          outline-offset: 2px;
        }
        .dms-feature-row:hover > div:first-child {
          transform: scale(1.08);
        }
        button:hover .dms-arrow {
          transform: translateX(3px);
        }
        .dms-arrow {
          transition: transform 0.2s ease;
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
        @media (max-width: 680px) {
          .dms-left-page { display: none !important; }
        }
      `}</style>
    </div>
  );
}