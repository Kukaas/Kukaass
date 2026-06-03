'use client';

import { useState } from 'react';
import { Send, Loader2, Check, CircleAlert } from 'lucide-react';
import { useCreateContact } from '@/hooks/use-contacts';

const fieldClass =
  'w-full rounded-md border border-border bg-background/40 px-3 py-2 text-foreground placeholder:text-muted-foreground transition-colors focus:border-brand focus:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50';
const labelClass = 'mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground';

export default function ContactForm() {
  const createContact = useCreateContact();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' });

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
        <label htmlFor="cf-message" className={labelClass}>Message</label>
        <textarea
          id="cf-message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="What would you like to build?"
          required
          rows={4}
          maxLength={5000}
          className={`${fieldClass} resize-y`}
        />
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
