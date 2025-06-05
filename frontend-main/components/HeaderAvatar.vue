<template>
    <div class="HeaderAvatar" @click="auth.userDrawer = true">
        <div class="HeaderAvatar-icon">
            <svg width="24" height="24" fill="#ffffff" viewBox="0 0 24 24">
                <path
                    d="M12 12c2.7 0 4.5-1.8 4.5-4.5S14.7 3 12 3 7.5 4.8 7.5 7.5 9.3 12 12 12zm0 1.5c-3 0-9 1.5-9 4.5V21h18v-3c0-3-6-4.5-9-4.5z" />
            </svg>
        </div>


        <p class="HeaderAvatar-name">{{ truncateText(auth.user.pubkeyhash, 12) }}</p>
    </div>
</template>

<script setup>
import { truncateText } from '~/utils/utils'

const auth = useAuthStore()


</script>

<style scoped>
.HeaderAvatar {
    gap: 1rem;
    display: flex;
    padding: 0 0.5rem;
    align-items: center;
    border-radius: var(--radius-e);
    border: 1px solid rgb(255, 255, 255);
}

.HeaderAvatar-icon {
    width: 2rem;
    height: 2rem;
    display: flex;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
}

.HeaderAvatar-name {
    font-size: var(--text-size-1);
    font-weight: 400;
}
</style>