import { useState, useRef, useEffect } from 'react';
import owlChest from '@/assets/owl_chest.png';
import aceSupport from '@/assets/ace_support.png';
import { useAuth } from '@/hooks/use-auth';
import {
  Message, GUEST_LIMIT, loadChatHistory, saveChatHistory, clearChatHistory,
  getGuestCount, incrementGuestCount, saveMessage, askAce, buildApiMessages
} from '@/lib/aceChat';

const avatarSrc = aceSupport || owlChest;

export default function AceWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadChatHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestCount, setGuestCount] = useState(getGuestCount);
  const [pathname, setPathname] = useState(window.location.pathname);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isSignedIn = !!user;
  const guestLimitReached = !isSignedIn && guestCount >= GUEST_LIMIT;

  useEffect(() => {
    const handler = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handler);
    const origPush = history.pushState.bind(history);
    const origReplace = history.replaceState.bind(history);
    history.pushState = (...args) => { origPush(...args); handler(); };
    history.replaceState = (...args) => { origReplace(...args); handler(); };
    return () => {
      window.removeEventListener('popstate', handler);
      history.pushState = origPush;
      history.replaceState = origReplace;
    };
  }, []);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 300); }, [open]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  if (pathname === '/support') return null;

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

  function handleClear() { clearChatHistory(); setMessages([{ id: '0', role: 'ace', text: "Hey! 👋 I'm Ace, how can I help you today?" }]); }
  function handleKey(e: React.KeyboardEvent) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Chat with Ace"
        style={{ position: 'fixed', bottom: '24px', right: '24px', width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', border: '2px solid rgba(212,160,23,0.4)', cursor: 'pointer', display: open ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 24px rgba(124,58,237,0.55)', zIndex: 9999, transition: 'transform 0.2s', padding: 0, overflow: 'hidden' }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
        <img src={avatarSrc} alt="Ace" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
      </button>

      {open && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', width: '360px', maxWidth: 'calc(100vw - 32px)', height: '540px', maxHeight: 'calc(100vh - 48px)', borderRadius: '20px', background: '#0F0A1E', border: '1px solid rgba(124,58,237,0.3)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <div style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.2)', border: '1.5px solid rgba(212,160,23,0.4)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={avatarSrc} alt="Ace" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>Ace</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px' }}>Online · Customer Support</div>
              </div>
            </div>
            <a href="/support" onClick={() => setOpen(false)} title="Open full chat" style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', padding: '6px 8px', fontSize: '12px', textDecoration: 'none', marginRight: '2px', display: 'inline-block' }}>⛶</a>
            <button onClick={handleClear} title="Clear chat" style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', padding: '6px 8px', fontSize: '14px', marginRight: '4px' }}>🗑️</button>
            <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', padding: '6px 10px', fontSize: '16px', fontWeight: 700 }}>✕</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '6px' }}>
                {msg.role === 'ace' && (
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(124,58,237,0.3)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={avatarSrc} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                  </div>
                )}
                <div style={{ maxWidth: '78%', padding: '9px 13px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px', background: msg.role === 'user' ? 'linear-gradient(135deg, #7C3AED, #5B21B6)' : 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(124,58,237,0.3)', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={avatarSrc} alt="" style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '4px 16px 16px 16px', background: 'rgba(255,255,255,0.08)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0,1,2].map((i) => <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7C3AED', animation: `aceBounce 1.2s ${i*0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            {guestLimitReached && (
              <div style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', marginBottom: '6px' }}>🔒</div>
                <div style={{ color: '#fff', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>You've used your free messages</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '12px' }}>Sign in free to keep chatting with Ace</div>
                <a href="/auth" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', color: '#fff', borderRadius: '20px', padding: '8px 20px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Sign in free →</a>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {!guestLimitReached && (
            <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
                placeholder="Message Ace..." disabled={loading}
                style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '24px', padding: '10px 16px', color: '#fff', fontSize: '13px', outline: 'none' }} />
              <button onClick={send} disabled={loading || !input.trim()}
                style={{ width: '38px', height: '38px', borderRadius: '50%', background: loading || !input.trim() ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg, #7C3AED, #5B21B6)', border: 'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>➤</button>
            </div>
          )}
          {!isSignedIn && !guestLimitReached && guestCount > 0 && (
            <div style={{ textAlign: 'center', padding: '4px 0 8px', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
              {GUEST_LIMIT - guestCount} free {GUEST_LIMIT - guestCount === 1 ? 'message' : 'messages'} left · <a href="/auth" style={{ color: 'rgba(124,58,237,0.8)', textDecoration: 'none' }}>Sign in for unlimited</a>
            </div>
          )}
        </div>
      )}
      <style>{`@keyframes aceBounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }`}</style>
    </>
  );
}