'use client';

import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { cn } from '@/lib/utils';

/**
 * Renders user/markdown text with the editor tokens — bold, italic, lists,
 * links, code, headings, blockquotes. Shared by the contact form preview and
 * the admin message views. CommonMark only (no extra deps).
 */
const components: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand underline underline-offset-2">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="mb-2 list-disc space-y-0.5 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal space-y-0.5 pl-5">{children}</ol>,
  li: ({ children }) => <li className="pl-0.5">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  h1: ({ children }) => <h1 className="mb-2 mt-1 text-[15px] font-semibold text-foreground">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-2 mt-1 text-[14px] font-semibold text-foreground">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-1 mt-1 text-[13px] font-semibold text-foreground">{children}</h3>,
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-border pl-3 text-muted-foreground">{children}</blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-accent px-1 py-0.5 text-[0.9em] text-foreground">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="my-2 overflow-x-auto rounded-md border border-border bg-background p-2.5 text-[12px]">{children}</pre>
  ),
};

export default function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn('break-words', className)}>
      <ReactMarkdown components={components}>{children}</ReactMarkdown>
    </div>
  );
}
