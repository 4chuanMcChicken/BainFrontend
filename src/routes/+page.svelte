<script lang="ts">
  // import { Button, Label, Input, Radio } from 'flowbite-svelte';
  import { Calculator, Clock } from "svelte-heros-v2";
  import { goto } from "$app/navigation";
  import { fetchDistance } from "$lib/api/client";
  import { toast } from "$lib/stores/toast";
  import PageTitle from "$lib/components/PageTitle.svelte";
  import { googlePlacesAutocomplete } from "$lib/actions/googlePlacesAutocomplete";
  import { showRecaptcha } from "$lib/actions/recaptcha";

  const MAX_ADDRESS_LENGTH = 50;

  let sourceAddress = "";
  let destinationAddress = "";
  let isLoading = false;
  let result: {
    kilometers: number;
    miles: number;
    source_address: string;
    destination_address: string;
    source_corrected: boolean;
    destination_corrected: boolean;
  } | null = null;
  let selectedUnit: "Miles" | "Kilometers" | "Both" = "Miles";

  const handleAddressSelect =
    (type: "source" | "destination") => (place: any) => {
      if (type === "source") {
        sourceAddress = place.formatted_address.slice(0, MAX_ADDRESS_LENGTH);
      } else {
        destinationAddress = place.formatted_address.slice(
          0,
          MAX_ADDRESS_LENGTH
        );
      }
    };

  $: if (sourceAddress.length > MAX_ADDRESS_LENGTH) {
    sourceAddress = sourceAddress.slice(0, MAX_ADDRESS_LENGTH);
  }

  $: if (destinationAddress.length > MAX_ADDRESS_LENGTH) {
    destinationAddress = destinationAddress.slice(0, MAX_ADDRESS_LENGTH);
  }

  const handleSubmit = async () => {
    if (!sourceAddress || !destinationAddress) {
      toast.set({
        type: "error",
        message: "Please enter both addresses",
      });
      return;
    }

    let captchaToken: string;

    try {
      captchaToken = await showRecaptcha({
        siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
        onError: (error) => {
          toast.set({
            type: "error",
            message: "reCAPTCHA verification failed. Please try again.",
          });
        },
      });

      isLoading = true;
      result = await fetchDistance(
        sourceAddress,
        destinationAddress,
        captchaToken
      );
      toast.set({
        type: "success",
        message: "Distance calculated successfully!",
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("reCAPTCHA")) {
        return;
      }
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
        <div class="space-y-1">
          <input
            type="text"
            id="source"
            bind:value={sourceAddress}
            use:googlePlacesAutocomplete={{
              onSelect: handleAddressSelect("source"),
              onError: (error) => {
                toast.set({
                  type: "error",
                  message:
                    "Failed to load address suggestions. Please try typing the full address.",
                });
              },
            }}
            class="w-full p-2 border-0 border-b border-gray-300 bg-transparent
            focus:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-transparent
            transition-colors"
            placeholder="Enter source address"
            maxlength={MAX_ADDRESS_LENGTH}
          />
          {#if sourceAddress.length >= MAX_ADDRESS_LENGTH}
            <p class="text-sm text-red-500">
              Address cannot exceed {MAX_ADDRESS_LENGTH} characters
            </p>
          {/if}
          {#if result?.source_corrected}
            <p class="text-sm text-gray-600 italic">
              Guess you want to search: {result.source_address}
            </p>
          {/if}
        </div>
      </div>
      <div class="basis-1/3">
        <label
          for="destination"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Destination Address</label
        >
        <div class="space-y-1">
          <input
            type="text"
            id="destination"
            bind:value={destinationAddress}
            use:googlePlacesAutocomplete={{
              onSelect: handleAddressSelect("destination"),
              onError: (error) => {
                toast.set({
                  type: "error",
                  message:
                    "Failed to load address suggestions. Please try typing the full address.",
                });
              },
            }}
            class="w-full p-2 border-0 border-b border-gray-300 bg-transparent
            focus:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-transparent
            transition-colors"
            placeholder="Enter destination address"
            maxlength={MAX_ADDRESS_LENGTH}
          />
          {#if destinationAddress.length >= MAX_ADDRESS_LENGTH}
            <p class="text-sm text-red-500">
              Address cannot exceed {MAX_ADDRESS_LENGTH} characters
            </p>
          {/if}
          {#if result?.destination_corrected}
            <p class="text-sm text-gray-600 italic">
              Guess you want to search: {result.destination_address}
            </p>
          {/if}
        </div>
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
            <p class="text-lg">
              {#if selectedUnit === "Both"}
                <span>{result.miles.toFixed(2)} mi</span>
                <!-- add more space here -->
                <span class="mx-4">{result.kilometers.toFixed(2)} km</span>
              {:else if selectedUnit === "Miles"}
                {result.miles.toFixed(2)} mi
              {:else}
                {result.kilometers.toFixed(2)} km
              {/if}
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
