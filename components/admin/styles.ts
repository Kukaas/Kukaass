/**
 * Shared class strings for the admin forms, so every input/label/button reads
 * like the editor (graphite surfaces, single amber accent, mono labels). Keeps
 * the long form files consistent without a component rewrite.
 */

/** Text inputs, textareas, selects, file inputs. */
export const fieldInput =
  'w-full rounded-md border border-border bg-background/40 px-3 py-2 text-foreground placeholder:text-muted-foreground transition-colors focus:border-brand focus:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50';

/** Field caption — small, mono, uppercase, like a code comment. */
export const fieldLabel =
  'mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground';

/** The amber "Add" button used by the tag/list inputs. */
export const addButton =
  'flex items-center gap-2 rounded-md border border-brand/30 bg-brand/15 px-3 py-2 text-brand transition-colors hover:bg-brand/25 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none';

/** A removable chip/pill (tech stack, features, …). */
export const chip =
  'flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5';

/** Section card surface. */
export const panel = 'rounded-lg border border-border bg-card p-6';
