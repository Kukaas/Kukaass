'use client';

import { Fragment } from 'react';
import { format } from 'date-fns';
import { useExperiences, type Experience } from '@/hooks/use-experiences';

const fmt = (d: string | Date) => format(new Date(d), 'MMM yyyy');

/** Human duration between two dates, inclusive of the start month. */
function duration(start: string | Date, end?: string | Date | null): string {
  const s = new Date(start);
  const e = end ? new Date(end) : new Date();
  const months = Math.max(1, (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()) + 1);
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts: string[] = [];
  if (y) parts.push(`${y} yr${y > 1 ? 's' : ''}`);
  if (m) parts.push(`${m} mo${m > 1 ? 's' : ''}`);
  return parts.join(' ');
}

/* --- JSON syntax tokens (monochrome; amber is the single accent) ---------- */
const Punc = ({ children }: { children: React.ReactNode }) => (
  <span className="text-muted-foreground/40">{children}</span>
);
const Key = ({ children }: { children: React.ReactNode }) => (
  <span>
    <span className="text-muted-foreground/40">&quot;</span>
    <span className="text-foreground/55">{children}</span>
    <span className="text-muted-foreground/40">&quot;</span>
  </span>
);
const Str = ({ children }: { children: React.ReactNode }) => (
  <span>
    <span className="text-muted-foreground/40">&quot;</span>
    <span className="text-foreground/90">{children}</span>
    <span className="text-muted-foreground/40">&quot;</span>
  </span>
);

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

function ExpObject({ exp, last }: { exp: Experience; last: boolean }) {
  const endLabel = exp.isCurrent ? 'Present' : exp.endDate ? fmt(exp.endDate) : '—';
  const period = `${fmt(exp.startDate)} — ${endLabel}`;
  const highlights = exp.description ?? [];

  return (
    <>
      <Row depth={1}>
        <Punc>{'{'}</Punc>
      </Row>
      <Row depth={2}>
        <Key>role</Key>
        <Punc>: </Punc>
        <Str>{exp.role}</Str>
        <Punc>,</Punc>
      </Row>
      <Row depth={2}>
        <Key>company</Key>
        <Punc>: </Punc>
        <Str>{exp.company}</Str>
        <Punc>,</Punc>
      </Row>
      <Row depth={2}>
        <Key>period</Key>
        <Punc>: </Punc>
        <span>
          <span className="text-muted-foreground/40">&quot;</span>
          <span className="text-foreground/90">{fmt(exp.startDate)} — </span>
          <span className={exp.isCurrent ? 'text-brand' : 'text-foreground/90'}>{endLabel}</span>
          <span className="text-muted-foreground/40">&quot;</span>
        </span>
        <Punc>,</Punc>
        <span className="select-none text-muted-foreground/30"> // {duration(exp.startDate, exp.isCurrent ? null : exp.endDate)}</span>
      </Row>
      {exp.location && (
        <Row depth={2}>
          <Key>location</Key>
          <Punc>: </Punc>
          {exp.mapUrl ? (
            <span>
              <span className="text-muted-foreground/40">&quot;</span>
              <a
                href={exp.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/90 underline-offset-2 hover:text-brand hover:underline"
              >
                {exp.location}
              </a>
              <span className="text-muted-foreground/40">&quot;</span>
            </span>
          ) : (
            <Str>{exp.location}</Str>
          )}
          <Punc>,</Punc>
        </Row>
      )}
      {exp.isCurrent && (
        <Row depth={2}>
          <Key>current</Key>
          <Punc>: </Punc>
          <span className="text-brand">true</span>
          <Punc>,</Punc>
        </Row>
      )}
      {highlights.length > 0 && (
        <>
          <Row depth={2}>
            <Key>highlights</Key>
            <Punc>: [</Punc>
          </Row>
          {highlights.map((d, i) => (
            <Row depth={3} key={i}>
              <Str>{d}</Str>
              {i < highlights.length - 1 && <Punc>,</Punc>}
            </Row>
          ))}
          <Row depth={2}>
            <Punc>]</Punc>
          </Row>
        </>
      )}
      <Row depth={1}>
        <Punc>{'}'}</Punc>
        {!last && <Punc>,</Punc>}
      </Row>
    </>
  );
}

export default function ExperienceFile() {
  const { data: experiences, isLoading, error } = useExperiences();
  const count = experiences?.length ?? 0;

  return (
    <div className="editor-selectable w-full px-1 py-3 font-mono text-[13px] leading-[1.7] sm:px-2">
      {isLoading && (
        <div className="space-y-2 px-3 py-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-md border border-border bg-card" />
          ))}
        </div>
      )}

      {error && <p className="px-3 text-destructive">Error: failed to load experience.</p>}

      {!isLoading && !error && (
        <div className="code-lines">
          <Row>
            <span className="text-muted-foreground/50">// experience.json — roles and teams I have built with</span>
          </Row>
          <Row>
            <Punc>[</Punc>
          </Row>
          {count > 0 ? (
            experiences!.map((exp, i) => (
              <Fragment key={exp._id}>
                <ExpObject exp={exp} last={i === count - 1} />
              </Fragment>
            ))
          ) : (
            <Row depth={1}>
              <span className="text-muted-foreground/50">// no experience added yet</span>
            </Row>
          )}
          <Row>
            <Punc>]</Punc>
          </Row>
        </div>
      )}
    </div>
  );
}
