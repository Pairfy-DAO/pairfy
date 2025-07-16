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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-laptop-minimal-icon lucide-laptop-minimal"><rect width="18" height="12" x="3" y="4" rx="2" ry="2"/><line x1="2" x2="22" y1="20" y2="20"/></svg>
          </span>
          <span class="sidebar-label"
            :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'product-list' }"
            v-show="!isCollapsed || isHovering">Products</span>
        </NuxtLink>

        <NuxtLink to="/product-books" :class="{ selected: currentPath === 'product-books' }">
          <span class="sidebar-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library-big-icon lucide-library-big"><rect width="8" height="18" x="3" y="3" rx="1"/><path d="M7 3v18"/><path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z"/></svg>
          </span>
          <span class="sidebar-label"
            :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'product-books' }"
            v-show="!isCollapsed || isHovering">Books</span>
        </NuxtLink>

        <NuxtLink to="/order-list" :class="{ selected: currentPath === 'order-list' }">
          <span class="sidebar-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-list-icon lucide-clipboard-list"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
          </span>
          <span class="sidebar-label"
            :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'order-list' }"
            v-show="!isCollapsed || isHovering">Orders</span>
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
