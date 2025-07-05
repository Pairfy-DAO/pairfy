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
                    <div class="notification">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell-icon lucide-bell"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>
                        <div>0</div>
                        <span>Notifications</span>                 
                    </div>
                </InboxComp>
            </div>

        </nav>
    </div>
</template>

<script setup>
const isOpen = ref(true);

const data = {
    id: 'zd5zti1do3p564o1',
    type: 'order',
    title: 'Payment Detected',
    owner: 'a239e6c2bbd6a9f3249d65afef89c28e1471ed07c529ec06848cc141',
    seen: 0,
    data: '{"threadtoken":"512c745edc9bcca15300512004de0652de4eb7dca9b0b2374ce00d65","buyer_address":"addr_test1qz3rnekzh0t2nueyn4j6lmufc28pgu0dqlzjnmqxsjxvzs24qtjuxnphyqxz46t40nudnm3kxu8hkau2mq6nw7svg7jswruwy3","country":"US","buyer_wallet":"lace"}',
    message: 'The payment is being processed on the network.',
    created_at: 1751658616793,
    updated_at: 1751658616793
}

const notifications = ref([
    { title: 'Payment Detected', type: 'order', message:  'The payment is being processed on the network.', created_at: 1751658616793 },
    { title: 'Payment Detected', message: 'The payment is being processed on the network.', created_at: 1751658616793 },
    { title: 'Payment Detected', message: 'The payment is being processed on the network.', created_at: 1751658616793 },
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

.notification {
    display: flex;
    cursor: pointer;
    align-items: center;
}

.notification span {
    font-size: var(--text-size-1);
    margin-left: 0.5rem;
}

.notification div{
    border-radius: var(--radius-f);
    background: var(--red-a);
    justify-content: center;
    align-items: center;
    margin-left: 0.5rem;
    font-size: 10px;
    width: 1.25rem;
    display: flex;
    height: 1.25rem;

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