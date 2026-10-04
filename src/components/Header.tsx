"use client";

import React from "react";
import { ShieldCheck, Database, Layers } from "lucide-react";

interface HeaderProps {
  onOpenBulkModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBulkModal }) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-meesho-800 via-meesho-700 to-meesho-500 flex items-center justify-center shadow-md shadow-meesho-700/25 ring-2 ring-meesho-100">
            <span className="text-white font-black text-xl tracking-tight">M</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-lg tracking-tight">
                Shop<span className="text-meesho-700">Verify</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-meesho-50 text-meesho-700 border border-meesho-200/60">
                PROD-READY
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              Authorized Customer Database Verifier
            </span>
          </div>
        </div>

        {/* Right status & bulk check action */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Database className="w-3.5 h-3.5" />
            <span>Authorized DB Online</span>
          </div>

          <button
            onClick={onOpenBulkModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 rounded-lg transition-all focus:outline-hidden focus:ring-2 focus:ring-meesho-500"
            title="Open Developer / Privileged Bulk API Modal"
          >
            <Layers className="w-3.5 h-3.5 text-meesho-700" />
            <span className="hidden sm:inline">Privileged</span> Bulk API
          </button>
        </div>
      </div>
    </header>
  );
};
