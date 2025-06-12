<template>
  <div class="InputProductCondition">
    <label class="title-text" :for="props.id">

      <span>{{ label }}</span>
      <span class="error-text" :class="{ visible: errorMessage }" :id="`${props.id}-error`">
        {{ errorMessage || '-' }}
      </span>

    </label>
    <div class="switch-group" :class="{ 'is-invalid': errorMessage }" role="radiogroup"
      :aria-describedby="`${props.id}-error`">
      <button v-for="option in options" :key="option" type="button" class="switch-button"
        :class="{ active: internalValue === option }" @click="selectOption(option)"
        :aria-pressed="internalValue === option">
        {{ capitalize(option) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  id: { type: String, default: 'product-condition' },
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'Condition' },
  required: { type: Boolean, default: true },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'valid', payload: { valid: boolean; value: string | null }): void
}>()

const options = ['new', 'used', 'refurbished'] as const
const internalValue = ref(props.modelValue)
const errorMessage = ref('')

watch(() => props.modelValue, (val) => {
  if (val !== internalValue.value) internalValue.value = val
})

const selectOption = (val: string) => {
  internalValue.value = val
}

const messages = {
  required: 'Please select a condition.',
}

const validate = (val: string) => {
  if (props.required && !val) {
    errorMessage.value = messages.required
    emit('valid', { valid: false, value: null })
  } else {
    errorMessage.value = ''
    emit('valid', { valid: true, value: val })
  }
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

watch(internalValue, (val) => {
  emit('update:modelValue', val)
  validate(val)
}, { immediate: true })

</script>

<style scoped>
.InputProductCondition {
  flex-direction: column;
  display: flex;
  width: 100%;
}

.switch-group {
  display: flex;
  gap: 0.5rem;
}

.switch-button {
  border: 1px solid var(--border-a, #ccc);
  border-radius: var(--input-radius);
  background: var(--background-a);
  font-size: var(--text-size-0);
  padding: 0.75rem 1rem;
  font-weight: 500;
  transition: 0.2s;
  cursor: pointer;
  flex: 1;
}

.switch-button:hover {
  border: 1px solid var(--primary-a);
}

.switch-button.active {
  background-color: var(--primary-a);
  border-color: var(--primary-a);
  color: var(--text-w);
}

.title-text {
  display: flex;
  margin-bottom: 0.75rem;
  justify-content: space-between;
}

.error-text {
  font-size: var(--text-size-0, 0.875rem);
  animation: fadeIn 0.2s ease-in-out;
  color: transparent;
  font-weight: 400;
  opacity: 0;
}


.error-text.visible {
  opacity: 1;
  color: red;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
