<template>
  <div class="layout-entry">
    <main class="layout-entry-content">
      <slot />
    </main>
  </div>
</template>


<script setup>
const auth = useAuthStore()

await auth.fetchUser()

</script>


<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}


.layout-entry {
  background: var(--primary-a);
  display: flex;
  height: 100vh;
}

.layout-entry-content {
  flex-grow: 1;
  overflow-y: auto;
}
</style>