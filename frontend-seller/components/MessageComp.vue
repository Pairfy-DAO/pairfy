<template>
    <div>
      <div
        ref="contentRef"
        class="json-card"
        :class="{ collapsed: !expanded }"
      >
        <div
          class="json-entry"
          v-for="(value, key) in parsedData"
          :key="key"
        >
          <span class="json-key">{{ key }}:</span>
          <span class="json-value">{{ value }}</span>
        </div>
      </div>
  
      <button
        v-if="showToggle"
        @click="toggleExpand"
        class="toggle-btn"
        type="button"
      >
        {{ expanded ? 'Show less' : 'Show more' }}
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
  
  const props = defineProps({
    content: {
      type: String,
      required: true
    }
  })
  
  const parsedData = computed(() => {
    try {
      return JSON.parse(props.content)
    } catch {
      return { error: 'Inválid JSON ' }
    }
  })
  
  const contentRef = ref(null)
  const expanded = ref(false)
  const showToggle = ref(false)
  
  function checkOverflow() {
    if (contentRef.value) {
      showToggle.value = contentRef.value.scrollHeight > 100
    }
  }
  
  const toggleExpand = () => {
    expanded.value = !expanded.value
  }
  

  watch(parsedData, async () => {
    await nextTick()
    checkOverflow()
  })
  

  let resizeObserver
  onMounted(() => {
    checkOverflow()
  
    resizeObserver = new ResizeObserver(checkOverflow)
    if (contentRef.value) {
      resizeObserver.observe(contentRef.value)
    }
  })
  
  onBeforeUnmount(() => {
    if (resizeObserver && contentRef.value) {
      resizeObserver.unobserve(contentRef.value)
    }
  })
  </script>
  
  <style scoped>
  .json-card {
    border: 1px solid var(--border-a);
    border-radius: var(--radius-c);
    box-shadow: var(--shadow-b);
    padding: 1rem;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
  
  .collapsed {
    max-height: 100px;
  }
  
  .json-entry {
    margin-top: 0.5rem;
    word-break: break-word;
  }
  
  .json-key {
    font-weight: bold;
    display: block;
  }
  
  .json-value {
    display: block;
    margin-top: 0.5rem;
    color: var(--text-b);
  }
  
  .toggle-btn {
    margin-top: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--primary-a);
    font-size: var(--text-size-0);
    text-decoration: underline;
    padding: 0;
  }
  </style>
  