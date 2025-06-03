<template>
  <nav class="HeaderContent flex" :class="{ contrast: isContrast }">
    <div class="HeaderContent-body" :class="{ contrast: isContrast }">

      <div class="left-column flex">
        <img class="icon" v-if="!isContrast" src="@/assets/brand/icon-white.svg" alt="" @click="navigateTo('/')">
        <img class="icon" v-if="isContrast" src="@/assets/brand/icon.svg" alt="" @click="navigateTo('/')">

        <ul class="HeaderContent-nav">

          <li v-for="item in items" :key="item.label" @click="navigateTo(item.route)" :class="{ contrast: isContrast }">
            {{ item.label }}
          </li>
        </ul>
      </div>


      <div class="center-column flex center">
        <HeaderSearch v-if="isContrast" />
      </div>


      <div class="right-column flex end">
        <ClientOnly>
        <HeaderConnect v-if="!auth.isAuthenticated" />
        <HeaderAvatar v-if="auth.isAuthenticated" />
      </ClientOnly>
      </div>

    </div>
  </nav>
</template>


<script setup lang="ts">
const isContrast = computed(() => ['country-p-id', 'country-s'].includes(route.name as string))

const auth = useAuthStore()

const items = ref([
  { label: 'Trending', route: '/docs' },
  { label: 'Categories', route: '/categories' },
  { label: 'Docs', route: '/docs' },
  { label: 'Sellers', route: '/sell' },
  { label: 'Support', route: '/support' }
])

const router = useRouter()
const route = useRoute()
const activeRoute = ref(route.path)

const navigateTo = (path: string) => {
  if (path !== route.path) {
    router.push(path)
  }
}

watch(() => route.path, (newPath) => {
  activeRoute.value = newPath
})
</script>

<style scoped>
.icon {
  height: 2.5rem;
}

.HeaderContent {
  justify-content: center;
  box-sizing: border-box;
  color: var(--text-w);
  position: fixed;
  z-index: 11000;
  height: 4rem;
  width: 100%;
  top: 1rem;
}

.HeaderContent-body {
  display: grid;
  width: inherit;
  color: inherit;
  font-weight: 500;
  align-items: center;
  max-width: var(--body-a);
  grid-template-columns: 1fr 1.25fr 0.5fr;
}

.HeaderContent-nav {
  align-items: center;
  list-style: none;
  padding: 0 1rem;
  width: inherit;
  display: flex;
  gap: 1rem;
  margin: 0;
}

.HeaderContent-body li {
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-f);
  transition: background-color 0.2s;
}

.HeaderContent-body li:hover {
  background: rgba(255, 255, 255, 0.1);
}




.HeaderContent.contrast {
  margin-top: 2rem;
  position: initial;
  background: var(--background-a);
  border-bottom: 1px solid var(--border-a);
} 

.HeaderContent-body.contrast {
  padding: 0.75rem 0;
  color: var(--text-a);
}

.HeaderContent-body li.contrast:hover {
  color: var(--text-a);
  background: rgba(255, 255, 255, 0.05);
}
</style>