import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import aceIcon from "@/assets/app/ace-icon.png";

export function ProfileComponent() {
  return <ProfilePage />;
}

function ProfilePage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate({ to: '/auth' }); return; }
    loadProfile();
  }, [user, authLoading]);

  async function loadProfile() {
    if (!user) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    if (data) {
      setFullName(data.full_name || user.user_metadata?.full_name || '');
      setAvatarUrl(data.avatar_url || user.user_metadata?.avatar_url || '');
      setHasDownloaded(data.has_downloaded || false);
    } else {
      setFullName(user.user_metadata?.full_name || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
    }
    setLoading(false);
  }

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: fullName,
      avatar_url: avatarUrl,
      has_downloaded: hasDownloaded,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Profile saved!');
  }

  async function uploadAvatar(file: File) {
    if (!user) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `avatars/${user.id}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (uploadError) { toast.error('Upload failed'); setUploading(false); return; }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
    setUploading(false);
    toast.success('Photo updated!');
  }

  const initials = fullName?.trim().charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?';

  if (loading) return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
      <div className="text-slate-400">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100">
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={aceIcon} alt="" className="h-7 w-7 rounded-lg object-contain" />
            <span className="font-semibold text-white">ScholarMate</span>
          </Link>
          <Link to="/" className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10">← Home</Link>
        </div>
      </nav>

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-bold text-white mb-8">My Profile</h1>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500/40 bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white">{initials}</span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-indigo-600 border-2 border-[#0F172A] flex items-center justify-center text-white text-sm hover:bg-indigo-500 transition"
            >
              {uploading ? '...' : '📷'}
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAvatar(f); }} />
          <p className="mt-3 text-sm text-slate-400">{user?.email}</p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div className="sm-card rounded-2xl p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Display Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email</label>
              <div className="w-full rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-slate-400 text-sm">{user?.email}</div>
            </div>

            {/* Downloaded toggle */}
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-white">Downloaded ScholarMate</div>
                <div className="text-xs text-slate-400 mt-0.5">Mark if you've already downloaded the app</div>
              </div>
              <button
                onClick={() => setHasDownloaded((v) => !v)}
                className={`w-12 h-6 rounded-full transition-colors relative ${hasDownloaded ? 'bg-indigo-600' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${hasDownloaded ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            onClick={async () => { await signOut(); navigate({ to: '/' }); toast.success('Signed out'); }}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}