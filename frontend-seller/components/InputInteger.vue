<template>
<div class="InputInteger">
    <label class="InputInteger-label">
        {{ label }}
    </label>

    <input class="InputInteger-input" type="number" :placeholder="placeholder" :min="min" :max="max"
        v-model="internalValue" />
</div>
</template>

<script setup>

const props = defineProps({
    modelValue: {
        type: Number,
        default: null
    },
    min: {
        type: Number,
        default: -Infinity
    },
    max: {
        type: Number,
        default: Infinity
    },
    label: {
        type: String,
        default: 'title'
    },
    placeholder: {
        type: String,
        default: 'Enter number'
    }
})

const emit = defineEmits(['update:modelValue', 'valid'])

const internalValue = ref(normalizeValue(props.modelValue))

function normalizeValue(value) {
    if (typeof value !== 'number' || Number.isNaN(value)) return props.min
    if (value < props.min) return props.min
    if (value > props.max) return props.max
    return value
}

watch(
    () => props.modelValue,
    (newVal) => {
        const normalized = normalizeValue(newVal)
        if (normalized !== internalValue.value) {
            internalValue.value = normalized
        }
        emit('valid', { valid: isValid(normalized), value: normalized })
    },
    { immediate: true }
)


watch(internalValue, (newVal) => {
    const normalized = normalizeValue(newVal)
    if (normalized !== newVal) {
        internalValue.value = normalized 
    }
    emit('update:modelValue', normalized)
})

function isValid(value) {
    return (
        typeof value === 'number' &&
        !Number.isNaN(value) &&
        value >= props.min &&
        value <= props.max
    )
}
</script>

<style>
.InputInteger{

}

.InputInteger-input {
    width: 100%;
    box-sizing: border-box;
    padding: var(--input-padding);
    font-size: var(--text-size-1);
    border: 1px solid var(--border-b);
    border-radius: var(--input-radius);
    transition: var(--transition-a);
}

.InputInteger-input:hover {
    border-color: var(--primary-a);
}

.InputInteger-input:focus {
    border-color: var(--primary-a);
    outline: none;
}

.InputInteger-input:invalid {
    border-color: var(--red-a);
}

.InputInteger-label {
    display: flex;
    font-weight: 700;
    color: var(--text-a);
    flex-direction: column;
    margin-bottom: 0.75rem;
}
</style>