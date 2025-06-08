<script lang="ts">
  // import { Button, Label, Input, Radio } from 'flowbite-svelte';
  import { Calculator, Clock } from "svelte-heros-v2";
  import { goto } from "$app/navigation";
  import { fetchDistance } from "$lib/api/client";
  import { toast } from "$lib/stores/toast";
  import PageTitle from "$lib/components/PageTitle.svelte";
  import { googlePlacesAutocomplete } from '$lib/actions/googlePlacesAutocomplete';

  let sourceAddress = "";
  let destinationAddress = "";
  let isLoading = false;
  let result: { kilometers: number; miles: number } | null = null;
  let selectedUnit: "Miles" | "Kilometers" | "Both" = "Miles";

  const handleAddressSelect = (type: 'source' | 'destination') => (place: any) => {
    if (type === 'source') {
      sourceAddress = place.formatted_address;
    } else {
      destinationAddress = place.formatted_address;
    }
  };

  const handleSubmit = async () => {
    if (!sourceAddress || !destinationAddress) {
      toast.set({
        type: "error",
        message: "Please enter both addresses",
      });
      return;
    }

    isLoading = true;
    try {
      result = await fetchDistance(sourceAddress, destinationAddress);
      toast.set({
        type: "success",
        message: "Distance calculated successfully!",
      });

    } catch (error) {
      toast.set({
        type: "error",
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      isLoading = false;
    }
  };
</script>

<div class="mx-auto">
  <div class="flex justify-between items-start mb-4">
    <PageTitle />
    <button
      on:click={() => goto("/history")}
      class="inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium text-white bg-black hover:bg-gray-700"
    >
      View Historical Queries <Clock class="ml-4 h-5 w-5" />
    </button>
  </div>

  <div class="bg-white p-4 space-y-6">
    <div class="flex gap-6">
      <div class="basis-1/3">
        <label for="source" class="block text-sm font-medium text-gray-700 mb-1"
          >Source Address</label
        >
        <input
          type="text"
          id="source"
          bind:value={sourceAddress}
          use:googlePlacesAutocomplete={{
            onSelect: handleAddressSelect('source'),
            onError: (error) => {
              toast.set({
                type: "error",
                message: "Failed to load address suggestions. Please try typing the full address.",
              });
            }
          }}
          class="w-full p-2 border-0 border-b border-gray-300 bg-transparent
          focus:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-transparent
          transition-colors"
          placeholder="Enter source address"
        />
      </div>
      <div class="basis-1/3">
        <label
          for="destination"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Destination Address</label
        >
        <input
          type="text"
          id="destination"
          bind:value={destinationAddress}
          use:googlePlacesAutocomplete={{
            onSelect: handleAddressSelect('destination'),
            onError: (error) => {
              toast.set({
                type: "error",
                message: "Failed to load address suggestions. Please try typing the full address.",
              });
            }
          }}
          class="w-full p-2 border-0 border-b border-gray-300 bg-transparent
          focus:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-transparent
          transition-colors"
          placeholder="Enter destination address"
        />
      </div>
      <div class="basis-1/3 flex gap-4">
        <fieldset class="basis-1/4">
          <legend class="block text-sm font-medium text-gray-700 mb-2"
            >Unit</legend
          >
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
        </fieldset>
        <div class="basis-3/4">
          <div class="block text-sm font-medium text-gray-700 mb-2">
            Distance
          </div>
          {#if result}
            <p class="text-lg truncate">
              {selectedUnit === "Miles"
                ? `${result.miles.toFixed(2)} miles`
                : selectedUnit === "Kilometers"
                  ? `${result.kilometers.toFixed(2)} kilometers`
                  : `${result.miles.toFixed(2)} mi / ${result.kilometers.toFixed(2)} km`}
            </p>
          {/if}
        </div>
      </div>
    </div>

    <div>
      <button
        on:click={handleSubmit}
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
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Calculating...
        {:else}
          Calculate Distance <Calculator class="ml-4 h-4 w-4" />
        {/if}
      </button>
    </div>
  </div>
</div>
