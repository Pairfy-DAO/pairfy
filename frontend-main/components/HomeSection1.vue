<template>
    <div class="HomeSection1">

        <img src="/assets/images/drawing.svg" alt="wave" class="wave-svg" />

        <section class="top-section">
            <h1 class="title fade-title">Welcome to your Cardano store</h1>
            <p class="subtitle ">Save with liquidity pool discounts.</p>
            <button class="action-button" @click="onExplore">Explore</button>
        </section>

        <section class="card-section">
            <HomePrompt />
            <DividerComp invisible />
            <HomeCards />
        </section>
    </div>
</template>

<script setup>
import { gsap } from 'gsap'

const authStore = useAuthStore()

const router = useRouter()

const onExplore = () => {
    router.push({
        name: 'country-s',
        params: { country: authStore.country },
        query: {
            prompt: "product",
            vectorized: true
        }
    })
}


onMounted(async () => {
    await nextTick()
    document.body.style.overflow = 'hidden';
    gsap.from('.wave-svg', {
        y: 1000,
        opacity: 0,
        duration: 2,
        ease: 'power3.out',
        onComplete: () => {
            document.body.style.overflow = 'auto';
        }
    })
})

</script>

<style scoped>
.HomeSection1 {
    box-sizing: border-box;

}

.wave-svg {
    position: absolute;
    left: 0;
    bottom: 0;
    object-fit: cover;
    z-index: -1;
    width: 100%;
    height: 100%;
}

.title {
    background: linear-gradient(90deg, var(--primary-a), var(--primary-b));
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    font-size: var(--text-size-9);
    background-clip: text;
    margin-top: 8rem;
    font-weight: bold;
    color: transparent;
}

.subtitle {
    font-size: var(--text-size-7);
    color: var(--text-b);
    margin: 1rem 0;
}

.action-button {
    border: none;
    cursor: pointer;
    margin-top: 1rem;
    color: var(--text-w);
    background: var(--gradient-a);
    font-size: var(--text-size-a);
    padding: var(--button-padding);
    border-radius: var(--radius-c);
    transition: var(--transition-a);
}

.action-button:hover {
    opacity: 0.9;
}

.top-section {

    text-align: center;
}

.card-section {
    justify-content: center;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 3rem;
    display: flex;
}

.section-title {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #444;
}

.card-grid {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
}

.card-item {
    border: 1px solid #eee;
    border-radius: var(--radius-c);
    padding: 1rem;
    width: 220px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;
    background-color: #fff;
}

.card-item:hover {
    transform: translateY(-5px);
}

.card-image {
    width: 100%;
    height: 120px;
    background: var(--background-b);
    border-radius: var(--radius-b);
    margin-bottom: 1rem;
    box-sizing: border-box;
}

.card-image img {
    width: 100%;
}

.product-name {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #222;
}

.product-price {
    font-size: 1rem;
    color: #777;
}

/* -------------------
     Responsive Design
  -------------------- */

@media (max-width: 768px) {
    .title {
        font-size: 2.2rem;
    }

    .subtitle {
        font-size: 1rem;
    }

    .action-button {
        font-size: 0.9rem;
        padding: 0.6rem 1.2rem;
    }

    .card-grid {
        flex-direction: column;
        align-items: center;
    }

    .card-item {
        width: 90%;
        max-width: 300px;
    }
}

@media (max-width: 480px) {
    .title {
        font-size: 1.8rem;
    }

    .subtitle {
        font-size: 0.95rem;
    }

    .section-title {
        font-size: 1.5rem;
    }
}
</style>