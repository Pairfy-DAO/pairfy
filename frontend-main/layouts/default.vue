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

await auth.fetchUser()
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
