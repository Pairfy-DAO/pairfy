<template>
    <header class="header">
        <nav class="nav">
            <ul class="nav-links">
                <li><a href="#">How to sell?</a></li>
                <li><a href="#">How it works?</a></li>
                <li><a href="#">Governance</a></li>
                <li><a href="#">Community</a></li>
                <li><a href="#">I need Help</a></li>
            </ul>
        </nav>
    </header>
</template>

<script setup>
const route = useRoute()
</script>

<style scoped>
.header {
    border-top: 1px solid rgba(255, 255, 255, 0.3); 
    background: var(--blue-b);
    height: 2.5rem;
    width: 100%;
}

.nav {
    display: flex;
    width: inherit;
    align-items: center;
    color: var(--text-w);
    box-sizing: border-box;
    max-width: var(--body-a);
    text-transform: capitalize;
    font-size: var(--text-size-0);
    justify-content: space-between;
}

.logo {
    font-size: 1.5rem;
}

.nav-links {
    list-style: none;
    display: flex;
    gap: 2rem;
    margin: 0;
    padding: 0;
}

.nav-links a {
    color: #fff;
    text-decoration: none;
}

.nav-links a:hover {
    text-decoration: underline;
}
</style>