<template>
  <div class="InputSwitch" :class="{ disabled }">
    <label class="InputSwitch-label" :for="id">
      <span>{{ label }}</span>
      <span class="error-text visible" v-if="errorMessage" :id="`${id}-error`">
        {{ errorMessage }}
      </span>
    </label>

    <label class="InputSwitch-wrap" :class="{ 'is-invalid': errorMessage }">
      <input
        class="InputSwitch-input"
        type="checkbox"
        v-model="localValue"
        :disabled="disabled"
        :aria-invalid="hasError"
        :aria-describedby="`${id}-error`"
      />
      <span class="InputSwitch-circle"></span>
    </label>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'

const props = defineProps({
  id: { type: String, default: 'switch' },
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: 'Title' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'valid'])

const localValue = ref(props.modelValue)
const errorMessage = ref('')
const hasError = computed(() => !!errorMessage.value)

watch(() => props.modelValue, (val) => {
  if (val !== localValue.value) localValue.value = val
})

watch(localValue, (val) => {
  emit('update:modelValue', val)
  validate(val)
})

onMounted(() => validate(localValue.value))

function validate(val) {
  if (props.required && !val) {
    errorMessage.value = '•'
    emit('valid', false)
  } else {
    errorMessage.value = ''
    emit('valid', true)
  }
}

const { id, label, disabled } = props
</script>

<style scoped>
.InputSwitch {
  display: flex;
  flex-direction: column;
  width: 100%;
  opacity: 1;
}

.InputSwitch.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.InputSwitch-label {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  justify-content: space-between;
}

.InputSwitch-wrap {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
  cursor: pointer;
}

.InputSwitch-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.InputSwitch-circle {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 999px;
  background: var(--border-b);
  transition: 0.3s;
}

.InputSwitch-wrap input:checked ~ .InputSwitch-circle {
  background-color: var(--primary-a, #2563eb);
}

.InputSwitch-circle::before {
  content: '';
  position: absolute;
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  border-radius: 50%;
  background: var(--background-b);
  transition: var(--transition-a);
}

.InputSwitch-wrap input:checked ~ .InputSwitch-circle::before {
  transform: translateX(22px);
}

.error-text {
  margin: 0.5rem 0;
  color: red;
  opacity: 1;
}

.error-text:not(.visible) {
  opacity: 0;
  color: transparent;
}
</style>
