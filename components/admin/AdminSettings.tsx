'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
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
        return <div className="h-48 bg-white/5 rounded-2xl animate-pulse" />;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Global Settings</h2>

            <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label htmlFor="chatbot-mode" className="text-lg text-white font-medium">
                            AI Chatbot Assistant
                        </Label>
                        <p className="text-sm text-gray-400">
                            Enable or disable the AI chatbot on the public portfolio.
                            {chatbotEnabled ? (
                                <span className="text-green-400 ml-2">(Active)</span>
                            ) : (
                                <span className="text-red-400 ml-2">(Inactive)</span>
                            )}
                        </p>
                    </div>
                    <Switch
                        id="chatbot-mode"
                        checked={chatbotEnabled}
                        onCheckedChange={handleToggle}
                        className="data-[state=checked]:bg-blue-500"
                    />
                </div>
            </GlassCard>
        </div>
    );
}
