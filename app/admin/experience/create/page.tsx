'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GlassCard from '@/components/GlassCard';
import { useCreateExperience } from '@/hooks/use-experiences';

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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.push('/admin')}
                                className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-200"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="font-medium">Back to Dashboard</span>
                            </motion.button>
                        </div>
                        <h1 className="text-3xl font-bold text-white">Add Experience</h1>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <GlassCard>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Company
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-colors"
                                        placeholder="Company name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Role
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-colors"
                                        placeholder="Job role"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-colors"
                                        placeholder="Location (e.g. Remote, Cebu City)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Map URL (Google Maps link)
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.mapUrl}
                                        onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-colors"
                                        placeholder="https://goo.gl/maps/..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
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
                                            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-colors"
                                            required
                                        >
                                            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, i) => (
                                                <option key={i} value={i} className="bg-gray-900">{month}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={formData.startDate ? parseInt(formData.startDate.split('-')[0]) : new Date().getFullYear()}
                                            onChange={(e) => {
                                                const month = formData.startDate ? formData.startDate.split('-')[1] : (new Date().getMonth() + 1).toString().padStart(2, '0');
                                                setFormData({ ...formData, startDate: `${e.target.value}-${month}-01` });
                                            }}
                                            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-colors"
                                            required
                                        >
                                            {Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                                <option key={year} value={year} className="bg-gray-900">{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
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
                                            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-colors disabled:opacity-50"
                                            disabled={formData.isCurrent}
                                            required={!formData.isCurrent}
                                        >
                                            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, i) => (
                                                <option key={i} value={i} className="bg-gray-900">{month}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={formData.endDate ? parseInt(formData.endDate.split('-')[0]) : new Date().getFullYear()}
                                            onChange={(e) => {
                                                const month = formData.endDate ? formData.endDate.split('-')[1] : (new Date().getMonth() + 1).toString().padStart(2, '0');
                                                setFormData({ ...formData, endDate: `${e.target.value}-${month}-01` });
                                            }}
                                            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-colors disabled:opacity-50"
                                            disabled={formData.isCurrent}
                                            required={!formData.isCurrent}
                                        >
                                            {Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                                <option key={year} value={year} className="bg-gray-900">{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="isCurrent"
                                            checked={formData.isCurrent}
                                            onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                                            className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                                        />
                                        <label htmlFor="isCurrent" className="text-sm text-gray-400">
                                            Currently working here
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-4">
                                    Description (Bullet Points)
                                </label>
                                <div className="space-y-4">
                                    {formData.description.map((desc, index) => (
                                        <div key={index} className="flex gap-3">
                                            <div className="flex-1">
                                                <textarea
                                                    value={desc}
                                                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-colors"
                                                    placeholder="Describe your responsibilities or achievements..."
                                                    rows={2}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveDescription(index)}
                                                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors h-fit self-center"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleAddDescription}
                                        className="w-full py-3 border border-dashed border-white/20 rounded-lg text-gray-400 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2 mt-2"
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
                                    className={`px-8 py-3 rounded-lg font-medium transition-all ${submitting
                                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                                        : 'bg-white text-black hover:bg-gray-100 shadow-lg'
                                        }`}
                                >
                                    {submitting ? 'Creating...' : 'Create Experience'}
                                </motion.button>
                            </div>
                        </form>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
}
