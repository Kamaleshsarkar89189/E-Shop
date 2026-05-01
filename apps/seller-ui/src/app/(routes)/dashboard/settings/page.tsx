"use client";

import React, { useState, useEffect } from 'react';
import {
  User,
  Store,
  Bell,
  Lock,
  CreditCard,
  Globe,
  Save,
  Camera,
  Check,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 2000); // Simulate Prisma Update
  };

  if (!mounted) return null;

  const navItems = [
    { id: 'profile', label: 'Account Profile', icon: <User size={18} /> },
    { id: 'store', label: 'Store Analytics', icon: <Store size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security & Auth', icon: <Lock size={18} /> },
    { id: 'billing', label: 'Billing & Plans', icon: <CreditCard size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 selection:bg-indigo-500/30">

      {/* Dynamic Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-600/10 blur-[140px] rounded-full -z-10 animate-pulse" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-bold tracking-widest text-xs uppercase mb-2">
              <Zap size={14} fill="currentColor" />
              System Preferences
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">Settings</h1>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-white text-slate-950 hover:bg-indigo-50 px-8 py-3 rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <span className="animate-spin mr-2">◌</span> : <Save size={18} />}
            {isSaving ? "Syncing..." : "Save Changes"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all border ${activeTab === item.id
                    ? "bg-indigo-600/10 border-indigo-500/50 text-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.1)]"
                    : "border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300"
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </aside>

          {/* Settings Content Area */}
          <main className="flex-1 space-y-8">

            {/* Section 1: Profile Appearance */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                Public Profile
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">LIVE</span>
              </h2>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 p-1">
                    <div className="w-full h-full rounded-[20px] bg-slate-900 flex items-center justify-center overflow-hidden border-4 border-slate-900">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 bg-slate-800 border border-slate-700 rounded-xl text-white hover:bg-slate-700 transition-all shadow-xl">
                    <Camera size={16} />
                  </button>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <InputGroup label="Display Name" placeholder="Your Name" value="Abhishek Kumar" />
                  <InputGroup label="Store URL" placeholder="mystore.com" value="matrix-electronics" />
                  <div className="md:col-span-2">
                    <InputGroup label="Biography" placeholder="Tell us about your brand..." value="High-performance electronics for the modern era." />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Security Pulse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/30 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Two-Factor Auth</h3>
                    <p className="text-xs text-slate-500 font-medium">Extra layer of security enabled</p>
                  </div>
                </div>
                <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold text-slate-300 transition-colors">
                  Configure Settings
                </button>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white">Email Notifications</h3>
                  <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center px-1">
                    <div className="w-4 h-4 bg-white rounded-full translate-x-6" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Get daily summaries of event performance and sales data.</p>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

/* UI Helper: Reusable Dark Input */
const InputGroup = ({ label, placeholder, value }: any) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <input
      type="text"
      defaultValue={value}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/40 text-white placeholder:text-slate-700 transition-all font-medium"
    />
  </div>
);