'use client';

import { useState } from 'react';
import { FileUp, Trash2, CheckCircle, Circle, Download, Plus, Loader2, Pencil, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResumes, useUploadResume, useToggleResumeActive, useDeleteResume, useUpdateResume } from '@/hooks/use-resumes';
import { format } from 'date-fns';
import { fieldLabel } from './styles';

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
            <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-6 flex items-center gap-2 text-[14px] font-semibold text-foreground">
                    <FileUp className="size-4 text-brand" />
                    Upload new resume
                </h3>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className={fieldLabel}>Version label (internal)</label>
                            <Input
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                placeholder="e.g., Early 2026 Version"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className={fieldLabel}>Download filename</label>
                            <Input
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                placeholder="Maligaso, Chester Luke A"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className={fieldLabel}>PDF file</label>
                        <Input
                            id="resume-file"
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                            className="file:mr-4 file:border-0 file:bg-transparent file:text-brand"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={uploading || !selectedFile || !label}
                        className="w-full bg-brand text-brand-foreground hover:bg-brand-deep"
                    >
                        {uploading ? 'Processing…' : (
                            <>
                                <Plus className="size-4" />
                                Upload resume
                            </>
                        )}
                    </Button>
                </form>
            </div>

            {/* List Section */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {resumes.map((resume) => (
                    <div
                        key={resume._id}
                        className={`relative flex h-full flex-col rounded-lg border bg-card p-5 transition-colors ${resume.isActive ? 'border-brand/50 bg-brand/5' : 'border-border'}`}
                    >
                        <div className="flex-1">
                            <div className="mb-4 flex items-start justify-between gap-2">
                                {editingId === resume._id ? (
                                    <div className="w-full space-y-2 pr-8">
                                        <Input
                                            value={editLabel}
                                            onChange={(e) => setEditLabel(e.target.value)}
                                            className="h-8 text-sm"
                                            autoFocus
                                        />
                                        <p className={fieldLabel}>Internal label</p>
                                    </div>
                                ) : (
                                    <div>
                                        <h4 className="mb-1 text-[14px] font-semibold text-foreground">{resume.label}</h4>
                                        <p className="text-[11px] text-muted-foreground">Uploaded {format(new Date(resume.createdAt), 'MMM d, yyyy')}</p>
                                    </div>
                                )}
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => handleToggleActive(resume._id, resume.isActive)}
                                        disabled={toggleActiveMutation.isPending}
                                        className={`rounded-full p-1 transition-colors ${resume.isActive ? 'text-brand' : 'text-muted-foreground hover:text-foreground'} ${toggleActiveMutation.isPending ? 'cursor-not-allowed opacity-50' : ''}`}
                                        title={resume.isActive ? 'Active' : 'Set as Active'}
                                    >
                                        {toggleActiveMutation.isPending && toggleActiveMutation.variables?.id === resume._id ? (
                                            <Loader2 className="size-6 animate-spin" />
                                        ) : resume.isActive ? (
                                            <CheckCircle className="size-6" />
                                        ) : (
                                            <Circle className="size-6" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="mb-6 space-y-2">
                                {editingId === resume._id ? (
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={editFilename}
                                                    onChange={(e) => setEditFilename(e.target.value)}
                                                    className="h-8 text-sm"
                                                />
                                                <span className="text-sm text-muted-foreground">.pdf</span>
                                            </div>
                                            <p className={fieldLabel}>Download filename</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="group relative">
                                                <Input
                                                    type="file"
                                                    accept=".pdf,application/pdf"
                                                    onChange={handleEditFileChange}
                                                    className="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
                                                />
                                                <div className="flex h-8 items-center gap-3 overflow-hidden rounded-md border border-border bg-background/40 px-3 transition-colors group-hover:bg-accent">
                                                    <div className="flex min-w-fit items-center gap-1.5">
                                                        <FileUp className="size-3.5 text-brand" />
                                                        <span className="text-[11px] font-semibold uppercase tracking-tight text-brand">Attached:</span>
                                                    </div>
                                                    <span className="truncate text-xs font-medium text-foreground/90">
                                                        {editFile ? editFile.name : resume.originalFilename}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className={fieldLabel}>Replace file (optional)</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Download className="size-4 text-muted-foreground/70" />
                                        <span className="truncate">{resume.filename}.pdf</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 border-t border-border pt-4">
                            {editingId === resume._id ? (
                                <>
                                    <Button
                                        size="sm"
                                        className="flex-1 bg-brand text-brand-foreground hover:bg-brand-deep"
                                        onClick={() => handleUpdate(resume._id)}
                                        disabled={updateMutation.isPending}
                                    >
                                        {updateMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                                        Save
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1" onClick={cancelEditing}>
                                        <X className="size-4" /> Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outline" size="sm" className="flex-1" onClick={() => startEditing(resume)}>
                                        <Pencil className="size-3.5" /> Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
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
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                        onClick={() => handleDelete(resume._id)}
                                    >
                                        <Trash2 className="size-3.5" /> Delete
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {resumes.length === 0 && !isLoading && (
                <div className="py-12 text-center text-[13px] text-muted-foreground">
                    <span className="select-none text-muted-foreground/50">// </span>
                    No resumes uploaded yet.
                </div>
            )}
        </div>
    );
}
