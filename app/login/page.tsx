"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { HPLogo } from "@/components/hp-logo";
import { SwooshDivider } from "@/components/swoosh-divider";
import { createClient } from "@/lib/supabase/client";
import {
  Trophy,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Award,
  User,
  ShieldAlert,
} from "lucide-react";

const authSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "official@hpcl.in",
      password: "Password@123",
      fullName: "Track Marshal",
    },
  });

  const handleAuth = async (data: AuthFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    const supabase = createClient();

    try {
      if (authMode === "signup") {
        const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName || data.email.split("@")[0],
            },
          },
        });

        if (signUpErr) {
          throw signUpErr;
        }

        if (signUpData.session) {
          router.refresh();
          router.push("/dashboard");
          return;
        } else {
          // Attempt sign in directly in case email confirmation is disabled
          const { error: directInErr } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });
          if (!directInErr) {
            router.refresh();
            router.push("/dashboard");
            return;
          }
        }
      } else {
        // Sign in
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (signInErr) {
          // If user doesn't exist yet, attempt automatic bootstrap registration
          if (signInErr.message.toLowerCase().includes("invalid login credentials")) {
            const { error: autoUpErr } = await supabase.auth.signUp({
              email: data.email,
              password: data.password,
              options: {
                data: {
                  full_name: data.fullName || data.email.split("@")[0],
                },
              },
            });
            if (!autoUpErr) {
              const { error: secondInErr } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
              });
              if (!secondInErr) {
                router.refresh();
                router.push("/dashboard");
                return;
              }
            }
          }
          throw signInErr;
        }

        router.refresh();
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Authentication failed. Please check credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Top Banner strip with Devanagari text on mobile */}
      <div className="w-full bg-[#E4202B] py-1.5 px-4 text-center text-white text-xs font-semibold tracking-wider md:hidden">
        हिन्दुस्तान पेट्रोलियम कॉर्पोरेशन लिमिटेड · खेलकूद प्रतियोगिता
      </div>

      {/* Left Navy Panel (Branded) */}
      <div className="relative flex flex-col justify-between bg-[#141F63] text-white p-8 md:p-12 lg:w-1/2 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#1F2E8C]/50 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#E4202B]/20 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10">
          <div className="inline-block bg-[#E4202B] px-3 py-1 rounded-sm text-[11px] font-bold tracking-widest uppercase text-white shadow-xs">
            हिन्दुस्तान पेट्रोलियम
          </div>
          <div className="mt-4 flex items-center gap-3">
            <HPLogo size="lg" showText textColor="white" />
          </div>
        </div>

        {/* Middle hero content */}
        <div className="relative z-10 my-10 space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-slate-200">
            <Award className="size-3.5 text-hp-gold" />
            <span>19th All India Annual Sports Meet 2024-25</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight font-[family-name:var(--font-poppins)] leading-tight">
            Digitising Paper Registers at the Track.
          </h1>

          <p className="text-sm md:text-base text-slate-300 max-w-lg leading-relaxed">
            Real-time track entry for Official Record Sheets (Heats), Instant Podium Results,
            and the Format 3 Cash Card Control Sheet for on-ground prize disbursement.
          </p>

          <SwooshDivider variant="navy" className="pt-2 opacity-80" />

          {/* Quick Stats bullet points */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-hp-navy border border-white/20">
                <Trophy className="size-3 text-hp-gold" />
              </div>
              <span>16 Official Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-hp-navy border border-white/20">
                <ShieldCheck className="size-3 text-emerald-400" />
              </div>
              <span>Format 3 Verification</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-400 border-t border-white/10 pt-4 flex items-center justify-between">
          <span>HPCL Corporate Sports Meet</span>
          <span>28 Feb – 1 Mar 2025</span>
        </div>
      </div>

      {/* Right White/Card Panel (Login Form) */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16 bg-card">
        <div className="w-full max-w-md space-y-6">
          {/* Form Header */}
          <div className="space-y-1">
            <div className="hidden md:inline-block bg-[#E4202B] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase mb-2">
              हिन्दुस्तान पेट्रोलियम
            </div>
            <h2 className="text-2xl font-bold tracking-tight font-[family-name:var(--font-poppins)] text-hp-ink dark:text-white">
              {authMode === "signin" ? "Organiser Sign In" : "Register Track Official"}
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Sign in with your role credentials to manage heats, results, and cash cards.
            </p>
          </div>

          {/* Auth Mode Tabs */}
          <div className="flex rounded-lg border border-border p-1 bg-muted/30">
            <button
              type="button"
              onClick={() => {
                setAuthMode("signin");
                setErrorMessage(null);
              }}
              className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                authMode === "signin"
                  ? "bg-hp-navy text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("signup");
                setErrorMessage(null);
              }}
              className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                authMode === "signup"
                  ? "bg-hp-navy text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              New Official Sign Up
            </button>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
              <ShieldAlert className="size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(handleAuth)} className="space-y-4">
            {authMode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-hp-ink dark:text-slate-200">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="e.g. S. Ramanathan"
                    {...register("fullName")}
                    className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm focus:border-hp-navy focus:outline-none focus:ring-1 focus:ring-hp-navy"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-hp-ink dark:text-slate-200">
                HPCL Email ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="official@hpcl.in"
                  {...register("email")}
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm focus:border-hp-navy focus:outline-none focus:ring-1 focus:ring-hp-navy"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-hp-red">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-hp-ink dark:text-slate-200">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm focus:border-hp-navy focus:outline-none focus:ring-1 focus:ring-hp-navy"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-hp-red">{errors.password.message}</p>
              )}
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#E4202B] hover:bg-red-700 text-white py-2.5 text-sm font-semibold transition-colors shadow-sm disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Authenticating with Supabase...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {authMode === "signin" ? "Sign In to Meet Portal" : "Create Official Account"}
                  <ArrowRight className="size-4" />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
