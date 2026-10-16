import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { usePageTitle } from "@/hooks/use-page-title";
import { toast } from "sonner";
import aceIcon from "@/assets/app/ace-icon.webp";

export function ProfileComponent() {
  usePageTitle("Your profile");
  return <ProfilePage />;
}

const FIELD = "w-full rounded-lg border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-400";

function ProfilePage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate({ to: "/auth" }); return; }
    loadProfile();
  }, [user, authLoading]);

  async function loadProfile() {
    if (!user) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (data) {
      setFullName(data.full_name || user.user_metadata?.full_name || "");
      setAvatarUrl(data.avatar_url || user.user_metadata?.avatar_url || "");
      setHasDownloaded(data.has_downloaded || false);
    } else {
      setFullName(user.user_metadata?.full_name || "");
      setAvatarUrl(user.user_metadata?.avatar_url || "");
    }
    setLoading(false);
  }

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      avatar_url: avatarUrl,
      has_downloaded: hasDownloaded,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) { toast.error("Your profile could not be saved. Try again."); return; }
    toast.success("Profile saved.");
  }

  async function uploadAvatar(file: File) {
    if (!user) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Choose a photo under 5 MB."); return; }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `avatars/${user.id}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) { toast.error("The photo could not be uploaded. Try again."); setUploading(false); return; }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
    setUploading(false);
    toast.success("Photo updated. Select Save changes to keep it.");
  }

  const initials = fullName?.trim().charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "?";

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F172A]" role="status">
      <p className="text-slate-300">Loading your profile.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0F172A]">
        <nav aria-label="Main" className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={aceIcon} width={32} height={32} alt="" className="h-8 w-8 rounded-md object-contain" />
            <span className="font-semibold text-white">ScholarMate</span>
          </Link>
          <Link to="/" className="sm-btn-ghost rounded-lg px-3 py-2 text-xs font-semibold text-slate-100">Back to home</Link>
        </nav>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="mb-8 text-2xl font-bold text-white">Your profile</h1>

        <div className="mb-8 flex flex-col items-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-emerald-700">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Your profile photo" className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white" aria-hidden>{initials}</span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              aria-label={uploading ? "Uploading photo" : "Change profile photo"}
              className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full border-2 border-[#0F172A] bg-emerald-700 text-white hover:bg-emerald-600 disabled:opacity-60"
            >
              <Camera size={16} aria-hidden />
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAvatar(f); }} />
          <p className="mt-3 text-sm text-slate-300">{user?.email}</p>
        </div>

        <div className="space-y-5">
          <div className="sm-card space-y-5 rounded-lg p-5 sm:p-6">
            <div>
              <label htmlFor="profile-name" className="mb-1.5 block text-sm font-semibold text-slate-200">Display name</label>
              <input id="profile-name" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" placeholder="Your name" className={FIELD} />
            </div>

            <div>
              <span className="mb-1.5 block text-sm font-semibold text-slate-200">Email</span>
              <div className="w-full rounded-lg border border-white/10 px-4 py-3 text-sm text-slate-300">{user?.email}</div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 px-4 py-3">
              <div>
                <div id="downloaded-label" className="text-sm font-semibold text-white">I have downloaded the app</div>
                <div className="mt-0.5 text-sm text-slate-300">Turn this on if you already installed ScholarMate.</div>
              </div>
              <button
                role="switch"
                aria-checked={hasDownloaded}
                aria-labelledby="downloaded-label"
                onClick={() => setHasDownloaded((v) => !v)}
                className={`relative h-6 w-12 shrink-0 rounded-full ${hasDownloaded ? "bg-emerald-700" : "bg-white/20"}`}
              >
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white ${hasDownloaded ? "left-7" : "left-1"}`} />
              </button>
            </div>
          </div>

          <button onClick={saveProfile} disabled={saving} className="sm-btn-primary w-full rounded-lg px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? "Saving" : "Save changes"}
          </button>

          <button
            onClick={async () => { await signOut(); navigate({ to: "/" }); toast.success("You are signed out."); }}
            className="sm-btn-ghost w-full rounded-lg px-4 py-3 text-sm font-semibold text-slate-100"
          >
            Sign out
          </button>
        </div>
      </main>
    </div>
  );
}
