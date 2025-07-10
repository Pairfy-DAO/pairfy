<template>
    <div class="ToastComp-container">
      <transition-group name="ToastComp" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['ToastComp', toast.type]"
        >
          <span class="ToastComp-message">{{ toast.message }}</span>
        </div>
      </transition-group>
    </div>
  </template>
  
  <script setup lang="ts">
  const toasts = ref<{ id: number; message: string; type: string }[]>([]);
  let counter = 0;
  

  function showToast(
    message: string,
    type: "success" | "error" | "info" | "default" = "default",
    duration = 5000
  ) {
    const id = counter++;
    toasts.value.push({ id, message, type });
  
    setTimeout(() => removeToast(id), duration);
  }
  

  function removeToast(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }
  
  defineExpose({ showToast });
  </script>
  
  <style scoped>
  .ToastComp-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 30000;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .ToastComp {
    justify-content: space-between;
    border-radius: var(--radius-b);
    font-size: var(--text-size-1);
    box-shadow: var(--shadow-b);
    margin-bottom: 1rem;
    align-items: center;
    position: relative;
    min-width: 300px;
    max-width: 400px;
    font-weight: 500;
    padding: 1rem;
    display: flex;
  }
  
  .ToastComp.success {
    background-color: #e6f4ea;
    color: #216e39;
  }
  .ToastComp.error {
    background-color: #fdecea;
    color: #b91c1c;
  }
  .ToastComp.info {
    background-color: #e8f1fb;
    color: #1e3a8a;
  }
  .ToastComp.default {
    background-color: #f3f4f6;
    color: #374151;
  }
  
  .ToastComp-message {
    overflow-wrap: anywhere;
    text-align: left;
    flex: 1;
  }
  
  .ToastComp-enter-active,
  .ToastComp-leave-active {
    transition: all 0.3s ease;
  }
  .ToastComp-enter-from,
  .ToastComp-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  </style>
  