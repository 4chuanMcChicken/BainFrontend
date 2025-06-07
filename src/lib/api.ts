interface DistanceResponse {
    kilometers: number;
    miles: number;
}

interface HistoryRecord {
    source: string;
    destination: string;
    kilometers: number;
    miles: number;
    timestamp: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export async function fetchDistance(source: string, destination: string): Promise<DistanceResponse> {
    const response = await fetch(`${API_BASE_URL}/distance`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            source,
            destination,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail?.message || 'Failed to calculate distance');
    }

    return response.json();
}

export async function fetchHistory(limit = 20): Promise<Array<HistoryRecord>> {
    const response = await fetch(`${API_BASE_URL}/history?limit=${limit}`);

    if (!response.ok) {
        throw new Error('Failed to fetch history');
    }

    return response.json();
} 