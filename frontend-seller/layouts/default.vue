<template>
  <div class="app-layout">
    <aside :class="['sidebar', { collapsed: isCollapsed && !isHovering }]">

      <div class="sidebar-header">
        <div class="sidebar-logo">
          <img src="@/assets/brand/aside-icon.svg" alt="">
        </div>
      </div>

      <nav>
        <NuxtLink to="/home">
          <div class="sidebar-nav-button">
            <span class="sidebar-icon" :class="{ selected: currentPath === 'home' }">
              <HomeIcon />
            </span>
          </div>
          <span class="sidebar-label"
            :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'home' }"
            v-show="!isCollapsed || isHovering">Home</span>
        </NuxtLink>

        <NuxtLink to="/product-list">
          <div class="sidebar-nav-button">
            <span class="sidebar-icon" :class="{ selected: currentPath === 'product-list' }">
              <ProductsIcon />
            </span>
          </div>
          <span class="sidebar-label"
            :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'product-list' }"
            v-show="!isCollapsed || isHovering">Products</span>
        </NuxtLink>

        <NuxtLink to="/product-books">
          <div class="sidebar-nav-button">
            <span class="sidebar-icon" :class="{ selected: currentPath === 'product-books' }">
              <BooksIcon />
            </span>
          </div>
          <span class="sidebar-label"
            :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'product-books' }"
            v-show="!isCollapsed || isHovering">Books</span>
        </NuxtLink>

        <NuxtLink to="/create-product">
          <div class="sidebar-nav-button">
            <span class="sidebar-icon" :class="{ selected: currentPath === 'create-product' }">
              <CreateIcon />
            </span>
          </div>
          <span class="sidebar-label"
            :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'create-product' }"
            v-show="!isCollapsed || isHovering">Create</span>
        </NuxtLink>

        <NuxtLink to="/notifications">
          <div class="sidebar-nav-button">
            <span class="sidebar-icon" :class="{ selected: currentPath === 'notifications' }">
              <BellIcon />
            </span>
          </div>
          <span class="sidebar-label"
            :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'notifications' }"
            v-show="!isCollapsed || isHovering">Notifications</span>
        </NuxtLink>

      </nav>
    </aside>

    <main class="app-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const currentPath = computed(() => route.name)

const auth = useAuthStore()

const isCollapsed = ref(false)
const isHovering = ref(false)

if (import.meta.server) {
  await auth.fetchProfile()
}
</script>

<style scoped>
.app-layout {
  background: var(--background-b);
  display: flex;
  height: 100vh;
}

.app-content {
  overflow-y: auto;
  flex: 1;
}

.sidebar {
  border-bottom-right-radius: var(--radius-c);
  border-top-right-radius: var(--radius-c);
  background: var(--gray-a);
  box-shadow: var(--shadow-a);
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 14rem;
}

.sidebar.collapsed {
  width: 4rem;
}

nav {
  flex-direction: column;
  margin-top: 1rem;
  display: flex;
  gap: 0rem;
}

nav a {
  font-size: var(--text-size-0);
  text-decoration: none;
  color: var(--text-w);
  align-items: center;
  padding: 0.5rem 0;
  font-weight: 600;
  display: flex;
}

nav a:hover {
  background: var(--background-b);
  color: var(--primary-a);
}

.sidebar-nav-button {
  justify-content: center;
  align-items: center;
  display: flex;
  width: 4rem;
  min-width: 4rem;
}

.sidebar-icon {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-icon.selected {
  border-radius: var(--radius-b);
  background: var(--primary-a);
  color: var(--text-w);
}

.sidebar-label {
  animation: fade-in 0.5s ease forwards;
  white-space: nowrap;
  visibility: initial;
}

.sidebar-label.selected {
  color: var(--primary-a);
}

.sidebar-label.collapsed {
  visibility: hidden;
}

.sidebar-header {
  display: flex;
  margin-top: 1rem;
  align-items: center;
}

.sidebar-logo {
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
  display: flex;
}

</style>
