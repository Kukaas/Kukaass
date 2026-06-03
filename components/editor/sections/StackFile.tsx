'use client';

import { Fragment } from 'react';

interface Group {
  key: string;
  note: string;
  items: string[];
}

/** Core tools get the single amber accent; everything else stays monochrome. */
const PRIMARY = new Set(['React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB']);

const GROUPS: Group[] = [
  {
    key: 'frontend',
    note: 'interfaces & interaction',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'TanStack Query', 'Framer Motion'],
  },
  { key: 'backend', note: 'APIs & services', items: ['Node.js', 'Express', 'NestJS', 'Laravel', 'PHP'] },
  { key: 'data', note: 'storage & modelling', items: ['MongoDB', 'PostgreSQL', 'MySQL', 'Mongoose', 'Prisma', 'REST APIs'] },
  { key: 'devops', note: 'ship & run', items: ['Docker', 'Linux', 'Vercel', 'Git', 'GitHub', 'CI/CD'] },
  { key: 'tooling', note: 'everyday glue', items: ['Stripe', 'JWT', 'Zod', 'React Hook Form', 'SEO'] },
];

const TOTAL = GROUPS.reduce((n, g) => n + g.items.length, 0);

/* --- TS syntax tokens (monochrome; amber is the single accent) ------------ */
const Punc = ({ children }: { children: React.ReactNode }) => (
  <span className="text-muted-foreground/40">{children}</span>
);
const Kw = ({ children }: { children: React.ReactNode }) => (
  <span className="text-muted-foreground/80">{children}</span>
);

function StrItem({ label, last }: { label: string; last: boolean }) {
  const primary = PRIMARY.has(label);
  return (
    <span>
      <span className="text-muted-foreground/40">&apos;</span>
      <span className={primary ? 'text-brand' : 'text-foreground/85'}>{label}</span>
      <span className="text-muted-foreground/40">&apos;</span>
      {!last && <span className="text-muted-foreground/40">, </span>}
    </span>
  );
}

/** One source line with an auto line-number gutter and `depth` of indent. */
function Row({ depth = 0, children }: { depth?: number; children?: React.ReactNode }) {
  return (
    <div className="code-row">
      <span className="code-body" style={depth ? { paddingLeft: `${depth * 2}ch` } : undefined}>
        {children}
      </span>
    </div>
  );
}

export default function StackFile() {
  return (
    <div className="editor-selectable w-full px-1 py-3 font-mono text-[13px] leading-[1.7] sm:px-2">
      <div className="code-lines">
        <Row>
          <span className="text-muted-foreground/50">// stack.config.ts — the tools I reach for to build and ship</span>
        </Row>
        <Row>
          <Kw>import type</Kw> <Punc>{'{'}</Punc> <span className="text-foreground/70">Stack</span>{' '}
          <Punc>{'}'}</Punc> <Kw>from</Kw>{' '}
          <span>
            <span className="text-muted-foreground/40">&apos;</span>
            <span className="text-foreground/85">./stack</span>
            <span className="text-muted-foreground/40">&apos;</span>
          </span>
        </Row>
        <Row />
        <Row>
          <Kw>export const</Kw> <span className="text-brand">stack</span>
          <Punc>: </Punc>
          <span className="text-foreground/70">Stack</span> <Punc>= {'{'}</Punc>
        </Row>

        {GROUPS.map((g) => (
          <Fragment key={g.key}>
            <Row depth={1}>
              <span className="text-foreground/60">{g.key}</span>
              <Punc>: [</Punc>
              <span className="select-none text-muted-foreground/30"> // {g.note}</span>
            </Row>
            {g.items.map((item, i) => (
              <Row depth={2} key={item}>
                <StrItem label={item} last={i === g.items.length - 1} />
              </Row>
            ))}
            <Row depth={1}>
              <Punc>],</Punc>
            </Row>
          </Fragment>
        ))}

        <Row>
          <Punc>{'}'}</Punc> <Kw>satisfies</Kw> <span className="text-foreground/70">Stack</span>
          <Punc>;</Punc>
        </Row>
        <Row />
        <Row>
          <span className="text-muted-foreground/50">
            // {TOTAL} technologies across {GROUPS.length} domains
          </span>
        </Row>
      </div>
    </div>
  );
}
