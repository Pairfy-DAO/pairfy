<template>
    <div class="OrderPanel">
        <OrderChat />
        <OrderMetadata v-if="orderStore.address"/>
    </div>
</template>

<script setup>

const orderStore = useOrderStore()

</script>

<style lang="css" scoped>
.OrderPanel {
    display: flex;
    flex-direction: column;
}
</style>