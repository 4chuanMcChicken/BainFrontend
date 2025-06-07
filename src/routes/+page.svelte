<script lang="ts">
  import { fetchDistance } from "$lib/api";
  import { goto } from "$app/navigation";

  let sourceAddress = "";
  let destinationAddress = "";
  let isLoading = false;
  let error: { message: string } | null = null;
  let result: { kilometers: number; miles: number } | null = null;
  let selectedUnit: "Miles" | "Kilometers" | "Both" = "Miles";

  async function calculateDistance() {
    if (!sourceAddress || !destinationAddress) return;

    isLoading = true;
    error = null;
    result = null;

    try {
      result = await fetchDistance(sourceAddress, destinationAddress);
    } catch (e) {
      error = {
        message: e instanceof Error ? e.message : "Something went wrong",
      };
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="mx-auto p-4">

    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold">Distance Calculator</h1>
      <button
        on:click={() => goto('/history')}
        class="inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        View Historical Queries
        <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  
    <p class="text-gray-600 mb-8">Prototype web application for calculating the distance between addresses.</p>
  

    <div class="bg-white p-4 space-y-6">

      <div class="flex flex-col md:flex-row gap-6">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          <div>
            <label for="source" class="block text-sm font-medium text-gray-700 mb-1">Source Address</label>
            <input
              type="text"
              id="source"
              bind:value={sourceAddress}
              class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter source address"
            />
          </div>
          <div>
            <label for="destination" class="block text-sm font-medium text-gray-700 mb-1">
              Destination Address
            </label>
            <input
              type="text"
              id="destination"
              bind:value={destinationAddress}
              class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter destination address"
            />
          </div>
        </div>

        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Unit</label>
            <div class="flex flex-col space-y-2">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  bind:group={selectedUnit}
                  value="Miles"
                  class="form-radio h-4 w-4 text-blue-600"
                />
                <span class="ml-2">Miles</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  bind:group={selectedUnit}
                  value="Kilometers"
                  class="form-radio h-4 w-4 text-blue-600"
                />
                <span class="ml-2">Kilometers</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  bind:group={selectedUnit}
                  value="Both"
                  class="form-radio h-4 w-4 text-blue-600"
                />
                <span class="ml-2">Both</span>
              </label>
            </div>
          </div>
  
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Distance</label>
            {#if result}
              <div class="flex flex-row gap-4">
                {#if selectedUnit === 'Miles' || selectedUnit === 'Both'}
                  <p class="text-lg">{result.miles.toFixed(2)} miles</p>
                {/if}
                {#if selectedUnit === 'Kilometers' || selectedUnit === 'Both'}
                  <p class="text-lg">{result.kilometers.toFixed(2)} kilometers</p>
                {/if}
              </div>
            {/if}
          </div>
        </div>
      </div>
  

      <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
        <button
          on:click={calculateDistance}
          disabled={isLoading || !sourceAddress || !destinationAddress}
          class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
        >
          {#if isLoading}
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            Calculating...
          {:else}
            Calculate Distance
          {/if}
        </button>
  
        {#if error}
          <div role="alert" class="bg-red-50 border-l-4 border-red-400 p-4 mt-2 md:mt-0">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Calculation failed</h3>
                <p class="text-sm text-red-700 mt-1">{error.message}</p>
              </div>
              <div class="ml-auto pl-3">
                <button on:click={() => (error = null)} class="inline-flex text-red-400 hover:text-red-500" aria-label="Close">
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
  