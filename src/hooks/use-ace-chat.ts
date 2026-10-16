import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { CONTACT_EMAIL } from "@/lib/site";
import {
  GUEST_LIMIT, WELCOME, askAce, buildApiMessages, clearChatHistory, getGuestCount,
  incrementGuestCount, loadChatHistory, saveChatHistory, saveMessage, type Message,
} from "@/lib/aceChat";

// Shared by the floating chat widget and the full support page, so the two cannot drift apart.
export function useAceChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(loadChatHistory);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestCount, setGuestCount] = useState(getGuestCount);

  const isSignedIn = !!user;
  const guestLimitReached = !isSignedIn && guestCount >= GUEST_LIMIT;
  const guestMessagesLeft = Math.max(GUEST_LIMIT - guestCount, 0);

  async function send() {
    const text = input.trim();
    if (!text || loading || guestLimitReached) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text };
    const next = [...messages, userMsg];
    setMessages(next);
    saveChatHistory(next);
    setInput("");
    setLoading(true);
    await saveMessage("user", text, user?.id);
    try {
      const reply = await askAce(buildApiMessages(next));
      const updated = [...next, { id: (Date.now() + 1).toString(), role: "ace" as const, text: reply }];
      setMessages(updated);
      saveChatHistory(updated);
      // A guest only spends one of their free messages when Ace actually answered.
      if (!isSignedIn) { incrementGuestCount(); setGuestCount(getGuestCount()); }
      await saveMessage("ace", reply, user?.id);
    } catch {
      const err = `Ace could not reply just now.${isSignedIn ? "" : " That did not use up one of your free messages."} Try again in a moment, or email ${CONTACT_EMAIL}.`;
      const updated = [...next, { id: (Date.now() + 1).toString(), role: "ace" as const, text: err }];
      setMessages(updated);
      saveChatHistory(updated);
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    clearChatHistory();
    setMessages([WELCOME]);
  }

  return { user, isSignedIn, messages, input, setInput, loading, guestLimitReached, guestMessagesLeft, guestCount, send, clear };
}
