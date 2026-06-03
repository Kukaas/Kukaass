'use client';

import { useState } from 'react';
import { Mail, Trash2, Building2, Loader2, MailOpen, CornerUpLeft, Maximize2 } from 'lucide-react';
import { format } from 'date-fns';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import Markdown from '@/components/shared/Markdown';
import { useContacts, useSetContactRead, useDeleteContact, type Contact } from '@/hooks/use-contacts';

const LONG_MESSAGE = 220;

export default function MessagesManager() {
    const { data: messages = [], isLoading } = useContacts();
    const setRead = useSetContactRead();
    const deleteContact = useDeleteContact();
    const [viewing, setViewing] = useState<Contact | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this message?')) return;
        await deleteContact.mutateAsync(id);
        setViewing((v) => (v?._id === id ? null : v));
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[1, 2].map((i) => (
                    <div key={i} className="h-44 animate-pulse rounded-lg border border-border bg-card" />
                ))}
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="py-16 text-center text-[13px] text-muted-foreground">
                <span className="select-none text-muted-foreground/50">// </span>
                No messages yet.
            </div>
        );
    }

    const unread = messages.filter((m) => !m.isRead).length;

    return (
        <div className="space-y-4">
            <p className="text-[12px] text-muted-foreground">
                <span className="text-foreground/80">{messages.length} messages</span>
                {unread > 0 && <span className="ml-2 text-brand">· {unread} unread</span>}
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {messages.map((m) => {
                    const isLong = m.message.length > LONG_MESSAGE || m.message.split('\n').length > 4;
                    return (
                        <div
                            key={m._id}
                            className={`flex min-h-56 flex-col rounded-lg border bg-card p-5 transition-colors ${m.isRead ? 'border-border' : 'border-brand/50 bg-brand/5'}`}
                        >
                            <div className="mb-3 flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        {!m.isRead && <span className="size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />}
                                        <h4 className="truncate text-[14px] font-semibold text-foreground">{m.name}</h4>
                                    </div>
                                    <a
                                        href={`mailto:${m.email}`}
                                        className="mt-0.5 flex items-center gap-1.5 text-[12px] text-brand hover:underline"
                                    >
                                        <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                                        <span className="truncate">{m.email}</span>
                                    </a>
                                    {m.company && (
                                        <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                            <Building2 className="size-3.5 shrink-0" aria-hidden="true" />
                                            <span className="truncate">{m.company}</span>
                                        </p>
                                    )}
                                </div>
                                <span className="shrink-0 text-right text-[10.5px] text-muted-foreground/70">
                                    {format(new Date(m.createdAt), 'MMM d, yyyy')}
                                </span>
                            </div>

                            <div className="flex-1">
                                <div className="max-h-19 overflow-hidden text-[13px] leading-relaxed text-foreground/85">
                                    <Markdown>{m.message}</Markdown>
                                </div>
                                {isLong && (
                                    <button
                                        type="button"
                                        onClick={() => setViewing(m)}
                                        className="mt-1 inline-flex items-center gap-1 text-[11.5px] text-brand transition-colors hover:text-brand-deep focus-visible:outline-none"
                                    >
                                        <Maximize2 className="size-3" /> View full message
                                    </button>
                                )}
                            </div>

                            <div className="mt-3 flex items-center gap-1 border-t border-border pt-3">
                                <button
                                    type="button"
                                    onClick={() => setRead.mutate({ id: m._id, isRead: !m.isRead })}
                                    disabled={setRead.isPending}
                                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                                >
                                    {m.isRead ? <CornerUpLeft className="size-3.5" /> : <MailOpen className="size-3.5" />}
                                    {m.isRead ? 'Unread' : 'Read'}
                                </button>
                                <a
                                    href={`mailto:${m.email}?subject=Re: your message`}
                                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                                >
                                    <Mail className="size-3.5" /> Reply
                                </a>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(m._id)}
                                    className="ml-auto inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-destructive transition-colors hover:bg-destructive/10 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                                    aria-label="Delete message"
                                >
                                    {deleteContact.isPending && deleteContact.variables === m._id ? (
                                        <Loader2 className="size-3.5 animate-spin" />
                                    ) : (
                                        <Trash2 className="size-3.5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Full message dialog */}
            <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
                <DialogContent className="max-w-lg font-mono">
                    {viewing && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-foreground">{viewing.name}</DialogTitle>
                                <DialogDescription asChild>
                                    <div className="space-y-0.5 text-muted-foreground">
                                        <a href={`mailto:${viewing.email}`} className="flex items-center gap-1.5 text-brand hover:underline">
                                            <Mail className="size-3.5" aria-hidden="true" /> {viewing.email}
                                        </a>
                                        {viewing.company && (
                                            <span className="flex items-center gap-1.5">
                                                <Building2 className="size-3.5" aria-hidden="true" /> {viewing.company}
                                            </span>
                                        )}
                                        <span className="text-[11px] text-muted-foreground/70">
                                            {format(new Date(viewing.createdAt), 'MMM d, yyyy · h:mm a')}
                                        </span>
                                    </div>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="editor-scroll max-h-[55vh] overflow-y-auto rounded-md border border-border bg-background/40 p-4 text-[13px] leading-relaxed text-foreground/90">
                                <Markdown>{viewing.message}</Markdown>
                            </div>
                            <div className="flex justify-end">
                                <a
                                    href={`mailto:${viewing.email}?subject=Re: your message`}
                                    className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-[12px] font-medium text-brand-foreground transition-colors hover:bg-brand-deep"
                                >
                                    <Mail className="size-3.5" /> Reply
                                </a>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
