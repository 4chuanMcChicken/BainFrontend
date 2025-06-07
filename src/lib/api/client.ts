import { toast } from '$lib/stores/toast';

interface ApiError {
    detail: {
        code: string;
        message: string;
    };
}

const API_BASE_URL = 'http://localhost:8000/api/v1';

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            const error = data as ApiError;
            throw new Error(error.detail?.message || 'An unexpected error occurred');
        }

        return data as T;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        toast.set({ type: 'error', message });
        throw error;
    }
}

export interface DistanceResponse {
    kilometers: number;
    miles: number;
}

export interface HistoryRecord {
    sourceAddress: string;
    destinationAddress: string;
    kilometers: number;
    miles: number;
    timestamp: string;
}

export async function fetchDistance(source: string, destination: string): Promise<DistanceResponse> {
    return apiFetch<DistanceResponse>('/distance', {
        method: 'POST',
        body: JSON.stringify({ source, destination }),
    });
}

export async function fetchHistory(limit = 20): Promise<HistoryRecord[]> {
    return apiFetch<HistoryRecord[]>(`/history?limit=${limit}`);
} 