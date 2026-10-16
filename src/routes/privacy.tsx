import { Link } from "@tanstack/react-router";
import aceIcon from "@/assets/app/ace-icon.webp";
import { usePageTitle } from "@/hooks/use-page-title";
import { CONTACT_EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/site";

export function PrivacyComponent() {
  usePageTitle("Privacy Policy");
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0F172A]">
        <nav aria-label="Main">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={aceIcon} alt="" className="h-8 w-8 rounded-lg object-contain" />
            <span className="font-bold text-white">ScholarMate</span>
          </Link>
          <Link to="/" className="sm-btn-ghost rounded-lg px-3 py-2 text-xs font-semibold text-slate-100">
            Back to home
          </Link>
        </div>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-400">Last updated: July 2026</p>

        <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-slate-300">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Who We Are</h2>
            <p>ScholarMate is an AI-powered study companion app designed for university students. It is developed and maintained by <span className="text-white font-medium">Prince AI Studio</span>. If you have any questions about this policy, contact us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-300 underline underline-offset-2">{CONTACT_EMAIL}</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>
            <p>We collect only what is necessary to provide the service:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-slate-400">
              <li><span className="text-slate-300">Account information</span>: your name and email address when you sign up or sign in with Google.</li>
              <li><span className="text-slate-300">Usage data</span>: basic app interactions to improve features (no keylogging or sensitive content capture).</li>
              <li><span className="text-slate-300">Reviews</span>: display name, star rating, and review text you choose to submit publicly.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Information</h2>
            <ul className="mt-3 space-y-2 list-disc list-inside text-slate-400">
              <li>To authenticate you and manage your account.</li>
              <li>To deliver the app download to verified users.</li>
              <li>To display your public reviews on the ScholarMate website.</li>
              <li>To improve the app and fix bugs.</li>
            </ul>
            <p className="mt-4 text-emerald-300 font-medium">We do not sell, rent, or share your personal data with third parties for marketing purposes. Ever.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Google Sign-In</h2>
            <p>When you sign in with Google, we only receive your name and email address. We do not access your Google Drive, Gmail, contacts, or any other Google data. Your Google account password is never seen or stored by us.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Data Storage</h2>
            <p>Your data is stored securely using <span className="text-white font-medium">Supabase</span>, a trusted cloud database provider. Data is encrypted at rest and in transit. We retain your data for as long as your account is active. You may request deletion at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-slate-400">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and all associated data.</li>
              <li>Withdraw consent at any time by deleting your account.</li>
            </ul>
            <p className="mt-4">To exercise any of these rights, email us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-300 underline underline-offset-2">{CONTACT_EMAIL}</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Cookies</h2>
            <p>We use only essential session cookies to keep you logged in. We do not use tracking cookies, advertising cookies, or third-party analytics cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Children's Privacy</h2>
            <p>ScholarMate is intended for university students aged 16 and above. We do not knowingly collect data from children under 13. If you believe a child has provided us with personal data, please contact us and we will delete it immediately.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Changes to This Policy</h2>
            <p>We may update this policy from time to time. We will notify users of significant changes via the app or website. Continued use of ScholarMate after changes means you accept the updated policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Contact</h2>
            <p>Questions? Reach us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-300 underline underline-offset-2">{CONTACT_EMAIL}</a> or on Instagram <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:underline">{INSTAGRAM_HANDLE}</a>.</p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-[#060912] px-5 py-8 mt-16 text-center text-sm text-slate-400">
        © 2026 Prince AI Studio · <Link to="/terms" className="hover:text-white">Terms</Link> · <Link to="/privacy" className="hover:text-white">Privacy</Link>
      </footer>
    </div>
  );
}
