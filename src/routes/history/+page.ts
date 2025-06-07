import type { PageLoad } from './$types';
import type { HistoryRecord } from '$lib/api/client';
import { fetchHistory } from '$lib/api/client';

export const load: PageLoad = async () => {
    try {
        const history = await fetchHistory(20);
        return {
            history
        };
    } catch (err) {
        return {
            history: [] as HistoryRecord[],
            error: 'Failed to load history'
        };
    }
};
