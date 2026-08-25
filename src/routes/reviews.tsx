import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import owlImg from "@/assets/owl.png";

export function ReviewsComponent() {
  return <ReviewsPage />;
}

type Review = {
  id: string;
  user_id: string;
  stars: number;
  review_text: string | null;
  display_name: string;
  created_at: string;
};

type SortKey = "recent" | "highest" | "lowest";

function Stars({ value, onChange, size = "text-2xl" }: { value: number; onChange?: (n: number) => void; size?: string }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= active;
        const interactive = !!onChange;
        return (
          <button key={i} type="button" disabled={!interactive} onClick={() => onChange?.(i)}
            onMouseEnter={() => interactive && setHover(i)} onMouseLeave={() => interactive && setHover(0)}
            className={`${size} leading-none transition-transform ${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} ${filled ? "text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" : "text-slate-600"}`}
            aria-label={`${i} star${i > 1 ? "s" : ""}`}>★</button>
        );
      })}
    </div>
  );
}

function ReviewForm({ existing, displayNameDefault, userId, onSaved }: { existing: Review | null; displayNameDefault: string; userId: string; onSaved: (r: Review) => void }) {
  const [stars, setStars] = useState(existing?.stars ?? 0);
  const [text, setText] = useState(existing?.review_text ?? "");
  const [name, setName] = useState(existing?.display_name ?? displayNameDefault);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stars < 1 || stars > 5) return toast.error("Pick a star rating");
    if (!name.trim()) return toast.error("Add a display name");
    if (text.length > 300) return toast.error("Review must be 300 characters or less");
    setSaving(true);
    const payload = { user_id: userId, stars, review_text: text.trim() ? text.trim() : null, display_name: name.trim().slice(0, 80) };
    const { data, error } = await supabase.from("reviews").upsert(payload, { onConflict: "user_id" }).select().single();
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(existing ? "Review updated" : "Thanks for your review!");
    onSaved(data as Review);
  };

  return (
    <form onSubmit={submit} className="sm-card rounded-3xl p-6 sm:p-8">
      <h3 className="text-xl font-bold text-white sm:text-2xl">{existing ? "Edit your review" : "Leave your review"}</h3>
      <p className="mt-1 text-sm text-slate-400">Tap the stars to rate ScholarMate.</p>
      <div className="mt-5">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Your rating</label>
        <Stars value={stars} onChange={setStars} size="text-3xl" />
      </div>
      <div className="mt-5">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Display name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-violet-400/50"
          placeholder="How should we display your name?" />
      </div>
      <div className="mt-5">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Review <span className="text-slate-500">(optional)</span></label>
        <textarea value={text} onChange={(e) => setText(e.target.value.slice(0, 300))} rows={4} maxLength={300}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-violet-400/50"
          placeholder="What do you love? What could be better?" />
        <div className="mt-1 text-right text-xs text-slate-500">{text.length}/300</div>
      </div>
      <button type="submit" disabled={saving} className="sm-btn-primary mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto">
        {saving ? "Saving…" : existing ? "Update review" : "Submit review"}
      </button>
    </form>
  );
}

function Breakdown({ reviews }: { reviews: Review[] }) {
  const total = reviews.length;
  const counts = [5, 4, 3, 2, 1].map((s) => ({ s, n: reviews.filter((r) => r.stars === s).length }));
  return (
    <div className="space-y-2">
      {counts.map(({ s, n }) => {
        const pct = total ? (n / total) * 100 : 0;
        return (
          <div key={s} className="flex items-center gap-3">
            <div className="w-10 text-sm font-semibold text-slate-300">{s}★</div>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
            <div className="w-10 text-right text-xs text-slate-400">{n}</div>
          </div>
        );
      })}
    </div>
  );
}

function ReviewCard({ r }: { r: Review }) {
  const date = new Date(r.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  const initial = r.display_name.trim().charAt(0).toUpperCase() || "?";
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4 }} className="sm-card rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">{initial}</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-semibold text-white">{r.display_name}</div>
            <div className="text-xs text-slate-500">{date}</div>
          </div>
          <div className="mt-1"><Stars value={r.stars} size="text-base" /></div>
          {r.review_text && <p className="mt-3 text-sm leading-relaxed text-slate-300">{r.review_text}</p>}
        </div>
      </div>
    </motion.div>
  );
}

function ReviewsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>("recent");
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
      if (!alive) return;
      if (error) toast.error(error.message);
      setReviews((data as Review[]) ?? []);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
      const fallback = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "";
      setProfileName((data?.full_name as string) || fallback);
    })();
  }, [user]);

  const myReview = useMemo(() => (user ? reviews.find((r) => r.user_id === user.id) ?? null : null), [reviews, user]);
  const sorted = useMemo(() => {
    const arr = [...reviews];
    if (sort === "recent") arr.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    if (sort === "highest") arr.sort((a, b) => b.stars - a.stars || +new Date(b.created_at) - +new Date(a.created_at));
    if (sort === "lowest") arr.sort((a, b) => a.stars - b.stars || +new Date(b.created_at) - +new Date(a.created_at));
    return arr;
  }, [reviews, sort]);

  const total = reviews.length;
  const avg = total ? reviews.reduce((s, r) => s + r.stars, 0) / total : 0;
  const onSaved = (r: Review) => {
    setReviews((prev) => {
      const i = prev.findIndex((x) => x.user_id === r.user_id);
      if (i === -1) return [r, ...prev];
      const copy = [...prev]; copy[i] = r; return copy;
    });
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100">
      <nav className="border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-8 sm:py-4">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <img src={owlImg} alt="ScholarMate owl" className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9" />
            <span className="truncate text-base font-bold tracking-tight text-white sm:text-lg">ScholarMate</span>
          </Link>
          <Link to="/" className="shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 sm:text-sm">← Home</Link>
        </div>
      </nav>

      <section className="relative px-4 py-12 sm:px-8 sm:py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <img src={owlImg} alt="" className="mx-auto mb-5 h-16 w-16 object-contain sm-owl-float sm:mb-6 sm:h-20 sm:w-20" />
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Reviews</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Rate <span className="sm-gradient-text">ScholarMate</span></h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-slate-300 sm:text-lg">Tell us how ScholarMate is helping you study smarter. Your feedback shapes the app.</p>
          </div>

          <div className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-2">
            <div className="sm-card rounded-3xl p-6 text-center sm:p-8">
              <div className="text-6xl font-extrabold text-white"><span className="sm-gradient-text">{avg.toFixed(1)}</span><span className="text-3xl text-slate-500"> / 5</span></div>
              <div className="mt-3 flex justify-center"><Stars value={Math.round(avg)} size="text-2xl" /></div>
              <div className="mt-3 text-sm text-slate-400">Based on {total} {total === 1 ? "review" : "reviews"}</div>
            </div>
            <div className="sm-card rounded-3xl p-6 sm:p-8">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Rating breakdown</h3>
              <Breakdown reviews={reviews} />
            </div>
          </div>

          <div className="mt-12">
            {authLoading ? null : user ? (
              <ReviewForm existing={myReview} userId={user.id} displayNameDefault={profileName} onSaved={onSaved} />
            ) : (
              <div className="sm-card rounded-3xl p-8 text-center">
                <div className="text-3xl">🔒</div>
                <h3 className="mt-3 text-xl font-bold text-white">Log in to leave your review</h3>
                <p className="mt-2 text-sm text-slate-400">Sign in with Google or email to rate ScholarMate.</p>
                <button onClick={() => navigate({ to: "/auth" })} className="sm-btn-primary mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white">Sign in</button>
              </div>
            )}
          </div>

          <div className="mt-14">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">What students say</h2>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sort</label>
                <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-violet-400/50">
                  <option value="recent" className="bg-[#0F172A]">Most Recent</option>
                  <option value="highest" className="bg-[#0F172A]">Highest Rated</option>
                  <option value="lowest" className="bg-[#0F172A]">Lowest Rated</option>
                </select>
              </div>
            </div>
            {loading ? (
              <div className="py-12 text-center text-slate-400">Loading reviews…</div>
            ) : sorted.length === 0 ? (
              <div className="sm-card rounded-3xl p-10 text-center"><div className="text-4xl">🦉</div><p className="mt-3 text-slate-300">No reviews yet — be the first!</p></div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">{sorted.map((r) => <ReviewCard key={r.id} r={r} />)}</div>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#060912] px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <img src={owlImg} alt="" className="h-7 w-7 object-contain" />
            <span className="font-bold text-white">ScholarMate</span>
          </div>
          <p className="text-sm text-slate-400">© 2026 Prince Isaac · ScholarMate v7.0 · Made with <span className="text-rose-400">❤</span> for UNILAG students</p>
        </div>
      </footer>
    </div>
  );
}
