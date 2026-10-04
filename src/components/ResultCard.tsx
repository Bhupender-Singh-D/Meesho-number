"use client";

import React from "react";
import {
  CheckCircle2,
  UserPlus,
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
  Clock,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { PhoneCheckResponse } from "@/lib/validation";

interface ResultCardProps {
  result: PhoneCheckResponse | null;
  onReset: () => void;
  phoneEntered: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  onReset,
  phoneEntered,
}) => {
  if (!result) return null;

  const { status, message, maskedPhone, timestamp } = result;

  const renderContent = () => {
    switch (status) {
      case "REGISTERED":
        return {
          badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
          dotColor: "bg-emerald-500",
          cardBorder: "border-emerald-200 bg-emerald-50/40",
          iconBg: "bg-emerald-100 text-emerald-600",
          title: "Registered Customer",
          statusText: "🟢 REGISTERED",
          description:
            message ||
            "This mobile number is already registered in the authorized customer database.",
          actionText: "Proceed to Login / Account",
          actionClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20",
          Icon: CheckCircle2,
        };

      case "NEW":
        return {
          badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
          dotColor: "bg-blue-500",
          cardBorder: "border-blue-200 bg-blue-50/40",
          iconBg: "bg-blue-100 text-blue-600",
          title: "New / Not Registered",
          statusText: "🔵 NEW NUMBER",
          description:
            message ||
            "This mobile number was not found in the authorized database and is eligible for new registration.",
          actionText: "Proceed to New Customer Signup",
          actionClass: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20",
          Icon: UserPlus,
        };

      case "INVALID":
        return {
          badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
          dotColor: "bg-rose-500",
          cardBorder: "border-rose-200 bg-rose-50/40",
          iconBg: "bg-rose-100 text-rose-600",
          title: "Invalid Mobile Number",
          statusText: "🔴 INVALID NUMBER",
          description:
            message ||
            "The entered number does not meet standard Indian mobile specifications (10 digits starting with 6, 7, 8, or 9).",
          actionText: "Correct Mobile Number",
          actionClass: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20",
          Icon: AlertCircle,
        };

      case "ERROR":
      default:
        return {
          badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
          dotColor: "bg-amber-500",
          cardBorder: "border-amber-200 bg-amber-50/40",
          iconBg: "bg-amber-100 text-amber-600",
          title: "Verification Error / Rate Limited",
          statusText: "🟠 SYSTEM NOTICE",
          description:
            message ||
            "An error occurred while verifying the number or the rate limit was reached.",
          actionText: "Try Again Later",
          actionClass: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20",
          Icon: AlertTriangle,
        };
    }
  };

  const config = renderContent();
  const Icon = config.Icon;

  return (
    <div
      className={`mt-6 rounded-2xl border ${config.cardBorder} p-5 sm:p-6 transition-all duration-300 shadow-sm`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${config.iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${config.badgeColor}`}
              >
                <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                {config.statusText}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              {config.title}
            </h3>
          </div>
        </div>

        <button
          onClick={onReset}
          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
          title="Verify Another Number"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-slate-600 mt-3 leading-relaxed">
        {config.description}
      </p>

      {/* Verification details table / metadata */}
      <div className="mt-4 pt-4 border-t border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Masked Record:{" "}
            <strong className="text-slate-700 font-mono">
              {maskedPhone || "+91 ******" + phoneEntered.slice(-4)}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Checked:{" "}
            <span className="text-slate-700 font-mono">
              {timestamp ? new Date(timestamp).toLocaleTimeString() : "Just now"}
            </span>
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-xs"
        >
          Check Another Number
        </button>

        <button
          onClick={() => {
            alert(
              `Demo Action: "${config.actionText}" triggered for ${maskedPhone || phoneEntered}. In a full application, this navigates to the next onboarding or authentication step.`
            );
          }}
          className={`w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl shadow-sm transition-all ${config.actionClass}`}
        >
          <span>{config.actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
