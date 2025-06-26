<template>
  <div class="p-EditableBulletList">
    <label class="title-text">{{ label }}</label>

    <div class="list-container">
      <div v-for="(item, index) in items" :key="index" class="item">
        <textarea
          v-model="items[index]"
          placeholder=""
          :maxlength="maxLength"
          class="textarea"
          :class="{ 'is-invalid': showError[index] }"
          :aria-invalid="showError[index]"
          @focus="markTouched(index)"
          @input="autoResize($event)"
        />
      </div>
    </div>

    <p class="error-text" :class="{ visible: overallErrorMessage !== '' }">
      {{ overallErrorMessage || '‎' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array as () => string[],
    default: () => [],
  },
  label: {
    type: String,
    default: 'List of important features',
  },
  maxLength: {
    type: Number,
    default: 240,
  },
})

const emit = defineEmits(['update:modelValue', 'valid'])

const bulletRegex = /^[\p{L}\p{N}\p{P}\p{S}\p{Zs}]{1,240}$/u

function normalizeToFour(arr: string[]): string[] {
  return [...arr.slice(0, 4), ...Array(4 - arr.length).fill('')]
}

const items = ref<string[]>(normalizeToFour(props.modelValue))
const touched = ref<boolean[]>(Array(4).fill(false))
const showError = ref<boolean[]>(Array(4).fill(false))

watch(() => props.modelValue, (newValue) => {
  items.value = normalizeToFour(newValue)
  resetValidation()
  validateAll()
})

function resetValidation() {
  touched.value.fill(false)
  showError.value.fill(false)
}

const isValidItem = (text: string): boolean =>
  text.trim() !== '' && bulletRegex.test(text.trim())

function markTouched(index: number) {
  touched.value[index] = true
}

function autoResize(event: Event) {
  const el = event.target as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

function validateItem(index: number) {
  showError.value[index] =
    touched.value[index] && !isValidItem(items.value[index])
}

function validateAll() {
  for (let i = 0; i < 4; i++) validateItem(i)
  emitValidation()
}

const overallErrorMessage = computed(() => {
  const validItems = items.value.filter(isValidItem)
  const hasInvalid = items.value.some(
    (val) => val.trim() !== '' && !isValidItem(val)
  )
  if (validItems.length === 0) return 'At least one valid feature is required.'
  if (hasInvalid) return 'Some features contain invalid characters.'
  return ''
})

watch(items, (newItems) => {
  const normalized = normalizeToFour(newItems)
  const current = normalizeToFour(props.modelValue)

  if (JSON.stringify(normalized) !== JSON.stringify(current)) {
    emit('update:modelValue', normalized)
  }

  emitValidation()
}, { deep: true })


function emitValidation() {
  const normalized = normalizeToFour(items.value)
  const valid =
    normalized.some(isValidItem) &&
    normalized.every((val) => val.trim() === '' || isValidItem(val))
  emit('valid', { valid, value: valid ? [...normalized] : null })
}

onMounted(() => {
  validateAll()
})
</script>



<style scoped>
.p-EditableBulletList {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.title-text {
  margin-bottom: 0.75rem;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.textarea {
  width: 100%;
  min-height: 43px;
  max-height: 12rem;
  resize: none; 
  overflow-y: hidden;
  font-family: inherit;
  padding: 0.75rem 1rem;
  box-sizing: border-box;
  border: 1px solid var(--border-b);
  border-radius: var(--input-radius);
  outline: none;
}

.textarea:hover {
  border: 1px solid var(--primary-a);
}

.textarea:focus-within {
  border: 1px solid var(--primary-a);
}

.textarea::-webkit-scrollbar {
  width: 0.9rem;
}

.textarea::-webkit-scrollbar-track {
  background: transparent;
}

.textarea::-webkit-scrollbar-thumb {
  border: 2px solid var(--background-b);
  background: #888;
  border-radius: 4px;
  cursor: pointer;
}

.textarea::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.textarea.is-invalid {
  border-color: red;
}

.error-text {
  font-size: var(--text-size-0);
  visibility: hidden;
  text-align: left;
  color: red;
}

.error-text.visible {
  visibility: visible;
}
</style>
