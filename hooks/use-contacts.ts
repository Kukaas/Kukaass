import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Contact {
    _id: string;
    name: string;
    company?: string;
    email: string;
    message: string;
    isRead: boolean;
    createdAt: string | Date;
}

export interface ContactInput {
    name: string;
    company?: string;
    email: string;
    message: string;
}

const fetchContacts = async (): Promise<Contact[]> => {
    const response = await fetch('/api/contact');
    if (!response.ok) {
        throw new Error('Failed to fetch messages');
    }
    return response.json();
};

const createContact = async (data: ContactInput): Promise<{ message: string; id: string }> => {
    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to send message');
    }
    return response.json();
};

const setContactRead = async ({ id, isRead }: { id: string; isRead: boolean }): Promise<Contact> => {
    const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead }),
    });
    if (!response.ok) {
        throw new Error('Failed to update message');
    }
    return response.json();
};

const deleteContact = async (id: string): Promise<{ message: string }> => {
    const response = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
    if (!response.ok) {
        throw new Error('Failed to delete message');
    }
    return response.json();
};

export const contactKeys = {
    all: ['contacts'] as const,
    lists: () => [...contactKeys.all, 'list'] as const,
};

export const useContacts = () => {
    return useQuery({
        queryKey: contactKeys.lists(),
        queryFn: fetchContacts,
        staleTime: 60 * 1000,
    });
};

export const useCreateContact = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createContact,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
        },
    });
};

export const useSetContactRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: setContactRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
        },
    });
};

export const useDeleteContact = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteContact,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
        },
    });
};
