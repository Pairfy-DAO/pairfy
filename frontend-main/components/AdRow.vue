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
    height: 6rem;
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
    background: linear-gradient(
    135deg,
    #fff6e5 0%,
    #fbe8f9 0%,
    #e3f0ff 25%,
    #e8f4fc 80%,
    #e9fff0 100%
  )
}
</style>