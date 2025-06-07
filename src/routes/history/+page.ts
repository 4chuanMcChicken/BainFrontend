import type { PageLoad } from './$types';
import { fetchHistory } from '$lib/api';

export const load: PageLoad = async () => {
    try {
        const history = await fetchHistory(20);
        return {
            history
        };
    } catch (error) {
        return {
            history: [],
            error: 'Failed to load history'
        };
    }
}; 