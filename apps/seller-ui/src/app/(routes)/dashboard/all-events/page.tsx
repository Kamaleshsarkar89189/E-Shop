"use client";

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  Tag,
  MoreVertical,
  CheckCircle2,
  Clock,
  BarChart3,
  Search,
  Filter,
  ArrowUpRight
} from 'lucide-react';

export default function AllEventsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const MOCK_EVENTS = [
    { id: '1', title: 'Eid Special Sale', status: 'Active', discount: '25%', sales: '₹45,000', end: '2026-04-05' },
    { id: '2', title: 'Tech Week 2026', status: 'Scheduled', discount: '10%', sales: '₹0', end: '2026-05-12' },
    { id: '3', title: 'Winter Clearance', status: 'Expired', discount: '50%', sales: '₹1,20,000', end: '2026-01-15' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-10 selection:bg-indigo-500/30">

      {/* Glow Background Effects */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-rose-600/5 blur-[100px] rounded-full -z-10" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Campaign Events</h1>
          <p className="text-slate-400 mt-2 text-lg">Monitor and launch your store's promotional periods.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
          <Plus size={20} />
          Create New Event
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Active Events" value="03" icon={<CheckCircle2 className="text-emerald-400" />} trend="+12%" />
        <StatCard title="Event Revenue" value="₹1,65,000" icon={<BarChart3 className="text-indigo-400" />} trend="+8.4%" />
        <StatCard title="Scheduled" value="05" icon={<Clock className="text-amber-400" />} trend="Next: May" />
      </div>

      {/* Table Container */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search by event name..."
              className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/40 text-white placeholder:text-slate-600 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 transition-colors font-medium">
              <Filter size={18} />
              Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-500 text-sm font-semibold uppercase tracking-wider border-b border-slate-800/50">
                <th className="px-8 py-5">Event Details</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Discount</th>
                <th className="px-8 py-5">Total Sales</th>
                <th className="px-8 py-5">Expiry</th>
                <th className="px-8 py-5 text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {MOCK_EVENTS.map((event) => (
                <tr key={event.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform">
                        <Calendar size={22} />
                      </div>
                      <span className="font-bold text-white text-lg">{event.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={event.status} />
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 font-mono font-bold text-indigo-300 bg-indigo-500/5 px-3 py-1 rounded-lg w-fit border border-indigo-500/10">
                      <Tag size={16} />
                      {event.discount}
                    </div>
                  </td>
                  <td className="px-8 py-5 font-semibold text-slate-300">{event.sales}</td>
                  <td className="px-8 py-5 text-slate-500 font-medium">{event.end}</td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-500 hover:text-white">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* Updated Helper Components for Dark Theme */

const StatCard = ({ title, value, icon, trend }: any) => (
  <div className="bg-slate-900/80 p-7 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all shadow-xl group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 group-hover:border-indigo-500/30 transition-colors">
        {icon}
      </div>
      <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md flex items-center gap-1">
        <ArrowUpRight size={12} />
        {trend}
      </span>
    </div>
    <div>
      <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">{title}</p>
      <h3 className="text-3xl font-black mt-1 text-white tracking-tight">{value}</h3>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Scheduled: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    Expired: "bg-slate-800 text-slate-500 border-slate-700",
  }[status] || "bg-slate-800 text-slate-400";

  return (
    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${styles}`}>
      {status}
    </span>
  );
};