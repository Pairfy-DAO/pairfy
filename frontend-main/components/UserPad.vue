<template>
    <div class="UserPad">
        <ReceivedButton v-if="orderStore.state === 2" />
    </div>
</template>

<script setup>
const orderStore = useOrderStore()

</script>

<style scoped>
.UserPad {
    display: flex;
}
</style>

