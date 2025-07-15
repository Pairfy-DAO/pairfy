<template>
    <div class="SellerPad">
        <AcceptButton v-if="orderStore.state === 0" />
        <DispatchButton v-if="orderStore.state === 1" />
        <CollectButton v-if="[2, 3].includes(orderStore.state)" />
    </div>
</template>

<script setup>
const orderStore = useOrderStore()

</script>

<style scoped>
.SellerPad {
    display: flex;
}
</style>