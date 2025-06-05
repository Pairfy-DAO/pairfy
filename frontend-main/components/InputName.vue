<template>
  <div class="InputName">
    <label class="InputName-label" :for="props.id">
      <span>{{ label }}</span>
      <span class="error-text" :class="{ visible: errorMessage }" :id="`${props.id}-error`">
        {{ errorMessage || '-' }}
      </span>
    </label>
    
    <input ref="inputRef" v-model="internalValue" :id="props.id" type="text" :placeholder="placeholder"
      :maxlength="maxLength" inputmode="text" @drop.prevent @blur="validate" :class="{ 'is-invalid': errorMessage }"
      :aria-invalid="!!errorMessage" :aria-describedby="`${props.id}-error`" class="InputName-input" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  id: { type: String, default: 'input-name' },
  modelValue: { type: [String, null] as PropType<string | null>, default: null },
  label: { type: String, default: 'Name' },
  placeholder: { type: String, default: 'Nikola Tesla' },
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
})

watch(() => props.focus, (newVal) => {
  if (newVal) inputRef.value?.focus()
}, { immediate: true })

onMounted(() => {
  validate()
})
</script>

<style scoped>
.InputName {
  flex-direction: column;
  display: flex;
  width: 100%;
}

.InputName-input {
  border-radius: var(--input-radius);
  border: 1px solid var(--border-b);
  transition: var(--transition-a);
  background: var(--background-b);
  padding: 0.6rem 1rem;
  outline: none;
}

.InputName-input:focus-within {
  border: 1px solid var(--primary-a, #2563eb);
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

.InputName-label {
  justify-content: space-between;
  font-size: var(--text-size-0);
  margin-bottom: 0.75rem;
  align-items: center;
  display: flex;
}

.error-text {
  font-size: var(--text-size-0);
  color: transparent;
  font-weight: 300;
  opacity: 0;
}

.error-text.visible {
  opacity: 1;
  color: red;
}
</style>
