'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(false);

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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
                <GlassCard>
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Admin Access</h1>
                        <p className="text-gray-400 mt-2">Enter password to continue</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-white/40"
                            required
                        />
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        <Button
                            type="submit"
                            className="w-full bg-white text-black hover:bg-gray-100"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Access Admin'}
                        </Button>
                    </form>
                </GlassCard>
            </motion.div>
        </div>
    );
}
