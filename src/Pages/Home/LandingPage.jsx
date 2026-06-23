import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";

import { useLanguage } from "../Home/LanguageContext";
// ── Animation hook: element view mein aane par trigger hota hai
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

const NAV_LINKS = [
  "Home",
  "Features",
  "Solutions",
  "Resources",
  "About Us",
  "Contact",
];

const FEATURES = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
        />
      </svg>
    ),
    color: "text-emerald-600 bg-emerald-100",
    gradient: "from-emerald-400 to-teal-500",
    title: "Centralized Storage",
    desc: "Store all your documents in one secure and centralized place.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35"
        />
      </svg>
    ),
    color: "text-blue-600 bg-blue-100",
    gradient: "from-blue-400 to-indigo-500",
    title: "Smart Search",
    desc: "Find documents instantly with advanced search and filters.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5"
        />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    color: "text-purple-600 bg-purple-100",
    gradient: "from-purple-400 to-pink-500",
    title: "Role Based Access",
    desc: "Control who can view, edit or share documents.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    color: "text-orange-600 bg-orange-100",
    gradient: "from-orange-400 to-rose-500",
    title: "Version Control",
    desc: "Track document versions and restore previous versions.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
        />
      </svg>
    ),
    color: "text-sky-600 bg-sky-100",
    gradient: "from-sky-400 to-cyan-500",
    title: "Cloud Integration",
    desc: "Seamlessly integrate with cloud services.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    color: "text-rose-600 bg-rose-100",
    gradient: "from-rose-400 to-fuchsia-500",
    title: "Reports & Analytics",
    desc: "Gain insights and monitor document activities.",
  },
];

const STATS = [
  {
    value: "2,548+",
    label: "Total Documents",
    sub: "+12.5% from last month",
    subColor: "text-emerald-500",
    icon: "📄",
    bg: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
  },
  {
    value: "156+",
    label: "Active Users",
    sub: "+18 new users this month",
    subColor: "text-blue-500",
    icon: "👥",
    bg: "from-blue-50 to-indigo-50",
    border: "border-blue-200",
  },
  {
    value: "128.4 GB",
    label: "Storage Used",
    sub: "25.68% of 500 GB",
    subColor: "text-purple-500",
    icon: "💾",
    bg: "from-purple-50 to-pink-50",
    border: "border-purple-200",
  },
  {
    value: "99.9%",
    label: "Data Security",
    sub: "Enterprise Grade Security",
    subColor: "text-orange-500",
    icon: "🔐",
    bg: "from-orange-50 to-rose-50",
    border: "border-orange-200",
  },
];

const ICON_FEATURES = [
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35"
        />
      </svg>
    ),
    label: "Search",
    color: "text-emerald-500",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18M9 21V9" />
      </svg>
    ),
    label: "Organize",
    color: "text-blue-500",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        />
      </svg>
    ),
    label: "Store",
    color: "text-teal-500",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999A5.002 5.002 0 003 15z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 12v4m0-4l-2 2m2-2l2 2"
        />
      </svg>
    ),
    label: "Cloud Store",
    color: "text-blue-600",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
        />
      </svg>
    ),
    label: "Workflow",
    color: "text-green-500",
  },
];

// ── Floating particles background
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-20 animate-pulse"
          style={{
            width: `${Math.random() * 6 + 3}px`,
            height: `${Math.random() * 6 + 3}px`,
            background: ["#3B82F6", "#06B6D4", "#10B981", "#8B5CF6", "#F59E0B"][
              i % 5
            ],
            left: `${(i * 8.3) % 100}%`,
            top: `${(i * 13.7) % 100}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${2 + (i % 3)}s`,
          }}
        />
      ))}
    </div>
  );
}

function FolderHeroIllustration() {
  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[420px]">
      <Particles />

      {/* Secure — top center, floating */}
      <div
        className="absolute flex flex-col items-center animate-bounce"
        style={{
          top: "10px",
          left: "calc(50% - 40px)",
          animationDuration: "3s",
        }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-teal-500/20 p-3 flex flex-col items-center w-20 border border-teal-100">
          <div className="text-teal-500 mb-1">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-700">Secure</span>
        </div>
      </div>

      {/* Organize — left, floating */}
      <div
        className="absolute left-0 top-1/3"
        style={{
          animation: "floatY 4s ease-in-out infinite",
          animationDelay: "0.5s",
        }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-500/20 p-3 flex flex-col items-center w-24 border border-blue-100">
          <div className="text-blue-500 mb-1">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path strokeLinecap="round" d="M3 9h18M9 21V9" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-700">Organize</span>
        </div>
      </div>

      {/* Search — right top */}
      <div
        className="absolute right-0 top-1/4"
        style={{
          animation: "floatY 3.5s ease-in-out infinite",
          animationDelay: "1s",
        }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-emerald-500/20 p-3 flex flex-col items-center w-24 border border-emerald-100">
          <div className="text-emerald-500 mb-1">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-700">Search</span>
        </div>
      </div>

      {/* Store — right middle */}
      <div
        className="absolute right-4 top-1/2"
        style={{
          animation: "floatY 4.5s ease-in-out infinite",
          animationDelay: "1.5s",
        }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-500/20 p-3 flex flex-col items-center w-24 border border-blue-100">
          <div className="text-blue-500 mb-1">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999A5.002 5.002 0 003 15z"
              />
              <path strokeLinecap="round" d="M12 12v4m0-4l-2 2m2-2l2 2" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-700">Store</span>
        </div>
      </div>

      {/* Main Folder */}
      <div className="relative z-10 flex flex-col items-center">
        <div
          style={{ filter: "drop-shadow(0 20px 40px rgba(59,130,246,0.3))" }}
        >
          <svg
            width="260"
            height="240"
            viewBox="0 0 260 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse
              cx="130"
              cy="210"
              rx="110"
              ry="22"
              fill="url(#platformGrad)"
              opacity="0.85"
            />
            <ellipse
              cx="130"
              cy="204"
              rx="90"
              ry="14"
              fill="url(#platformInner)"
              opacity="0.5"
            />
            <rect
              x="32"
              y="90"
              width="196"
              height="124"
              rx="14"
              fill="url(#folderGrad)"
            />
            <path
              d="M32 103 Q32 90 46 90 H105 L118 75 H178 Q192 75 192 89 V103 Z"
              fill="url(#tabGrad)"
            />
            <rect
              x="148"
              y="52"
              width="62"
              height="78"
              rx="6"
              fill="#A78BFA"
              opacity="0.9"
            />
            <rect
              x="138"
              y="48"
              width="62"
              height="82"
              rx="6"
              fill="#60A5FA"
              opacity="0.9"
            />
            <rect
              x="125"
              y="44"
              width="62"
              height="86"
              rx="6"
              fill="#86EFAC"
              opacity="0.9"
            />
            <rect x="58" y="42" width="98" height="88" rx="6" fill="white" />
            <rect x="66" y="52" width="22" height="16" rx="3" fill="#EF4444" />
            <rect x="94" y="55" width="52" height="5" rx="2" fill="#94A3B8" />
            <rect x="66" y="75" width="82" height="4" rx="2" fill="#CBD5E1" />
            <rect x="66" y="84" width="70" height="4" rx="2" fill="#CBD5E1" />
            <rect x="66" y="93" width="55" height="4" rx="2" fill="#E2E8F0" />
            <rect
              x="106"
              y="145"
              width="48"
              height="38"
              rx="6"
              fill="white"
              opacity="0.25"
            />
            <path d="M114 158 H150 V177 H114 Z" fill="white" opacity="0.35" />
            <path
              d="M114 158 V155 Q114 152 117 152 H128 L131 155 V158 Z"
              fill="white"
              opacity="0.35"
            />
            <path
              d="M120 164 H144"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              d="M120 170 H136"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.6"
            />
            <defs>
              <linearGradient
                id="folderGrad"
                x1="32"
                y1="90"
                x2="228"
                y2="214"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2DD4BF" />
                <stop offset="1" stopColor="#0EA5E9" />
              </linearGradient>
              <linearGradient
                id="tabGrad"
                x1="32"
                y1="75"
                x2="192"
                y2="103"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#5EEAD4" />
                <stop offset="1" stopColor="#38BDF8" />
              </linearGradient>
              <linearGradient
                id="platformGrad"
                x1="20"
                y1="210"
                x2="240"
                y2="210"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#7DD3FC" />
                <stop offset="1" stopColor="#A5F3FC" />
              </linearGradient>
              <linearGradient
                id="platformInner"
                x1="40"
                y1="204"
                x2="220"
                y2="204"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#BAE6FD" />
                <stop offset="1" stopColor="#CFFAFE" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Bottom icon row */}
        <div className="flex gap-3 mt-2">
          {ICON_FEATURES.map((f, i) => (
            <div
              key={f.label}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md px-3 py-2 flex flex-col items-center w-16 border border-white/50 hover:scale-110 transition-transform duration-200"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className={f.color}>{f.icon}</span>
              <span className="text-xs font-semibold text-gray-600 mt-1 text-center leading-tight">
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Animated counter
function AnimatedCounter({ value }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView(0.3);
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
  const suffix = value.replace(/[0-9.,]/g, "");

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = numericValue / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, numericValue]);

  return (
    <span ref={ref}>
      {numericValue > 999
        ? Math.floor(count).toLocaleString() + suffix
        : count < 100
          ? count.toFixed(1) + suffix
          : Math.floor(count) + suffix}
    </span>
  );
}

// ─────────────────────────────────────────────
// MAIN LANDING EXPORT
// ─────────────────────────────────────────────
export default function DMSLanding({ onGetStarted, onNavigate }) {
  const { t, lang, setLang, languages } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [featuresRef, featuresInView] = useInView(0.1);
  const [statsRef, statsInView] = useInView(0.2);
  const [whyRef, whyInView] = useInView(0.1);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="font-sans bg-white text-gray-900 min-h-screen">
      <Helmet>
        {/* Basic */}
        <title>
          DMS — Document Management System | Smart. Secure. Simplified.
        </title>
        <meta
          name="description"
          content="Store, organize, and access all your documents securely from one centralized platform. Role-based access, version control, smart search and more."
        />
        <meta
          name="keywords"
          content="document management system, DMS, secure documents, file storage, workflow, cloud documents"
        />
        <meta name="author" content="DMS" />
        <link rel="canonical" href="https://yourdomain.com/" />

        {/* Open Graph (Facebook, LinkedIn, WhatsApp preview) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/" />
        <meta property="og:title" content="DMS — Manage Documents Smarter" />
        <meta
          property="og:description"
          content="One platform to store, organize, search and secure all your documents. Built for modern teams."
        />
        <meta
          property="og:image"
          content="https://yourdomain.com/og-image.png"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DMS — Manage Documents Smarter" />
        <meta
          name="twitter:description"
          content="One platform to store, organize, search and secure all your documents."
        />
        <meta
          name="twitter:image"
          content="https://yourdomain.com/og-image.png"
        />

        {/* Robots */}
        <meta name="robots" content="index, follow" />
      </Helmet>
      {/* ── Keyframes via style tag */}
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-fade-in-up { animation: fadeInUp 0.7s ease forwards; }
        .animate-fade-in-left { animation: fadeInLeft 0.7s ease forwards; }
        .animate-fade-in-right { animation: fadeInRight 0.7s ease forwards; }
        .animate-scale-in { animation: scaleIn 0.6s ease forwards; }
        .text-gradient {
          background: linear-gradient(135deg, #2563EB 0%, #06B6D4 50%, #10B981 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .btn-glow {
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(37,99,235,0.3);
        }
        .btn-glow:hover {
          box-shadow: 0 8px 25px rgba(37,99,235,0.5);
          transform: translateY(-2px);
        }
        .feature-card-bar {
          height: 3px;
          width: 0%;
          transition: width 0.6s ease;
          border-radius: 2px;
        }
        .feature-card:hover .feature-card-bar { width: 100%; }
      `}</style>
      {/* ── NAVBAR ── */}
      <nav
        className={`sticky top-0 z-50 bg-white border-b transition-all duration-300 ${scrolled ? "border-gray-200 shadow-md" : "border-gray-100 shadow-sm"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999A5.002 5.002 0 003 15z"
                />
              </svg>
            </div>
            <div>
              <div className="font-bold text-lg text-gray-900 leading-none ml-0 pb-1">
                DMS
              </div>
              <div className="text-[10px] text-gray-400 leading-none">
                Document Management System
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                  if (link === "Home") onNavigate?.("home");
                  if (link === "Features") onNavigate?.("features");
                  if (link === "Solutions") onNavigate?.("solutions");
                  if (link === "Resources") onNavigate?.("documentation");
                  if (link === "About Us") onNavigate?.("about");
                  if (link === "Contact") onNavigate?.("contact");
                }}
                className={`text-sm font-medium transition-all duration-200 relative group ${i === 0 ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
              >
                {link}
                {link === "Resources" && <span className="ml-1">▾</span>}
                <span
                  className={`absolute -bottom-0.5 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 ${i === 0 ? "w-full" : "w-0 group-hover:w-full"}`}
                ></span>
              </a>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 bg-white hover:border-gray-300 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
                </svg>
                <span>{languages.find((l) => l.code === lang)?.flag}</span>
                <span>{languages.find((l) => l.code === lang)?.label}</span>
                <span className="text-xs">▾</span>
              </button>

              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 max-h-72 overflow-y-auto">
                {languages.map((lng) => (
                  <button
                    key={lng.code}
                    onClick={() => setLang(lng.code)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                      lang === lng.code
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    <span className="text-base">{lng.flag}</span>
                    <span>{lng.label}</span>
                    {lang === lng.code && (
                      <svg
                        className="w-3.5 h-3.5 ml-auto text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={onGetStarted}
              className="btn-glow bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-sm font-semibold px-5 py-2 rounded-lg"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="bg-white border-t border-gray-100 px-4 pb-4 pt-2 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (link === "Home") onNavigate?.("home");
                  if (link === "Features") onNavigate?.("features");
                  if (link === "Solutions") onNavigate?.("solutions");
                  if (link === "About Us") onNavigate?.("about");
                  if (link === "Contact") onNavigate?.("contact");
                }}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors py-1"
              >
                {link}
              </a>
            ))}
            <button
              onClick={onGetStarted}
              className="btn-glow bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold px-5 py-2 rounded-lg mt-2"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>
      {/* ── HERO ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-64px)]">
        {/* Left */}
        <div className="flex flex-col gap-6">
          <span
            className={`inline-flex w-fit items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse"></span>
            Smart. Secure. Simplified.
          </span>

          <h1
            className={`text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight transition-all duration-700 delay-100 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            Manage Documents <span className="text-gradient">Smarter</span>
          </h1>

          <p
            className={`text-lg text-gray-500 max-w-lg leading-relaxed transition-all duration-700 delay-200 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            Store, organize, and access all your documents securely from one
            centralized platform. Improve productivity and collaboration across
            your organization.
          </p>

          <div
            className={`flex flex-wrap gap-3 transition-all duration-700 delay-300 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <button
              onClick={onGetStarted}
              className="btn-glow flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold px-6 py-3 rounded-xl"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Get Started
            </button>
            <button className="flex items-center gap-2 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 font-semibold px-6 py-3 rounded-xl transition-all duration-200 bg-white hover:bg-blue-50 hover:-translate-y-0.5">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
              </svg>
              Watch Demo
            </button>
          </div>

          <div
            className={`flex flex-wrap gap-6 mt-2 transition-all duration-700 delay-400 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {[
              {
                icon: "🛡️",
                label: "Secure & Compliant",
                color: "text-emerald-600 bg-emerald-50 border-emerald-200",
              },
              {
                icon: "☁️",
                label: "Access Anywhere",
                color: "text-blue-600 bg-blue-50 border-blue-200",
              },
              {
                icon: "📈",
                label: "Scalable Solution",
                color: "text-purple-600 bg-purple-50 border-purple-200",
              },
            ].map((b) => (
              <div
                key={b.label}
                className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full border ${b.color}`}
              >
                <span>{b.icon}</span>
                {b.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right — Folder Illustration */}
        <div
          className={`flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 min-h-[420px] relative overflow-hidden transition-all duration-700 delay-300 ${heroVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
        >
          {/* Glowing orbs */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div
            className="absolute bottom-10 left-10 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <FolderHeroIllustration />
        </div>
      </section>

      {/* ── FEATURES STRIP ── */}
      <section className="bg-gradient-to-r from-gray-50 via-blue-50/30 to-gray-50 border-y border-gray-100 py-10">
        <div
          ref={featuresRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`feature-card flex flex-col items-start gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg card-hover transition-all duration-500 ${featuresInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={`p-2 rounded-xl ${f.color}`}>{f.icon}</div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">
                  {f.title}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 leading-snug">
                  {f.desc}
                </div>
              </div>
              <div
                className={`feature-card-bar bg-gradient-to-r ${f.gradient}`}
              ></div>
            </div>
          ))}
        </div>
      </section>
      {/* ── EVERYTHING YOU NEED ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Shield Illustration */}
        <div
          className={`flex items-center justify-center transition-all duration-700 ${statsInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          ref={statsRef}
        >
          <div className="relative w-72 h-72 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 opacity-60 animate-pulse"
              style={{ animationDuration: "3s" }}
            ></div>
            <svg
              width="220"
              height="220"
              viewBox="0 0 220 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="110"
                cy="110"
                r="100"
                fill="url(#bgCircle)"
                opacity="0.15"
              />
              <path
                d="M110 30 L168 58 V110 C168 145 141 172 110 182 C79 172 52 145 52 110 V58 Z"
                fill="url(#shieldGrad)"
              />
              <path
                d="M110 48 L154 70 V110 C154 138 135 160 110 168 C85 160 66 138 66 110 V70 Z"
                fill="white"
                opacity="0.25"
              />
              <rect x="96" y="108" width="28" height="22" rx="4" fill="white" />
              <path
                d="M100 108 V100 a10 10 0 0120 0 V108"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="110" cy="120" r="3" fill="#1D4ED8" />
              <defs>
                <linearGradient
                  id="shieldGrad"
                  x1="52"
                  y1="30"
                  x2="168"
                  y2="182"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#06B6D4" />
                </linearGradient>
                <radialGradient id="bgCircle" cx="50%" cy="50%" r="50%">
                  <stop stopColor="#BFDBFE" />
                  <stop offset="1" stopColor="#CFFAFE" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
            <div
              className="absolute top-2 right-2 bg-white shadow-lg shadow-blue-100 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 border border-blue-100 animate-bounce"
              style={{ animationDuration: "2s" }}
            >
              📄 2,548 Docs
            </div>
            <div
              className="absolute bottom-4 left-0 bg-white shadow-lg shadow-emerald-100 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 border border-emerald-100 animate-bounce"
              style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}
            >
              🔒 Encrypted
            </div>
          </div>
        </div>

        {/* Text + Stats */}
        <div
          className={`flex flex-col gap-6 transition-all duration-700 delay-200 ${statsInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
        >
          <div className="text-blue-600 text-sm font-semibold tracking-wide uppercase flex items-center gap-2">
            <span className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
            Designed for modern teams
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Everything You Need to{" "}
            <span className="text-gradient">Manage Documents</span> Efficiently
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            DMS helps you streamline document workflows, enhance security, and
            improve collaboration across your organization.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`bg-gradient-to-br ${s.bg} rounded-2xl p-4 border ${s.border} card-hover transition-all duration-500`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{s.icon}</span>
                  <span className="text-xl font-bold text-gray-900">
                    {statsInView ? <AnimatedCounter value={s.value} /> : "0"}
                  </span>
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  {s.label}
                </div>
                <div className={`text-xs mt-0.5 ${s.subColor}`}>{s.sub}</div>
              </div>
            ))}
          </div>
          <button
            onClick={onGetStarted}
            className="btn-glow flex items-center gap-2 w-fit bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold px-6 py-3 rounded-xl"
          >
            Learn More →
          </button>
        </div>
      </section>
      {/* ── WHY TEAMS CHOOSE DMS ── */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 relative z-10">
          <span className="inline-block bg-white/10 text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20 mb-4">
            Why DMS?
          </span>
          <h2 className="text-4xl font-extrabold text-white mb-3">
            Why Teams Choose DMS
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            One platform for all your document needs — from creation to
            collaboration to compliance.
          </p>
        </div>

        <div
          ref={whyRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10"
        >
          {[
            {
              icon: "🔐",
              title: "Enterprise-Grade Security",
              desc: "AES-256 encryption, audit logs, and compliance controls keep your documents protected at all times.",
              color: "from-blue-400/20 to-indigo-400/20",
            },
            {
              icon: "⚡",
              title: "Lightning Fast Search",
              desc: "Full-text search across all your documents in milliseconds. Find anything, instantly.",
              color: "from-cyan-400/20 to-teal-400/20",
            },
            {
              icon: "🤝",
              title: "Real-Time Collaboration",
              desc: "Work together with your team on documents simultaneously with live cursors and instant sync.",
              color: "from-purple-400/20 to-pink-400/20",
            },
          ].map((c, i) => (
            <div
              key={c.title}
              className={`bg-gradient-to-br ${c.color} backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-white hover:bg-white/20 card-hover transition-all duration-500 ${whyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="text-4xl mb-4">{c.icon}</div>
              <h3 className="text-xl font-bold mb-2">{c.title}</h3>
              <p className="text-blue-100 text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 rounded-3xl p-12 border border-blue-100 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-200/30 rounded-full translate-y-6 -translate-x-6"></div>

          <div className="relative z-10">
            <span className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full border border-blue-200 mb-4">
              🚀 Get Started Today
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Ready to Get <span className="text-gradient">Started?</span>
            </h2>
            <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto">
              Join 156+ teams already managing their documents smarter with DMS.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="btn-glow bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold px-8 py-3 rounded-xl"
              >
                Start Free Trial
              </button>
              <button
                onClick={onGetStarted}
                className="border border-gray-200 hover:border-blue-300 text-gray-700 font-semibold px-8 py-3 rounded-xl transition-all duration-200 bg-white hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-md"
              >
                Talk to Sales
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-200 group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999A5.002 5.002 0 003 15z"
                />
              </svg>
            </div>
            <span className="font-bold text-gray-800">DMS</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            {["Privacy Policy", "Terms of Service", "Support", "Contact"].map(
              (l) => (
                <a
                  key={l}
                  href="#"
                  className="hover:text-blue-600 transition-colors relative group"
                >
                  {l}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </a>
              ),
            )}
          </div>
          <div className="text-sm text-gray-400">
            © 2026 DMS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
