<template>
  <nav class="SubMenu" :class="{ contrast: isContrast }">
    <ul class="SubMenu-body" :class="{ contrast: isContrast }">
      <img class="icon" v-if="!isContrast" src="@/assets/brand/icon-white.svg" alt="" @click="navigateTo('/')">
      <img class="icon" v-if="isContrast" src="@/assets/brand/icon.svg" alt="" @click="navigateTo('/')">

      <li v-for="item in items" :key="item.label" @click="navigateTo(item.route)" :class="{ contrast: isContrast }">
        {{ item.label }}
      </li>

      <HeaderSearchComp v-if="isContrast" />

      <div style="margin-left: auto;">
        <HeaderConnectComp />
      </div>
    </ul>
  </nav>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const isContrast = computed(() => ['p-id', 's'].includes(route.name as string))

interface SubMenuItem {
  label: string
  route: string
}

const props = defineProps<{
  items: SubMenuItem[]
}>()

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

.SubMenu {
  justify-content: center;
  box-sizing: border-box;
  color: var(--text-w);
  position: fixed;
  z-index: 11000;
  display: flex;
  height: 4rem;
  width: 100%;
  top: 1rem;
}

.SubMenu-body {
  gap: 1rem;
  margin: 0;
  display: flex;
  width: inherit;
  color: inherit;
  font-weight: 500;
  list-style: none;
  align-items: center;
  padding: 0.75rem 0rem;
  max-width: var(--body-a);
}

.SubMenu-body li {
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-f);
  transition: background-color 0.2s;
}

.SubMenu-body li:hover {
  background: rgba(255, 255, 255, 0.1);
}




.SubMenu.contrast {
  margin-top: 2rem;
  position: initial;
  background: var(--background-a);
}

.SubMenu-body.contrast {
  padding: 0.75rem 0;
  color: var(--text-a);
}

.SubMenu-body li.contrast:hover {
  color: var(--primary-a);
  background: rgba(0, 0, 0, 0.04);
}
</style>