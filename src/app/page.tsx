"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { PhoneVerifierForm } from "@/components/PhoneVerifierForm";
import { SecurityBadge } from "@/components/SecurityBadge";
import { RecentChecks, HistoryItem } from "@/components/RecentChecks";
import { BulkCheckModal } from "@/components/BulkCheckModal";
import { PhoneCheckResponse } from "@/lib/validation";
import {
  ShieldCheck,
  Server,
  Zap,
  Lock,
  Database,
  CheckCircle2,
  Code2,
} from "lucide-react";

export default function Home() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Load history from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("meesho_verifier_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  const handleVerificationSuccess = (phone: string, result: PhoneCheckResponse) => {
    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      phone,
      maskedPhone: result.maskedPhone || `+91 ******${phone.slice(-4)}`,
      status: result.status,
      timestamp: result.timestamp || new Date().toISOString(),
    };

    setHistory((prev) => {
      // Keep only last 10 unique recent checks
      const filtered = prev.filter((item) => item.phone !== phone);
      const updated = [newItem, ...filtered].slice(0, 10);
      try {
        localStorage.setItem("meesho_verifier_history", JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("meesho_verifier_history");
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-meesho-100/50 via-meesho-50/20 to-transparent pointer-events-none -z-10" />

      {/* Header */}
      <Header onOpenBulkModal={() => setIsBulkModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Verification Card Column (7 cols on large) */}
          <div className="lg:col-span-7 space-y-6">
            <PhoneVerifierForm
              onVerificationSuccess={handleVerificationSuccess}
            />

            {/* Privacy and Security Badge */}
            <SecurityBadge />
          </div>

          {/* Sidebar / Info Column (5 cols on large) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Architecture Highlights Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-meesho-50 text-meesho-700 flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Security Specifications
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Production architecture safeguards
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 font-semibold block">
                      HMAC-SHA256 Pepper Hashing
                    </strong>
                    <span className="text-slate-500">
                      Pre-computed rainbow table attacks are rendered infeasible via
                      server-side secret salts.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 font-semibold block">
                      Anti-Enumeration Rate Limiting
                    </strong>
                    <span className="text-slate-500">
                      Sliding-window IP throttles prevent automated bot attacks and bulk
                      crawling.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 font-semibold block">
                      Masked Audit Logs
                    </strong>
                    <span className="text-slate-500">
                      Server logs record only <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px] text-slate-700">+91 ******3210</code>, protecting customer PII.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 font-semibold block">
                      Prisma ORM & Indexed Queries
                    </strong>
                    <span className="text-slate-500">
                      Sub-millisecond lookups on indexed <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px] text-slate-700">phoneHash</code> column with zero SQL injection risk.
                    </span>
                  </div>
                </div>
              </div>

              {/* Developer quick snippet */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-meesho-700" />
                    <span>API Endpoint</span>
                  </span>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    POST /api/phone/check
                  </span>
                </div>
                <div className="bg-slate-900 rounded-xl p-3 text-[11px] font-mono text-slate-300 overflow-x-auto">
                  <div className="text-slate-500">// Request Payload</div>
                  <div>&#123; <span className="text-pink-400">&quot;phone&quot;</span>: <span className="text-emerald-300">&quot;9876543210&quot;</span> &#125;</div>
                  <div className="text-slate-500 mt-1">// Response</div>
                  <div>&#123; <span className="text-pink-400">&quot;status&quot;</span>: <span className="text-emerald-300">&quot;REGISTERED&quot;</span> &#125;</div>
                </div>
              </div>
            </div>

            {/* Recent Checks Session History */}
            <RecentChecks
              history={history}
              onClear={handleClearHistory}
              onSelect={(phone) => {
                const el = document.getElementById("mobile-input") as HTMLInputElement;
                if (el) {
                  el.focus();
                }
              }}
            />
          </div>
        </div>
      </main>

      {/* Bulk Check Modal */}
      <BulkCheckModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
      />

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Authorized Customer Database Verifier &bull; Production Ready</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Strictly authorized internal verification &bull; Zero external scraping
          </p>
        </div>
      </footer>
    </div>
  );
}
