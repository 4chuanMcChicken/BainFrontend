<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchHistory } from '$lib/api/client';
    import type { HistoryRecord } from '$lib/api/client';
    import { goto } from '$app/navigation';
    import PageTitle from '$lib/components/PageTitle.svelte';

    let history: HistoryRecord[] = [];
    let isLoading = false;

    onMount(async () => {
        isLoading = true;
        try {
            history = await fetchHistory();
        } catch (error) {
            // Handle error silently
        } finally {
            isLoading = false;
        }
    });
</script>

<div class="mx-auto">
    <div class="flex justify-between items-start mb-8">
        <div>
            <PageTitle />
            <div class="mt-8">
                <h2 class="text-xl font-medium mb-2">Historical Queries</h2>
                <p class="text-gray-600">History of the user's queries.</p>
            </div>
        </div>
        <button
            on:click={() => goto('/')}
            class="inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
            Back to Calculator
            <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
        </button>
    </div>

    <div class="bg-white shadow overflow-hidden rounded-lg">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Source Address
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Destination Address
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Distance in Miles
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Distance in Kilometers
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    {#if isLoading}
                        <tr>
                            <td colspan="4" class="px-6 py-4 text-center">
                                <svg
                                    class="animate-spin h-5 w-5 text-gray-500 mx-auto"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                                    <path
                                        class="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            </td>
                        </tr>
                    {:else if history.length === 0}
                        <tr>
                            <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                                No historical queries found.
                            </td>
                        </tr>
                    {:else}
                        {#each history as record}
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {record.sourceAddress}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {record.destinationAddress}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {record.miles.toFixed(2)}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {record.kilometers.toFixed(2)}
                                </td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </div>
    </div>
</div> 