<template>
    <div class="json-card">
        <div class="json-entry" v-for="(value, key) in parsedData" :key="key">
            <span class="json-key">{{ key }}:</span>
            <span class="json-value">{{ value }}</span>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    content: {
        type: String,
        required: true
    }
})

const parsedData = computed(() => JSON.parse(props.content))
</script>

<style scoped>
.json-card {
    border: 1px solid var(--border-a);
    border-radius: var(--radius-c);
    box-shadow: var(--shadow-b);
    padding: 1rem;
}

.json-entry {
    margin-bottom: 0.75rem;
    word-break: break-word;
}

.json-key {
    font-weight: bold;
    display: block;
}

.json-value {
    display: block;
    margin-top: 0.5rem;
    color: var(--text-b);
}
</style>