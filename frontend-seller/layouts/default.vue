<template>
  <div class="layout">
    <aside :class="['sidebar', { collapsed: isCollapsed && !isHovering }]">

      <div class="sidebar-header">
        <div class="sidebar-logo">
          <img src="@/assets/brand/aside-icon.svg" alt="">
        </div>
      </div>

      <nav>
        <NuxtLink to="/home" :class="{ selected: currentPath === 'home' }">
          <span class="sidebar-icon">
            <HomeIcon />
          </span>
          <span class="sidebar-label"
            :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'home' }"
            v-show="!isCollapsed || isHovering">Home</span>
        </NuxtLink>

        <NuxtLink to="/product-list" :class="{ selected: currentPath === 'product-list' }">
          <span class="sidebar-icon">
            <ProductsIcon />
          </span>
          <span class="sidebar-label"
            :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'product-list' }"
            v-show="!isCollapsed || isHovering">Products</span>
        </NuxtLink>

        <NuxtLink to="/product-books" :class="{ selected: currentPath === 'product-books' }">
          <span class="sidebar-icon">
            <BooksIcon />
          </span>
          <span class="sidebar-label"
            :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'product-books' }"
            v-show="!isCollapsed || isHovering">Books</span>
        </NuxtLink>

        <NuxtLink to="/create-product" :class="{ selected: currentPath === 'create-product' }">
          <span class="sidebar-icon">
            <CreateIcon />
          </span>
          <span class="sidebar-label"
            :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'create-product' }"
            v-show="!isCollapsed || isHovering">Create</span>
        </NuxtLink>

        <NuxtLink to="/notifications" :class="{ selected: currentPath === 'notifications' }">
          <span class="sidebar-icon">
            <BellIcon />
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
.layout {
  background: var(--gradient-a); 
  display: flex;
  height: 100vh;
}

.layout-content {
  overflow-y: auto;
  flex: 1;
}

.sidebar {
  border-bottom-right-radius: var(--radius-c);
  border-top-right-radius: var(--radius-c);
  border-right: 1px solid var(--border-a);
  background: var(--background-a);
  box-shadow: var(--shadow-a);
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
