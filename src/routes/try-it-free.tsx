import { Link } from "@tanstack/react-router";
import aceIcon from "@/assets/app/ace-icon.webp";
import { TryItFreeTabs } from "@/components/try-it-free-tabs";
import { usePageTitle } from "@/hooks/use-page-title";

export function TryItFreeComponent() {
  usePageTitle("Try it free");
  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1020]">
        <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={aceIcon} width={32} height={32} alt="" className="h-8 w-8 rounded-md object-contain" />
            <span className="text-base font-semibold tracking-tight text-white">ScholarMate</span>
          </Link>
          <Link to="/" className="sm-btn-ghost rounded-lg px-4 py-2 text-sm font-semibold text-slate-100">Back to home</Link>
        </nav>
      </header>

      <main>
        <TryItFreeTabs />

        <section className="border-t border-white/10 px-4 py-12 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-semibold text-white">Want the rest?</h2>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">
              The app adds the study planner, timer, AI notes, image generation, and uploads from your own notes, PDFs and videos.
            </p>
            <Link to="/" hash="download" className="sm-btn-primary mt-4 inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white">
              See what the app adds
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-8 text-center text-sm text-slate-400">
        © 2026 Prince AI Studio · <Link to="/privacy" className="hover:text-white">Privacy</Link> · <Link to="/terms" className="hover:text-white">Terms</Link>
      </footer>
    </div>
  );
}
