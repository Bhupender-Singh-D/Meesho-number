import React from "react";
import { Sparkles } from "lucide-react";

interface DemoNumbersProps {
  onSelectNumber: (num: string) => void;
  disabled?: boolean;
}

export const DemoNumbers: React.FC<DemoNumbersProps> = ({
  onSelectNumber,
  disabled,
}) => {
  const demos = [
    {
      label: "9876543210",
      type: "REGISTERED",
      badge: "🟢 Registered",
      classes:
        "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300",
    },
    {
      label: "8888899999",
      type: "REGISTERED",
      badge: "🟢 Registered",
      classes:
        "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300",
    },
    {
      label: "9999912345",
      type: "NEW",
      badge: "🔵 New Number",
      classes:
        "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 hover:border-blue-300",
    },
    {
      label: "5555512345",
      type: "INVALID",
      badge: "🔴 Invalid (starts 5)",
      classes:
        "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 hover:border-rose-300",
    },
  ];

  return (
    <div className="mt-5 pt-4 border-t border-slate-100">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-2.5">
        <Sparkles className="w-3.5 h-3.5 text-meesho-600" />
        <span>Quick Test with Seeded Dummy Numbers:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {demos.map((item) => (
          <button
            key={item.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelectNumber(item.label)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${item.classes} ${
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95"
            }`}
          >
            <span>{item.label}</span>
            <span className="text-[10px] font-sans font-semibold opacity-85">
              ({item.badge})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
