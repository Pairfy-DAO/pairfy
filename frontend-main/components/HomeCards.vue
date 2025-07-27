<template>
  <div class="carousel-container">
    <div class="carousel-shadow left"></div>
    <div class="carousel-shadow right"></div>

    <div class="carousel-track" ref="track">

      <div v-for="(image, index) in images.concat(images)" :key="index" class="carousel-item" :style="getStyle(index)"
        @click="onExplore">
        <img :src="image" alt="Mockup" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const authStore = useAuthStore()

const router = useRouter()

const images = [
  "https://pairfy-media-prod.nyc3.cdn.digitaloceanspaces.com/groups/3b252e0b-c6cf-7296-a214-7a94b4fa8890/G5pn8YAYF2W8LtTd-93d63192-c71c-4a26-8e0c-da261bf863c7-small.webp",
  "https://pairfy-media-prod.nyc3.cdn.digitaloceanspaces.com/groups/2ec5695e-2802-5113-b7bd-0ce79df2eefd/HZyZBcnYcgFe4Ta9-Captura%20de%20pantalla%202025-07-25%20132637-small.webp",
  "https://pairfy-media-prod.nyc3.cdn.digitaloceanspaces.com/groups/732aadfa-2bc8-476e-9081-69d729470305/d5KmFKZzXBtXPXtT-Captura%20de%20pantalla%202025-07-25%20135849-small.webp",
  "https://pairfy-media-prod.nyc3.cdn.digitaloceanspaces.com/groups/ab44d068-5150-f313-fce9-59b6d081e5fc/JYKAupdKAGueHBSZ-Captura%20de%20pantalla%202025-07-25%20120511-small.webp",
  "https://pairfy-media-prod.nyc3.cdn.digitaloceanspaces.com/groups/e5c7d88c-6c61-8582-8979-6d729fc905cf/8s8X7MtuExPdCbkV-Captura%20de%20pantalla%202025-07-25%20140655-small.webp"

]
const track = ref(null)

onMounted(() => {
  const totalWidth = track.value.scrollWidth / 2

  gsap.to(track.value, {
    x: `-=${totalWidth}`,
    duration: 35,
    ease: 'linear',
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
    },
  })
})

// Generar estilo collage
function getStyle(index) {
  const sizes = [
    { w: '240px', h: '180px', r: -4, s: 1 },
    { w: '200px', h: '240px', r: 3, s: 0.95 },
    { w: '220px', h: '200px', r: -2, s: 1.05 },
    { w: '260px', h: '160px', r: 1, s: 1 },
    { w: '230px', h: '230px', r: -1, s: 0.92 },
  ]

  const s = sizes[index % sizes.length]
  return {
    width: s.w,
    height: s.h,
    transform: `rotate(${s.r}deg) scale(${s.s})`,
  }
}

const onExplore = () => {
  router.push({
    name: 'country-s',
    params: { country: authStore.country },
    query: {
      prompt: "office",
      vectorized: true
    }
  })
}

</script>

<style scoped>
.carousel-container {
  position: relative;
  overflow: hidden;
  width: 70%;
  height: 300px;
  background: #fff;
}

.carousel-track {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 48px;
  will-change: transform;
}

.carousel-item {
  flex-shrink: 0;
  border-radius: 16px;
  padding: 1rem;
  cursor: pointer;
  overflow: hidden;
  box-shadow: var(--shadow-c);
  transition: transform 0.3s ease;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.carousel-shadow {
  position: absolute;
  top: 0;
  width: 80px;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.carousel-shadow.left {
  left: -1px;
  background: linear-gradient(to right, white 75%, transparent);
}

.carousel-shadow.right {
  right: -1px;
  background: linear-gradient(to left, white 75%, transparent);
}

@media (max-width: 600px) {
  .carousel-container {
    width: 100%;
  }

  .carousel-track {
    gap: 12px;
    padding: 12px 16px;
  }

  .carousel-item {
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
  }
}

@media (max-width: 600px) {
  .carousel-container {
    height: 220px;
  }
  .carousel-track {
    gap: 12px;
    padding: 12px 16px;
  }
  .carousel-item {
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
  }
}

/* TABLETS */
@media (min-width: 601px) and (max-width: 1024px) {
  .carousel-container {
    width: 100%;
  }
  .carousel-track {
    gap: 16px;
    padding: 16px 24px;
  }
  .carousel-item {
    border-radius: 14px;
  }
}

/* DESKTOP + */
@media (min-width: 1025px) {
  .carousel-container {

    height: 320px;
  }
}
</style>
