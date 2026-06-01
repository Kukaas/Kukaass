'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';

type StartViewTransition = (callback: () => void | Promise<void>) => unknown;

function getStartViewTransition(): StartViewTransition | null {
  if (typeof document === 'undefined') return null;
  const doc = document as Document & { startViewTransition?: StartViewTransition };
  return typeof doc.startViewTransition === 'function'
    ? doc.startViewTransition.bind(doc)
    : null;
}

/**
 * Resolve once an element matching `selector` is in the DOM, or after `timeout`
 * ms as a safety net. Used so a View Transition does not snapshot the new route
 * before its shared element (the morph target) has rendered.
 */
function waitForElement(selector: string, timeout = 1000): Promise<void> {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      resolve();
      return;
    }
    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(() => {
      observer.disconnect();
      resolve();
    }, timeout);
  });
}

interface TransitionOptions {
  /** CSS selector for the shared element on the destination, to wait for. */
  waitFor?: string;
}

/**
 * App Router navigation wrapped in the View Transitions API so shared elements
 * (tagged with `view-transition-name`) morph between routes. Falls back to an
 * instant navigation when the API is unavailable or the user prefers reduced
 * motion. See DESIGN.md: motion is deliberate and always has a static path.
 */
export function useViewTransitionRouter() {
  const router = useRouter();
  const reduce = useReducedMotion();

  const run = useCallback(
    (navigate: () => void, options?: TransitionOptions) => {
      const start = getStartViewTransition();
      if (reduce || !start) {
        navigate();
        return;
      }
      start(async () => {
        navigate();
        if (options?.waitFor) {
          await waitForElement(options.waitFor);
        } else {
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
          );
        }
      });
    },
    [reduce]
  );

  const push = useCallback(
    (href: string, options?: TransitionOptions) => run(() => router.push(href), options),
    [router, run]
  );

  const back = useCallback(
    (options?: TransitionOptions) => run(() => router.back(), options),
    [router, run]
  );

  return { push, back };
}

/** Inline style helper for assigning a `view-transition-name`. */
export function viewTransitionStyle(name?: string): React.CSSProperties {
  return name ? ({ viewTransitionName: name } as React.CSSProperties) : {};
}
