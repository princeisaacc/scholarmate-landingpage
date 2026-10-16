import { Link, Outlet } from "@tanstack/react-router";
import { usePageTitle } from "@/hooks/use-page-title";

export function RootComponent() {
  return <Outlet />;
}

export function NotFoundComponent() {
  usePageTitle("Page not found");
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B1020] px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">Error 404</p>
        <h1 className="mt-3 text-3xl font-bold text-white">This page does not exist</h1>
        <p className="mt-3 text-slate-300">The link may be old or mistyped. These pages will get you moving again.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/" className="sm-btn-primary inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white">Go to the home page</Link>
          <Link to="/try-it-free" className="sm-btn-ghost inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-100">Try the free tools</Link>
        </div>
      </div>
    </main>
  );
}
