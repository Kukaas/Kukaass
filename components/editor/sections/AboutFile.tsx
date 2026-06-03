'use client';

const capabilities: { area: string; detail: string }[] = [
  { area: 'Frontend', detail: 'React, Next.js, TypeScript, Tailwind CSS' },
  { area: 'Backend', detail: 'Node.js, Express, Laravel, PHP' },
  { area: 'Data', detail: 'MongoDB, MySQL, Mongoose, REST APIs' },
  { area: 'Delivery', detail: 'Docker, Linux, Vercel, end-to-end ownership' },
];

export default function AboutFile() {
  return (
    <div className="w-full max-w-2xl px-6 py-8 sm:px-10 sm:py-12">
      {/* markdown heading marker */}
      <div className="flex items-baseline gap-2 font-mono text-muted-foreground">
        <span className="text-muted-foreground/50">#</span>
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">About</h2>
      </div>

      <div className="mt-6 space-y-4 font-sans text-[15px] leading-relaxed text-foreground/80">
        <p>
          I&apos;m a full-stack developer who ships web applications end to end. I work primarily
          across the MERN stack and Laravel, and I&apos;m comfortable owning a feature from the
          database schema and API up to the interface people actually use.
        </p>
        <p>
          I care about the parts that don&apos;t demo well: sensible data models, honest loading and
          error states, and interfaces that stay fast and legible. I&apos;d rather ship something
          small that works than something large that mostly does.
        </p>
      </div>

      {/* capabilities as a labeled list, not a card grid */}
      <div className="mt-10">
        <div className="flex items-baseline gap-2 font-mono text-muted-foreground">
          <span className="text-muted-foreground/50">##</span>
          <h3 className="font-sans text-lg font-semibold tracking-tight text-foreground">
            What I work with
          </h3>
        </div>
        <dl className="mt-4 divide-y divide-border border-y border-border">
          {capabilities.map((c) => (
            <div key={c.area} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3">
              <dt className="font-mono text-[13px] text-muted-foreground">{c.area}</dt>
              <dd className="font-sans text-[15px] text-foreground/85">{c.detail}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="mt-8 font-mono text-[12.5px] text-muted-foreground">
        <span className="text-muted-foreground/50">&gt;</span> available for freelance projects and
        full-time roles.
      </p>
    </div>
  );
}
