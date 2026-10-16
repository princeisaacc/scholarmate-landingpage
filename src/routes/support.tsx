import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Send } from "lucide-react";
import aceIcon from "@/assets/app/ace-icon.webp";
import aceSupport from "@/assets/ace_support.webp";
import { useAceChat } from "@/hooks/use-ace-chat";
import { usePageTitle } from "@/hooks/use-page-title";
import { GUEST_LIMIT } from "@/lib/aceChat";
import { CONTACT_EMAIL } from "@/lib/site";

export function SupportComponent() {
  usePageTitle("Support");
  const chat = useAceChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ block: "end" }); }, [chat.messages, chat.loading]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#0F172A]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0F172A]">
        <nav aria-label="Main" className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={aceIcon} width={32} height={32} alt="" className="h-8 w-8 rounded-md object-contain" />
            <span className="font-semibold text-white">ScholarMate</span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={chat.clear} className="sm-btn-ghost rounded-lg px-3 py-2 text-xs font-medium text-slate-200">Clear chat</button>
            <Link to="/" className="sm-btn-ghost rounded-lg px-3 py-2 text-xs font-semibold text-slate-100">Back to home</Link>
          </div>
        </nav>
      </header>

      <div className="border-b border-white/10 bg-emerald-800 px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <img src={aceSupport} width={48} height={48} alt="" className="h-12 w-12 rounded-full bg-black/20 object-contain" />
          <div>
            <h1 className="text-lg font-semibold text-white">Ace, ScholarMate support</h1>
            <p className="text-sm text-emerald-100">Replies are AI generated. For anything urgent, email {CONTACT_EMAIL}.</p>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto flex max-w-2xl flex-col gap-3" role="log" aria-live="polite" aria-label="Conversation with Ace">
          {chat.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] whitespace-pre-wrap rounded-lg px-4 py-2.5 text-sm leading-relaxed text-white ${msg.role === "user" ? "bg-emerald-700" : "bg-white/10"}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {chat.loading && (
            <div className="flex" role="status" aria-label="Ace is typing">
              <div className="flex items-center gap-1 rounded-lg bg-white/10 px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-300" style={{ animation: `aceBounce 1.2s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          {chat.guestLimitReached && (
            <div className="rounded-lg border border-white/15 p-5 text-center">
              <p className="font-semibold text-white">You have used your {GUEST_LIMIT} free messages</p>
              <p className="mt-1 text-sm text-slate-300">Create a free account to keep chatting with Ace.</p>
              <Link to="/auth" className="sm-btn-primary mt-4 inline-block rounded-lg px-5 py-2.5 text-sm font-semibold text-white">Sign in or sign up</Link>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      {!chat.guestLimitReached && (
        <div className="border-t border-white/10 bg-[#0F172A] px-4 py-3">
          <form onSubmit={(e) => { e.preventDefault(); chat.send(); }} className="mx-auto flex max-w-2xl items-center gap-3">
            <label htmlFor="support-input" className="sr-only">Message Ace</label>
            <input
              id="support-input"
              ref={inputRef}
              value={chat.input}
              onChange={(e) => chat.setInput(e.target.value)}
              placeholder="Ask about the app"
              disabled={chat.loading}
              className="flex-1 rounded-lg border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-400"
            />
            <button type="submit" disabled={chat.loading || !chat.input.trim()} aria-label="Send message" className="sm-btn-primary grid h-11 w-11 shrink-0 place-items-center rounded-lg text-white disabled:opacity-50">
              <Send size={18} aria-hidden />
            </button>
          </form>
          {!chat.isSignedIn && chat.guestCount > 0 && (
            <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-slate-300">
              {chat.guestMessagesLeft} free {chat.guestMessagesLeft === 1 ? "message" : "messages"} left. <Link to="/auth" className="underline underline-offset-2 hover:text-white">Sign in for no limit</Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
