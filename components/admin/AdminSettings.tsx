'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AdminSettings() {
    const [chatbotEnabled, setChatbotEnabled] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (data.chatbot_enabled !== undefined) {
                setChatbotEnabled(data.chatbot_enabled);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (checked: boolean) => {
        setChatbotEnabled(checked);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'chatbot_enabled', value: checked }),
            });

            if (!res.ok) throw new Error('Failed to update');
            toast.success(`Chatbot ${checked ? 'enabled' : 'disabled'} successfully`);
        } catch (error) {
            console.error('Error updating setting:', error);
            toast.error('Failed to update setting');
            setChatbotEnabled(!checked); // Revert on error
        }
    };

    if (loading) {
        return <div className="mx-auto h-32 max-w-2xl animate-pulse rounded-lg border border-border bg-card" />;
    }

    return (
        <div className="mx-auto max-w-2xl">
            <h2 className="mb-1 text-[15px] font-semibold text-foreground">Global settings</h2>
            <p className="mb-6 text-[12px] text-muted-foreground">
                <span className="select-none text-muted-foreground/50">// </span>
                Toggles that affect the public portfolio.
            </p>

            <div className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="chatbot-mode" className="text-[14px] font-medium text-foreground">
                            AI chatbot assistant
                        </Label>
                        <p className="text-[12px] text-muted-foreground">
                            Enable or disable the AI chatbot on the public portfolio.
                            {chatbotEnabled ? (
                                <span className="ml-2 text-brand">(active)</span>
                            ) : (
                                <span className="ml-2 text-muted-foreground/70">(inactive)</span>
                            )}
                        </p>
                    </div>
                    <Switch
                        id="chatbot-mode"
                        checked={chatbotEnabled}
                        onCheckedChange={handleToggle}
                        className="data-[state=checked]:bg-brand"
                    />
                </div>
            </div>
        </div>
    );
}
