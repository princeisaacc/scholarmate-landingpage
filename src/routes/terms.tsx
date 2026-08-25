import { Link } from "@tanstack/react-router";
import aceIcon from "@/assets/app/ace-icon.png";

export function TermsComponent() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100">
      <nav className="border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={aceIcon} alt="" className="h-8 w-8 rounded-lg object-contain" />
            <span className="font-bold text-white">ScholarMate</span>
          </Link>
          <Link to="/" className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10">
            ← Home
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">Terms of Use</h1>
        <p className="mt-2 text-sm text-slate-400">Last updated: July 2026</p>

        <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-slate-300">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By downloading, installing, or using ScholarMate, you agree to be bound by these Terms of Use. If you do not agree to these terms, do not use the app or this website. ScholarMate is developed by <span className="text-white font-medium">Prince Isaac</span>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Description of Service</h2>
            <p>ScholarMate is a free AI-powered study companion application for university students. Features include AI-generated notes, flashcards, quizzes, a CGPA calculator, study planner, study timer, and more. The app is provided free of charge and is intended for personal, academic use only.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Eligibility</h2>
            <p>You must be at least 13 years old to use ScholarMate. By using the app, you confirm that you are old enough to agree to these terms. ScholarMate is primarily designed for university students in Nigeria and beyond.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Account Responsibility</h2>
            <p>You are responsible for keeping your account credentials secure. Do not share your password with others. You are responsible for all activity that occurs under your account. Notify us immediately at <a href="mailto:princeaistudio@gmail.com" className="text-indigo-400 hover:underline">princeaistudio@gmail.com</a> if you suspect unauthorized access.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Acceptable Use</h2>
            <p>You agree to use ScholarMate only for lawful, academic purposes. You must not:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-slate-400">
              <li>Use the app to cheat in examinations or violate your institution's academic integrity policies.</li>
              <li>Attempt to reverse-engineer, hack, or tamper with the app or its backend.</li>
              <li>Use the app to generate or distribute harmful, offensive, or illegal content.</li>
              <li>Share or resell the app download link or your account with others.</li>
              <li>Attempt to overload or disrupt the service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. AI-Generated Content</h2>
            <p>ScholarMate uses AI to generate study notes, flashcards, quizzes, and other content. While we strive for accuracy, AI-generated content may occasionally be incorrect or incomplete. You should always verify important information with trusted academic sources. We are not responsible for academic decisions made based solely on AI-generated content.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Intellectual Property</h2>
            <p>ScholarMate, its name, logo, Ace mascot, and all associated content are the intellectual property of Prince AI Studio. You may not copy, reproduce, or distribute any part of the app or website without written permission. Content you create using the app (your notes, saved data) remains yours.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. User Reviews</h2>
            <p>By submitting a review on this website, you grant Prince AI Studio a non-exclusive, royalty-free license to display that review publicly. You are responsible for the content of your review. We reserve the right to remove reviews that are abusive, false, or violate these terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Availability & Updates</h2>
            <p>We aim to keep ScholarMate available at all times, but we cannot guarantee uninterrupted service. We may update, modify, or temporarily suspend the app at any time without prior notice. We will always try to communicate major changes in advance.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Limitation of Liability</h2>
            <p>ScholarMate is provided "as is" without warranty of any kind. Prince AI Studio is not liable for any indirect, incidental, or consequential damages arising from your use of the app, including but not limited to academic performance outcomes, data loss, or service interruptions.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">11. Termination</h2>
            <p>We reserve the right to suspend or delete accounts that violate these terms, without prior notice. You may delete your account at any time by contacting us. Upon termination, your access to the app and any stored data may be removed.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">12. Changes to Terms</h2>
            <p>We may update these Terms of Use from time to time. We will notify users of material changes via the app or website. Continued use of ScholarMate after changes are posted constitutes your acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">13. Governing Law</h2>
            <p>These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes will be resolved in accordance with Nigerian law.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">14. Contact</h2>
            <p>For questions about these terms, contact us at <a href="mailto:princeaistudio@gmail.com" className="text-indigo-400 hover:underline">princeaistudio@gmail.com</a>.</p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-[#060912] px-5 py-8 mt-16 text-center text-sm text-slate-500">
        © 2026 Prince AI Studio · <Link to="/terms" className="hover:text-white">Terms</Link> · <Link to="/privacy" className="hover:text-white">Privacy</Link>
      </footer>
    </div>
  );
}
