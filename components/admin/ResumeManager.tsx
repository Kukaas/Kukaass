import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileUp, Trash2, CheckCircle, Circle, Download, Plus, Loader2, Edit, X, Save } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResumes, useUploadResume, useToggleResumeActive, useDeleteResume, useUpdateResume } from '@/hooks/use-resumes';
import { format } from 'date-fns';

export default function ResumeManager() {
    const { data: resumes = [], isLoading } = useResumes();
    const uploadMutation = useUploadResume();
    const toggleActiveMutation = useToggleResumeActive();
    const deleteMutation = useDeleteResume();
    const updateMutation = useUpdateResume();

    const [label, setLabel] = useState('');
    const [filename, setFilename] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editLabel, setEditLabel] = useState('');
    const [editFilename, setEditFilename] = useState('');
    const [editFile, setEditFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setFilename(file.name.replace(/\.[^/.]+$/, ""));
        }
    };

    const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setEditFile(file);
            setEditFilename(file.name.replace(/\.[^/.]+$/, ""));
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !label) return;

        setUploading(true);
        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Content = reader.result as string;
                await uploadMutation.mutateAsync({
                    label,
                    filename: filename || selectedFile.name.replace(/\.[^/.]+$/, ""),
                    originalFilename: selectedFile.name,
                    content: base64Content,
                    contentType: selectedFile.type,
                });
                setLabel('');
                setSelectedFile(null);
                // Reset file input
                const fileInput = document.getElementById('resume-file') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            };
            reader.readAsDataURL(selectedFile);
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        if (currentStatus) return; // Already active
        await toggleActiveMutation.mutateAsync({ id, isActive: true });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this resume?')) return;
        await deleteMutation.mutateAsync(id);
    };

    const startEditing = (resume: any) => {
        setEditingId(resume._id);
        setEditLabel(resume.label);
        setEditFilename(resume.filename);
        setEditFile(null);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditFile(null);
    };

    const handleUpdate = async (id: string) => {
        try {
            let updateData: any = {
                id,
                label: editLabel,
                filename: editFilename
            };

            if (editFile) {
                const reader = new FileReader();
                const filePromise = new Promise<{ content: string; contentType: string }>((resolve) => {
                    reader.onloadend = () => {
                        resolve({
                            content: reader.result as string,
                            contentType: editFile.type
                        });
                    };
                });
                reader.readAsDataURL(editFile);
                const { content, contentType } = await filePromise;
                updateData.content = content;
                updateData.contentType = contentType;
                updateData.originalFilename = editFile.name;
            }

            await updateMutation.mutateAsync(updateData);
            setEditingId(null);
            setEditFile(null);
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    return (
        <div className="space-y-8">
            {/* Upload Section */}
            <GlassCard>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FileUp className="w-5 h-5 text-blue-400" />
                    Upload New Resume
                </h3>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Version Label (Internal)</label>
                            <Input
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                placeholder="e.g., Early 2026 Version"
                                className="bg-white/5 border-white/10 text-white"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Download Filename</label>
                            <Input
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                placeholder="Maligaso, Chester Luke A"
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">PDF File</label>
                        <Input
                            id="resume-file"
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                            className="bg-white/5 border-white/10 text-white file:text-blue-400 file:mr-4 file:bg-transparent file:border-0"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={uploading || !selectedFile || !label}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2"
                    >
                        {uploading ? 'Processing...' : (
                            <>
                                <Plus className="w-4 h-4" />
                                Upload Resume
                            </>
                        )}
                    </Button>
                </form>
            </GlassCard>

            {/* List Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resumes.map((resume) => (
                    <GlassCard key={resume._id} className={`relative flex flex-col h-full border-2 transition-colors ${resume.isActive ? 'border-blue-500/50 bg-blue-500/5' : 'border-transparent'}`}>
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                                {editingId === resume._id ? (
                                    <div className="space-y-2 w-full pr-8">
                                        <Input
                                            value={editLabel}
                                            onChange={(e) => setEditLabel(e.target.value)}
                                            className="bg-white/10 border-white/20 text-white h-8 text-sm"
                                            autoFocus
                                        />
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Internal Label</p>
                                    </div>
                                ) : (
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-1">{resume.label}</h4>
                                        <p className="text-xs text-gray-400">Uploaded {format(new Date(resume.createdAt), 'MMM d, yyyy')}</p>
                                    </div>
                                )}
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => handleToggleActive(resume._id, resume.isActive)}
                                        disabled={toggleActiveMutation.isPending}
                                        className={`p-1 rounded-full transition-colors ${resume.isActive ? 'text-blue-400' : 'text-gray-500 hover:text-white'} ${toggleActiveMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        title={resume.isActive ? 'Active' : 'Set as Active'}
                                    >
                                        {toggleActiveMutation.isPending && toggleActiveMutation.variables?.id === resume._id ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : resume.isActive ? (
                                            <CheckCircle className="w-6 h-6" />
                                        ) : (
                                            <Circle className="w-6 h-6" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                {editingId === resume._id ? (
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={editFilename}
                                                    onChange={(e) => setEditFilename(e.target.value)}
                                                    className="bg-white/10 border-white/20 text-white h-8 text-sm"
                                                />
                                                <span className="text-gray-500 text-sm">.pdf</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Download Filename</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="relative group">
                                                <Input
                                                    type="file"
                                                    accept=".pdf,application/pdf"
                                                    onChange={handleEditFileChange}
                                                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                                                />
                                                <div className="bg-white/10 border border-white/20 rounded-md h-8 px-3 flex items-center gap-3 overflow-hidden group-hover:bg-white/15 transition-colors">
                                                    <div className="flex items-center gap-1.5 min-w-fit">
                                                        <FileUp className="w-3.5 h-3.5 text-blue-400" />
                                                        <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-tight">Attached File:</span>
                                                    </div>
                                                    <span className="text-xs text-gray-200 font-medium truncate">
                                                        {editFile ? editFile.name : resume.originalFilename}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Replace File (Optional)</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <Download className="w-4 h-4 text-gray-500" />
                                        <span className="truncate">{resume.filename}.pdf</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-white/10">
                            {editingId === resume._id ? (
                                <>
                                    <Button
                                        size="sm"
                                        className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/20"
                                        onClick={() => handleUpdate(resume._id)}
                                        disabled={updateMutation.isPending}
                                    >
                                        {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                        Save
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 border-white/20 text-white hover:bg-white/5"
                                        onClick={cancelEditing}
                                    >
                                        <X className="w-4 h-4 mr-2" /> Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 border-white/20 text-white hover:bg-white/5"
                                        onClick={() => startEditing(resume)}
                                    >
                                        <Edit className="w-4 h-4 mr-2" /> Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 border-white/20 text-white hover:bg-white/5"
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = resume.content;
                                            link.download = `${resume.filename}.pdf`;
                                            link.click();
                                        }}
                                    >
                                        Preview
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 border-red-500/20"
                                        onClick={() => handleDelete(resume._id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                    </Button>
                                </>
                            )}
                        </div>
                    </GlassCard>
                ))}
            </div>

            {resumes.length === 0 && !isLoading && (
                <div className="text-center py-12">
                    <p className="text-gray-400">No resumes uploaded yet.</p>
                </div>
            )}
        </div>
    );
}
