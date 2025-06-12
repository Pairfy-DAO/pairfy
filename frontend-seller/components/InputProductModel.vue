<template>
  <div class="InputProductModel">
    <label class="title-text" :for="props.id">
      <span>{{ label }}</span>
      <span class="error-text" :class="{ visible: errorMessage }" :id="`${props.id}-error`">
        {{ errorMessage || '-' }}
      </span>
    </label>
    <input ref="inputRef" v-model="internalValue" :id="props.id" type="text" @drop.prevent :placeholder="placeholder"
      class="InputProductModel-input" :class="{ 'is-invalid': errorMessage }" :maxlength="maxLength"
      :aria-invalid="!!errorMessage" :aria-describedby="`${props.id}-error`" inputmode="text" @blur="validate" />
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  id: { type: String, default: 'product-model' },
  modelValue: { type: [String, null], default: null },
  label: { type: String, default: 'Model' },
  placeholder: { type: String, default: 'XR-6400a' },
  focus: { type: Boolean, default: false },
  required: { type: Boolean, default: true },
  maxLength: { type: Number, default: 40 },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void;
  (e: 'valid', payload: { valid: boolean; value: string | null }): void;
}>();


const inputRef = ref<HTMLInputElement | null>(null);

const internalValue = ref<string | null>(props.modelValue);

const errorMessage = ref('');

const modelRegex = /^[a-zA-Z0-9\- ]*$/;

const messages = {
  required: '•',
  invalid: 'Only letters, numbers, dashes, and spaces are allowed.',
  maxLength: `Maximum length is ${props.maxLength} characters.`,
};


const isValueEmpty = computed(() => !internalValue.value || internalValue.value.trim() === '');


const validate = () => {
  const value = internalValue.value?.trim() ?? '';
  errorMessage.value = '';

  if (props.required && isValueEmpty.value) {
    errorMessage.value = messages.required;
    emit('valid', { valid: false, value: null });
  } else if (value.length > props.maxLength) {
    errorMessage.value = messages.maxLength;
    emit('valid', { valid: false, value: null });
  } else if (value && !modelRegex.test(value)) {
    errorMessage.value = messages.invalid;
    emit('valid', { valid: false, value: null });
  } else {
    emit('valid', { valid: true, value: value || null });
  }
};

onMounted(() => {
  if (props.focus) inputRef.value?.focus();
});

watch(() => props.modelValue, (newVal) => {
  internalValue.value = newVal;
  validate();
});

watch(internalValue, (newVal) => {
  emit('update:modelValue', newVal);
  validate();
}, { immediate: true });
</script>

<style scoped>
.InputProductModel {
  flex-direction: column;
  display: flex;
  width: 100%;
}

.InputProductModel-input {
  border: 1px solid var(--border-a, #ccc);
  border-radius: var(--input-radius, 6px);
  background: var(--background-b);
  transition: var(--transition-a);
  padding: 0.75rem 1rem;
  outline: none;
}

.InputProductModel-input:focus-within {
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
