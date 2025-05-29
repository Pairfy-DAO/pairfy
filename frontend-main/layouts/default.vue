<template>
  <div class="layout">
    <HeaderComp />
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">

const auth = useAuthStore()

if (import.meta.server) {
  await auth.fetchProfile()
}
</script>

<style scoped>
.layout {
  flex-direction: column;
  height: 100vh;
}

.content {
  overflow-y: auto;
  flex: 1;
}
</style>
