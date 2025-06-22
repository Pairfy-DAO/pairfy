<template>
  <div class="InputSelect" ref="dropdownRef" @blur="validate(props.modelValue)" @keydown.enter.prevent="toggleDropdown"
    @keydown.space.prevent="toggleDropdown" tabindex="0">
    <label class="title-text" :class="{ small: props.small }" :for="props.id">

      <span>{{ label }}</span>

      <span class="error-text" :class="{ visible: errorMessage }" :id="`${props.id}-error`">
        {{ errorMessage || '-' }}
      </span>
    </label>

    <!-- Display -->
    <div class="dropdown-display" :class="{ 'is-invalid': errorMessage }" role="combobox"
      :aria-expanded="isOpen.toString()" aria-haspopup="listbox" :aria-controls="`${props.id}-listbox`"
      @click="toggleDropdown">

      <template v-if="selectedOption">
        <slot name="selected" :option="selectedOption"/>
      </template>

      <template v-else>
        <span class="placeholder">{{ placeholder }}</span>
      </template>

      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron-down-icon"
        aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>

    <!-- Dropdown -->
    <transition name="fade">
      <ul v-if="isOpen" :id="`${props.id}-listbox`" class="dropdown-list" role="listbox">
        <li v-for="option in options" :key="option.code" class="dropdown-item" @click.stop="select(option)"
          :id="`option-${option.code}`" role="option">
          <slot name="option" :option="option" />
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
const props = defineProps({
  id: { type: String, default: 'input-select' },
  modelValue: { type: String, default: '' },
  label: { type: String, required: true },
  required: { type: Boolean, default: true },
  small: { type: Boolean, default: false },
  options: { type: Array, required: true },
  placeholder: { type: String, default: 'Select one...' },
  invalid: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'valid'])

const isOpen = ref(false)
const dropdownRef = ref(null)
const errorMessage = ref('')
const selectedOption = computed(() =>
  props.options.find(opt => opt.code === props.modelValue)
)


onMounted(() => {
  validate(props.modelValue)
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function select(option) {
  emit('update:modelValue', option.code)
  validate(option.code)
  isOpen.value = false
}

function validate(value) {
  if (props.required && !value) {
    errorMessage.value = '•'
    emit('valid', { valid: false, value: null })
    return false
  }
  errorMessage.value = ''
  emit('valid', { valid: true, value })
  return true
}

function handleClickOutside(e) {
  if (!dropdownRef.value?.contains(e.target)) {
    isOpen.value = false
  }
}

function onFlagError(event) {
  event.target.src = '/flags/default.svg'
  console.warn(`⚠️ Flag not found for ${event.target.src}, loading default.`)
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, { passive: true })
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(() => props.modelValue, (newVal) => {
  validate(newVal)
})

watch(
  () => props.invalid,
  (val) => {
    if (val) {
      errorMessage.value = '•'
    } else if (!val && !props.required) {
      errorMessage.value = ''
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.InputSelect {
  font-size: var(--text-size-1);
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
}

.dropdown-display {
  border-radius: var(--input-radius);
  border: 1px solid var(--border-a);
  background: var(--background-b);
  padding: var(--input-padding);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: space-between;
}

.dropdown-display:hover {
  border-color: var(--primary-a);
}

.dropdown-display:focus::placeholder {
  color: transparent;
}

.dropdown-display:focus-within {
  border: 1px solid var(--primary-a);
}

.chevron-down-icon {
  margin-left: auto;
  flex-shrink: 0;
  pointer-events: none;
  transition: var(--transition-a);
}

.dropdown-display[aria-expanded="true"] .chevron-down-icon {
  transform: rotate(180deg);
}

.placeholder {
  opacity: var(--placeholder-opacity);
  color: var(--text-b);
}

.dropdown-list {
  border-radius: var(--input-radius);
  border: 1px solid var(--border-a);
  background: var(--background-a);
  font-size: var(--text-size-1);
  box-shadow: var(--shadow-a);
  position: absolute;
  top: calc(100% - 0px);
  left: 0;
  right: 0;
  max-height: 400px;
  list-style: none;
  overflow-y: auto;
  z-index: 1000;
  padding: 0;
  margin: 0;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.dropdown-item:hover {
  background: var(--background-b);
}

.title-text {
  display: flex;
  margin-bottom: 0.75rem;
  justify-content: space-between;
}

.title-text.small {
  font-size: var(--text-size-0) !important;
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

.flag-icon {
  width: 20px;
  height: 14px;
  object-fit: contain;
}

.fade-enter-active,
.fade-leave-active {
  transition: var(--transition-a);
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
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
