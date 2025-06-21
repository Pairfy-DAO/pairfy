<template>
    <div class="p-VerifyView">
        <ToastComp ref="toastRef" />

        <span>{{ message }}</span>
    </div>
</template>

<script setup>
const auth = useAuthStore()

const route = useRoute()

const router = useRouter()

const toastRef = ref(null);

const displayMessage = (message, type, duration) => {
    toastRef.value?.showToast(message, type, duration)
}

let message = ref("Verifying your email...")

onMounted(async () => {
    const mode = route.query.m?.toString()
    const token = route.query.t?.toString()

    if (mode === 'verify' && token) {
        try {
            const response = await auth.verify({ token })

            message.value = response.message

            displayMessage(response.message, 'info', 20_000)

            router.replace({ path: '/entry', query: { m: 'login' } })
        } catch (err) {
            displayMessage(err, 'error', 20_000)
        }
    }
})

</script>

<style lang="css" scoped>
.p-VerifyView {
    background: var(--background-b);
    border-radius: var(--radius-c);
    font-size: var(--text-size-4);
    text-align: center;
    font-weight: 600;
    padding: 12px;
}
</style>