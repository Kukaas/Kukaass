'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Download, Loader2, MessageSquareCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditor } from '../EditorContext';
import { EASE, PROFILE } from '../data';

export default function HomeFile() {
  const { openFile, downloadResume, resumeLoading, setTerminalOpen } = useEditor();
  const reduce = useReducedMotion();

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: EASE },
        };

  return (
    <div className="w-full max-w-2xl px-6 py-8 sm:px-10 sm:py-12">
      {/* File doc-comment header */}
      <motion.pre
        {...rise(0)}
        className="mb-8 overflow-x-auto font-mono text-[12.5px] leading-relaxed text-muted-foreground"
      >
        <code>
          {`/**\n * `}
          <span className="text-foreground/80">{PROFILE.name}</span>
          {`  ·  @${PROFILE.handle}\n * ${PROFILE.role} · ${PROFILE.location}\n * status: `}
          <span className="text-brand">open to roles &amp; freelance</span>
          {`\n */`}
        </code>
      </motion.pre>

      <motion.h1
        {...rise(0.06)}
        className="font-sans text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl"
        style={{ textWrap: 'balance' }}
      >
        Hi, I&apos;m Chester <span className="sr-only">Luke Maligaso (Chester Maligaso)</span>.
      </motion.h1>

      <motion.p
        {...rise(0.12)}
        className="mt-5 max-w-[60ch] font-sans text-base leading-relaxed text-foreground/75 sm:text-lg"
        style={{ textWrap: 'pretty' }}
      >
        I&apos;m Chester Maligaso, a full-stack developer building modern web applications with
        React, Next.js, Node.js, and Laravel, from database schema to production deploy. Right now
        I&apos;m shipping projects across the MERN stack and looking for the next team to build with.
      </motion.p>

      <motion.div {...rise(0.18)} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button onClick={() => openFile('projects')} className="group h-11 px-5 text-sm">
          View my work
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
        <Button
          variant="outline"
          onClick={downloadResume}
          disabled={resumeLoading}
          aria-label="Download résumé"
          className="h-11 px-5 text-sm"
        >
          {resumeLoading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          {resumeLoading ? 'Preparing…' : 'Download résumé'}
        </Button>
        <button
          type="button"
          onClick={() => setTerminalOpen(true)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <MessageSquareCode className="size-4" aria-hidden="true" />
          Ask my assistant
        </button>
      </motion.div>

      <motion.p {...rise(0.24)} className="mt-12 font-mono text-[12.5px] text-muted-foreground">
        export default <span className="text-brand">chester</span>;
      </motion.p>
    </div>
  );
}
