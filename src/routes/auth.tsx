import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import owlImg from "@/assets/owl.png";

export function AuthComponent() {
  return <AuthPage />;
}

type Mode = "login" | "signup" | "verify";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  const onGoogle = async () => {
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) {
        toast.error("Google sign-in failed. Please try again.");
        setBusy(false);
      }
    } catch {
      toast.error("Something went wrong.");
      setBusy(false);
    }
  };

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters.");
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: fullName },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("We sent a 6-digit code to your email.");
    setMode("verify");
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: otp.trim(), type: "signup" });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Email confirmed! Welcome to ScholarMate 🦉");
    navigate({ to: "/" });
  };

  const resendCode = async () => {
    setBusy(true);
    const { error } = await supabase.auth.resend({ type: "signup", email });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Code resent. Check your inbox.");
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        toast.error("Please confirm your email first.");
        setMode("verify");
        return;
      }
      return toast.error(error.message);
    }
    toast.success("Welcome back!");
    navigate({ to: "/" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0F172A] text-slate-100">
      <div className="pointer-events-none absolute inset-0 sm-grid-bg" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-5 py-10 sm:px-8">
        <Link to="/" className="mb-8 flex items-center gap-2 self-start text-sm text-slate-300 hover:text-white">
          <img src={owlImg} alt="" className="h-8 w-8 object-contain" />
          <span className="font-bold text-white">ScholarMate</span>
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="sm-card rounded-3xl p-7 sm:p-9">
          <div className="text-center">
            <img src={owlImg} alt="" className="sm-owl-float mx-auto h-16 w-16 object-contain" />
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {mode === "login" && <>Welcome <span className="sm-gradient-text">back</span></>}
              {mode === "signup" && <>Join <span className="sm-gradient-text">ScholarMate</span></>}
              {mode === "verify" && <>Verify your <span className="sm-gradient-text">email</span></>}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {mode === "login" && "Sign in to download the app and continue learning."}
              {mode === "signup" && "Create your free account in seconds."}
              {mode === "verify" && `Enter the 6-digit code sent to ${email}.`}
            </p>
          </div>
          {mode !== "verify" && (
            <>
              <p className="mt-6 rounded-xl border border-violet-400/20 bg-violet-500/5 px-4 py-3 text-center text-xs leading-relaxed text-slate-300">
                🔒 We only use your Google email to save your progress — nothing else. This is safe and standard.
              </p>
              <button onClick={onGoogle} disabled={busy} className="mt-3 flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-60">
                <GoogleIcon />
                Continue with Google
              </button>
              <div className="my-6 flex items-center gap-3 text-xs text-slate-500">
                <div className="h-px flex-1 bg-white/10" />OR<div className="h-px flex-1 bg-white/10" />
              </div>
            </>
          )}
          {mode === "login" && (
            <form onSubmit={onLogin} className="space-y-3">
              <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@unilag.edu.ng" />
              <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
              <SubmitButton busy={busy}>Sign in</SubmitButton>
              <p className="pt-3 text-center text-sm text-slate-400">
                New here?{" "}
                <button type="button" onClick={() => setMode("signup")} className="font-semibold text-violet-300 hover:text-violet-200">Create an account</button>
              </p>
            </form>
          )}
          {mode === "signup" && (
            <form onSubmit={onSignup} className="space-y-3">
              <Field label="Full name" type="text" value={fullName} onChange={setFullName} placeholder="Prince Isaac" />
              <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@unilag.edu.ng" />
              <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 6 characters" />
              <SubmitButton busy={busy}>Create account</SubmitButton>
              <p className="pt-3 text-center text-sm text-slate-400">
                Already have an account?{" "}
                <button type="button" onClick={() => setMode("login")} className="font-semibold text-violet-300 hover:text-violet-200">Sign in</button>
              </p>
            </form>
          )}
          {mode === "verify" && (
            <form onSubmit={onVerify} className="space-y-3">
              <Field label="Verification code" type="text" value={otp} onChange={(v) => setOtp(v.replace(/\D/g, "").slice(0, 6))} placeholder="123456" />
              <SubmitButton busy={busy}>Verify & continue</SubmitButton>
              <div className="flex items-center justify-between pt-3 text-sm">
                <button type="button" onClick={() => setMode("signup")} className="text-slate-400 hover:text-white">← Back</button>
                <button type="button" onClick={resendCode} disabled={busy} className="font-semibold text-violet-300 hover:text-violet-200">Resend code</button>
              </div>
            </form>
          )}
        </motion.div>
        <p className="mt-6 text-center text-xs text-slate-500">By continuing you agree to use ScholarMate for academic purposes.</p>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder }: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
      <input required type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-violet-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-violet-500/30" />
    </label>
  );
}

function SubmitButton({ busy, children }: { busy: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={busy} className="sm-btn-primary mt-2 w-full rounded-xl px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
      {busy ? "Please wait…" : children}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.7-3.9 2.7-6.62Z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18Z"/>
      <path fill="#FBBC05" d="M3.97 10.71A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.29-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.33Z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"/>
    </svg>
  );
}
