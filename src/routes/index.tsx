import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calculator, Layers, ListChecks, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { usePageTitle } from "@/hooks/use-page-title";
import { toast } from "sonner";
import { GUEST_LIMIT } from "@/lib/aceChat";
import {
  APP_VERSION, CONTACT_EMAIL, DOWNLOAD_URL, INSTAGRAM_HANDLE, INSTAGRAM_URL,
  PRO_PLANS, TRY_TAB_KEY, naira, perDay,
} from "@/lib/site";
import { FREE_COURSES, FREE_QUIZZES } from "@/components/free-content-data";
import aceFull from "@/assets/app/ace_full.webp";
import aceIcon from "@/assets/app/ace-icon.webp";
import studyPlanner from "@/assets/app/study-planner.webp";
import library from "@/assets/app/library.webp";
import cgpaCalc from "@/assets/app/cgpa-calculator.webp";
import studyTimer from "@/assets/app/study-timer.webp";
import aiNotes from "@/assets/app/ai-notes.webp";
import imageGeneration from "@/assets/app/image-generation.webp";
import practiceFlashcards from "@/assets/app/practice-flashcards.webp";
import princeStudioLogo from "@/assets/app/prince-ai-studio-logo.webp";

export function IndexComponent() {
  usePageTitle();
  return <LandingPage />;
}

const PENDING_KEY = "scholarmate:pendingDownload";

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
      toast.info("Sign in to download ScholarMate. Your download starts right after.");
      navigate({ to: "/auth" });
      return;
    }
    toast.success("Your download is starting.");
    triggerSilentDownload(DOWNLOAD_URL);
    supabase.from("profiles").upsert({ id: user.id, has_downloaded: true, updated_at: new Date().toISOString() });
  };
}

function rememberTool(tab: "cgpa" | "quiz" | "flashcards") {
  try { localStorage.setItem(TRY_TAB_KEY, tab); } catch {}
}

const NAV_LINK = "text-[13px] font-medium text-slate-300 hover:text-white";
const MOBILE_LINK = "rounded-lg px-3 py-3 text-sm text-slate-200 hover:bg-white/5";

function Avatar({ size = "h-8 w-8" }: { size?: string }) {
  const { user } = useAuth();
  if (!user) return null;
  const url = user.user_metadata?.avatar_url as string | undefined;
  const initial = ((user.user_metadata?.full_name as string) || user.email || "?").charAt(0).toUpperCase();
  return (
    <Link to="/profile" aria-label="Your profile" className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-emerald-700 text-xs font-bold text-white`}>
      {url ? <img src={url} alt="" className="h-full w-full object-cover" /> : initial}
    </Link>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const guard = useDownloadGuard();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const closeMenu = () => setMenuOpen(false);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 ${scrolled || menuOpen ? "border-b border-white/10 bg-[#0B1020]" : "bg-transparent"}`}>
      <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <a href="#top" className="flex min-w-0 items-center gap-2" onClick={closeMenu}>
          <img src={aceIcon} alt="" width={32} height={32} className="h-8 w-8 shrink-0 rounded-md object-contain" />
          <span className="truncate text-base font-semibold tracking-tight text-white">ScholarMate</span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          <a href="#features" className={NAV_LINK}>Features</a>
          <a href="#ace" className={NAV_LINK}>Meet Ace</a>
          <Link to="/try-it-free" className={NAV_LINK}>Try It Free</Link>
          <Link to="/reviews" className={NAV_LINK}>Reviews</Link>
          <Link to="/support" className={NAV_LINK}>Support</Link>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Avatar />
          ) : (
            <button onClick={() => navigate({ to: "/auth" })} className="sm-btn-ghost rounded-lg px-3.5 py-2 text-[13px] font-medium text-slate-200">
              Sign in
            </button>
          )}
          <a href={DOWNLOAD_URL} onClick={guard} className="sm-btn-primary rounded-lg px-4 py-2 text-[13px] font-semibold text-white">
            Download
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Avatar />
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="sm-btn-ghost grid h-10 w-10 shrink-0 place-items-center rounded-lg text-white"
          >
            {menuOpen ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-white/10 bg-[#0B1020] px-4 py-3 md:hidden">
          <div className="flex flex-col">
            <a href="#features" onClick={closeMenu} className={MOBILE_LINK}>Features</a>
            <a href="#ace" onClick={closeMenu} className={MOBILE_LINK}>Meet Ace</a>
            <Link to="/try-it-free" onClick={closeMenu} className={MOBILE_LINK}>Try It Free</Link>
            <Link to="/reviews" onClick={closeMenu} className={MOBILE_LINK}>Reviews</Link>
            <Link to="/support" onClick={closeMenu} className={MOBILE_LINK}>Support</Link>
            <a href={DOWNLOAD_URL} onClick={(e) => { closeMenu(); guard(e); }} className={MOBILE_LINK}>Download for Android</a>
            {!user && (
              <button onClick={() => { closeMenu(); navigate({ to: "/auth" }); }} className={`${MOBILE_LINK} text-left`}>
                Sign in
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  const guard = useDownloadGuard();
  return (
    <section id="top" className="bg-[#0F172A] pb-16 pt-28 sm:pb-24 sm:pt-32 md:pt-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
              ScholarMate {APP_VERSION} for Android
            </p>
            <h1 className="mt-4 text-[2.1rem] font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
              Turn your notes into a study plan, flashcards and quizzes.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">
              ScholarMate is a study app for Nigerian university students. Upload your material, enter your exam date, and Ace builds the schedule and the practice questions.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/try-it-free" className="sm-btn-primary inline-flex items-center justify-center rounded-lg px-6 py-3 text-[15px] font-semibold text-white">
                Try it free in your browser
              </Link>
              <a href={DOWNLOAD_URL} onClick={guard} className="sm-btn-ghost inline-flex items-center justify-center rounded-lg px-6 py-3 text-[15px] font-semibold text-white">
                Download for Android
              </a>
            </div>
            <p className="mt-5 text-sm text-slate-400">
              The browser tools need no account. Downloading the app needs a free sign-in.
            </p>
          </div>
          <img
            src={studyPlanner}
            width={760}
            height={507}
            alt="ScholarMate study planner showing an exam countdown and a day of scheduled lectures, assignments and revision"
            className="sm-shot"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}

const features = [
  { id: "planner", name: "Study Planner", title: "A plan built around your exam date", body: "Enter your exam date and Ace builds a prioritized, day-by-day study schedule.", image: studyPlanner, alt: "Study Planner screen with an exam countdown and a day's schedule" },
  { id: "library", name: "My Library", title: "Your own material, turned into study tools", body: "Upload notes, PDFs, images, YouTube videos or links. ScholarMate generates notes, flashcards and quizzes from them.", image: library, alt: "My Library screen" },
  { id: "cgpa", name: "CGPA Calculator", title: "Check your CGPA on a 4.0, 5.0 or 7.0 scale", body: "Add your courses and grades. The app keeps a saved history and lets you share results.", image: cgpaCalc, alt: "CGPA Calculator screen", tryTab: "cgpa" as const },
  { id: "timer", name: "Study Timer", title: "Timed study sessions", body: "Pomodoro presets and custom timers, with tracking that keeps running in the background.", image: studyTimer, alt: "Study Timer screen" },
  { id: "notes", name: "AI Notes", title: "Lecture notes for any topic", body: "Generate notes for a topic, then read them or listen with text-to-speech.", image: aiNotes, alt: "AI Notes screen" },
  { id: "images", name: "Image Generation", title: "A picture for the idea you cannot visualise", body: "Generate an image that explains a topic you find hard to picture.", image: imageGeneration, alt: "Image Generation screen" },
  { id: "flashcards", name: "Flashcards", title: "Flashcards generated per topic", body: "Generate between 1 and 50 flashcards for a topic and revise them in the app.", image: practiceFlashcards, alt: "Flashcards screen", tryTab: "flashcards" as const },
];

function Features() {
  const [active, setActive] = useState(0);
  const f = features[active];
  return (
    <section id="features" className="bg-[#0B1020] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">What is inside the app</h2>
          <p className="mt-3 text-base text-slate-300">Pick a feature to see it.</p>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12">
          <div role="tablist" aria-label="App features" className="flex flex-col gap-1">
            {features.map((item, i) => (
              <button
                key={item.id}
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={i === active}
                aria-controls="feature-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setActive((i + 1) % features.length); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setActive((i - 1 + features.length) % features.length); }
                }}
                className={`rounded-lg border px-4 py-3 text-left text-[15px] font-semibold transition-colors ${
                  i === active ? "border-emerald-400/50 bg-emerald-500/10 text-white" : "border-transparent text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div id="feature-panel" role="tabpanel" aria-labelledby={`tab-${f.id}`}>
            <img src={f.image} width={760} height={507} alt={f.alt} className="sm-shot" loading="lazy" />
            <h3 className="mt-6 text-xl font-semibold text-white sm:text-2xl">{f.title}</h3>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-slate-300">{f.body}</p>
            {f.tryTab && (
              <Link to="/try-it-free" onClick={() => rememberTool(f.tryTab)} className="mt-4 inline-block text-[15px] font-semibold text-emerald-300 underline underline-offset-4 hover:text-emerald-200">
                Try a free version in your browser
              </Link>
            )}
          </div>
        </div>
        <p className="mt-12 max-w-2xl text-sm leading-relaxed text-slate-400">
          Also in the app: practice quizzes, a Final Boss quiz, a leaderboard, web search and text-to-speech.
        </p>
      </div>
    </section>
  );
}

function MeetAce() {
  return (
    <section id="ace" className="bg-[#0F172A] py-16 sm:py-24">
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[auto_1fr] md:gap-16">
        <img src={aceFull} width={520} height={780} alt="Ace, the ScholarMate owl mascot wearing a graduation cap" className="mx-auto h-56 w-auto sm:h-72" loading="lazy" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Meet Ace</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
            Ace is the AI study assistant inside ScholarMate. It helps you study, plan, learn and revise.
          </p>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-300">
            The chat button on this site is Ace too, in support mode. Ask it about features, downloads or Pro plans. Guests get {GUEST_LIMIT} free messages, and a free account removes that limit.
          </p>
        </div>
      </div>
    </section>
  );
}

const tools = [
  { tab: "cgpa" as const, icon: Calculator, name: "CGPA calculator", text: "Pick a 4.0, 5.0 or 7.0 scale, add your courses and see your CGPA." },
  { tab: "quiz" as const, icon: ListChecks, name: "Practice quiz", text: `${FREE_QUIZZES[FREE_COURSES[0].code].length} questions per course, with an explanation for every answer.` },
  { tab: "flashcards" as const, icon: Layers, name: "Flashcards", text: "Flip through a short set for each course." },
];

function TryItFreeTeaser() {
  return (
    <section id="try-it-free" className="bg-[#0B1020] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Try it before you sign up</h2>
          <p className="mt-3 text-base text-slate-300">
            Three tools work right here in your browser, covering {FREE_COURSES.length} courses. No account needed.
          </p>
        </div>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {tools.map((t) => (
            <li key={t.tab}>
              <Link to="/try-it-free" onClick={() => rememberTool(t.tab)} className="sm-card block h-full rounded-lg p-5 hover:border-white/25">
                <t.icon size={22} className="text-emerald-300" aria-hidden />
                <span className="mt-4 block text-base font-semibold text-white">{t.name}</span>
                <span className="mt-1.5 block text-sm leading-relaxed text-slate-300">{t.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function useReviewSummary() {
  const [state, setState] = useState<{ status: "loading" | "error" | "ready"; count: number; avg: number }>({ status: "loading", count: 0, avg: 0 });
  useEffect(() => {
    let alive = true;
    supabase.from("reviews").select("stars").then(({ data, error }) => {
      if (!alive) return;
      if (error || !data) { setState({ status: "error", count: 0, avg: 0 }); return; }
      const count = data.length;
      const avg = count ? data.reduce((s, r) => s + (r.stars as number), 0) / count : 0;
      setState({ status: "ready", count, avg });
    });
    return () => { alive = false; };
  }, []);
  return state;
}

function ReviewsTeaser() {
  const r = useReviewSummary();
  return (
    <section className="bg-[#0F172A] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Reviews</h2>
        <p className="mt-3 max-w-xl text-base text-slate-300" aria-live="polite">
          {r.status === "loading" && "Loading reviews."}
          {r.status === "error" && "Reviews could not load right now. You can still try the reviews page."}
          {r.status === "ready" && r.count === 0 && "No reviews yet. If you use the app, yours could be the first."}
          {r.status === "ready" && r.count > 0 && `${r.avg.toFixed(1)} out of 5, from ${r.count} ${r.count === 1 ? "review" : "reviews"} left by users.`}
        </p>
        <Link to="/reviews" className="sm-btn-ghost mt-6 inline-flex items-center rounded-lg px-5 py-3 text-[15px] font-semibold text-white">
          Read reviews or leave one
        </Link>
      </div>
    </section>
  );
}

function DownloadSection() {
  const guard = useDownloadGuard();
  const { user } = useAuth();
  const navigate = useNavigate();
  const courseCount = FREE_COURSES.length;
  const quizLen = FREE_QUIZZES[FREE_COURSES[0].code].length;
  const rows = [
    ["CGPA calculator", "Works here, kept on this device", "Saved history and sharing"],
    ["Practice quiz", `${quizLen} questions in each of ${courseCount} courses`, "Practice quizzes and a Final Boss quiz"],
    ["Flashcards", `A short set for each of ${courseCount} courses`, "1 to 50 generated per topic"],
    ["Your own notes, PDFs and videos", "Not available", "Upload them in My Library"],
    ["Study planner, timer, AI notes, images", "Not available", "Included"],
  ];
  return (
    <section id="download" className="bg-[#0B1020] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="min-w-0">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Get the Android app</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              ScholarMate {APP_VERSION} is an Android APK. There is no iOS version. You need a free account to download it.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href={DOWNLOAD_URL} onClick={guard} className="sm-btn-primary inline-flex items-center justify-center rounded-lg px-6 py-3 text-[15px] font-semibold text-white">
                Download APK
              </a>
              {!user && (
                <button onClick={() => navigate({ to: "/auth" })} className="sm-btn-ghost inline-flex items-center justify-center rounded-lg px-6 py-3 text-[15px] font-semibold text-white">
                  Sign in
                </button>
              )}
            </div>

            <h3 className="mt-12 text-base font-semibold text-white">Pro plans</h3>
            <p className="mt-1 text-sm text-slate-300">A free plan is available. Pro is optional. Pay by bank transfer, then upload the receipt inside the app.</p>
            <table className="mt-4 w-full text-left text-sm">
              <caption className="sr-only">Pro plan prices</caption>
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th scope="col" className="py-2 pr-3 font-medium">Plan</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Price</th>
                  <th scope="col" className="py-2 font-medium">Per day</th>
                </tr>
              </thead>
              <tbody className="text-slate-200">
                {PRO_PLANS.map((p) => (
                  <tr key={p.id} className="border-b border-white/5">
                    <th scope="row" className="py-2.5 pr-3 font-medium text-white">{p.label}</th>
                    <td className="py-2.5 pr-3">{naira(p.price)}</td>
                    <td className="py-2.5">about {naira(perDay(p.price, p.days))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-semibold text-white">In your browser or in the app</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[34rem] text-left text-sm">
                <caption className="sr-only">What you get in the browser compared with the app</caption>
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th scope="col" className="py-2 pr-4 font-medium">What</th>
                    <th scope="col" className="py-2 pr-4 font-medium">In your browser</th>
                    <th scope="col" className="py-2 font-medium">In the app</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {rows.map(([what, web, app]) => (
                    <tr key={what} className="border-b border-white/5 align-top">
                      <th scope="row" className="py-3 pr-4 font-medium text-white">{what}</th>
                      <td className="py-3 pr-4">{web}</td>
                      <td className="py-3">{app}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutDeveloper() {
  return (
    <section id="about" className="bg-[#0F172A] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Who makes it</h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-300">
              ScholarMate is designed and developed by Prince Isaac, a UNILAG student, under Prince AI Studio. For questions or bug reports, email the studio or message it on Instagram.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <img src={princeStudioLogo} width={40} height={40} alt="" className="h-10 w-10 rounded-md object-contain" loading="lazy" />
              <span className="text-lg font-semibold text-white">Prince AI Studio</span>
            </div>
            <ul className="mt-5 space-y-2 text-[15px]">
              <li><a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-300 underline underline-offset-4 hover:text-emerald-200">{CONTACT_EMAIL}</a></li>
              <li><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-300 underline underline-offset-4 hover:text-emerald-200">Instagram {INSTAGRAM_HANDLE}</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0B1020] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <img src={aceIcon} width={28} height={28} alt="" className="h-7 w-7 rounded-md object-contain" loading="lazy" />
            <span className="font-semibold text-white">ScholarMate</span>
            <span className="text-xs text-slate-400">{APP_VERSION}</span>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-slate-300">
            <Link to="/try-it-free" className="hover:text-white">Try It Free</Link>
            <Link to="/reviews" className="hover:text-white">Reviews</Link>
            <Link to="/support" className="hover:text-white">Support</Link>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">Contact</a>
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
          </nav>
        </div>
        <div className="sm-divider mt-8" />
        <p className="mt-6 text-xs text-slate-400">© 2026 Prince AI Studio. All rights reserved.</p>
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
    toast.success("You are signed in. Starting your download.");
    triggerSilentDownload(DOWNLOAD_URL);
  }, [user, loading]);
  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Features />
        <MeetAce />
        <TryItFreeTeaser />
        <ReviewsTeaser />
        <DownloadSection />
        <AboutDeveloper />
      </main>
      <Footer />
    </div>
  );
}
