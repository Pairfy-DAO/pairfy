<template>
    <div class="HeaderNav">
        <nav class="HeaderNav-body">
            <div>
                <ul class="navigator">
                    <li><a href="#">How to sell</a></li>
                    <li><a href="#">How it works</a></li>
                    <li><a href="#">Governance</a></li>
                    <li><a href="#">Community</a></li>
                    <li><a href="#">I need Help</a></li>
                </ul>
            </div>

            <div>
                <InboxComp v-model="isOpen" :notifications="notifications">
                    <div class="trigger">
                        🔔 <span>Notifications</span>
                    </div>
                </InboxComp>
            </div>

        </nav>
    </div>
</template>

<script setup>
const isOpen = ref(true);
const notifications = ref([
    { title: 'Nuevo mensaje', body: 'Tienes un mensaje de Laura' },
    { title: 'Actualización disponible', body: 'Nueva versión lista para instalar' },
    { title: 'Recordatorio', body: 'Reunión a las 15:00' },
]);
</script>

<style scoped>
.HeaderNav {
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    background: var(--blue-b);
    justify-content: center;
    box-sizing: border-box;
    padding: 0 1rem;
    height: 2.5rem;
    display: flex;
    width: 100%;
}

.HeaderNav-body {
    display: flex;
    width: inherit;
    align-items: center;
    color: var(--text-w);
    box-sizing: border-box;
    scroll-behavior: smooth;
    max-width: var(--body-a);
    text-transform: capitalize;
    font-size: var(--text-size-0);
    justify-content: space-between;
}

.HeaderNav-body {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.HeaderNav-body::-webkit-scrollbar {
    display: none;
}

.logo {
    font-size: 1.5rem;
}

.navigator {
    list-style: none;
    display: flex;
    gap: 2rem;
    margin: 0;
    padding: 0;
}

.navigator a {
    color: var(--text-w);
    text-decoration: none;
    white-space: nowrap;
}

.navigator a:hover {
    text-decoration: underline;
}
</style>

<style scoped>
@media (max-width: 480px) {}

@media (min-width: 481px) and (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) and (max-width: 1599px) {}

@media (min-width: 1600px) {}
</style>