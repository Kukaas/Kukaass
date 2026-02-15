import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Experience {
    _id: string;
    company: string;
    role: string;
    description: string[];
    location?: string;
    startDate: string | Date;
    endDate?: string | Date;
    isCurrent: boolean;
    createdAt: string | Date;
}

const fetchExperiences = async (): Promise<Experience[]> => {
    const response = await fetch('/api/experiences');
    if (!response.ok) {
        throw new Error('Failed to fetch experiences');
    }
    return response.json();
};

const createExperience = async (experienceData: Omit<Experience, '_id' | 'createdAt'>): Promise<Experience> => {
    const response = await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experienceData),
    });
    if (!response.ok) {
        throw new Error('Failed to create experience');
    }
    return response.json();
};

const updateExperience = async ({ id, data }: { id: string; data: Partial<Experience> }): Promise<Experience> => {
    const response = await fetch(`/api/experiences/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to update experience');
    }
    return response.json();
};

const deleteExperience = async (id: string): Promise<{ message: string }> => {
    const response = await fetch(`/api/experiences/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete experience');
    }
    return response.json();
};

export const experienceKeys = {
    all: ['experiences'] as const,
    lists: () => [...experienceKeys.all, 'list'] as const,
    details: () => [...experienceKeys.all, 'detail'] as const,
    detail: (id: string) => [...experienceKeys.details(), id] as const,
};

export const useExperiences = () => {
    return useQuery({
        queryKey: experienceKeys.lists(),
        queryFn: fetchExperiences,
        staleTime: 5 * 60 * 1000,
    });
};

export const useCreateExperience = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createExperience,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: experienceKeys.lists() });
        },
    });
};

export const useUpdateExperience = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateExperience,
        onSuccess: (data, variables) => {
            queryClient.setQueryData(experienceKeys.detail(variables.id), data);
            queryClient.invalidateQueries({ queryKey: experienceKeys.lists() });
        },
    });
};

export const useDeleteExperience = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteExperience,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: experienceKeys.lists() });
        },
    });
};
