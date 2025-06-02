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
  flex-direction: column;
  height: 100vh;
}

.content {
  overflow-y: auto;
  flex: 1;
}
</style>
