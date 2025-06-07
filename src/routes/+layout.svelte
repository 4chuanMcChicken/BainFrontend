<script>
    import '../app.postcss';
    import Toast from '$lib/components/Toast.svelte';
</script>

<div class="min-h-screen bg-gray-100 p-8">
    <slot />
    <Toast />
</div> 