import React from "react";
import { Lock, Shield, EyeOff, KeyRound } from "lucide-react";

export const SecurityBadge: React.FC = () => {
  return (
    <div className="mt-8 rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div className="w-7 h-7 rounded-lg bg-meesho-50 flex items-center justify-center text-meesho-700">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Privacy & Authorized Database Notice
          </h4>
          <p className="text-[11px] text-slate-500">
            Zero-plaintext compliance & ethical architecture
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-600 mt-3 leading-relaxed">
        Phone numbers submitted through this portal are verified strictly against this
        application&apos;s authorized customer database. This system{" "}
        <strong className="text-slate-800">does not</strong> scrape, enumerate, or access
        live third-party private endpoints.
      </p>

      <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
          <EyeOff className="w-3.5 h-3.5 text-meesho-700 shrink-0 mt-0.5" />
          <span className="text-[11px] text-slate-600 leading-snug">
            <strong className="text-slate-700 block font-semibold">Zero Plaintext</strong>
            Never saved to disk as plain numbers.
          </span>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
          <KeyRound className="w-3.5 h-3.5 text-meesho-700 shrink-0 mt-0.5" />
          <span className="text-[11px] text-slate-600 leading-snug">
            <strong className="text-slate-700 block font-semibold">HMAC-SHA256</strong>
            Peppered server-side hashing strategy.
          </span>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
          <Lock className="w-3.5 h-3.5 text-meesho-700 shrink-0 mt-0.5" />
          <span className="text-[11px] text-slate-600 leading-snug">
            <strong className="text-slate-700 block font-semibold">Anti-Abuse</strong>
            Sliding-window IP rate limiting active.
          </span>
        </div>
      </div>
    </div>
  );
};
