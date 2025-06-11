<template>
  <div class="InputCheck">
    <label class="InputCheck-wrap">
      <input class="InputCheck-input" ref="checkboxRef" type="checkbox" :checked="modelValue" @change="onChange"  />
      <span class="InputCheck-box"></span>
      <span class="InputCheck-label">{{ label }}

        <a class="InputCheck-link" v-if="link" :href="link.href" target="_blank" rel="noopener">
          {{ link.label }}
        </a>

      </span>
    </label>

    <p class="error-text" v-if="errorMessage" >{{ errorMessage }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  focus: {
    type: Boolean,
    default: false
  },
  link: {
    type: Object,
    default: null
    // expected: { label: string, href: string }
  }
})

const emit = defineEmits(['update:modelValue', 'valid'])

const checkboxRef = ref(null)
const errorMessage = ref('')

const validate = (value) => {
  if (props.required && !value) {
    errorMessage.value = ''
    emit('valid', false)
    return false
  }

  errorMessage.value = ''
  emit('valid', true)
  return true
}

const onChange = (event) => {
  const checked = event.target.checked
  emit('update:modelValue', checked)
  validate(checked)
}

onMounted(() => {
  if (props.focus) {
    checkboxRef.value?.focus()
  }

  // validar inicial
  validate(props.modelValue)
})


</script>

<style scoped>
.InputCheck {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.InputCheck-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.InputCheck-input {
  display: none;
}

.InputCheck-box {
  width: 1rem;
  height: 1rem;
  border: 2px solid var(--border-a, #ccc);
  border-radius: 4px;
  position: relative;
  background-color: white;
}

.InputCheck-input:checked+.InputCheck-box {
  background-color: var(--primary-a, #3498db);
  border-color: var(--primary-a, #3498db);
}

.InputCheck-input:checked+.InputCheck-box::after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 2px;
  font-size: 16px;
  color: white;
}

.InputCheck-label {
  font-size: var(--text-size-0);
  font-weight: 400;
}

.error-text {
  color: red;
  font-size: var(--text-size-0);
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.InputCheck-link {
  text-decoration: underline;
  color: var(--text-a);
  font-size: inherit;
}
</style>