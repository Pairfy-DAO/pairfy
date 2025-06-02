<template>
    <button :class="{ contrast: isContrast }" @click="auth.authDrawer = true">
        Connect Wallet
    </button>
</template>

<script setup>
const route = useRoute()

const auth = useAuthStore()

const isContrast = computed(() =>  ['p-id', 's'].includes(route.name))

</script>

<style lang="css" scoped>
button {
    border: none;
    outline: none;
    cursor: pointer;
    font-weight: 600;
    white-space: nowrap;
    color: var(--text-a);
    padding: 0.75rem 1rem;
    border: 2px solid white;
    overflow-wrap: break-word;
    font-size: var(--text-size-1);
    border-radius: var(--radius-e);
    transition: var(--transition-a);
    background: var(--background-a);
}

button:hover {
    opacity: 0.9
}

button.contrast {
    border: 2px solid var(--primary-a);
    background: var(--primary-a);
    color: var(--text-w);
}

button.contrast:hover {
    opacity: 0.8;
    color: var(--text-w);
    border: 2px solid var(--primary-a);
}
</style>