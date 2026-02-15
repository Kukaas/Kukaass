import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Resume {
    _id: string;
    label: string;
    filename: string;
    originalFilename?: string;
    content: string;
    contentType: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export function useResumes() {
    return useQuery<Resume[]>({
        queryKey: ['resumes'],
        queryFn: async () => {
            const response = await fetch('/api/resumes');
            if (!response.ok) throw new Error('Failed to fetch resumes');
            return response.json();
        }
    });
}

export function useActiveResume() {
    return useQuery<Resume | null>({
        queryKey: ['resumes', 'active'],
        queryFn: async () => {
            const response = await fetch('/api/resumes?active=true');
            if (!response.ok) throw new Error('Failed to fetch active resume');
            return response.json();
        }
    });
}

export function useUploadResume() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<Resume>) => {
            const response = await fetch('/api/resumes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to upload resume');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resumes'] });
        }
    });
}

export function useUpdateResume() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, label, filename, originalFilename, content, contentType }: { id: string; label?: string; filename?: string; originalFilename?: string; content?: string; contentType?: string }) => {
            const response = await fetch(`/api/resumes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ label, filename, originalFilename, content, contentType }),
            });
            if (!response.ok) throw new Error('Failed to update resume');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resumes'] });
        }
    });
}

export function useToggleResumeActive() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
            const response = await fetch(`/api/resumes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive }),
            });
            if (!response.ok) throw new Error('Failed to update resume');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resumes'] });
        }
    });
}

export function useDeleteResume() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/resumes/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete resume');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resumes'] });
        }
    });
}
