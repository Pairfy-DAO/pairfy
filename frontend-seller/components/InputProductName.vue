<template>
  <div class="InputProductName">
    <label class="title-text" :for="props.id">
      <span>{{ label }}</span>

      <span class="error-text" :class="{ visible: errorMessage }" :id="`${props.id}-error`">
        {{ errorMessage || '\u00A0' }}
      </span>
    </label>


    <input ref="inputRef" v-model="internalValue" :id="props.id" type="text" @drop.prevent :placeholder="placeholder"
      class="InputProductName-input" :class="{ 'is-invalid': errorMessage }" :maxlength="maxLength"
      :aria-invalid="!!errorMessage" :aria-describedby="`${props.id}-error`" inputmode="text" @blur="validate" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  id: { type: String, default: 'product-name' },
  modelValue: { type: [String, null], default: null },
  label: { type: String, default: 'Name' },
  placeholder: { type: String, default: 'Headphones' },
  focus: { type: Boolean, default: false },
  required: { type: Boolean, default: true },
  maxLength: { type: Number, default: 200 },
  minLength: { type: Number, default: 3 },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'valid', payload: { valid: boolean, value: string | null }): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const internalValue = ref(props.modelValue ?? '')
const errorMessage = ref('')

const productNameRegex = /^[\p{L}\p{N} .,'"\-(/&|＆):+]+$/u

const messages = {
  required: '•',
  minLength: `Minimum length is ${props.minLength} characters.`,
  maxLength: `Maximum length is ${props.maxLength} characters.`,
  invalid: 'Only valid characters are allowed: letters, numbers, basic punctuation.',
}

onMounted(() => {
  if (props.focus) inputRef.value?.focus()
})

watch(() => props.focus, (newVal) => {
  if (newVal) inputRef.value?.focus()
})

watch(() => props.modelValue, (val) => {
  const normalized = val ?? ''
  if (normalized !== internalValue.value) internalValue.value = normalized
})

watch(internalValue, () => {
  emitNormalizedValue()
  validate()
}, { immediate: true })

function emitNormalizedValue() {
  const normalized = internalValue.value.trim()
  emit('update:modelValue', normalized === '' ? null : normalized)
}

function validate() {
  const value = internalValue.value.trim()

  const rules = [
    { invalid: props.required && !value, message: messages.required },
    { invalid: value.length < props.minLength, message: messages.minLength },
    { invalid: value.length > props.maxLength, message: messages.maxLength },
    { invalid: !!value && !productNameRegex.test(value), message: messages.invalid },
  ]

  const failed = rules.find(rule => rule.invalid)
  if (failed) {
    errorMessage.value = failed.message
    emit('valid', { valid: false, value: null })
  } else {
    errorMessage.value = ''
    emit('valid', { valid: true, value: value || null })
  }
}
</script>


<style scoped>
.InputProductName {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.InputProductName-input {
  border: 1px solid var(--border-a);
  border-radius: var(--input-radius);
  transition: var(--transition-a);
  background: var(--background-b);
  padding: var(--input-padding);
  outline: none;
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
