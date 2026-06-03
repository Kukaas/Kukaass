/**
 * Minimal allow-list HTML sanitizer for user-submitted rich text (contact
 * messages). Rebuilds a clean DOM tree keeping only safe formatting tags and
 * stripping every attribute except a vetted `href` on links. Prevents stored
 * XSS in the admin inbox where the HTML is rendered.
 *
 * Runs in the browser (uses DOMParser); returns '' on the server.
 */

const ALLOWED_TAGS = new Set([
  'B', 'STRONG', 'I', 'EM', 'U', 'A', 'UL', 'OL', 'LI', 'P', 'BR', 'DIV', 'SPAN', 'CODE', 'PRE', 'H1', 'H2', 'H3', 'BLOCKQUOTE',
]);

const SAFE_HREF = /^(https?:|mailto:|#|\/)/i;

function cleanInto(source: Node, target: Node, doc: Document) {
  source.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      target.appendChild(doc.createTextNode(child.textContent || ''));
      return;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) return; // drop comments etc.

    const el = child as HTMLElement;
    if (!ALLOWED_TAGS.has(el.tagName)) {
      // Unwrap unknown tags but keep their (cleaned) contents.
      cleanInto(el, target, doc);
      return;
    }

    const safe = doc.createElement(el.tagName.toLowerCase());
    if (el.tagName === 'A') {
      const href = (el.getAttribute('href') || '').trim();
      if (SAFE_HREF.test(href)) {
        safe.setAttribute('href', href);
        safe.setAttribute('target', '_blank');
        safe.setAttribute('rel', 'noopener noreferrer');
      }
    }
    cleanInto(el, safe, doc);
    target.appendChild(safe);
  });
}

export function sanitizeHtml(dirty: string): string {
  if (typeof window === 'undefined' || !dirty) return '';
  const doc = new DOMParser().parseFromString(dirty, 'text/html');
  const container = doc.createElement('div');
  cleanInto(doc.body, container, doc);
  return container.innerHTML;
}

/** Strip all tags to plain text (for length checks and SSR fallback). */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
}
