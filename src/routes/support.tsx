import { Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import aceIcon from "@/assets/app/ace-icon.png";
import aceSupport from "@/assets/ace_support.png";
import owlChest from "@/assets/owl_chest.png";
import { useAuth } from "@/hooks/use-auth";
import {
  Message, GUEST_LIMIT, loadChatHistory, saveChatHistory, clearChatHistory,
  getGuestCount, incrementGuestCount, saveMessage, askAce, buildApiMessages
} from "@/lib/aceChat";

const avatarSrc = aceSupport || owlChest;

export function SupportComponent() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(loadChatHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestCount, setGuestCount] = useState(getGuestCount);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isSignedIn = !!user;
  const guestLimitReached = !isSignedIn && guestCount >= GUEST_LIMIT;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 300); }, []);

  async function send() {
    const text = input.trim();
    if (!text || loading || guestLimitReached) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    const next = [...messages, userMsg];
    setMessages(next);
    saveChatHistory(next);
    setInput('');
    setLoading(true);
    await saveMessage('user', text, user?.id);
    if (!isSignedIn) { incrementGuestCount(); setGuestCount(getGuestCount()); }
    try {
      const reply = await askAce(buildApiMessages(next));
      const updated = [...next, { id: Date.now().toString(), role: 'ace' as const, text: reply }];
      setMessages(updated);
      saveChatHistory(updated);
      await saveMessage('ace', reply, user?.id);
    } catch {
      const err = "Sorry, I'm having trouble right now. Email us at princeaistudio@gmail.com!";
      const updated = [...next, { id: Date.now().toString(), role: 'ace' as const, text: err }];
      setMessages(updated);
      saveChatHistory(updated);
    } finally { setLoading(false); }
  }

  function handleClear() {
    clearChatHistory();
    setMessages([{ id: '0', role: 'ace', text: "Hey! 👋 I'm Ace, how can I help you today?" }]);
  }
  function handleKey(e: React.KeyboardEvent) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={aceIcon} alt="" className="h-7 w-7 rounded-lg object-contain" />
            <span className="font-semibold text-white">ScholarMate</span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={handleClear} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10">Clear chat</button>
            <Link to="/" className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10">← Home</Link>
          </div>
        </div>
      </nav>

      <div className="bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] px-4 py-4">
        <div className="mx-auto max-w-2xl flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-black/20 border-2 border-yellow-400/30 overflow-hidden flex-shrink-0 flex items-center justify-center">
            <img src={avatarSrc} alt="Ace" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-white font-bold text-lg">Ace</div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-white/70 text-xs">Online · Customer Support</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto max-w-2xl flex flex-col gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ace' && (
                <div className="w-8 h-8 rounded-full bg-[#7C3AED]/30 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <img src={avatarSrc} alt="" className="w-7 h-7 object-contain" />
                </div>
              )}
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-[#7C3AED] text-white rounded-br-sm' : 'bg-white/10 text-white rounded-bl-sm'}`}>
                {msg.text}
              </div>
              {msg.role === 'user' && user?.user_metadata?.avatar_url && (
                <img src={user.user_metadata.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-[#7C3AED]/30 overflow-hidden flex-shrink-0 flex items-center justify-center">
                <img src={avatarSrc} alt="" className="w-7 h-7 object-contain" />
              </div>
              <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                {[0,1,2].map((i) => <div key={i} className="w-2 h-2 rounded-full bg-[#7C3AED]" style={{ animation: `aceBounce 1.2s ${i*0.2}s infinite` }} />)}
              </div>
            </div>
          )}
          {guestLimitReached && (
            <div className="bg-[#7C3AED]/15 border border-[#7C3AED]/40 rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">🔒</div>
              <div className="text-white font-bold mb-1">You've used your free messages</div>
              <div className="text-slate-400 text-sm mb-4">Sign in free to keep chatting with Ace</div>
              <Link to="/auth" className="inline-block bg-[#7C3AED] text-white rounded-full px-6 py-2.5 text-sm font-bold hover:bg-[#6D28D9] transition">Sign in free →</Link>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {!guestLimitReached && (
        <div className="border-t border-white/5 bg-[#0F172A] px-4 py-3">
          <div className="mx-auto max-w-2xl flex gap-3 items-center">
            <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
              placeholder="Message Ace..." disabled={loading}
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder:text-slate-500 outline-none focus:border-violet-400/50 text-sm" />
            <button onClick={send} disabled={loading || !input.trim()}
              className="w-11 h-11 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-lg disabled:opacity-40 hover:bg-[#6D28D9] transition flex-shrink-0">➤</button>
          </div>
          {!isSignedIn && guestCount > 0 && (
            <p className="text-center text-xs text-slate-500 mt-2">{GUEST_LIMIT - guestCount} free messages left · <Link to="/auth" className="text-violet-400">Sign in for unlimited</Link></p>
          )}
        </div>
      )}
      <style>{`@keyframes aceBounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }`}</style>
    </div>
  );
}