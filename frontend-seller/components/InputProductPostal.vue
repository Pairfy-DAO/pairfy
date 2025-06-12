<template>
  <div class="InputProductPostal">
    <label class="title-text" :for="id">
      <span>{{ label }}</span>

      <span class="error-text" :class="{ visible: errorMessage }" :id="`${id}-error`">
        {{ errorMessage || '-' }}
      </span>
    </label>

    <input ref="inputRef" v-model="normalizedValue" :id="id" type="text" :placeholder="placeholder"
      class="InputProductPostal-input" :class="{ 'is-invalid': errorMessage }" :maxlength="maxLength"
      :aria-invalid="!!errorMessage" :aria-describedby="`${id}-error`" inputmode="text" @drop.prevent
      @blur="validate" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  id: { type: String, default: 'product-postal' },
  modelValue: { type: [String, null], default: null },
  label: { type: String, default: 'Postal Code' },
  placeholder: { type: String, default: '10001' },
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
.InputProductPostal {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.InputProductPostal-input {
  border: 1px solid var(--border-a, #ccc);
  border-radius: var(--input-radius, 6px);
  transition: var(--transition-a);
  background: var(--background-b);
  padding: 0.75rem 1rem;
  outline: none;
}

.InputProductPostal-input:focus {
  border-color: var(--primary-a, #2563eb);
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
