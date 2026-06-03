'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2 } from 'lucide-react';
import { applyTheme, loadThemeId, themeById } from '@/components/editor/theme';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Inherit the editor's Filament Dark tokens.
    useEffect(() => {
        applyTheme(themeById(loadThemeId()));
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            setIsLoading(true);
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                // Refresh the page to trigger the layout re-check
                window.location.reload();
            } else {
                const data = await response.json();
                setError(data.error || 'Incorrect password');
                setPassword('');
            }
        } catch (err) {
            setError('An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[100dvh] items-center justify-center bg-background p-6 font-mono text-foreground antialiased">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card shadow-[0_16px_48px_-12px_rgba(0,0,0,0.55)]"
            >
                {/* Title bar */}
                <div className="flex h-9 select-none items-center gap-2 border-b border-border px-3 text-[12px] text-muted-foreground">
                    <span className="size-3 rounded-full" style={{ backgroundColor: '#ff5f57' }} aria-hidden="true" />
                    <span className="size-3 rounded-full" style={{ backgroundColor: '#febc2e' }} aria-hidden="true" />
                    <span className="size-3 rounded-full" style={{ backgroundColor: '#28c840' }} aria-hidden="true" />
                    <span className="ml-2 truncate">auth.ts — admin</span>
                </div>

                <div className="p-6">
                    <div className="mb-6 flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-md border border-border bg-background text-brand">
                            <Lock className="size-5" aria-hidden="true" />
                        </span>
                        <div>
                            <h1 className="text-[15px] font-semibold text-foreground">Admin access</h1>
                            <p className="text-[11px] text-muted-foreground">Enter password to continue</p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-3">
                        <div className="flex items-center gap-2 rounded-md border border-border bg-background/40 px-2.5 focus-within:border-brand">
                            <span className="select-none text-brand" aria-hidden="true">&gt;</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="password"
                                autoFocus
                                className="min-w-0 flex-1 bg-transparent py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none"
                                required
                            />
                        </div>
                        {error && (
                            <p className="text-[12px] text-destructive">
                                <span className="select-none text-muted-foreground">// </span>
                                {error}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-[13px] font-medium text-brand-foreground transition-colors hover:bg-brand-deep disabled:opacity-50 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                                    Verifying…
                                </>
                            ) : (
                                'Access admin'
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
