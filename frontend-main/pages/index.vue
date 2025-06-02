<template>
  <HomeSection1 />
</template>

<script setup lang="ts">
import Lenis from 'lenis'

let lenis: Lenis | null = null
let frameId: number

onMounted(() => {
  addLenis()
})

onBeforeUnmount(() => {
  removeLenis()
})

function addLenis() {
  lenis = new Lenis({
    smooth: true,
  } as any)

  const raf = (time: number) => {
    lenis?.raf(time)
    frameId = requestAnimationFrame(raf)
  }

  frameId = requestAnimationFrame(raf)
}


function removeLenis() {
  if (frameId) cancelAnimationFrame(frameId)
  lenis?.destroy()
}

useHead({
  title: 'Pairfy - Cardano marketplace',
  meta: [
    { name: 'description', content: 'Buy and sell products on Cardano blockchain.' }
  ]
})

</script>