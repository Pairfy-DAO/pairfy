<template>
  <div class="app-layout">
    <aside :class="['sidebar', { collapsed: isCollapsed && !isHovering }]">

      <div class="sidebar-header">
        <div class="sidebar-logo">
          <img src="@/assets/brand/icon.svg" alt="">
        </div>
      </div>

      <nav>
        <NuxtLink to="/home">
          <div class="sidebar-nav-button">
            <span class="sidebar-icon" :class="{ selected: currentPath === 'home' }">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            </span>
          </div>
          <span class="sidebar-label" :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'home' }" v-show="!isCollapsed || isHovering">Home</span>
        </NuxtLink>

        <NuxtLink to="/product-list">
          <div class="sidebar-nav-button">
            <span class="sidebar-icon" :class="{ selected: currentPath === 'product-list' }">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-box-icon lucide-box"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            </span>
          </div>
          <span class="sidebar-label" :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'product-list' }" v-show="!isCollapsed || isHovering">Products</span>
        </NuxtLink>

        <NuxtLink to="/product-books">
          <div class="sidebar-nav-button">
            <span class="sidebar-icon" :class="{ selected: currentPath === 'product-books' }">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-bag-icon lucide-shopping-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </span>
          </div>
          <span class="sidebar-label" :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'product-books' }" v-show="!isCollapsed || isHovering">Books</span>
        </NuxtLink>

        <NuxtLink to="/create-product">
          <div class="sidebar-nav-button">
            <span class="sidebar-icon" :class="{ selected: currentPath === 'create-product' }">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-plus-icon lucide-circle-plus"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
            </span>
          </div>
          <span class="sidebar-label" :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'create-product' }" v-show="!isCollapsed || isHovering">Create</span>
        </NuxtLink>

        <NuxtLink to="/notifications">
          <div class="sidebar-nav-button">
            <span class="sidebar-icon" :class="{ selected: currentPath === 'notifications' }">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell-icon lucide-bell"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>
            </span>
          </div>
          <span class="sidebar-label" :class="{ collapsed: isCollapsed && !isHovering, selected: currentPath === 'notifications' }" v-show="!isCollapsed || isHovering">Notifications</span>
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
  align-items: center;
}

.sidebar-logo {
  justify-content: center;
  align-items: center;
  min-width: 4rem;
  display: flex;
  height: 4rem;
  width: 4rem;
}

.sidebar-logo img {
  width: 3rem;
}
</style>
