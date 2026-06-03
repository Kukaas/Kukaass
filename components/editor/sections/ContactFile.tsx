'use client';

import { useState } from 'react';
import { Mail, Copy, Check, FileDown, Loader2, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditor } from '../EditorContext';
import ContactForm from '../ContactForm';
import { PROFILE, SOCIALS } from '../data';

export default function ContactFile() {
  const { downloadResume, resumeLoading } = useEditor();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const channels = SOCIALS.filter((s) => s.name !== 'Email');

  return (
    <div className="w-full max-w-2xl px-6 py-8 sm:px-10 sm:py-12">
      <pre className="font-mono text-[12.5px] leading-relaxed text-muted-foreground">
        <code>
          {`#!/bin/bash\n`}
          <span className="text-muted-foreground/60">
            {`# the fastest way to reach me is email.\n# I usually reply within a day or two.`}
          </span>
        </code>
      </pre>

      {/* Primary action: email */}
      <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button asChild className="h-11 px-5 text-sm">
          <a href={`mailto:${PROFILE.email}`}>
            <Mail className="size-4" aria-hidden="true" />
            Email me
          </a>
        </Button>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border px-4 font-mono text-[13px] text-foreground/80 transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {copied ? (
            <>
              <Check className="size-4 text-brand" aria-hidden="true" /> copied
            </>
          ) : (
            <>
              <Copy className="size-4" aria-hidden="true" /> {PROFILE.email}
            </>
          )}
        </button>
      </div>

      {/* Direct message form */}
      <div className="mt-8">
        <ContactForm />
      </div>

      {/* Other channels */}
      <div className="mt-10 font-mono text-[12.5px] text-muted-foreground">
        <span className="text-muted-foreground/50">$</span> open &lt;channel&gt;
      </div>
      <ul className="mt-3 divide-y divide-border border-y border-border">
        {channels.map((c) => (
          <li key={c.name}>
            <a
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 py-3 text-foreground/80 transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <c.icon className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" aria-hidden="true" />
              <span className="font-sans text-[15px]">{c.name}</span>
              <span className="font-mono text-[12px] text-muted-foreground/60">{c.label}</span>
              <ArrowUpRight className="ml-auto size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={downloadResume}
            className="group flex w-full items-center gap-3 py-3 text-left text-foreground/80 transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {resumeLoading ? (
              <Loader2 className="size-4 animate-spin text-muted-foreground" aria-hidden="true" />
            ) : (
              <FileDown className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" aria-hidden="true" />
            )}
            <span className="font-sans text-[15px]">Résumé</span>
            <span className="font-mono text-[12px] text-muted-foreground/60">resume.pdf</span>
            <span className="ml-auto font-mono text-[11px] uppercase tracking-wider text-muted-foreground/50">
              download
            </span>
          </button>
        </li>
      </ul>

      <p className="mt-8 font-mono text-[12.5px] text-muted-foreground">
        <span className="text-muted-foreground/50">&gt;</span> open to roles and freelance work.
      </p>
    </div>
  );
}
