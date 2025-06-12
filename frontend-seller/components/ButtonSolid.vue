
<template>
  <button class="p-ButtonSolid" :class="[{ disabled }, sizeClass]" @click="$emit('click')" :disabled="disabled">

    <div class="p-ButtonSolid-body">
      <span class="loader" v-if="loading" />
      <span class="label" v-if="!loading">{{ label }}</span>
    </div>

  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  size: {
    type: String as PropType<'mini' | 'mid' | 'large'>,
    default: 'mid'
  },
  label: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})
defineEmits(['click'])

const sizeClass = computed(() => {
  switch (props.size) {
    case 'mini':
      return 'btn-mini'
    case 'large':
      return 'btn-large'
    default:
      return 'btn-mid'
  }
})
</script>

<style scoped>
.p-ButtonSolid {
  transition: background-color 0.2s ease;
  border-radius: var(--button-radius);
  background: var(--primary-a);
  justify-content: center;
  color: var(--text-w);
  align-items: center;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  border: none;
}

.p-ButtonSolid:hover {
  background: var(--primary-b);
}

.p-ButtonSolid.disabled {
  pointer-events: none;
}

.p-ButtonSolid-body {
  align-items: center;
  display: flex;
}

.btn-mini {
  padding: 4px 8px;
  font-size: 12px;
}

.btn-mid {
  font-size: var(--text-size-1);
  padding: 0.75rem 1rem;
}

.btn-large {
  padding: 12px 24px;
  font-size: 16px;
}


.loader {
  width: 1rem;
  height: 1rem;
  margin: 0 1rem;
  border: 2px solid #FFF;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  border-bottom-color: transparent;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
