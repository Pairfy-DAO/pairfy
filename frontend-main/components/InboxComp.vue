<template>
    <div class="InboxComp">
      <div @click="toggle">
        <slot />
      </div>
  
      <div class="notification-panel" v-if="props.modelValue">
        <div class="notification-empty" v-if="props.notifications.length === 0" >
          No notifications
        </div>
        <ul v-else class="notification-list">
          <li class="notification-item" v-for="(n, i) in props.notifications" :key="i" >
            <p class="notification-title">{{ n.title }}</p>
            <p class="notification-body">{{ n.body }}</p>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    notifications: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
  });
  const emit = defineEmits(['update:modelValue']);
  
  const toggle = () => {
    emit('update:modelValue', !props.modelValue);
  };
  </script>
  
  <style scoped>
  .InboxComp {
    position: relative;
    display: inline-block;
  }
  
  .notification-panel {
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 8px;
    width: 260px;
    background-color: rgb(202, 19, 19);
    border: 1px solid #ad2121;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 14000;
    max-height: 300px;
    overflow-y: auto;
  }
  
  .notification-empty {
    padding: 16px;
    color: #888;
    text-align: center;
    font-size: 14px;
  }
  
  .notification-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .notification-item {
    padding: 12px 16px;
    border-bottom: 1px solid #eee;
  }
  
  .notification-title {
    margin: 0;
    font-weight: bold;
  }
  
  .notification-body {
    margin: 4px 0 0;
    font-size: 13px;
    color: #555;
  }
  </style>
  