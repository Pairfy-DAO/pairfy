<template>
  <div class="dialog-backdrop" v-if="visible" @click="close">
    <div class="dialog-box" @click.stop>

      <div class="header flex">
        <button class="flex center" @click="close">
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
import { ref, defineExpose } from 'vue';

const visible = ref(false);

function open() {
  visible.value = true;
}

function close() {
  visible.value = false;
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
  background: rgba(0, 0, 0, 0.2);
}

.dialog-box {
  background: var(--background-a);
  border-radius: var(--radius-c);
  box-shadow: var(--shadow-b);
  min-width: 300px;
  padding: 1.5rem;
}

button {
  background: transparent;
  cursor: pointer;
  border: none;
}

.header{
  justify-content: flex-end; 
  width: 100%;
}
</style>
