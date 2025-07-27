<template>
  <div class="cards-wrapper">
    <div class="card" v-for="(card, index) in cards" :key="index" :class="`card--init-${index}`"
      :ref="el => cardRefs[index] = el">
      <h3>{{ card.title }}</h3>
      <p>{{ card.text }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cards = [
  { title: 'Staking pool', text: 'Earn $PAIRFY tokens' },
  { title: 'DAO community', text: 'Discord' },
  { title: 'Trending', text: 'Best sellers' }
]

const cardRefs = ref([])

onMounted(async () => {
  await nextTick()

  cardRefs.value.forEach((card, i) => {
    const initialX = i === 0 ? -150 : i === 2 ? 150 : 0
    const initialRot = i === 0 ? -8 : i === 2 ? 8 : 0

    // Estado inicial
    gsap.set(card, {
      x: initialX,
      y: -100,
      rotation: initialRot,
      opacity: 0,
     
    })

    // Timeline con ease diferente para `y`
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      delay: 1.5,
    })

    tl.to(card, {
      x: 0,
      rotation: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
    }, 0)

    tl.to(card, {
      y: 0,
      duration: 2,
      ease: 'back.out(1)',
    }, 0)
  })

  ScrollTrigger.refresh()
})

</script>

<style scoped>
.cards-wrapper {
  display: flex;
  justify-content: center;
  align-items: start;
  gap: 2rem;
  flex-wrap: wrap;
  padding: 4rem 2rem;
}

.card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow-b);
  width: 300px;
  opacity: 0;
  transform: translateY(-100px);
  transition: transform 0.3s ease;
  will-change: transform, opacity;
}

/* Modificadores individuales */
.card--init-0 {
  transform: translateX(-150px) rotate(-8deg) translateY(-100px);
}

.card--init-1 {
  transform: translateY(-100px);
}

.card--init-2 {
  transform: translateX(150px) rotate(8deg) translateY(-100px);
}

.card:hover {
  transform: scale(1.03) translateY(-5px);
  z-index: 2;
}

.card h3 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}

.card p {
  font-size: 1rem;
  color: #555;
}
</style>
