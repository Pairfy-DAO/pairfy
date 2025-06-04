<template>
    <div class="AdRow flex center">
        <div class="AdRow-body">
       
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="css" scoped>
.AdRow {
    width: 100%;
    height: 8rem;
    overflow: hidden;
}

.AdRow img {
    object-fit: cover;
    width: inherit;
    height: 100%;
}

.AdRow-body {
    width: 100%;
    height: inherit;
    max-width: var(--body-a);
    background: rgba(128, 128, 128, 0.1);
    background-image: url('@/assets/banner/1.png');
    background-size: contain;
    background-position: center;
}
</style>