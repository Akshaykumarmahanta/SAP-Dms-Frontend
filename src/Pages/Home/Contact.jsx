// src/Pages/Home/Contact.jsx
// ──────────────────────────────────────────────────────────────────────────────
// HOW TO USE:
//   import Contact from "./Contact";
//
//   Place <Contact /> inside DMSLanding return, after the CTA section, before footer.
//   Or link it as a separate page/modal.
// ──────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../Home/LanguageContext";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

const CONTACT_METHODS = (t) => [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: t("contact.emailLabel"),
    value: "support@dms.io",
    href: "mailto:support@dms.io",
    color: "text-blue-600 bg-blue-50 border-blue-100",
    hover: "hover:bg-blue-100",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: t("contact.phoneLabel"),
    value: "+91 98765 43210",
    href: "tel:+919876543210",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    hover: "hover:bg-emerald-100",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: t("contact.addressLabel"),
    value: t("contact.address"),
    href: "https://maps.google.com",
    color: "text-purple-600 bg-purple-50 border-purple-100",
    hover: "hover:bg-purple-100",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: t("contact.hours"),
    value: t("contact.hoursVal"),
    href: null,
    color: "text-orange-600 bg-orange-50 border-orange-100",
    hover: "hover:bg-orange-100",
  },
];

const SUBJECTS = [
  "General Inquiry",
  "Sales & Pricing",
  "Technical Support",
  "Partnership",
  "Feedback",
  "Other",
];

export default function Contact() {
  const { t } = useLanguage();
  const [formRef, formInView] = useInView(0.1);
  const [infoRef, infoInView] = useInView(0.1);

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
    if (!form.subject) errs.subject = "Please select a subject";
    if (!form.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus("sending");
    // Simulate API call — replace with your actual endpoint
    await new Promise((res) => setTimeout(res, 1500));
    setStatus("success");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
      errors[field]
        ? "border-red-300 bg-red-50 focus:ring-red-200"
        : "border-gray-200 bg-gray-50 focus:bg-white focus:ring-blue-200 focus:border-blue-300"
    }`;

  return (
    <section id="contact" className="bg-white font-sans">

      {/* ── HEADER BANNER ── */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block bg-blue-500/10 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full border border-blue-500/20 mb-4">
            {t("contact.badge")}
          </span>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-3">
            {t("contact.title")}{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#3B82F6 0%,#06B6D4 50%,#10B981 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("contact.titleHighlight")}
            </span>
          </h1>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">{t("contact.subtitle")}</p>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-5 gap-12">

        {/* LEFT — Contact Info (2 cols) */}
        <div
          ref={infoRef}
          className={`lg:col-span-2 flex flex-col gap-5 transition-all duration-700 ${infoInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
        >
          <h2 className="text-2xl font-extrabold text-gray-900">{t("contact.info")}</h2>

          {CONTACT_METHODS(t).map((m, i) => (
            <div
              key={m.label}
              className={`flex items-start gap-4 p-4 rounded-2xl border ${m.color} ${m.hover} transition-all duration-200 cursor-pointer`}
              style={{ transitionDelay: `${i * 80}ms` }}
              onClick={() => m.href && window.open(m.href, "_blank")}
            >
              <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border ${m.color}`}>
                {m.icon}
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{m.label}</div>
                <div className="text-sm font-semibold text-gray-800 mt-0.5">{m.value}</div>
              </div>
            </div>
          ))}

          {/* Social links */}
          <div className="mt-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Follow Us</div>
            <div className="flex gap-3">
              {[
                { label: "LinkedIn", icon: "in", href: "#", color: "bg-blue-600" },
                { label: "Twitter", icon: "𝕏", href: "#", color: "bg-black" },
                { label: "GitHub", icon: "gh", href: "#", color: "bg-gray-800" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className={`${s.color} text-white text-xs font-bold w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-80 hover:scale-110 transition-all duration-200 shadow-md`}
                  title={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Contact Form (3 cols) */}
        <div
          ref={formRef}
          className={`lg:col-span-3 transition-all duration-700 delay-200 ${formInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
        >
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-12 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-100">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6 shadow-xl shadow-emerald-200 animate-bounce" style={{ animationDuration: "2s" }}>
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-500 max-w-sm">{t("contact.success")}</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 text-sm font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col gap-5"
              noValidate
            >
              {/* Row: Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t("contact.name")}</label>
                  <input
                    type="text"
                    placeholder={t("contact.namePlaceholder")}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass("name")}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t("contact.email")}</label>
                  <input
                    type="email"
                    placeholder={t("contact.emailPlaceholder")}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass("email")}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Subject dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t("contact.subject")}</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className={inputClass("subject") + " cursor-pointer"}
                >
                  <option value="">{t("contact.subjectPlaceholder")}</option>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t("contact.message")}</label>
                <textarea
                  rows={5}
                  placeholder={t("contact.messagePlaceholder")}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={inputClass("message") + " resize-none"}
                />
                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                <div className="text-right text-xs text-gray-400 mt-1">{form.message.length}/500</div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "sending"}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:opacity-60 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                {status === "sending" ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t("contact.sending")}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    {t("contact.send")}
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400">
                🔒 Your information is protected by our{" "}
                <a href="#" className="underline hover:text-blue-600">Privacy Policy</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}