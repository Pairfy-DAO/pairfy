<template>
  <div class="layout">
    <HeaderComp />
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<script setup>

const auth = useAuthStore()

await auth.fetchUser()

onMounted(() => {
  auth.checkLocation() 
})

</script>

<style scoped>
.layout {
  background: var(--background-b); 
  flex-direction: column;
  min-height: 100vh;
}

.content {
  overflow-y: auto;
  flex: 1;
}
</style>
