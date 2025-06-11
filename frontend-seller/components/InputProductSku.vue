<template>
  <div class="InputSku">
    <label class="title-text" :for="props.id">

      <span>{{ label }}</span>


      <span class="error-text" :class="{ visible: errorMessage }" :id="`${props.id}-error`">
        {{ errorMessage || '-' }}
      </span>

    </label>
    <input ref="inputRef" v-model="internalValue" :id="props.id" type="text" @drop.prevent :placeholder="placeholder"
      class="InputSku-input" :class="{ 'is-invalid': errorMessage }" :maxlength="maxLength"
      :aria-invalid="!!errorMessage" :aria-describedby="`${props.id}-error`" inputmode="text" @blur="validate" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  id: { type: String, default: 'sku' },
  modelValue: { type: [String, null], default: null },
  label: { type: String, default: 'Sku' },
  placeholder: { type: String, default: 'RZ-RTX4090' },
  focus: { type: Boolean, default: false },
  required: { type: Boolean, default: true },
  maxLength: { type: Number, default: 20 },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'valid', payload: { valid: boolean, value: string | null }): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const errorMessage = ref('')

const internalValue = ref<string | null>(props.modelValue)

watch(() => props.modelValue, (val) => {
  if (val !== internalValue.value) internalValue.value = val
})

watch(() => props.focus, (focus) => {
  if (focus) inputRef.value?.focus()
})

onMounted(() => {
  if (props.focus) inputRef.value?.focus()
})

const messages = {
  required: '•',
  invalid: 'Invalid format. Use only UPPERCASE letters, numbers, and dashes.',
  maxLength: `Maximum length is ${props.maxLength} characters.`,
}

const skuRegex = /^[A-Z0-9-]+$/

watch(internalValue, (val) => {
  emit('update:modelValue', val)
  validate()
}, { immediate: true })  

function validate() {
  const value = internalValue.value?.trim() || ''

  if (props.required && value === '') {
    return setInvalid(messages.required)
  }

  if (value.length > props.maxLength) {
    return setInvalid(messages.maxLength)
  }

  if (!skuRegex.test(value)) {
    return setInvalid(messages.invalid)
  }

  errorMessage.value = ''
  emit('valid', { valid: true, value: value || null })
}

function setInvalid(message: string) {
  errorMessage.value = message
  emit('valid', { valid: false, value: null })
}


</script>

<style scoped>
.InputSku {
  flex-direction: column;
  display: flex;
  width: 100%;
}

.InputSku-input {
  border: 1px solid var(--border-a, #ccc);
  border-radius: var(--input-radius, 6px);
  background: var(--background-b);
  transition: var(--transition-a);
  padding: 0.75rem 1rem;
  outline: none;
}

.InputSku-input:focus-within {
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
