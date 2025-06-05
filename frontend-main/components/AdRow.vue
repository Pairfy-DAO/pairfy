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
    margin-top: 1rem;
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
    background-image: url('@/assets/banner/1.png');
    background-position: center;
}
</style>