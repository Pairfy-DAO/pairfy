<template>
  <div class="InputProductCity">
    <label class="title-text" :for="props.id">
      <span>{{ label }}</span>
      <span class="error-text" :class="{ visible: errorMessage }" :id="`${props.id}-error`">
        {{ errorMessage || '-' }}
      </span>
    </label>
    <input class="InputProductCity-input" ref="inputRef" v-model="internalValue" :id="props.id" type="text" :placeholder="placeholder"
      :maxlength="maxLength" inputmode="text" @drop.prevent @blur="validate" :class="{ 'is-invalid': errorMessage }"
      :aria-invalid="!!errorMessage" :aria-describedby="`${props.id}-error`"  />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  id: { type: String, default: 'product-city' },
  modelValue: { type: [String, null] as PropType<string | null>, default: null },
  label: { type: String, default: 'City' },
  placeholder: { type: String, default: 'Los Angeles' },
  focus: { type: Boolean, default: false },
  required: { type: Boolean, default: true },
  maxLength: { type: Number, default: 40 },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'valid', payload: { valid: boolean; value: string | null }): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const internalValue = ref(props.modelValue ?? '')
const errorMessage = ref('')

const cityRegex = /^[\p{L}\p{M}\s\-'.(),]+$/u

const messages = {
  required: '•',
  invalid: 'Only letters, spaces, and symbols like - . , ’ ( ) are allowed.',
  maxLength: `Maximum length is ${props.maxLength} characters.`,
}

const isEmpty = (val: string) => val.trim() === ''
const emitValue = (val: string) => emit('update:modelValue', isEmpty(val) ? null : val)

const validate = () => {
  const val = internalValue.value
  const trimmed = val.trim()

  const validators = [
    { condition: props.required && isEmpty(val), message: messages.required },
    { condition: val.length > props.maxLength, message: messages.maxLength },
    { condition: !isEmpty(val) && !cityRegex.test(trimmed), message: messages.invalid },
  ]

  const error = validators.find(v => v.condition)?.message
  errorMessage.value = error || ''
  emit('valid', { valid: !error, value: !error ? (isEmpty(val) ? null : trimmed) : null })
}

watch(() => props.modelValue, (val) => {
  if (val !== internalValue.value) internalValue.value = val ?? ''
})

watch(internalValue, (val) => {
  emitValue(val)
  validate()
}, { immediate: true })

watch(() => props.focus, (newVal) => {
  if (newVal) inputRef.value?.focus()
}, { immediate: true })


</script>

<style scoped>
.InputProductCity {
  flex-direction: column;
  display: flex;
  width: 100%;
}

.InputProductCity-input {
  border: 1px solid var(--border-a, #ccc);
  border-radius: var(--input-radius, 6px);
  transition: var(--transition-a);
  background: var(--background-b);
  padding: 0.75rem 1rem;
  outline: none;
}

.InputProductCity-input:focus-within {
  border: 1px solid var(--primary-a, #2563eb);
}

input::placeholder {
  opacity: var(--placeholder-opacity);
  color: var(--text-b);
}

input:focus::placeholder {
  color: transparent;
}

input:hover {
  border: 1px solid var(--primary-a);
}

input:focus-within {
  border: 1px solid var(--primary-a);
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
