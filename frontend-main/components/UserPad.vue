<template>
    <div class="UserPad">
        <ReturnButton v-if="orderStore.state === 0"/>
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
