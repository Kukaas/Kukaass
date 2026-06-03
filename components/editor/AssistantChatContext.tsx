'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export type Role = 'user' | 'assistant';
export interface Message {
  id: string;
  role: Role;
  content: string;
}

interface AssistantChatValue {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  enabled: boolean;
  send: (raw: string) => void;
  clear: () => void;
}

const uid = () => Math.random().toString(36).slice(2, 9);

const AssistantChatContext = createContext<AssistantChatValue | null>(null);

/**
 * Holds the assistant conversation above the Assistant panel so it survives
 * the panel being closed and reopened. Kept separate from EditorContext so
 * that typing / streaming here doesn't re-render the whole editor shell.
 */
export function AssistantChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const loadingRef = useRef(isLoading);
  loadingRef.current = isLoading;
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d?.chatbot_enabled !== undefined) setEnabled(d.chatbot_enabled);
      })
      .catch(() => {});
  }, []);

  const askAssistant = useCallback(async (history: Message[]) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map((m) => ({
            role: m.role,
            parts: [{ type: 'text', text: m.content }],
          })),
        }),
      });
      if (!response.ok) throw new Error('request failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      const assistantId = uid();
      let assistant = '';
      if (reader) {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          assistant += decoder.decode(value);
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.id === assistantId) return [...prev.slice(0, -1), { ...last, content: assistant }];
            return [...prev, { id: assistantId, role: 'assistant', content: assistant }];
          });
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: 'assistant', content: 'Sorry, the assistant hit an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || loadingRef.current || !enabled) return;
      const history = [...messagesRef.current, { id: uid(), role: 'user' as const, content: text }];
      setMessages(history);
      setInput('');
      askAssistant(history);
    },
    [enabled, askAssistant],
  );

  const clear = useCallback(() => setMessages([]), []);

  const value = useMemo<AssistantChatValue>(
    () => ({ messages, input, setInput, isLoading, enabled, send, clear }),
    [messages, input, isLoading, enabled, send, clear],
  );

  return <AssistantChatContext.Provider value={value}>{children}</AssistantChatContext.Provider>;
}

export function useAssistantChat(): AssistantChatValue {
  const ctx = useContext(AssistantChatContext);
  if (!ctx) throw new Error('useAssistantChat must be used within an AssistantChatProvider');
  return ctx;
}
