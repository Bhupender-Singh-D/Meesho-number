"use client";

import React, { useState } from "react";
import { X, Key, Send, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";

interface BulkCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkCheckModal: React.FC<BulkCheckModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [token, setToken] = useState(
    "meesho_secure_verifier_token_2026_xyz"
  );
  const [numbersText, setNumbersText] = useState(
    "9876543210\n8888899999\n9999912345\n9123456780\n12345"
  );
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResponse(null);
    setLoading(true);

    const phones = numbersText
      .split("\n")
      .map((n) => n.trim())
      .filter(Boolean);

    if (phones.length === 0) {
      setError("Please provide at least one phone number to verify.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/phone/bulk-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phones }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || data.error || `HTTP ${res.status}`);
      } else {
        setResponse(data);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to execute bulk check.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-meesho-50 flex items-center justify-center text-meesho-700">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Privileged Bulk Verification API
              </h3>
              <p className="text-xs text-slate-500">
                POST /api/phone/bulk-check (Bearer Auth Protected)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleBulkSubmit} className="mt-4 space-y-4 overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bearer Token (API_AUTH_SECRET)
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter authorization secret"
              className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-meesho-500 text-slate-800"
              required
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Default demo token prefilled from .env
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Numbers (one per line, up to 50)
            </label>
            <textarea
              rows={4}
              value={numbersText}
              onChange={(e) => setNumbersText(e.target.value)}
              placeholder="9876543210&#10;9123456780"
              className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-meesho-500 text-slate-800"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-meesho-700 hover:bg-meesho-800 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-meesho-700/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute Bulk Check</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {response && (
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">
                  Bulk Results ({response.totalChecked} verified)
                </span>
                <span className="text-[10px] text-slate-500">
                  {new Date(response.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1.5">
                {response.results?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-2 bg-white rounded-lg border border-slate-100 flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-slate-800">{item.maskedPhone}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        item.status === "REGISTERED"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "NEW"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
