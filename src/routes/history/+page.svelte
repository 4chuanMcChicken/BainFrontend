<script lang="ts">
  import { goto } from "$app/navigation";
  import PageTitle from "$lib/components/PageTitle.svelte";
  import type { HistoryRecord } from "$lib/api/client";
  import type { PageData } from "./$types";
  import { Calculator } from "svelte-heros-v2";

  export let data: PageData;
  const history: HistoryRecord[] = data.history;
</script>

<div class="mx-auto">
  <div class="flex justify-between items-start mb-8">
    <div>
      <PageTitle />
    </div>
    <button
      on:click={() => goto("/")}
      class="inline-flex items-center p-5 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
    >
      Back to Calculator <Calculator class="ml-4 h-4 w-4" />
    </button>
  </div>

  <div class="bg-white py-8 px-4">
    <div class="mb-8 ml-4">
      <h2 class="text-xl font-light mb-2">Historical Queries</h2>
      <p class=" text-base text-gray-600">History of the user's queries.</p>
    </div>

    <div class="bg-white shadow overflow-hidden ">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-300">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
              >
                Source Address
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
              >
                Destination Address
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
              >
                Distance in Miles
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
              >
                Distance in Kilometers
              </th>
            </tr>
          </thead>
          <tbody class="bg-gray-50 divide-y divide-gray-200">
            {#if history.length === 0}
              <tr>
                <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                  {data.error ?? "No historical queries found."}
                </td>
              </tr>
            {:else}
              {#each history as record}
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.source}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.destination}
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
</div>
