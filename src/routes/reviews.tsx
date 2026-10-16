import { Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { usePageTitle } from "@/hooks/use-page-title";
import { toast } from "sonner";
import aceIcon from "@/assets/app/ace-icon.webp";

export function ReviewsComponent() {
  usePageTitle("Reviews");
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

function StarsDisplay({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span role="img" aria-label={`${value} out of 5 stars`} className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} aria-hidden className={i <= value ? "fill-amber-400 text-amber-400" : "text-slate-500"} />
      ))}
    </span>
  );
}

function StarsInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div role="radiogroup" aria-label="Your rating" className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={value === i}
          aria-label={`${i} ${i === 1 ? "star" : "stars"}`}
          onClick={() => onChange(i)}
          className="rounded p-1"
        >
          <Star size={30} aria-hidden className={i <= value ? "fill-amber-400 text-amber-400" : "text-slate-500"} />
        </button>
      ))}
    </div>
  );
}

const FIELD = "w-full rounded-lg border border-white/15 bg-transparent px-4 py-3 text-white placeholder:text-slate-400";

function ReviewForm({ existing, displayNameDefault, userId, onSaved }: { existing: Review | null; displayNameDefault: string; userId: string; onSaved: (r: Review) => void }) {
  const [stars, setStars] = useState(existing?.stars ?? 0);
  const [text, setText] = useState(existing?.review_text ?? "");
  const [name, setName] = useState(existing?.display_name ?? displayNameDefault);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // The profile name loads after the form first renders, so fill it in once it arrives.
  useEffect(() => {
    if (!existing && displayNameDefault) setName((n) => n || displayNameDefault);
  }, [displayNameDefault, existing]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (stars < 1 || stars > 5) return setError("Choose a star rating from 1 to 5.");
    if (!name.trim()) return setError("Add a display name. It is shown next to your review.");
    setSaving(true);
    const payload = { user_id: userId, stars, review_text: text.trim() ? text.trim() : null, display_name: name.trim().slice(0, 80) };
    const { data, error: err } = await supabase.from("reviews").upsert(payload, { onConflict: "user_id" }).select().single();
    setSaving(false);
    if (err) { setError("Your review could not be saved. Check your connection and try again."); return; }
    toast.success(existing ? "Review updated." : "Thanks for your review.");
    onSaved(data as Review);
  };

  return (
    <form onSubmit={submit} className="sm-card rounded-lg p-5 sm:p-6" noValidate>
      <h2 className="text-xl font-bold text-white">{existing ? "Edit your review" : "Leave a review"}</h2>
      <p className="mt-1 text-sm text-slate-300">Reviews are public and show your display name. You can edit yours later.</p>

      <div className="mt-5">
        <span className="mb-1 block text-sm font-semibold text-slate-200">Your rating</span>
        <StarsInput value={stars} onChange={setStars} />
      </div>
      <div className="mt-5">
        <label htmlFor="review-name" className="mb-1.5 block text-sm font-semibold text-slate-200">Display name</label>
        <input id="review-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="name" className={FIELD} placeholder="How your name appears" />
      </div>
      <div className="mt-5">
        <label htmlFor="review-text" className="mb-1.5 block text-sm font-semibold text-slate-200">Review <span className="font-normal text-slate-400">(optional)</span></label>
        <textarea id="review-text" value={text} onChange={(e) => setText(e.target.value.slice(0, 300))} rows={4} maxLength={300} className={`${FIELD} resize-none`} placeholder="What do you use it for? What could be better?" />
        <div className="mt-1 text-right text-xs text-slate-400">{text.length} of 300</div>
      </div>
      {error && <p role="alert" className="mt-4 text-sm font-medium text-rose-300">{error}</p>}
      <button type="submit" disabled={saving} className="sm-btn-primary mt-5 inline-flex w-full items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto">
        {saving ? "Saving" : existing ? "Update review" : "Submit review"}
      </button>
    </form>
  );
}

function Breakdown({ reviews }: { reviews: Review[] }) {
  const total = reviews.length;
  return (
    <ul className="space-y-2">
      {[5, 4, 3, 2, 1].map((s) => {
        const n = reviews.filter((r) => r.stars === s).length;
        const pct = total ? (n / total) * 100 : 0;
        return (
          <li key={s} className="flex items-center gap-3">
            <span className="w-14 text-sm font-medium text-slate-200">{s} {s === 1 ? "star" : "stars"}</span>
            <div className="h-2 flex-1 overflow-hidden rounded bg-white/10">
              <div className="h-full bg-emerald-400" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-8 text-right text-sm text-slate-300">{n}</span>
          </li>
        );
      })}
    </ul>
  );
}

function ReviewCard({ r }: { r: Review }) {
  const date = new Date(r.created_at).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });
  const initial = r.display_name.trim().charAt(0).toUpperCase() || "?";
  return (
    <li className="sm-card rounded-lg p-5">
      <div className="flex items-start gap-3">
        <div aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">{initial}</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-white">{r.display_name}</span>
            <span className="text-xs text-slate-400">{date}</span>
          </div>
          <div className="mt-1"><StarsDisplay value={r.stars} /></div>
          {r.review_text && <p className="mt-3 text-sm leading-relaxed text-slate-200">{r.review_text}</p>}
        </div>
      </div>
    </li>
  );
}

function ReviewsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [sort, setSort] = useState<SortKey>("recent");
  const [profileName, setProfileName] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    if (error) { setStatus("error"); return; }
    setReviews((data as Review[]) ?? []);
    setStatus("ready");
  }, []);

  useEffect(() => { load(); }, [load]);

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
    const byDate = (a: Review, b: Review) => +new Date(b.created_at) - +new Date(a.created_at);
    if (sort === "recent") arr.sort(byDate);
    if (sort === "highest") arr.sort((a, b) => b.stars - a.stars || byDate(a, b));
    if (sort === "lowest") arr.sort((a, b) => a.stars - b.stars || byDate(a, b));
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
      <header className="border-b border-white/10 bg-[#0F172A]">
        <nav aria-label="Main" className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3 sm:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <img src={aceIcon} width={32} height={32} alt="" className="h-8 w-8 shrink-0 rounded-md object-contain" />
            <span className="truncate text-base font-semibold tracking-tight text-white">ScholarMate</span>
          </Link>
          <Link to="/" className="sm-btn-ghost shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-slate-100">Back to home</Link>
        </nav>
      </header>

      <main className="px-4 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Reviews</h1>
          <p className="mt-3 max-w-xl text-base text-slate-300">
            What people who use ScholarMate say about it. Anyone with an account can leave one.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="sm-card rounded-lg p-5 sm:p-6">
              {status === "ready" && total > 0 ? (
                <>
                  <p className="text-5xl font-bold text-white">{avg.toFixed(1)}<span className="text-2xl font-medium text-slate-400"> out of 5</span></p>
                  <div className="mt-3"><StarsDisplay value={Math.round(avg)} size={20} /></div>
                  <p className="mt-2 text-sm text-slate-300">From {total} {total === 1 ? "review" : "reviews"}</p>
                </>
              ) : (
                <p className="text-sm text-slate-300">
                  {status === "loading" ? "Loading ratings." : status === "error" ? "Ratings could not load." : "No ratings yet."}
                </p>
              )}
            </div>
            <div className="sm-card rounded-lg p-5 sm:p-6">
              <h2 className="mb-3 text-sm font-semibold text-slate-200">Rating breakdown</h2>
              <Breakdown reviews={reviews} />
            </div>
          </div>

          <div className="mt-10">
            {authLoading ? null : user ? (
              <ReviewForm key={myReview?.id ?? "new"} existing={myReview} userId={user.id} displayNameDefault={profileName} onSaved={onSaved} />
            ) : (
              <div className="sm-card rounded-lg p-6">
                <h2 className="text-xl font-bold text-white">Leave a review</h2>
                <p className="mt-2 text-sm text-slate-300">You need an account to review, so every review comes from a real user. Reading reviews does not need one.</p>
                <button onClick={() => navigate({ to: "/auth" })} className="sm-btn-primary mt-4 inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white">Sign in to review</button>
              </div>
            )}
          </div>

          <div className="mt-12">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">All reviews</h2>
              <div className="flex items-center gap-2">
                <label htmlFor="review-sort" className="text-sm font-medium text-slate-300">Sort by</label>
                <select id="review-sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="rounded-lg border border-white/15 bg-[#0F172A] px-3 py-2 text-sm text-white">
                  <option value="recent">Most recent</option>
                  <option value="highest">Highest rated</option>
                  <option value="lowest">Lowest rated</option>
                </select>
              </div>
            </div>
            {status === "loading" && <p className="py-8 text-slate-300">Loading reviews.</p>}
            {status === "error" && (
              <div role="alert" className="sm-card rounded-lg p-6">
                <p className="text-slate-200">Reviews could not be loaded. Check your connection and try again.</p>
                <button onClick={load} className="sm-btn-ghost mt-3 rounded-lg px-4 py-2 text-sm font-semibold text-slate-100">Try again</button>
              </div>
            )}
            {status === "ready" && sorted.length === 0 && (
              <div className="sm-card rounded-lg p-6">
                <p className="text-slate-200">There are no reviews yet. Yours would be the first.</p>
              </div>
            )}
            {status === "ready" && sorted.length > 0 && (
              <ul className="grid gap-4 sm:grid-cols-2">{sorted.map((r) => <ReviewCard key={r.id} r={r} />)}</ul>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-slate-400">
        © 2026 Prince AI Studio · <Link to="/privacy" className="hover:text-white">Privacy</Link> · <Link to="/terms" className="hover:text-white">Terms</Link>
      </footer>
    </div>
  );
}
