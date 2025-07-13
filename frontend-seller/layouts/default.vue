<template>
  <div class="layout">
    <ToastComp ref="toastRef" />

    <aside :class="['sidebar', { collapsed: isCollapsed && !isHovering }]">

      <div class="sidebar-header">
        <div class="sidebar-logo">
          <img src="@/assets/brand/aside-icon.svg" alt="">
        </div>
      </div>

      <nav>
        <NuxtLink to="/home" :class="{ selected: currentPath === 'home' }">
          <span class="sidebar-icon">

            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-house-icon lucide-house">
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
              <path
                d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>

          </span>
          <span class="sidebar-label"
            :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'home' }"
            v-show="!isCollapsed || isHovering">Home</span>
        </NuxtLink>

        <NuxtLink to="/product-list" :class="{ selected: currentPath === 'product-list' }">
          <span class="sidebar-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-box-icon lucide-box">
              <path
                d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
          </span>
          <span class="sidebar-label"
            :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'product-list' }"
            v-show="!isCollapsed || isHovering">Products</span>
        </NuxtLink>

        <NuxtLink to="/product-books" :class="{ selected: currentPath === 'product-books' }">
          <span class="sidebar-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-layers-icon lucide-layers">
              <path
                d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
              <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
              <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
            </svg>
          </span>
          <span class="sidebar-label"
            :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'product-books' }"
            v-show="!isCollapsed || isHovering">Books</span>
        </NuxtLink>

        <NuxtLink to="/create-product" :class="{ selected: currentPath === 'create-product' }">
          <span class="sidebar-icon">

            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-circle-plus-icon lucide-circle-plus">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>

          </span>
          <span class="sidebar-label"
            :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'create-product' }"
            v-show="!isCollapsed || isHovering">Create</span>
        </NuxtLink>

        <NuxtLink to="/notifications" :class="{ selected: currentPath === 'notifications' }">
          <span class="sidebar-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-bell-icon lucide-bell">
              <path d="M10.268 21a2 2 0 0 0 3.464 0" />
              <path
                d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
            </svg>
          </span>
          <span class="sidebar-label"
            :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'notifications' }"
            v-show="!isCollapsed || isHovering">Notifications</span>
        </NuxtLink>

      </nav>
    </aside>

    <main class="layout-content">
      <slot />
    </main>
  </div>
</template>

<script setup>

const route = useRoute()
const currentPath = computed(() => route.name)

const authStore = useAuthStore()
const walletStore = useWalletStore()

const isCollapsed = ref(false)
const isHovering = ref(false)

const toastRef = ref(null);

await authStore.fetchUser()

const connectWallet = async () => {
  try {
    await walletStore.connect(authStore.walletName)
  } catch (err) {
    authStore.showToast(err.message, 'error', 5_000)
  }
}

function watchToast() {
    watch(() => authStore.toastMessage, ({ message, type, duration }) => toastRef.value?.showToast(message, type, duration));
}

onMounted(() => {
  watchToast()
  connectWallet()
})
</script>

<style scoped>
.layout {
  background: var(--background-b);
  display: flex;
  height: 100vh;
}

.layout-content {
  box-sizing: border-box;
  overflow-y: auto;
  flex: 1;
}

.sidebar {
  transition: width 0.3s ease;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  width: 14rem;
}

.sidebar.collapsed {
  width: 4rem;
}

.sidebar-header {
  display: flex;
  padding: 0 1rem;
  margin-top: 1rem;
  align-items: center;
}

.sidebar-logo {
  justify-content: center;
  align-items: center;
  display: flex;
}

nav {
  flex-direction: column;
  margin-top: 1rem;
  display: flex;
  padding: 1rem;
  gap: 0.5rem;
}

nav a {
  border-radius: var(--radius-b);
  font-size: var(--text-size-0);
  text-decoration: none;
  color: var(--text-a);
  align-items: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-weight: 600;
  display: flex;
}

nav a:hover {
  background: var(--background-b);
  color: var(--primary-a);
}

nav a.selected {
  background: var(--primary-a);
  color: var(--text-w);
}

.sidebar-icon {
  width: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-label {
  animation: fade-in 0.5s ease forwards;
  white-space: nowrap;
  visibility: initial;
}

.sidebar-label.collapsed {
  visibility: hidden;
}
</style>
