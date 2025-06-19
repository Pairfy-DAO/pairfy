<template>
    <div class="Banner">
        <div class="Banner-body">
            <div class="overlay">

                <!-- Header -->
                <div class="Banner-header">
                    <div class="Banner-header-left">
                        <h1 class="fade-title">
                            Buy and sell products on Cardano
                        </h1>
                        <ul class="features">
                            <li>✔ Community-governed (DAO)</li>
                            <li>✔ Native asset payments</li>
                            <li>✔ Midnight network</li>
                            <li>✔ Free shipping</li>
                        </ul>
                    </div>

                    <div class="Banner-header-right">
                        <p><strong>5M+</strong> Factory direct supply</p>
                        <p><strong>10</strong> Local warehouses worldwide</p>
                        <p><strong>20M+</strong> Value dropshipping items</p>
                        <p><strong>24H</strong> Personalized sourcing service</p>
                    </div>
                </div>

                <!-- Cards Sections -->
                <div class="Banner-cards">
                    <div class="box">
                        <h2>Discount pool</h2>
                        <div class="cards">834.372 ADA / 53%</div>
                    </div>
                    <div class="box">
                        <h2>Discount airdrop</h2>
                        <div class="cards">43 days left</div>
                    </div>
                    <div class="box">
                        <h2>Benefited users</h2>
                        <div class="cards">1753 wallets</div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.Banner {
    justify-content: center;
    display: flex;
    width: 100%;
}

.Banner-body {
    width: 100%;
    margin-top: 10rem;
    text-align: center;
    position: relative;
    box-sizing: border-box;
    max-width: var(--body-a);
    backdrop-filter: blur(5px);
    border-radius: var(--radius-d);
    border: 1px solid rgba(255, 255, 255, 0.2);
    -webkit-backdrop-filter: blur(5px);
    background: rgba(255, 255, 255, 5%);
}

.overlay {
    color: var(--text-w);
    padding: 2rem;
}

.Banner-header {
    gap: 2rem;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 2rem;
    align-items: flex-start;
    justify-content: space-between;

}

.Banner-header-left h1 {
    margin: 0;
    font-weight: 500;
    margin-bottom: 1rem;
    font-size: var(--text-size-9);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.bold {
    font-weight: 700;
}

.light {
    font-weight: 400;
}

.features {
    padding: 0;
    list-style: none;
    text-align: left;
    margin: 2rem 0 0;
    font-size: var(--text-size-3);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);

}

.features li {
    margin-bottom: 1rem;
}

.Banner-header-right {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    font-size: var(--text-size-3);
    text-align: right;
}

.Banner-header-right strong {
    font-size: inherit;
}

.Banner-cards {
    gap: 2rem;
    display: flex;
    flex-wrap: wrap;
}

.box {
    flex: 1;
    min-width: 200px;
}

.box h2 {
    font-size: var(--text-size-4);
    margin-bottom: 0.75rem;
    margin-bottom: 0.5rem;
}

.cards {
    padding: 1rem;
    font-size: var(--text-size-4);
    border-radius: var(--radius-f);
    background: rgba(255, 255, 255, 0.1);
}
</style>

<style scoped>
/* Smartphones */
@media (max-width: 480px) {
    .Banner-header-left h1 {
        font-size: var(--text-size-8);
    }

    .Banner-body {
        width: 100%;
        border: none;
        margin-top: 2rem;
        border-radius: initial;
        backdrop-filter: blur(0px);
        background: initial;
    }


    .Banner-header {
        flex-direction: column;
        align-items: center;
        margin-top: 4rem;
        gap: 0rem;
    }

    .features {
        font-size: var(--text-size-2);
        text-align: center;
        padding: 1rem;

    }

    .Banner-header-right {
        display: none; 
    }

    .Banner-cards {
        display: none;
    }

    .overlay {
        padding: 0rem;
    }
}

/* Smartphones en paisaje y móviles grandes */
@media (min-width: 481px) and (max-width: 767px) {}

/* Tablets en retrato */
@media (min-width: 768px) and (max-width: 991px) {}

/* Tablets en paisaje y laptops pequeños */
@media (min-width: 992px) and (max-width: 1199px) {}

/* Laptops y escritorios */
@media (min-width: 1200px) and (max-width: 1599px) {}

/* Pantallas grandes */
@media (min-width: 1600px) {}
</style>