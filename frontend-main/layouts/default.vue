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
const wallet = useWalletStore()

await auth.fetchUser()

await wallet.connect(auth.walletName)

onMounted(()=> auth.checkLocation())

</script>

<style scoped>
.layout {
  flex-direction: column;
  min-height: 100vh;
}

.content {
  overflow-y: auto;
  flex: 1;
}
</style>
