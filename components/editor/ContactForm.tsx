'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Loader2, Check, CircleAlert, Bold, Italic, Code, Heading2, List, ListOrdered, Link2 } from 'lucide-react';
import { useCreateContact } from '@/hooks/use-contacts';
import Markdown from '@/components/shared/Markdown';

const fieldClass =
  'w-full rounded-md border border-border bg-background/40 px-3 py-2 text-foreground placeholder:text-muted-foreground transition-colors focus:border-brand focus:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50';
const labelClass = 'mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground';

export default function ContactForm() {
  const createContact = useCreateContact();
  const [sent, setSent] = useState(false);
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Selection to restore after a toolbar action mutates the message value.
  const pendingSel = useRef<[number, number] | null>(null);

  useEffect(() => {
    if (pendingSel.current && textareaRef.current) {
      const [start, end] = pendingSel.current;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(start, end);
      pendingSel.current = null;
    }
  }, [form.message]);

  // Wrap the current selection with markdown markers (e.g. **bold**).
  const wrapInline = (before: string, after: string, placeholder: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const val = form.message;
    const inner = val.slice(s, e) || placeholder;
    const next = val.slice(0, s) + before + inner + after + val.slice(e);
    pendingSel.current = [s + before.length, s + before.length + inner.length];
    setForm((f) => ({ ...f, message: next }));
  };

  // Prefix each line in the selection (lists, headings).
  const prefixLines = (make: (i: number) => string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const val = form.message;
    const lineStart = val.lastIndexOf('\n', s - 1) + 1;
    const lineEndIdx = val.indexOf('\n', e);
    const lineEnd = lineEndIdx === -1 ? val.length : lineEndIdx;
    const block = val.slice(lineStart, lineEnd) || '';
    const newBlock = block.split('\n').map((ln, i) => make(i) + ln).join('\n');
    const next = val.slice(0, lineStart) + newBlock + val.slice(lineEnd);
    pendingSel.current = [lineStart, lineStart + newBlock.length];
    setForm((f) => ({ ...f, message: next }));
  };

  const insertLink = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const val = form.message;
    const text = val.slice(s, e) || 'text';
    const insert = `[${text}](url)`;
    const next = val.slice(0, s) + insert + val.slice(e);
    const urlAt = s + insert.lastIndexOf('url');
    pendingSel.current = [urlAt, urlAt + 3];
    setForm((f) => ({ ...f, message: next }));
  };

  const onMessageKeyDown = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(ev.metaKey || ev.ctrlKey)) return;
    const k = ev.key.toLowerCase();
    if (k === 'b') { ev.preventDefault(); wrapInline('**', '**', 'bold text'); }
    else if (k === 'i') { ev.preventDefault(); wrapInline('*', '*', 'italic text'); }
    else if (k === 'k') { ev.preventDefault(); insertLink(); }
  };

  const tools = [
    { icon: Bold, label: 'Bold (⌘B)', run: () => wrapInline('**', '**', 'bold text') },
    { icon: Italic, label: 'Italic (⌘I)', run: () => wrapInline('*', '*', 'italic text') },
    { icon: Code, label: 'Code', run: () => wrapInline('`', '`', 'code') },
    { icon: Heading2, label: 'Heading', run: () => prefixLines(() => '## ') },
    { icon: List, label: 'Bullet list', run: () => prefixLines(() => '- ') },
    { icon: ListOrdered, label: 'Numbered list', run: () => prefixLines((i) => `${i + 1}. `) },
    { icon: Link2, label: 'Link (⌘K)', run: insertLink },
  ];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createContact.isPending) return;
    try {
      await createContact.mutateAsync(form);
      setSent(true);
      setForm({ name: '', company: '', email: '', message: '' });
    } catch {
      /* error surfaced from mutation state below */
    }
  };

  if (sent) {
    return (
      <div className="rounded-lg border border-border bg-card p-5 font-mono text-[13px]">
        <div className="flex items-center gap-2 text-foreground">
          <Check className="size-4 text-brand" aria-hidden="true" />
          message sent
        </div>
        <p className="mt-1.5 text-muted-foreground">
          Thanks for reaching out — I&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-3 text-[12px] text-brand underline underline-offset-2 hover:text-brand-deep focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-border bg-card p-5 font-mono">
      <p className="mb-4 text-[12.5px] text-muted-foreground">
        <span className="text-muted-foreground/50">{'// '}</span>or drop a message directly
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={labelClass}>Name</label>
          <input
            id="cf-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Jane Doe"
            required
            maxLength={100}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="cf-company" className={labelClass}>
            Company <span className="lowercase tracking-normal text-muted-foreground/50">(optional)</span>
          </label>
          <input
            id="cf-company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="Acme Inc."
            maxLength={120}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="cf-email" className={labelClass}>Email</label>
        <input
          id="cf-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="jane@example.com"
          required
          maxLength={200}
          className={fieldClass}
        />
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="cf-message" className={labelClass}>Message</label>
          <div className="flex items-center gap-1 text-[11px]">
            {(['write', 'preview'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded px-2 py-0.5 capitalize transition-colors focus-visible:outline-none ${
                  tab === t ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        {tab === 'write' ? (
          <div className="overflow-hidden rounded-md border border-border bg-background/40 focus-within:border-brand">
            <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-1 py-1">
              {tools.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={t.run}
                  title={t.label}
                  aria-label={t.label}
                  className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none"
                >
                  <t.icon className="size-3.5" aria-hidden="true" />
                </button>
              ))}
            </div>
            <textarea
              id="cf-message"
              ref={textareaRef}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              onKeyDown={onMessageKeyDown}
              placeholder="What would you like to build?"
              required
              rows={4}
              maxLength={5000}
              className="max-h-72 min-h-24 w-full resize-y bg-transparent px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        ) : (
          <div className="min-h-[7.25rem] rounded-md border border-border bg-background/40 px-3 py-2 text-[13px] leading-relaxed text-foreground">
            {form.message.trim() ? (
              <Markdown>{form.message}</Markdown>
            ) : (
              <span className="text-muted-foreground">Nothing to preview yet.</span>
            )}
          </div>
        )}
        <p className="mt-1 text-[10.5px] text-muted-foreground/60">
          Markdown supported — <span className="text-foreground/70">**bold**</span>, <span className="text-foreground/70">*italic*</span>, <span className="text-foreground/70">- lists</span>
        </p>
      </div>

      {createContact.isError && (
        <p className="mt-3 flex items-center gap-1.5 text-[12px] text-destructive">
          <CircleAlert className="size-3.5" aria-hidden="true" />
          {(createContact.error as Error)?.message || 'Something went wrong. Please try again.'}
        </p>
      )}

      <button
        type="submit"
        disabled={createContact.isPending}
        className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand px-4 text-[13px] font-medium text-brand-foreground transition-colors hover:bg-brand-deep disabled:opacity-50 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {createContact.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" /> sending…
          </>
        ) : (
          <>
            <Send className="size-4" aria-hidden="true" /> send message
          </>
        )}
      </button>
    </form>
  );
}
