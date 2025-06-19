<template>
    <div class="HeaderNav">
        <nav class="HeaderNav-body">
            <ul class="HeaderNav-body-links">
                <li><a href="#">How to sell?</a></li>
                <li><a href="#">How it works?</a></li>
                <li><a href="#">Governance</a></li>
                <li><a href="#">Community</a></li>
                <li><a href="#">I need Help</a></li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
const route = useRoute()
</script>

<style scoped>
.HeaderNav {
    border-top: 1px solid rgba(255, 255, 255, 0.3); 
    background: var(--blue-b);
    height: 2.5rem;
    width: 100%;
    display: flex;
    justify-content: center;
}

.HeaderNav-body {
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

.HeaderNav-body-links {
    list-style: none;
    display: flex;
    gap: 2rem;
    margin: 0;
    padding: 0;
}

.HeaderNav-body-links a {
    color: var(--text-w);
    text-decoration: none;
}

.HeaderNav-body-links a:hover {
    text-decoration: underline;
}
</style>