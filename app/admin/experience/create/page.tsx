'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ArrowLeft, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCreateExperience } from '@/hooks/use-experiences';
import AdminShell from '@/components/admin/AdminShell';

export default function CreateExperience() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const createExperienceMutation = useCreateExperience();

    const [formData, setFormData] = useState({
        company: '',
        role: '',
        location: '',
        mapUrl: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: [''],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const submissionData = {
                ...formData,
                description: formData.description.filter(desc => desc.trim() !== ''),
            };

            await createExperienceMutation.mutateAsync(submissionData as any);
            router.push('/admin');
        } catch (error) {
            console.error('Error saving experience:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddDescription = () => {
        setFormData({ ...formData, description: [...formData.description, ''] });
    };

    const handleDescriptionChange = (index: number, value: string) => {
        const newDescription = [...formData.description];
        newDescription[index] = value;
        setFormData({ ...formData, description: newDescription });
    };

    const handleRemoveDescription = (index: number) => {
        const newDescription = formData.description.filter((_, i) => i !== index);
        setFormData({ ...formData, description: newDescription });
    };

    return (
        <AdminShell activeSection="experiences" tabLabel="new-experience.tsx" tabIcon={Briefcase}>
            <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/80 px-5 py-3 backdrop-blur">
                <button
                    type="button"
                    onClick={() => router.push('/admin')}
                    className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                    <ArrowLeft className="size-4" /> Back
                </button>
                <span className="text-border">/</span>
                <span className="text-[12px] text-foreground/80">Add experience</span>
            </div>

            <div className="mx-auto max-w-4xl p-5">
                <div className="rounded-lg border border-border bg-card p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                        Company
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full px-4 py-3 rounded-md border border-border bg-background/40 text-foreground focus:outline-none focus:border-brand transition-colors"
                                        placeholder="Company name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                        Role
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-4 py-3 rounded-md border border-border bg-background/40 text-foreground focus:outline-none focus:border-brand transition-colors"
                                        placeholder="Job role"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-4 py-3 rounded-md border border-border bg-background/40 text-foreground focus:outline-none focus:border-brand transition-colors"
                                        placeholder="Location (e.g. Remote, Cebu City)"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                        Map URL (Google Maps link)
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.mapUrl}
                                        onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                                        className="w-full px-4 py-3 rounded-md border border-border bg-background/40 text-foreground focus:outline-none focus:border-brand transition-colors"
                                        placeholder="https://goo.gl/maps/..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                        Start Date
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <select
                                            value={formData.startDate ? parseInt(formData.startDate.split('-')[1]) - 1 : 0}
                                            onChange={(e) => {
                                                const year = formData.startDate ? formData.startDate.split('-')[0] : new Date().getFullYear().toString();
                                                const month = (parseInt(e.target.value) + 1).toString().padStart(2, '0');
                                                setFormData({ ...formData, startDate: `${year}-${month}-01` });
                                            }}
                                            className="px-4 py-3 rounded-md border border-border bg-background/40 text-foreground focus:outline-none focus:border-brand transition-colors"
                                            required
                                        >
                                            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, i) => (
                                                <option key={i} value={i} className="bg-card text-foreground">{month}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={formData.startDate ? parseInt(formData.startDate.split('-')[0]) : new Date().getFullYear()}
                                            onChange={(e) => {
                                                const month = formData.startDate ? formData.startDate.split('-')[1] : (new Date().getMonth() + 1).toString().padStart(2, '0');
                                                setFormData({ ...formData, startDate: `${e.target.value}-${month}-01` });
                                            }}
                                            className="px-4 py-3 rounded-md border border-border bg-background/40 text-foreground focus:outline-none focus:border-brand transition-colors"
                                            required
                                        >
                                            {Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                                <option key={year} value={year} className="bg-card text-foreground">{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                        End Date
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <select
                                            value={formData.endDate ? parseInt(formData.endDate.split('-')[1]) - 1 : 0}
                                            onChange={(e) => {
                                                const year = formData.endDate ? formData.endDate.split('-')[0] : new Date().getFullYear().toString();
                                                const month = (parseInt(e.target.value) + 1).toString().padStart(2, '0');
                                                setFormData({ ...formData, endDate: `${year}-${month}-01` });
                                            }}
                                            className="px-4 py-3 rounded-md border border-border bg-background/40 text-foreground focus:outline-none focus:border-brand transition-colors disabled:opacity-50"
                                            disabled={formData.isCurrent}
                                            required={!formData.isCurrent}
                                        >
                                            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, i) => (
                                                <option key={i} value={i} className="bg-card text-foreground">{month}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={formData.endDate ? parseInt(formData.endDate.split('-')[0]) : new Date().getFullYear()}
                                            onChange={(e) => {
                                                const month = formData.endDate ? formData.endDate.split('-')[1] : (new Date().getMonth() + 1).toString().padStart(2, '0');
                                                setFormData({ ...formData, endDate: `${e.target.value}-${month}-01` });
                                            }}
                                            className="px-4 py-3 rounded-md border border-border bg-background/40 text-foreground focus:outline-none focus:border-brand transition-colors disabled:opacity-50"
                                            disabled={formData.isCurrent}
                                            required={!formData.isCurrent}
                                        >
                                            {Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                                <option key={year} value={year} className="bg-card text-foreground">{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="isCurrent"
                                            checked={formData.isCurrent}
                                            onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                                            className="size-4 rounded border-border bg-background text-brand accent-brand focus:ring-2 focus:ring-ring/50"
                                        />
                                        <label htmlFor="isCurrent" className="text-sm text-muted-foreground">
                                            Currently working here
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="mb-4 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                    Description (Bullet Points)
                                </label>
                                <div className="space-y-4">
                                    {formData.description.map((desc, index) => (
                                        <div key={index} className="flex gap-3">
                                            <div className="flex-1">
                                                <textarea
                                                    value={desc}
                                                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                                    className="w-full px-4 py-2 rounded-md border border-border bg-background/40 text-foreground focus:outline-none focus:border-brand transition-colors"
                                                    placeholder="Describe your responsibilities or achievements..."
                                                    rows={2}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveDescription(index)}
                                                className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors h-fit self-center"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleAddDescription}
                                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border py-3 text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Add Bullet Point
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <motion.button
                                    type="submit"
                                    disabled={submitting}
                                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                                    className={`rounded-md px-8 py-3 font-medium transition-colors ${submitting
                                        ? 'cursor-not-allowed bg-muted text-muted-foreground'
                                        : 'bg-brand text-brand-foreground hover:bg-brand-deep'
                                        }`}
                                >
                                    {submitting ? 'Creating…' : 'Create experience'}
                                </motion.button>
                            </div>
                        </form>
                </div>
            </div>
        </AdminShell>
    );
}
