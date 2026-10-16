import { useEffect, useRef, useState } from "react";
import { Maximize2, Send, Trash2, X } from "lucide-react";
import aceSupport from "@/assets/ace_support.webp";
import { useAceChat } from "@/hooks/use-ace-chat";
import { GUEST_LIMIT } from "@/lib/aceChat";

export default function AceWidget() {
  const chat = useAceChat();
  const [open, setOpen] = useState(false);
  const [pathname, setPathname] = useState(window.location.pathname);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  // The widget sits outside the router, so it follows navigation through the History API.
  useEffect(() => {
    const handler = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handler);
    const origPush = history.pushState.bind(history);
    const origReplace = history.replaceState.bind(history);
    history.pushState = (...args) => { origPush(...args); handler(); };
    history.replaceState = (...args) => { origReplace(...args); handler(); };
    return () => {
      window.removeEventListener("popstate", handler);
      history.pushState = origPush;
      history.replaceState = origReplace;
    };
  }, []);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => { if (open) bottomRef.current?.scrollIntoView({ block: "end" }); }, [chat.messages, chat.loading, open]);

  const close = () => { setOpen(false); openerRef.current?.focus(); };

  if (pathname === "/support") return null;

  return (
    <>
      {!open && (
        <button
          ref={openerRef}
          onClick={() => setOpen(true)}
          aria-label="Chat with Ace, ScholarMate support"
          className="fixed bottom-5 right-5 z-[9999] grid h-14 w-14 place-items-center overflow-hidden rounded-full border border-white/25 bg-emerald-700 hover:bg-emerald-600"
        >
          <img src={aceSupport} width={48} height={48} alt="" className="h-12 w-12 object-contain" />
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Chat with Ace"
          onKeyDown={(e) => { if (e.key === "Escape") close(); }}
          className="fixed bottom-5 right-5 z-[9999] flex h-[34rem] max-h-[calc(100vh-2.5rem)] w-[22.5rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-white/15 bg-[#0F172A] shadow-xl"
        >
          <div className="flex items-center gap-3 border-b border-white/10 bg-emerald-800 px-4 py-3">
            <img src={aceSupport} width={36} height={36} alt="" className="h-9 w-9 rounded-full bg-black/20 object-contain" />
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-semibold text-white">Ace</div>
              <div className="text-xs text-emerald-100">Support assistant. Replies are AI generated.</div>
            </div>
            <a href="/support" onClick={() => setOpen(false)} aria-label="Open the full support page" className="grid h-9 w-9 place-items-center rounded-lg text-white hover:bg-white/15">
              <Maximize2 size={16} aria-hidden />
            </a>
            <button onClick={chat.clear} aria-label="Clear chat" className="grid h-9 w-9 place-items-center rounded-lg text-white hover:bg-white/15">
              <Trash2 size={16} aria-hidden />
            </button>
            <button onClick={close} aria-label="Close chat" className="grid h-9 w-9 place-items-center rounded-lg text-white hover:bg-white/15">
              <X size={18} aria-hidden />
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" role="log" aria-live="polite" aria-label="Conversation with Ace">
            {chat.messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm leading-relaxed text-white ${msg.role === "user" ? "bg-emerald-700" : "bg-white/10"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {chat.loading && (
              <div className="flex" role="status" aria-label="Ace is typing">
                <div className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-3">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-300" style={{ animation: `aceBounce 1.2s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            {chat.guestLimitReached && (
              <div className="rounded-lg border border-white/15 p-4 text-center">
                <p className="text-sm font-semibold text-white">You have used your {GUEST_LIMIT} free messages</p>
                <p className="mt-1 text-xs text-slate-300">Create a free account to keep chatting with Ace.</p>
                <a href="/auth" className="sm-btn-primary mt-3 inline-block rounded-lg px-4 py-2 text-sm font-semibold text-white">Sign in or sign up</a>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {!chat.guestLimitReached && (
            <form
              onSubmit={(e) => { e.preventDefault(); chat.send(); }}
              className="flex items-center gap-2 border-t border-white/10 p-3"
            >
              <label htmlFor="ace-input" className="sr-only">Message Ace</label>
              <input
                id="ace-input"
                ref={inputRef}
                value={chat.input}
                onChange={(e) => chat.setInput(e.target.value)}
                placeholder="Ask about the app"
                disabled={chat.loading}
                className="min-w-0 flex-1 rounded-lg border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-slate-400"
              />
              <button type="submit" disabled={chat.loading || !chat.input.trim()} aria-label="Send message" className="sm-btn-primary grid h-10 w-10 shrink-0 place-items-center rounded-lg text-white disabled:opacity-50">
                <Send size={16} aria-hidden />
              </button>
            </form>
          )}
          {!chat.isSignedIn && !chat.guestLimitReached && chat.guestCount > 0 && (
            <p className="px-3 pb-3 text-center text-xs text-slate-300">
              {chat.guestMessagesLeft} free {chat.guestMessagesLeft === 1 ? "message" : "messages"} left. <a href="/auth" className="underline underline-offset-2 hover:text-white">Sign in for no limit</a>
            </p>
          )}
        </div>
      )}
    </>
  );
}
