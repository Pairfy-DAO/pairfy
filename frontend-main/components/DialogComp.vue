<template>
  <div class="dialog-backdrop" v-if="modelValue" @click="emitClose">
    <div class="dialog-box" @click.stop>

      <div class="header flex end">
        <button class="flex center" v-if="props.closable" @click="emitClose">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-x-icon lucide-x">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  closable: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue']);

function emitClose() {
  if(props.closable){
    emit('update:modelValue', false);
  }
}

function open() {
  emit('update:modelValue', true);
}

function close() {
  emit('update:modelValue', false);
}

defineExpose({ open, close });
</script>

<style scoped>
.dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  z-index: 20000;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}

.dialog-box {
  background: var(--background-a);
  border-radius: var(--radius-c);
  box-shadow: var(--shadow-b);
  min-width: 300px;
}

button {
  background: transparent;
  cursor: pointer;
  border: none;
}

.header {
  width: 100%;
}
</style>
