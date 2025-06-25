<template>
  <div class="InputProductBrand">
    <label class="title-text" :for="props.id">
      <span>{{ label }}</span>
      <span class="error-text" :class="{ visible: errorMessage }" :id="`${props.id}-error`">
        {{ errorMessage || '-' }}
      </span>
    </label>
    <input ref="inputRef" v-model="internalValue" :id="props.id" type="text" @beforeinput="onBeforeInput" @drop.prevent
      :placeholder="placeholder" class="InputProductBrand-input" :class="{ 'is-invalid': errorMessage }"
      :maxlength="maxLength" :aria-invalid="!!errorMessage" :aria-describedby="`${props.id}-error`" inputmode="text"
      @blur="validate" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  id: { type: String, default: 'product-brand' },
  modelValue: { type: [String, null], default: '' },
  label: { type: String, default: 'Brand' },
  placeholder: { type: String, default: 'Samsung' },
  focus: { type: Boolean, default: false },
  required: { type: Boolean, default: true },
  maxLength: { type: Number, default: 40 },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'valid', payload: { valid: boolean, value: string | null }): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const internalValue = ref<string | null>(props.modelValue)
const errorMessage = ref('')

const brandRegex = /^[\p{L}\p{N}\s\-.,&()']+$/u

const messages = {
  required: '•',
  invalid: 'Only letters, numbers, spaces, and basic symbols like - . , & ( ) are allowed.',
  maxLength: `Maximum length is ${props.maxLength} characters.`,
}

const validate = () => {
  const value = internalValue.value?.trim() ?? ''

  if (value === '' && props.required) {
    errorMessage.value = messages.required
    emit('valid', { valid: false, value: null })
  } else {
    errorMessage.value = ''

    const validationResult = [
      { condition: value.length > props.maxLength, message: messages.maxLength },
      { condition: !brandRegex.test(value), message: messages.invalid },
    ].find(validator => validator.condition)

    if (validationResult) {
      errorMessage.value = validationResult.message
      emit('valid', { valid: false, value: null })
    } else {
      emit('valid', { valid: true, value: value || null })
    }
  }
}

onMounted(() => {
  if (props.focus) inputRef.value?.focus()
  validate()
})

watch(() => props.focus, (newVal) => {
  if (newVal) inputRef.value?.focus()
})

watch(() => props.modelValue, (val) => {
  if (val !== internalValue.value) internalValue.value = val
})

watch(internalValue, (val) => {
  emit('update:modelValue', val)
  validate()
}, { immediate: true })

const onBeforeInput = (e: Event) => {
  const inputEvent = e as InputEvent
  if (inputEvent.inputType === 'insertFromPaste' || !inputEvent.data) return
}
</script>

<style scoped>
.InputProductBrand {
  flex-direction: column;
  display: flex;
  width: 100%;
}

.InputProductBrand-input {
  border: 1px solid var(--border-a, #ccc);
  border-radius: var(--input-radius, 6px);
  transition: var(--transition-a);
  background: var(--background-b);
  padding: var(--input-padding);
  outline: none;
}

.InputProductBrand-input:focus-within {
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
