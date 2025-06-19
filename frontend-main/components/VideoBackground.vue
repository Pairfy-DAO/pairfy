<template>
    <div class="video-background" ref="containerRef">
        <ClientOnly>
            <video class="video-bg" ref="videoRef" v-if="!prefersReducedMotion" autoplay muted loop playsinline>

                <source src="@/assets/videos/2.mp4" type="video/mp4" />
                Your browser does not support the video HTML5.
            </video>
        </ClientOnly>

        <div class="overlay-content">
            <slot />
        </div>


    </div>
</template>

<script setup lang="ts">
const router = useRouter()

const videoRef = ref<HTMLVideoElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const prefersReducedMotion = ref(false)

let observer: IntersectionObserver | null = null

onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        prefersReducedMotion.value = true
        return
    }

    if (!videoRef.value || !containerRef.value) return

    observer = new IntersectionObserver(
        (entries) => {
            const isVisible = entries[0].isIntersecting
            if (isVisible) {
                videoRef.value?.play().catch(() => { })
            } else {
                videoRef.value?.pause()
            }
        },
        {
            threshold: 0.1,
        }
    )

    observer.observe(containerRef.value)
})

onBeforeUnmount(() => {
    if (observer && containerRef.value) {
        observer.unobserve(containerRef.value)
    }
})

const goToProducts = () => {
    router.push('/products')
}
</script>

<style scoped>
.video-background {
    position: relative;
    overflow: hidden;
    height: inherit;
}

.video-bg {
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    z-index: 0;
    width: auto;
    height: auto;
    transform: translate(-50%, -50%);
    object-fit: cover;
    position: absolute;
    filter: brightness(0.4);
}

.overlay-content {
    position: relative;
    z-index: 1;
}
</style>

<style scoped>
@media (max-width: 480px) {
    .video-bg {
        filter: brightness(0.2);
    }
}

@media (min-width: 481px) and (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) and (max-width: 1599px) {}

@media (min-width: 1600px) {}
</style>