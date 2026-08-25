import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import aceFull from "@/assets/app/ace_full.png";
import aceIcon from "@/assets/app/ace-icon.png";
import studyPlanner from "@/assets/app/study-planner.png";
import library from "@/assets/app/library.png";
import cgpaCalc from "@/assets/app/cgpa-calculator.png";
import studyTimer from "@/assets/app/study-timer.png";
import aiNotes from "@/assets/app/ai-notes.png";
import imageGeneration from "@/assets/app/image-generation.png";
import practiceFlashcards from "@/assets/app/practice-flashcards.png";
import princeStudioLogo from "@/assets/app/prince-ai-studio-logo.png";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export function IndexComponent() {
  return <LandingPage />;
}

const DOWNLOAD_URL = "https://dub.sh/scholarmate-app";
const PENDING_KEY = "scholarmate:pendingDownload";
const APP_VERSION = "v7.0.0";

function triggerSilentDownload(url: string) {
  if (typeof document === "undefined") return;
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.setAttribute("aria-hidden", "true");
  iframe.src = url;
  document.body.appendChild(iframe);
  window.setTimeout(() => {
    try { document.body.removeChild(iframe); } catch {}
  }, 60_000);
}

function useDownloadGuard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      try { sessionStorage.setItem(PENDING_KEY, "1"); } catch {}
      toast.info("Sign in to download ScholarMate.");
      navigate({ to: "/auth" });
      return;
    }
    toast.success("Your download is starting…");
    triggerSilentDownload(DOWNLOAD_URL);
    supabase.from('profiles').upsert({ id: user.id, has_downloaded: true, updated_at: new Date().toISOString() });
  };
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const guard = useDownloadGuard();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const closeMenu = () => setMenuOpen(false);
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || menuOpen ? "border-b border-white/5 bg-[#0B1020]/85 backdrop-blur-xl" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4">
        <a href="#top" className="flex min-w-0 items-center gap-2" onClick={closeMenu}>
          <img src={aceIcon} alt="" className="h-7 w-7 shrink-0 rounded-lg object-contain sm:h-8 sm:w-8" />
          <span className="truncate text-[15px] font-semibold tracking-tight text-white sm:text-base">ScholarMate</span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-[13px] font-medium text-slate-300 hover:text-white">Features</a>
          <a href="#ace" className="text-[13px] font-medium text-slate-300 hover:text-white">Meet Ace</a>
          <Link to="/try-it-free" className="text-[13px] font-medium text-slate-300 hover:text-white">Try It Free</Link>
          <Link to="/reviews" className="text-[13px] font-medium text-slate-300 hover:text-white">Reviews</Link>
          <Link to="/try-it-free" onClick={closeMenu} className="rounded-lg px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5">Try It Free</Link>
          <Link to="/support" onClick={closeMenu} className="rounded-lg px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5">Support</Link>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Link to="/profile" className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-500/50 hover:border-indigo-400 transition flex-shrink-0">
  {user.user_metadata?.avatar_url ? (
    <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
      {(user.user_metadata?.full_name || user.email || '?').charAt(0).toUpperCase()}
    </div>
  )}
</Link>
          ) : (
            <button
              onClick={() => navigate({ to: "/auth" })}
              className="sm-btn-ghost rounded-full px-3.5 py-1.5 text-[13px] font-medium text-slate-200"
            >
              Sign in
            </button>
          )}
          <a
            href={DOWNLOAD_URL}
            onClick={guard}
            className="rounded-full bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white transition hover:bg-indigo-500"
          >
            Download
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {user && (
            <Link to="/profile" className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-500/50">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                  {(user.user_metadata?.full_name || user.email || '?').charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
          )}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="sm-btn-ghost grid h-9 w-9 shrink-0 place-items-center rounded-full text-white"
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 top-0 h-0.5 w-4 bg-current transition ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`absolute left-0 top-1.5 h-0.5 w-4 bg-current transition ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 top-3 h-0.5 w-4 bg-current transition ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden">
          <div className="border-t border-white/5 bg-[#0B1020]/95 px-4 py-4 backdrop-blur-xl">
            <div className="flex flex-col gap-1">
              <a href="#features" onClick={closeMenu} className="rounded-lg px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5">Features</a>
              <a href="#ace" onClick={closeMenu} className="rounded-lg px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5">Meet Ace</a>
              <a href={DOWNLOAD_URL} onClick={(e) => { closeMenu(); guard(e); }} className="rounded-lg px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5">Download App</a>
              <Link to="/reviews" onClick={closeMenu} className="rounded-lg px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5">Reviews</Link>
<Link to="/try-it-free" onClick={closeMenu} className="rounded-lg px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5">Try It Free</Link>
<Link to="/support" onClick={closeMenu} className="rounded-lg px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5">Support</Link>
              {user ? (
                <Link to="/profile" onClick={closeMenu} className="rounded-lg px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5">My Profile</Link>
              ) : (
                <button
                  onClick={() => { closeMenu(); navigate({ to: "/auth" }); }}
                  className="rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function PhoneMock({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`sm-phone mx-auto w-full max-w-[300px] sm:max-w-[340px] ${className}`}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}

function Hero() {
  const guard = useDownloadGuard();
  return (
    <section id="top" className="sm-hero-bg relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-14 md:grid-cols-2 md:gap-10">
          <div className="order-2 text-center md:order-1 md:text-left">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-indigo-200">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                ScholarMate {APP_VERSION}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 text-[2.25rem] font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
                Study Smarter <br className="hidden sm:block" />with Ace.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-slate-300 sm:text-lg md:mx-0">
                Everything you need to organize, learn, and succeed — in one beautifully designed app.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-3 md:justify-start">
                <a
                  href={DOWNLOAD_URL}
                  onClick={guard}
                  className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-[#0F172A] transition hover:bg-slate-100 sm:w-auto"
                >
                  Download App
                </a>
                <Link
                  to="/try-it-free"
                  className="sm-btn-ghost inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-[15px] font-semibold text-white sm:w-auto"
                >
                  Try It Free
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 text-xs text-slate-400">
                Free Forever · Secure Download · Built for University Students
              </p>
            </Reveal>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative mx-auto flex max-w-[420px] items-center justify-center">
              <motion.img
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                src={aceFull}
                alt="Ace, the ScholarMate mascot"
                className="sm-ace-float absolute -left-4 bottom-4 z-10 h-40 w-auto sm:-left-8 sm:h-56 md:-left-10 md:h-64"
              />
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1 }}
                className="relative z-0"
              >
                <PhoneMock src={studyPlanner} alt="ScholarMate app dashboard" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const showcase = [
  { eyebrow: "Study Planner", title: "A plan that adapts to your exam date.", subtitle: "Enter your exam date and Ace builds a prioritized, day-by-day study schedule you'll actually follow.", cta: "Learn More", href: "#everything", image: studyPlanner, alt: "Study Planner screen" },
  { eyebrow: "My Library", title: "Your material, transformed.", subtitle: "Upload notes, PDFs, images, YouTube videos or links. Get instant notes, flashcards and quizzes.", cta: "Learn More", href: "#everything", image: library, alt: "My Library screen" },
  { eyebrow: "CGPA Calculator", title: "Know exactly where you stand.", subtitle: "Supports 4.0, 5.0 and 7.0 grading systems, with saved history and easy sharing.", cta: "Try It Free", href: "/try-it-free", image: cgpaCalc, alt: "CGPA Calculator screen" },
  { eyebrow: "Study Timer", title: "Focus, one session at a time.", subtitle: "Pomodoro presets, custom timers and background tracking so you can put the phone down and study.", cta: "Learn More", href: "#everything", image: studyTimer, alt: "Study Timer screen" },
  { eyebrow: "AI Notes", title: "Comprehensive notes, in one tap.", subtitle: "Auto-generated lecture notes for every topic — clear, organized, and ready to listen to.", cta: "Learn More", href: "#everything", image: aiNotes, alt: "AI Notes screen" },
  { eyebrow: "Image Generation", title: "See the concept, not just the words.", subtitle: "Turn tricky topics into visuals that make them click, right inside your study flow.", cta: "Learn More", href: "#everything", image: imageGeneration, alt: "Image Generation screen" },
  { eyebrow: "Practice Flashcards", title: "Recall that actually sticks.", subtitle: "Generate 1–50 flashcards per topic and revise them anywhere, anytime.", cta: "Try It Free", href: "/try-it-free", image: practiceFlashcards, alt: "Flashcards screen" },
];

function ShowcaseSection() {
  return (
    <section id="features" className="relative bg-[#0B1020] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Feature showcase</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">Every tool a student actually needs.</h2>
            <p className="mt-4 text-[15px] text-slate-400 sm:text-base">Built with care. One coherent experience, from your first lecture to your final exam.</p>
          </div>
        </Reveal>
        <div className="mt-20 space-y-24 sm:space-y-32">
          {showcase.map((item, i) => {
            const reverse = i % 2 === 1;
            return (
              <Reveal key={item.title}>
                <div className={`grid items-center gap-12 md:grid-cols-2 md:gap-16 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
                  <div className="text-center md:text-left">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">{item.eyebrow}</p>
                    <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">{item.title}</h3>
                    <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-slate-400 md:mx-0">{item.subtitle}</p>
                    <a href={item.href} className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-indigo-300 hover:text-indigo-200">
                      {item.cta} <span aria-hidden>→</span>
                    </a>
                  </div>
                  <div><PhoneMock src={item.image} alt={item.alt} /></div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const insideItems = [
  { icon: "📝", title: "Practice Quiz", desc: "Adaptive quizzes that find and fix your weak topics." },
  { icon: "📅", title: "Study Planner", desc: "Day-by-day schedules tuned to your exam date." },
  { icon: "🧮", title: "CGPA Calculator", desc: "4.0, 5.0 and 7.0 systems with saved history." },
  { icon: "🎨", title: "Image Generation", desc: "Turn abstract concepts into visuals you'll remember." },
  { icon: "📖", title: "AI Notes", desc: "Comprehensive lecture notes for every topic." },
  { icon: "⏱️", title: "Study Timer", desc: "Pomodoro sessions with background tracking." },
  { icon: "🃏", title: "Flashcards", desc: "Spaced recall that keeps information locked in." },
  { icon: "✨", title: "And More…", desc: "Library, TTS, Final Boss quiz, best-scores and more." },
];

function InsideScholarMate() {
  return (
    <section id="everything" className="bg-[#0F172A] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Everything inside</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">One app. Your whole semester.</h2>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {insideItems.map((f) => (
            <div key={f.title} className="sm-card-soft rounded-2xl p-6">
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-4 text-[15px] font-semibold text-white">{f.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MeetAce() {
  return (
    <section id="ace" className="relative overflow-hidden bg-[#0B1020] py-20 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(700px_400px_at_50%_0%,rgba(99,102,241,0.18),transparent_60%)]" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <img src={aceFull} alt="Ace, the ScholarMate mascot" className="sm-ace-float mx-auto h-40 w-auto sm:h-56 md:h-64" loading="lazy" />
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Meet Ace</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">Your AI study companion.</h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-slate-300 sm:text-base">
            Ace helps you study, plan, learn, revise and stay productive — a calm, patient companion built into every corner of ScholarMate.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function TryItFreeTeaser() {
  return (
    <section id="try-it-free" className="relative bg-[#0F172A] py-20 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_50%_50%,rgba(99,102,241,0.1),transparent_70%)]" />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">No login required</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Try It <span className="sm-gradient-text">Free</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-slate-300">
          Try the CGPA calculator, practice quizzes and flashcards before you download — no login, no stress.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {[
            { emoji: "🧮", label: "CGPA Calculator" },
            { emoji: "📝", label: "Practice Quiz" },
            { emoji: "🃏", label: "Flashcards" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <span>{f.emoji}</span>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link
            to="/try-it-free"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3.5 text-[15px] font-semibold text-white transition hover:bg-indigo-500"
          >
            Try it free — no sign in needed →
          </Link>
        </div>
      </div>
    </section>
  );
}

function ReviewsTeaser() {
  return (
    <section className="bg-[#0B1020] py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Student reviews</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Loved by students across campus.</h2>
          <p className="mt-4 text-[15px] text-slate-400">See what other students are saying about ScholarMate — or leave your own review.</p>
          <div className="mt-8">
            <Link to="/reviews" className="sm-btn-ghost inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white">
              Read reviews & rate the app →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function DownloadCta() {
  const guard = useDownloadGuard();
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <section id="download" className="relative overflow-hidden bg-[#0F172A] py-20 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_50%_100%,rgba(79,70,229,0.25),transparent_60%)]" />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">ScholarMate {APP_VERSION}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">Study smarter, starting today.</h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] text-slate-300">Download ScholarMate today and start studying smarter with Ace.</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={DOWNLOAD_URL} onClick={guard} className="inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-8 py-3.5 text-[15px] font-semibold text-white transition hover:bg-indigo-500 sm:w-auto">
              Download APK
            </a>
            {!user && (
              <button onClick={() => navigate({ to: "/auth" })} className="sm-btn-ghost inline-flex w-full items-center justify-center rounded-full px-8 py-3.5 text-[15px] font-semibold text-white sm:w-auto">
                Sign In
              </button>
            )}
          </div>
          <p className="mt-5 text-xs text-slate-500">Secure download · Sign in required · Free forever</p>
        </Reveal>
      </div>
    </section>
  );
}

function AboutDeveloper() {
  return (
    <section id="about" className="bg-[#0B1020] py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Built with purpose.</h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-slate-400 sm:text-base">
            ScholarMate was created to help university students study more effectively through intelligent tools designed for everyday academic success.
          </p>
          <div className="mx-auto mt-12 max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Designed & Developed by</p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <img src={princeStudioLogo} alt="Prince AI Studio logo" className="h-10 w-10 rounded-xl object-contain" loading="lazy" />
              <span className="text-lg font-semibold text-white">Prince AI Studio</span>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <a href="https://instagram.com/officialprinceaistudio" target="_blank" rel="noopener noreferrer" className="sm-btn-ghost rounded-full px-4 py-1.5 text-xs font-medium text-slate-200 sm:text-sm">
                Instagram · @officialprinceaistudio
              </a>
              <a href="mailto:princeaistudio@gmail.com" className="sm-btn-ghost rounded-full px-4 py-1.5 text-xs font-medium text-slate-200 sm:text-sm">
                princeaistudio@gmail.com
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0B1020] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <div className="flex items-center gap-2">
              <img src={aceIcon} alt="" className="h-7 w-7 rounded-lg object-contain" />
              <span className="font-semibold text-white">ScholarMate</span>
              <span className="text-xs text-slate-500">{APP_VERSION}</span>
            </div>
            <p className="text-xs text-slate-500">Designed & Developed by <span className="text-slate-300">Prince AI Studio</span></p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-slate-400">
            <Link to="/reviews" className="hover:text-white">Reviews</Link>
            <a href="#features" className="hover:text-white">Features</a>
            <Link to="/support" className="hover:text-white">Support</Link>
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
        <div className="sm-divider mt-8" />
        <p className="mt-6 text-center text-xs text-slate-500">© 2026 Prince AI Studio · All rights reserved.</p>
      </div>
    </footer>
  );
}

function LandingPage() {
  const { user, loading } = useAuth();
  useEffect(() => {
    if (loading || !user) return;
    let pending = false;
    try { pending = sessionStorage.getItem(PENDING_KEY) === "1"; } catch {}
    if (!pending) return;
    try { sessionStorage.removeItem(PENDING_KEY); } catch {}
    toast.success("You're signed in — starting your download.");
    triggerSilentDownload(DOWNLOAD_URL);
  }, [user, loading]);
  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100">
      <Navbar />
      <Hero />
      <ShowcaseSection />
      <InsideScholarMate />
      <MeetAce />
      <TryItFreeTeaser />
      <ReviewsTeaser />
      <DownloadCta />
      <AboutDeveloper />
      <Footer />
    </div>
  );
}