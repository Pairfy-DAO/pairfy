<template>
  <div class="InputUsername">
    <label class="title-text" for="alpha">{{ label }}</label>
    <input ref="inputRef" type="text" :value="modelValue" @input="onInput" @keypress="onKeyPress" @paste="onPaste"
      @drop.prevent :placeholder="placeholder" class="InputUsername-input" :class="{ 'is-invalid': errorMessage }"
      :maxlength="maxLength" :aria-invalid="!!errorMessage" aria-describedby="alpha-error" inputmode="text"
      pattern="[a-zA-Z0-9]*" />
    <p v-if="errorMessage" id="alpha-error" class="error-text">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'Alphanumeric Input' },
  placeholder: { type: String, default: 'user123' },
  focus: { type: Boolean, default: false },
  required: { type: Boolean, default: true },
  maxLength: { type: Number, default: 30 },
  minLength: { type: Number, default: 3 }
})
const emit = defineEmits(['update:modelValue', 'valid'])

const inputRef = ref(null)
const errorMessage = ref('')
const alphanumericRegex = /^[a-zA-Z0-9]*$/

onMounted(() => {
  if (props.focus) inputRef.value?.focus()
})

watch(() => props.focus, (newVal) => {
  if (newVal) inputRef.value?.focus()
})

const onInput = (e) => {
  const value = e.target.value
  emit('update:modelValue', value)
  validateAlphaNumeric(value)
}

const onKeyPress = (e) => {
  if (!alphanumericRegex.test(e.key)) {
    e.preventDefault()
  }
}

const onPaste = (e) => {
  const pasted = (e.clipboardData || window.clipboardData).getData('text')
  if (!alphanumericRegex.test(pasted)) {
    e.preventDefault()
  }
}

const validateAlphaNumeric = (value) => {
  if (props.required && !value) {
    errorMessage.value = 'This field is required.'
    emit('valid', false)
    return false
  }
  if (value.length < props.minLength) {
    errorMessage.value = `Minimum length is ${props.minLength} characters.`
    emit('valid', false)
    return false
  }
  if (value.length > props.maxLength) {
    errorMessage.value = `Maximum length is ${props.maxLength} characters.`
    emit('valid', false)
    return false
  }
  if (!alphanumericRegex.test(value)) {
    errorMessage.value = 'Only letters and numbers are allowed.'
    emit('valid', false)
    return false
  }

  errorMessage.value = ''
  emit('valid', true)
  return true
}
</script>

<style scoped>
.InputUsername {
  display: flex;
  flex-direction: column;
  max-width: 300px;
}

.InputUsername-input {
  border: 1px solid var(--border-a, #ccc);
  background: var(--background-b);
  border-radius: var(--input-radius, 6px);
  padding: 0.75rem 1rem;
  outline: none;
  transition: border-color 0.2s;
}

input::placeholder {
  opacity: var(--placeholder-opacity);
  color: var(--text-b);
}

.InputUsername-input:focus-within {
  border: 1px solid var(--primary-a, #2563eb);
}

.InputUsername-input.is-invalid {
  border-color: red;
}

.title-text {
  font-size: var(--text-size-0);
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.error-text {
  animation: fadeIn 0.2s ease-in-out;
  font-size: var(--text-size-0, 0.875rem);
  margin-top: 0.5rem;
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