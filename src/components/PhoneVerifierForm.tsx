"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Search,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { ResultCard } from "./ResultCard";
import { DemoNumbers } from "./DemoNumbers";
import { PhoneCheckResponse } from "@/lib/validation";

const formSchema = z.object({
  phone: z
    .string()
    .min(1, "Please enter your mobile number")
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length === 10, {
      message: "Mobile number must be exactly 10 digits",
    })
    .refine((val) => /^[6-9]/.test(val), {
      message: "Valid Indian mobile numbers must start with 6, 7, 8, or 9",
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface PhoneVerifierFormProps {
  onVerificationSuccess: (
    phone: string,
    result: PhoneCheckResponse
  ) => void;
}

export const PhoneVerifierForm: React.FC<PhoneVerifierFormProps> = ({
  onVerificationSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState<PhoneCheckResponse | null>(null);
  const [lastCheckedPhone, setLastCheckedPhone] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      phone: "",
    },
  });

  const phoneValue = watch("phone") || "";

  // Auto filter non-digit characters and limit to 10 digits
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
    setValue("phone", raw, { shouldValidate: true });
    // Reset previous result if user types a new number
    if (apiResult) {
      setApiResult(null);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setApiResult(null);
    setLastCheckedPhone(data.phone);

    try {
      const response = await fetch("/api/phone/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: data.phone }),
      });

      const json: PhoneCheckResponse = await response.json();
      setApiResult(json);
      onVerificationSuccess(data.phone, json);
    } catch (err: any) {
      const errorResult: PhoneCheckResponse = {
        status: "ERROR",
        message:
          "Unable to connect to verification server. Please check your connection and try again.",
      };
      setApiResult(errorResult);
      onVerificationSuccess(data.phone, errorResult);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemoNumber = (num: string) => {
    setValue("phone", num, { shouldValidate: true });
    setApiResult(null);
    // Optional instant submit
    setTimeout(() => {
      handleSubmit(onSubmit)();
    }, 50);
  };

  const handleReset = () => {
    setApiResult(null);
    reset();
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-card border border-slate-200/80 transition-all">
      {/* Title & Subtitle */}
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-meesho-50 text-meesho-700 text-xs font-semibold mb-3 border border-meesho-100">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Indian Mobile Verification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Check Mobile Number
        </h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-lg">
          Verify whether an Indian mobile number exists in our authorized customer
          database, or if it is eligible as a new registration.
        </p>
      </div>

      {/* Main Verification Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        <div>
          <label
            htmlFor="mobile-input"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
          >
            Mobile Number
          </label>

          <div
            className={`flex items-stretch h-[52px] rounded-2xl border transition-all duration-200 bg-white ${
              errors.phone
                ? "border-rose-400 ring-4 ring-rose-50"
                : phoneValue.length === 10 && !errors.phone
                ? "border-emerald-400 ring-4 ring-emerald-50"
                : "border-slate-300 focus-within:border-meesho-600 focus-within:ring-4 focus-within:ring-meesho-100"
            }`}
          >
            {/* Indian Country Code Prefix */}
            <div className="flex items-center gap-2 px-4 h-full bg-slate-50/80 border-r border-slate-200 text-slate-800 rounded-l-2xl select-none font-semibold text-sm shrink-0">
              <span className="text-base" role="img" aria-label="India flag">
                🇮🇳
              </span>
              <span>+91</span>
            </div>

            {/* Input field */}
            <div className="relative flex-1 h-full">
              <input
                id="mobile-input"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                placeholder="Enter 10-digit mobile number"
                autoComplete="tel-national"
                disabled={loading}
                value={phoneValue}
                onChange={handlePhoneInputChange}
                className="w-full h-full px-4 text-base font-medium tracking-wider text-slate-900 placeholder:text-slate-400 placeholder:text-sm placeholder:tracking-normal focus:outline-hidden bg-transparent"
                aria-invalid={errors.phone ? "true" : "false"}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />

              {/* Digit counter */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                {phoneValue.length === 10 && !errors.phone && (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                )}
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                    phoneValue.length === 10
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {phoneValue.length}/10
                </span>
              </div>
            </div>
          </div>

          {/* Validation error message */}
          {errors.phone && (
            <p
              id="phone-error"
              className="mt-2 text-xs font-semibold text-rose-600 flex items-center gap-1.5 animate-fadeIn"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.phone.message}</span>
            </p>
          )}

          {!errors.phone && phoneValue.length > 0 && phoneValue.length < 10 && (
            <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Enter {10 - phoneValue.length} more digits</span>
            </p>
          )}
        </div>

        {/* Check Number CTA button */}
        <button
          type="submit"
          disabled={loading || phoneValue.length !== 10}
          className="w-full h-[52px] rounded-2xl bg-gradient-to-r from-meesho-800 via-meesho-700 to-meesho-600 hover:from-meesho-900 hover:via-meesho-800 hover:to-meesho-700 text-white font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-meesho-700/30 hover:shadow-meesho-700/40 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Checking Database...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Check Number</span>
            </>
          )}
        </button>
      </form>

      {/* Result Card */}
      <ResultCard
        result={apiResult}
        onReset={handleReset}
        phoneEntered={lastCheckedPhone || phoneValue}
      />

      {/* Quick Test Demo Chips */}
      <DemoNumbers
        onSelectNumber={handleSelectDemoNumber}
        disabled={loading}
      />
    </div>
  );
};
