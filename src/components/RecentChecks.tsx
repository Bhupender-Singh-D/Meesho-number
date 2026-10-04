"use client";

import React from "react";
import { History, Trash2 } from "lucide-react";
import { PhoneCheckResponse } from "@/lib/validation";

export interface HistoryItem {
  id: string;
  phone: string;
  maskedPhone: string;
  status: PhoneCheckResponse["status"];
  timestamp: string;
}

interface RecentChecksProps {
  history: HistoryItem[];
  onClear: () => void;
  onSelect: (phone: string) => void;
}

export const RecentChecks: React.FC<RecentChecksProps> = ({
  history,
  onClear,
  onSelect,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-6 rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Recent Verifications (This Session)
          </h4>
        </div>
        <button
          onClick={onClear}
          className="text-slate-400 hover:text-rose-500 text-xs flex items-center gap-1 transition-colors"
          title="Clear History"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      <div className="divide-y divide-slate-100 mt-2">
        {history.map((item) => {
          let badge = "bg-slate-100 text-slate-700 border-slate-200";
          let label: string = item.status;
          if (item.status === "REGISTERED") {
            badge = "bg-emerald-50 text-emerald-700 border-emerald-200";
            label = "🟢 Registered";
          } else if (item.status === "NEW") {
            badge = "bg-blue-50 text-blue-700 border-blue-200";
            label = "🔵 New";
          } else if (item.status === "INVALID") {
            badge = "bg-rose-50 text-rose-700 border-rose-200";
            label = "🔴 Invalid";
          }

          return (
            <div
              key={item.id}
              className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50/60 px-2 rounded-lg transition-colors cursor-pointer"
              onClick={() => onSelect(item.phone)}
            >
              <div className="flex flex-col">
                <span className="font-mono font-medium text-slate-800">
                  {item.maskedPhone}
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badge}`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
