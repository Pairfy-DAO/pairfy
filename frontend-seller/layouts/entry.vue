<template>
  <div class="layout-entry">
    <main class="layout-entry-content">
      <slot />
    </main>
  </div>
</template>


<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
if (import.meta.server) {

  await auth.fetchProfile()
  console.log('[layout-entry] Perfil cargado:', auth.seller)

}

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