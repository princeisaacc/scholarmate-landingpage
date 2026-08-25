import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const ADMIN_EMAIL = "isaacajayi411@gmail.com";

// ── Types ──────────────────────────────────────────────────────────────────
type Convo = {
  id: string;
  user_id: string | null;
  session_id: string;
  role: "user" | "ace";
  message: string;
  created_at: string;
};

type Review = {
  id: string;
  user_id: string;
  stars: number;
  review_text: string | null;
  display_name: string;
  created_at: string;
};

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  has_downloaded: boolean | null;
  updated_at: string | null;
  email?: string;
};

type Tab = "conversations" | "reviews" | "users";

// ── Helpers ────────────────────────────────────────────────────────────────
function fmt(ts: string) {
  return new Date(ts).toLocaleString("en-NG", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function shortId(id: string) {
  return id.slice(0, 8) + "…";
}

// ── Sub-components ─────────────────────────────────────────────────────────
function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 24px" }}>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span style={{ color: "#FBBF24", fontSize: 14 }}>
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
}

// ── Conversations Tab ──────────────────────────────────────────────────────
function ConversationsTab({ convos, profiles }: { convos: Convo[]; profiles: Profile[] }) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  // Group by session_id
  const sessions: Record<string, Convo[]> = {};
  convos.forEach((c) => {
    if (!sessions[c.session_id]) sessions[c.session_id] = [];
    sessions[c.session_id].push(c);
  });

  const sessionList = Object.entries(sessions)
    .map(([sid, msgs]) => {
      const userId = msgs.find((m) => m.user_id)?.user_id ?? null;
      const profile = profiles.find((p) => p.id === userId);
      const name = profile?.full_name || profile?.email || (userId ? shortId(userId) : "Guest");
      const last = msgs[msgs.length - 1];
      return { sid, msgs, userId, name, last, isGuest: !userId };
    })
    .filter((s) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.sid.toLowerCase().includes(q) ||
        s.msgs.some((m) => m.message.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => new Date(b.last.created_at).getTime() - new Date(a.last.created_at).getTime());

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, session ID, or message…"
        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 16px", color: "#fff", fontSize: 14, outline: "none", marginBottom: 20, boxSizing: "border-box" }}
      />
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>{sessionList.length} conversation{sessionList.length !== 1 ? "s" : ""}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sessionList.map(({ sid, msgs, name, last, isGuest }) => (
          <div key={sid} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
            {/* Header row */}
            <button
              onClick={() => setExpanded(expanded === sid ? null : sid)}
              style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, textAlign: "left" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: isGuest ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg,#7C3AED,#5B21B6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {isGuest ? "?" : name.charAt(0).toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {name} {isGuest && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>· Guest</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                    {msgs.length} messages · {fmt(last.created_at)}
                  </div>
                </div>
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 18, flexShrink: 0 }}>{expanded === sid ? "▲" : "▼"}</div>
            </button>

            {/* Expanded messages */}
            {expanded === sid && (
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10, maxHeight: 420, overflowY: "auto" }}>
                {msgs.map((m) => (
                  <div key={m.id} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>
                    {m.role === "ace" && (
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(124,58,237,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", flexShrink: 0 }}>A</div>
                    )}
                    <div style={{ maxWidth: "75%", padding: "8px 12px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "4px 14px 14px 14px", background: m.role === "user" ? "rgba(124,58,237,0.35)" : "rgba(255,255,255,0.07)", color: "#fff", fontSize: 13, lineHeight: 1.6 }}>
                      {m.message}
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", flexShrink: 0, alignSelf: "flex-end" }}>
                      {new Date(m.created_at).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Reviews Tab ────────────────────────────────────────────────────────────
function ReviewsTab({ reviews, profiles }: { reviews: Review[]; profiles: Profile[] }) {
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.stars, 0) / reviews.length : 0;
  const sorted = [...reviews].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Reviews" value={reviews.length} />
        <StatCard label="Avg Rating" value={avg.toFixed(1) + " ★"} />
        <StatCard label="5-Star" value={reviews.filter((r) => r.stars === 5).length} />
        <StatCard label="1–2 Star" value={reviews.filter((r) => r.stars <= 2).length} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sorted.map((r) => {
          const profile = profiles.find((p) => p.id === r.user_id);
          const email = profile?.email || shortId(r.user_id);
          return (
            <div key={r.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#5B21B6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                {r.display_name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                  <div>
                    <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{r.display_name}</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginLeft: 8 }}>{email}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{fmt(r.created_at)}</span>
                </div>
                <div style={{ marginTop: 4 }}><Stars n={r.stars} /></div>
                {r.review_text && <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 8, lineHeight: 1.6 }}>{r.review_text}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Users Tab ──────────────────────────────────────────────────────────────
function UsersTab({ profiles }: { profiles: Profile[] }) {
  const [search, setSearch] = useState("");
  const filtered = profiles.filter((p) => {
    const q = search.toLowerCase();
    return (
      (p.full_name || "").toLowerCase().includes(q) ||
      (p.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email…"
        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 16px", color: "#fff", fontSize: 14, outline: "none", marginBottom: 20, boxSizing: "border-box" }}
      />
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>{filtered.length} user{filtered.length !== 1 ? "s" : ""}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((p) => {
          const initials = (p.full_name || p.email || "?").charAt(0).toUpperCase();
          return (
            <div key={p.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: p.avatar_url ? "transparent" : "linear-gradient(135deg,#7C3AED,#5B21B6)", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {p.avatar_url ? <img src={p.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{initials}</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{p.full_name || <span style={{ color: "rgba(255,255,255,0.3)" }}>No name set</span>}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{p.email || shortId(p.id)}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: p.has_downloaded ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)", color: p.has_downloaded ? "#4ADE80" : "rgba(255,255,255,0.3)", border: `1px solid ${p.has_downloaded ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.08)"}` }}>
                  {p.has_downloaded ? "✓ Downloaded" : "Not downloaded"}
                </span>
                {p.updated_at && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>Updated {fmt(p.updated_at)}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Admin Page ────────────────────────────────────────────────────────
export function AdminComponent() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("conversations");
  const [convos, setConvos] = useState<Convo[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth guard
  useEffect(() => {
    if (authLoading) return;
    if (!user || user.email !== ADMIN_EMAIL) {
      navigate({ to: "/" });
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) return;
    async function load() {
      setLoading(true);
      const [convosRes, reviewsRes, profilesRes, usersRes] = await Promise.all([
        supabase.from("support_conversations").select("*").order("created_at", { ascending: true }),
        supabase.from("reviews").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*"),
        supabase.auth.admin?.listUsers?.() ?? Promise.resolve({ data: { users: [] } }),
      ]);

      const rawProfiles: Profile[] = (profilesRes.data ?? []) as Profile[];

      // Try to attach emails from auth.users if admin API is available
      const authUsers = (usersRes as any)?.data?.users ?? [];
      const profilesWithEmail = rawProfiles.map((p) => {
        const au = authUsers.find((u: any) => u.id === p.id);
        return { ...p, email: au?.email };
      });

      setConvos((convosRes.data ?? []) as Convo[]);
      setReviews((reviewsRes.data ?? []) as Review[]);
      setProfiles(profilesWithEmail);
      setLoading(false);
    }
    load();
  }, [user]);

  if (authLoading || (!user && !authLoading)) return null;
  if (user?.email !== ADMIN_EMAIL) return null;

  const sessions = new Set(convos.map((c) => c.session_id)).size;
  const signedInUsers = new Set(convos.filter((c) => c.user_id).map((c) => c.user_id)).size;
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1) : "—";

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "conversations", label: "💬 Conversations", count: sessions },
    { key: "reviews", label: "⭐ Reviews", count: reviews.length },
    { key: "users", label: "👥 Users", count: profiles.length },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#080C18", color: "#fff", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(8,12,24,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>ScholarMate Admin</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Welcome back, Isaac 👋</div>
          </div>
          <button
            onClick={() => navigate({ to: "/" })}
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "7px 16px", color: "rgba(255,255,255,0.7)", fontSize: 13, cursor: "pointer" }}
          >
            ← Home
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 32 }}>
          <StatCard label="Total Users" value={profiles.length} />
          <StatCard label="Signed-In Chatters" value={signedInUsers} />
          <StatCard label="Chat Sessions" value={sessions} />
          <StatCard label="Messages Sent" value={convos.filter((c) => c.role === "user").length} />
          <StatCard label="Reviews" value={reviews.length} sub={`Avg ${avgRating} ★`} />
          <StatCard label="Downloaded" value={profiles.filter((p) => p.has_downloaded).length} sub="of total users" />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{ padding: "9px 18px", borderRadius: 24, fontSize: 14, fontWeight: 600, cursor: "pointer", border: tab === t.key ? "1px solid rgba(124,58,237,0.6)" : "1px solid rgba(255,255,255,0.08)", background: tab === t.key ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.04)", color: tab === t.key ? "#C4B5FD" : "rgba(255,255,255,0.55)", transition: "all 0.15s" }}
            >
              {t.label} <span style={{ fontSize: 12, opacity: 0.6 }}>({t.count})</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)", fontSize: 15 }}>Loading data…</div>
        ) : (
          <>
            {tab === "conversations" && <ConversationsTab convos={convos} profiles={profiles} />}
            {tab === "reviews" && <ReviewsTab reviews={reviews} profiles={profiles} />}
            {tab === "users" && <UsersTab profiles={profiles} />}
          </>
        )}
      </div>
    </div>
  );
}