import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePageTitle } from "@/hooks/use-page-title";
import { toast } from "sonner";
import aceIcon from "@/assets/app/ace-icon.webp";

export function AuthComponent() {
  usePageTitle("Sign in");
  return <AuthPage />;
}

type Mode = "login" | "signup" | "verify";

const HEADINGS: Record<Mode, string> = {
  login: "Sign in",
  signup: "Create your free account",
  verify: "Confirm your email",
};

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  const go = (m: Mode) => { setError(""); setMode(m); };

  const onGoogle = async () => {
    setError("");
    setBusy(true);
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
      if (err) { setError("Google sign-in did not work. Try again, or use your email instead."); setBusy(false); }
    } catch {
      setError("Something went wrong. Check your connection and try again.");
      setBusy(false);
    }
  };

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) return setError("Your password needs at least 6 characters.");
    setBusy(true);
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/`, data: { full_name: fullName } },
    });
    setBusy(false);
    if (err) return setError(err.message);
    toast.success("We sent a 6-digit code to your email.");
    go("verify");
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error: err } = await supabase.auth.verifyOtp({ email, token: otp.trim(), type: "signup" });
    setBusy(false);
    if (err) return setError(err.message);
    toast.success("Email confirmed. Welcome to ScholarMate.");
    navigate({ to: "/" });
  };

  const resendCode = async () => {
    setError("");
    setBusy(true);
    const { error: err } = await supabase.auth.resend({ type: "signup", email });
    setBusy(false);
    if (err) return setError(err.message);
    toast.success("Code sent again. Check your inbox and spam folder.");
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) {
      if (err.message.toLowerCase().includes("email not confirmed")) {
        toast.info("Confirm your email first. We will ask for the code.");
        go("verify");
        return;
      }
      return setError(err.message);
    }
    toast.success("Welcome back.");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100">
      <main className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-10 sm:px-8">
        <Link to="/" className="mb-8 flex items-center gap-2 self-start text-sm text-slate-300 hover:text-white">
          <img src={aceIcon} width={32} height={32} alt="" className="h-8 w-8 rounded-md object-contain" />
          <span className="font-semibold text-white">ScholarMate</span>
        </Link>

        <div className="sm-card rounded-lg p-6 sm:p-8">
          {mode !== "login" && (
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Step {mode === "signup" ? 1 : 2} of 2</p>
          )}
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">{HEADINGS[mode]}</h1>
          <p className="mt-2 text-sm text-slate-300">
            {mode === "login" && "You need an account to download the app. It is free."}
            {mode === "signup" && "Enter your details. We email you a 6-digit code to confirm your address."}
            {mode === "verify" && `Enter the 6-digit code we sent to ${email || "your email"}.`}
          </p>

          {mode !== "verify" && (
            <>
              <button onClick={onGoogle} disabled={busy} className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-white/15 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 disabled:opacity-60">
                <GoogleIcon />
                Continue with Google
              </button>
              <p className="mt-2 text-xs text-slate-400">Google shares only your name and email with us.</p>
              <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
                <div className="h-px flex-1 bg-white/10" />or use email<div className="h-px flex-1 bg-white/10" />
              </div>
            </>
          )}

          {mode === "login" && (
            <form onSubmit={onLogin} className="space-y-3">
              <Field id="email" label="Email" type="email" autoComplete="email" value={email} onChange={setEmail} placeholder="you@example.com" />
              <PasswordField id="password" label="Password" autoComplete="current-password" value={password} onChange={setPassword} placeholder="Your password" />
              <ErrorLine message={error} />
              <SubmitButton busy={busy}>Sign in</SubmitButton>
              <p className="pt-3 text-center text-sm text-slate-300">
                New here?{" "}
                <button type="button" onClick={() => go("signup")} className="font-semibold text-emerald-300 underline underline-offset-4 hover:text-emerald-200">Create an account</button>
              </p>
            </form>
          )}
          {mode === "signup" && (
            <form onSubmit={onSignup} className="space-y-3">
              <Field id="full-name" label="Full name" type="text" autoComplete="name" value={fullName} onChange={setFullName} placeholder="Your full name" />
              <Field id="email" label="Email" type="email" autoComplete="email" value={email} onChange={setEmail} placeholder="you@example.com" />
              <PasswordField id="new-password" label="Password" autoComplete="new-password" value={password} onChange={setPassword} placeholder="At least 6 characters" />
              <ErrorLine message={error} />
              <SubmitButton busy={busy}>Create account</SubmitButton>
              <p className="pt-3 text-center text-sm text-slate-300">
                Already have an account?{" "}
                <button type="button" onClick={() => go("login")} className="font-semibold text-emerald-300 underline underline-offset-4 hover:text-emerald-200">Sign in</button>
              </p>
            </form>
          )}
          {mode === "verify" && (
            <form onSubmit={onVerify} className="space-y-3">
              <Field id="otp" label="Verification code" type="text" inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={(v) => setOtp(v.replace(/\D/g, "").slice(0, 6))} placeholder="6 digits" />
              <ErrorLine message={error} />
              <SubmitButton busy={busy}>Confirm and continue</SubmitButton>
              <div className="flex items-center justify-between pt-3 text-sm">
                <button type="button" onClick={() => go("signup")} className="text-slate-300 underline underline-offset-4 hover:text-white">Back</button>
                <button type="button" onClick={resendCode} disabled={busy} className="font-semibold text-emerald-300 underline underline-offset-4 hover:text-emerald-200">Send the code again</button>
              </div>
            </form>
          )}
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">
          By continuing you agree to the <Link to="/terms" className="underline underline-offset-4 hover:text-white">Terms</Link> and the <Link to="/privacy" className="underline underline-offset-4 hover:text-white">Privacy Policy</Link>.
        </p>
      </main>
    </div>
  );
}

const INPUT = "w-full rounded-lg border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-400";

function Field({ id, label, type, value, onChange, placeholder, autoComplete, inputMode }: { id: string; label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string; autoComplete?: string; inputMode?: "numeric" }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-200">{label}</label>
      <input id={id} required type={type} inputMode={inputMode} autoComplete={autoComplete} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={INPUT} />
    </div>
  );
}

function PasswordField({ id, label, value, onChange, placeholder, autoComplete }: { id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string; autoComplete?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-200">{label}</label>
      <div className="relative">
        <input id={id} required type={show ? "text" : "password"} autoComplete={autoComplete} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${INPUT} pr-12`} />
        <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show} className="absolute inset-y-0 right-0 grid w-12 place-items-center text-slate-300 hover:text-white">
          {show ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
        </button>
      </div>
    </div>
  );
}

function ErrorLine({ message }: { message: string }) {
  return <div aria-live="assertive">{message && <p role="alert" className="text-sm font-medium text-rose-300">{message}</p>}</div>;
}

function SubmitButton({ busy, children }: { busy: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={busy} className="sm-btn-primary mt-2 w-full rounded-lg px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">
      {busy ? "Please wait" : children}
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
