'use client';

import { useEffect } from 'react';

/**
 * ConsoleProtection component
 *
 * This component handles disabling console methods and implementing
 * basic DevTools detection/deterrence when running in production.
 */
export default function ConsoleProtection() {
    useEffect(() => {
        // Only run in production
        if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production') {
            return;
        }

        // 1. Display a "STOP" warning message (like Facebook)
        // This is the "comment" or warning usually seen on large sites.
        const warningTitle = 'STOP!';
        const warningText = 'This is a browser feature intended for developers. If someone told you to copy-paste something here to enable a feature or "hack" someone\'s account, it is a scam and will give them access to your account.';

        try {
            console.log(
                `%c${warningTitle}`,
                'color: red; font-family: sans-serif; font-size: 4.5em; font-weight: bolder; text-shadow: #000 1px 1px;'
            );
            console.log(
                `%c${warningText}`,
                'font-family: sans-serif; font-size: 1.5em; font-weight: bold;'
            );
        } catch (e) {
            // Fallback if styled logging fails
        }

        // 2. Override standard console methods using Object.defineProperty
        // to make them harder to override back by a user.
        const noop = () => { };
        const methods = [
            'log', 'debug', 'info', 'warn', 'error',
            'table', 'clear', 'time', 'timeEnd',
            'count', 'assert', 'dir', 'dirxml',
            'group', 'groupCollapsed', 'groupEnd'
        ];

        methods.forEach((method) => {
            try {
                if (typeof window !== 'undefined' && window.console) {
                    Object.defineProperty(window.console, method, {
                        value: noop,
                        writable: false,
                        configurable: false
                    });
                }
            } catch (e) {
                // Fallback to simple assignment if defineProperty fails
                // @ts-ignore
                window.console[method] = noop;
            }
        });

        // 3. Periodic clear to discourage injection
        if (typeof window !== 'undefined' && window.console) {
            const interval = setInterval(() => {
                try {
                    // Use the original clear if we can, or just do nothing
                    // since we've already overridden it to noop above.
                    // Actually, let's NOT clear periodically if we want the warning to stay.
                    // Instead, let's just keep the overrides.
                } catch (e) { }
            }, 3000);

            return () => clearInterval(interval);
        }
    }, []);

    return null;
}
