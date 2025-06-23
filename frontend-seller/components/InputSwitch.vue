<template>
  <div class="InputSwitch" :class="{ disabled }">
    <label class="InputSwitch-label" :for="id">
      <span>{{ label }}</span>
      <span class="error-text" :class="{ visible: errorMessage }" :id="`${id}-error`">
        {{ errorMessage || '-' }}
      </span>
    </label>
    <div class="InputSwitch-wrap" :class="{ 'is-invalid': errorMessage }">
      <input class="InputSwitch-input" type="checkbox" :id="id" ref="inputRef" v-model="internalValue" @change="onToggle"
        :disabled="disabled" :aria-invalid="!!errorMessage" :aria-describedby="`${id}-error`" />
      <span class="InputSwitch-circle" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: { type: String, default: 'switch' },
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: 'Title' },
  required: { type: Boolean, default: false }, 
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'valid'])

const inputRef = ref(null)
const internalValue = ref(props.modelValue)
const errorMessage = ref('')

watch(
  () => props.modelValue,
  (val) => {
    if (val !== internalValue.value) internalValue.value = val
  }
)

watch(internalValue, (val) => {
  emit('update:modelValue', val)
  validate(val)
})

onMounted(() => {
  validate(internalValue.value)
})

const onToggle = () => {
  validate(internalValue.value)
}

const validate = (value) => {
  if (props.required && !value) {
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
  width: 48px;
  height: 26px;
}

.InputSwitch-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.InputSwitch-circle {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.3s;
  border-radius: 999px;
  background: var(--border-b);
}

.InputSwitch-wrap input:checked+.InputSwitch-circle {
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
  transition: var(--transition-a);
  background: var(--background-b);
}

.InputSwitch-wrap input:checked+.InputSwitch-circle::before {
  transform: translateX(22px);
}

.error-text {
  margin: 0.5rem 0;
  color: transparent;
  opacity: 0;
}

.error-text.visible {
  opacity: 1;
  color: red;
}
</style>
