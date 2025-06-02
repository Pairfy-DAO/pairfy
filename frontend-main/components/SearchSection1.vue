<template>
    <div class="SearchSection">
        <main class="SearchSection-body">
            <SearchPrompt />
            <DividerComp />
            <ProductGrid title="Results" />
            <DividerComp />
        </main>
    </div>
</template>

<style scoped>
.SearchSection {
    width: 100%; 
    display: flex;
    justify-content: center;
    background: var(--background-b);
}

.SearchSection-body {
    max-width: var(--body-a);
    flex-direction: column;
    width: inherit;
    display: flex;
 
}
</style>