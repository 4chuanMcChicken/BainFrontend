<script lang="ts">
    import { Toast } from 'flowbite-svelte';
    import { CheckCircle, XCircle } from 'svelte-heros-v2';
    import { fade } from 'svelte/transition';
    import { toast } from '$lib/stores/toast';

    let timeoutId: NodeJS.Timeout | null = null;

    $: if ($toast) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            toast.set(null);
        }, 5000);
    }
</script>

{#if $toast}
    <div class="fixed bottom-4 right-4 z-50" transition:fade>
        <div class={`rounded-lg p-4 ${$toast.type === 'error' ? 'bg-red-100 border-l-4 border-red-500' : 'bg-green-100 border-l-4 border-green-500'}`}>
            <div class="flex items-center">
                {#if $toast.type === 'success'}
                    <CheckCircle class="w-5 h-5 mr-2 text-green-600" />
                {:else}
                    <XCircle class="w-5 h-5 mr-2 text-red-600" />
                {/if}
                <span class={$toast.type === 'error' ? 'text-red-800' : 'text-green-800'}>{$toast.message}</span>
            </div>
        </div>
    </div>
{/if} 