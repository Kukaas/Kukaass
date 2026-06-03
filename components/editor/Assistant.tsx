'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Trash2, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useEditor } from './EditorContext';
import { useAssistantChat } from './AssistantChatContext';
import { PROFILE } from './data';

const SUGGESTIONS = ['summarize his experience', 'what is his stack?', 'how do I contact him?'];
// The cycling "working" verbs, à la Claude Code's status line.
const WORK_WORDS = ['Thinking', 'Working', 'Reasoning', 'Crunching', 'Pondering', 'Synthesizing'];

/** The Claude spark — a crisp 4-point sparkle. Amber is the One Voice accent. */
function Spark({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 text-brand ${className}`}
    >
      <path d="M12 0c.46 5.7 6.3 11.54 12 12-5.7.46-11.54 6.3-12 12-.46-5.7-6.3-11.54-12-12C5.7 11.54 11.54 5.7 12 0Z" />
    </svg>
  );
}

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => <p className="mb-2 last:mb-0">{children}</p>,
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand underline underline-offset-2">
      {children}
    </a>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => <ul className="mb-2 space-y-0.5 pl-1">{children}</ul>,
  ol: ({ children }: { children?: React.ReactNode }) => <ol className="mb-2 list-decimal space-y-0.5 pl-5">{children}</ol>,
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="flex gap-2">
      <span className="select-none text-muted-foreground/50" aria-hidden="true">
        ⎿
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="rounded bg-accent px-1 py-0.5 text-[0.9em] text-foreground">{children}</code>
  ),
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="my-2 overflow-x-auto rounded-md border border-border bg-background p-2.5 text-[12px]">{children}</pre>
  ),
};

export default function Assistant() {
  const { setAssistantOpen } = useEditor();
  // Conversation state lives in AssistantChatProvider so it survives the
  // panel being closed and reopened.
  const { messages, input, setInput, isLoading, enabled, send, clear } = useAssistantChat();
  const reduce = useReducedMotion();
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }, [messages, isLoading, reduce]);

  // Cycle the status verb while a response streams.
  useEffect(() => {
    if (!isLoading) return;
    const id = setInterval(() => setTick((t) => t + 1), 1400);
    return () => clearInterval(id);
  }, [isLoading]);

  const streaming = isLoading && messages[messages.length - 1]?.role === 'assistant';

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div className="flex h-full flex-col bg-card font-mono text-[12.5px]">
      {/* Header */}
      <div className="flex h-9 shrink-0 select-none items-center justify-between border-b border-border pl-3 pr-2 text-muted-foreground">
        <div className="flex items-center gap-2 text-[11px] text-foreground/85">
          <Spark />
          <span className="font-medium">assistant</span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span
              className={enabled ? 'size-1.5 rounded-full bg-brand' : 'size-1.5 rounded-full bg-muted-foreground'}
              aria-hidden="true"
            />
            {enabled ? 'connected' : 'offline'}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={clear}
            aria-label="Clear conversation"
            title="Clear"
            className="rounded p-1 transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setAssistantOpen(false)}
            aria-label="Close assistant"
            title="Close"
            className="rounded p-1 transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Transcript */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Assistant conversation"
        className="editor-scroll editor-selectable min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3.5 leading-relaxed"
      >
        {messages.length === 0 && (
          <div className="space-y-3">
            {/* Welcome banner */}
            <div className="rounded-lg border border-border/70 bg-background/40 p-3">
              <div className="flex items-center gap-2 text-foreground">
                <Spark />
                <span className="font-medium">Welcome to {PROFILE.handle}&apos;s assistant</span>
              </div>
              <p className="mt-1 text-muted-foreground">
                Ask anything about {PROFILE.name.split(' ')[0]}&apos;s work, stack, or how to reach him.
              </p>
              <p className="mt-2 text-[11px] text-muted-foreground/50">~/portfolio · model: chester-1</p>
            </div>

            <div className="space-y-0.5">
              <p className="px-1 text-[11px] text-muted-foreground/60">Try one of these:</p>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  disabled={!enabled}
                  className="flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left text-foreground/75 transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <span className="select-none text-brand" aria-hidden="true">
                    ›
                  </span>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) =>
          m.role === 'user' ? (
            <div key={m.id} className="flex gap-2">
              <span className="select-none text-brand" aria-hidden="true">
                &gt;
              </span>
              <span className="min-w-0 flex-1 whitespace-pre-wrap break-words text-foreground/65">{m.content}</span>
            </div>
          ) : (
            <div key={m.id} className="flex gap-2.5">
              <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
              <div className="min-w-0 flex-1 text-foreground/90">
                <ReactMarkdown components={markdownComponents}>{m.content}</ReactMarkdown>
              </div>
            </div>
          ),
        )}

        {isLoading && (
          <div className="flex items-center gap-2 pl-0.5 text-muted-foreground">
            <Spark className={reduce ? 'size-3.5' : 'size-3.5 animate-pulse'} />
            <span className="text-foreground/80">{WORK_WORDS[tick % WORK_WORDS.length]}…</span>
            {streaming && <span className="text-[11px] text-muted-foreground/50">streaming</span>}
            <span className="sr-only">Assistant is responding</span>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Prompt box */}
      <form onSubmit={onSubmit} className="shrink-0 border-t border-border p-2">
        <div className="flex items-start gap-2 rounded-lg border border-border bg-background px-2.5 py-2 focus-within:border-brand/60">
          <span className="mt-0.5 select-none text-brand" aria-hidden="true">
            &gt;
          </span>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={!enabled || isLoading}
            rows={1}
            placeholder={enabled ? `Ask about ${PROFILE.handle}…` : 'assistant is offline'}
            aria-label="Message the assistant"
            spellCheck={false}
            className="min-h-5 max-h-32 min-w-0 flex-1 resize-none bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
          />
        </div>
        <div className="mt-1.5 flex items-center gap-3 px-1 text-[10.5px] text-muted-foreground/55">
          <span>
            <kbd className="text-muted-foreground/80">⏎</kbd> send
          </span>
          <span>
            <kbd className="text-muted-foreground/80">⇧⏎</kbd> newline
          </span>
          <span className="ml-auto">{enabled ? 'model: chester-1' : 'offline'}</span>
        </div>
      </form>
    </div>
  );
}
