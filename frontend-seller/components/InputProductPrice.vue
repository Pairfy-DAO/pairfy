<template>
  <div class="InputPrice">
    <label class="title-text" :for="props.id">
      <span>{{ label }}</span>

      <span class="error-text" :class="{ visible: errorMessage }" :id="`${props.id}-error`">
        {{ errorMessage || '-' }}
      </span>

    </label>
    <input ref="inputRef" v-model="internalValue" :id="props.id" type="text" @input="onInput" @drop.prevent
      :placeholder="placeholder" class="InputPrice-input" :class="{ 'is-invalid': errorMessage }"
      :maxlength="maxLength" :aria-invalid="!!errorMessage" :aria-describedby="`${props.id}-error`" inputmode="numeric"
      @blur="validate" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  id: { type: String, default: 'price' },
  modelValue: { type: [Number, null], default: null },
  label: { type: String, default: 'Price' },
  placeholder: { type: String, default: '0 USD' },
  focus: { type: Boolean, default: false },
  required: { type: Boolean, default: true },
  maxLength: { type: Number, default: 9 },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
  (e: 'valid', payload: { valid: boolean, value: number | null }): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const internalValue = ref(props.modelValue?.toString() ?? '')
const errorMessage = ref('')

const dollarRegex = /^[0-9]+$/

const messages = {
  required: '•',
  invalid: 'Only whole dollar amounts are allowed.',
  maxLength: `Maximum length is ${props.maxLength} digits.`,
  minValue: 'Minimum is $5.',
  maxValue: 'Maximum is $999,999.',
}

onMounted(() => {
  if (props.focus) inputRef.value?.focus()
})

watch(() => props.focus, (newVal) => {
  if (newVal) inputRef.value?.focus()
})

watch(() => props.modelValue, (val) => {
  const normalized = val?.toString() ?? ''
  if (normalized !== internalValue.value) internalValue.value = normalized
})

watch(internalValue, () => {
  emitNormalizedValue()
  validate()
}, { immediate: true })

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  internalValue.value = target.value.replace(/\D+/g, '')
}

function emitNormalizedValue() {
  const trimmed = internalValue.value.trim()
  const numeric = trimmed === '' ? null : Number(trimmed)
  emit('update:modelValue', Number.isNaN(numeric!) ? null : numeric)
}

function validate() {
  const value = internalValue.value.trim()
  const numValue = Number(value)

  const rules = [
    { invalid: props.required && value === '', message: messages.required },
    { invalid: value.length > props.maxLength, message: messages.maxLength },
    { invalid: !!value && !dollarRegex.test(value), message: messages.invalid },
    { invalid: !!value && numValue < 5, message: messages.minValue },
    { invalid: !!value && numValue > 999999, message: messages.maxValue },
  ]

  const failed = rules.find(r => r.invalid)
  if (failed) {
    errorMessage.value = failed.message
    emit('valid', { valid: false, value: null })
  } else {
    errorMessage.value = ''
    emit('valid', { valid: true, value: value === '' ? null : numValue })
  }
}
</script>



<style scoped>
.InputPrice {
  flex-direction: column;
  display: flex;
  width: 100%;
}

.InputPrice-input {
  border: 1px solid var(--border-a, #ccc);
  border-radius: var(--input-radius, 6px);
  transition: var(--transition-a);
  background: var(--background-b);
  padding: 0.75rem 1rem;
  outline: none;
}

.InputPrice-input:focus-within {
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
