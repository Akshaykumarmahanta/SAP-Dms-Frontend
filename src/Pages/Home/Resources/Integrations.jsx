// src/Pages/Home/Resources/Integrations.jsx

const INTEGRATIONS = [
  { name: "Google Drive", category: "Cloud Storage", emoji: "🟡", desc: "Sync documents between DMS and Google Drive automatically.", status: "Available" },
  { name: "Microsoft OneDrive", category: "Cloud Storage", emoji: "🔵", desc: "Two-way sync with OneDrive for seamless file access.", status: "Available" },
  { name: "Dropbox", category: "Cloud Storage", emoji: "🔷", desc: "Import and export files directly from your Dropbox.", status: "Available" },
  { name: "Slack", category: "Communication", emoji: "💬", desc: "Get DMS notifications and share document links in Slack.", status: "Available" },
  { name: "Microsoft Teams", category: "Communication", emoji: "🟪", desc: "Collaborate on documents without leaving Teams.", status: "Available" },
  { name: "Zoom", category: "Communication", emoji: "🎥", desc: "Share DMS documents during Zoom meetings instantly.", status: "Coming Soon" },
  { name: "Salesforce", category: "CRM", emoji: "☁️", desc: "Attach and manage documents directly within Salesforce records.", status: "Available" },
  { name: "HubSpot", category: "CRM", emoji: "🟠", desc: "Link client documents to HubSpot deals and contacts.", status: "Available" },
  { name: "Zoho CRM", category: "CRM", emoji: "🔴", desc: "Manage customer documents alongside Zoho CRM workflows.", status: "Coming Soon" },
  { name: "Zapier", category: "Automation", emoji: "⚡", desc: "Connect DMS to 5000+ apps with no-code Zapier workflows.", status: "Available" },
  { name: "Make (Integromat)", category: "Automation", emoji: "🟢", desc: "Build advanced document automation scenarios with Make.", status: "Available" },
  { name: "Microsoft Power Automate", category: "Automation", emoji: "🌀", desc: "Automate document approvals using Power Automate flows.", status: "Available" },
  { name: "DocuSign", category: "e-Signature", emoji: "✍️", desc: "Send documents for e-signature directly from DMS.", status: "Available" },
  { name: "Adobe Sign", category: "e-Signature", emoji: "🖊️", desc: "Request digital signatures via Adobe Sign integration.", status: "Available" },
  { name: "QuickBooks", category: "Finance", emoji: "💼", desc: "Attach invoices and receipts to QuickBooks transactions.", status: "Coming Soon" },
  { name: "SAP", category: "ERP", emoji: "🏭", desc: "Enterprise document management integrated with SAP ERP.", status: "Available" },
];

const CATEGORIES = ["All", "Cloud Storage", "Communication", "CRM", "Automation", "e-Signature", "Finance", "ERP"];

import { useState } from "react";

export default function Integrations() {
  const [active, setActive] = useState("All");

  const filtered = INTEGRATIONS.filter((i) => active === "All" || i.category === active);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full border border-blue-100 mb-4">
          🔗 Integrations
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Connect DMS with Your Favorite Tools</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          DMS integrates with the apps you already use — cloud storage, CRMs, communication tools, and more.
        </p>
      </div>

      {/* Count */}
      <div className="flex flex-wrap justify-center gap-6 mb-10">
        {[
          { value: "50+", label: "Integrations", icon: "🔌" },
          { value: "5000+", label: "Apps via Zapier", icon: "⚡" },
          { value: "REST API", label: "Custom Integration", icon: "🛠️" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <div className="font-bold text-gray-800">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              active === cat
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div key={item.name} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-blue-200 transition-all flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl">{item.emoji}</span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                item.status === "Available" ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-500"
              }`}>
                {item.status}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            <button
              disabled={item.status !== "Available"}
              className={`mt-auto text-sm font-semibold py-2 rounded-xl transition-all ${
                item.status === "Available"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {item.status === "Available" ? "Connect →" : "Notify Me"}
            </button>
          </div>
        ))}
      </div>

      {/* Custom integration */}
      <div className="mt-14 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center gap-6">
        <div className="text-5xl">🛠️</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">Need a Custom Integration?</h3>
          <p className="text-slate-300 text-sm">Use our REST API and webhooks to connect DMS with any system. Full documentation and sandbox access included.</p>
        </div>
        <button className="shrink-0 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold px-6 py-2.5 rounded-xl hover:from-blue-600 hover:to-cyan-500 transition-all">
          View API Docs →
        </button>
      </div>
    </main>
  );
}