<template>
    <hr class="divider" :style="{ margin }" />
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    margin?: string
  }>()
  
  const margin = props.margin ?? '2rem 0'
  </script>
  
  <style scoped>
  .divider {
    all: initial;
    width: 100%;
    border: none;
    display: block;
    max-width: var(--body-a);
    border-top: 1px solid var(--border-a, #e0e0e0);
  }
  </style>
  