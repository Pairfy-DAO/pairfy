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

onMounted(()=> auth.checkLocation())

</script>

<style scoped>
.layout {
  min-height: 100vh;
}

.content {
  flex: 1;
}
</style>
