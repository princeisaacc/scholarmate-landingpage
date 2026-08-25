import { Link } from "@tanstack/react-router";
import aceIcon from "@/assets/app/ace-icon.png";
import { TryItFreeTabs } from "@/components/try-it-free-tabs";

export function TryItFreeComponent() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0B1020]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={aceIcon} alt="" className="h-7 w-7 rounded-lg object-contain sm:h-8 sm:w-8" />
            <span className="text-[15px] font-semibold tracking-tight text-white">ScholarMate</span>
          </Link>
          <Link
            to="/"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 sm:text-sm"
          >
            ← Back home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <TryItFreeTabs />

      {/* Bottom CTA */}
      <section className="border-t border-white/5 py-16 text-center">
        <p className="text-sm text-slate-400 mb-4">Ready for the full experience?</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-[15px] font-semibold text-white transition hover:bg-indigo-500"
        >
          Download ScholarMate →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0B1020] px-4 py-8 text-center">
        <p className="text-xs text-slate-500">© 2026 Prince AI Studio · All rights reserved.</p>
      </footer>
    </div>
  );
}