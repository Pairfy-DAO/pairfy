<template>
  <div class="p-InputProductPostal">
    <label :for="id" class="title-text">{{ label }}</label>
    <input
      ref="inputRef"
      v-model="normalizedValue"
      :id="id"
      type="text"
      :placeholder="placeholder"
      class="p-InputProductPostal-input"
      :class="{ 'is-invalid': errorMessage }"
      :maxlength="maxLength"
      :aria-invalid="!!errorMessage"
      :aria-describedby="`${id}-error`"
      inputmode="text"
      @drop.prevent
      @blur="validate"
    />
    <p class="error-text" :class="{ visible: errorMessage }" :id="`${id}-error`">
      {{ errorMessage || '-' }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  id: { type: String, default: 'product-postal' },
  modelValue: { type: [String, null], default: null },
  label: { type: String, default: 'Postal Code' },
  placeholder: { type: String, default: 'e.g. 10001' },
  focus: { type: Boolean, default: false },
  required: { type: Boolean, default: true },
  maxLength: { type: Number, default: 12 },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'valid', payload: { valid: boolean, value: string | null }): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const rawValue = ref<string>(props.modelValue ?? '')
const errorMessage = ref('')

const normalizedValue = computed({
  get: () => rawValue.value,
  set: (val: string) => {
    rawValue.value = val
    emit('update:modelValue', val.trim() === '' ? null : val)
    validate()
  },
})

const postalRegex = /^[\p{L}\p{N}\s\-]+$/u

const messages = {
  required: '*',
  invalid: 'Only letters, numbers, spaces and hyphens are allowed.',
}

const validate = () => {
  const value = rawValue.value.trim()

  const errors: string[] = []

  if (props.required && value === '') {
    errors.push(messages.required)
  } else if (value.length > props.maxLength) {
    errors.push(`Maximum length is ${props.maxLength} characters.`)
  } else if (value && !postalRegex.test(value)) {
    errors.push(messages.invalid)
  }

  errorMessage.value = errors[0] || ''
  emit('valid', { valid: errors.length === 0, value: value || null })
}

onMounted(() => {
  if (props.focus) inputRef.value?.focus()
  validate()
})

watch(() => props.modelValue, (val) => {
  if ((val ?? '') !== rawValue.value) rawValue.value = val ?? ''
  validate()
})
</script>


<style scoped>
.p-InputProductPostal {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.p-InputProductPostal-input {
  border: 1px solid var(--border-a, #ccc);
  border-radius: var(--input-radius, 6px);
  transition: var(--transition-a);
  padding: 0.75rem 1rem;
  outline: none;
}

.p-InputProductPostal-input:focus {
  border-color: var(--primary-a, #2563eb);
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
  margin-bottom: 0.75rem;
}

.error-text {
  animation: fadeIn 0.2s ease-in-out;
  font-size: var(--text-size-0, 0.875rem);
  color: transparent;
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
