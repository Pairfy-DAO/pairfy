<template>
    <div class="HeaderTop flex" v-if="isContrast">

        <div class="HeaderTop-content flex">
            <div class="HeaderTop-location flex" @click="auth.locationDialog = true">
                <img :src="US" alt="">
                <span></span>
                <span>United States</span>
            </div>

            <nav class="flex">
                <span class="HeaderTop-price">Discount liquidity: 834.000 ADA</span>
                <span class="HeaderTop-price">Volume 24h: 253.894 ADA</span>
                <span class="HeaderTop-price">ADAUSD 1.5 </span>
                <span class="HeaderTop-price">IUSD 1.0</span>
                <span class="HeaderTop-price">USDM 1.0</span>
                <span class="HeaderTop-price">USDA 1.0</span>


                <div class="HeaderTop-network flex">
                    <div class="flex">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-arrow-down-up-icon lucide-arrow-down-up">
                            <path d="m3 16 4 4 4-4" />
                            <path d="M7 20V4" />
                            <path d="m21 8-4-4-4 4" />
                            <path d="M17 4v16" />
                        </svg>
                        <span> Cardano Mainnet</span>
                    </div>
                </div>
            </nav>


        </div>
    </div>
</template>

<script setup>
import US from '@pairfy/common-f/public/us.svg';

const route = useRoute()

const auth = useAuthStore()

const isContrast = computed(() => ['country-p-id', 'country-s'].includes(route.name))

</script>

<style lang="css" scoped>
.HeaderTop {
    font-size: var(--text-size-0);
    background: var(--background-b);
    justify-content: center;
    box-sizing: border-box;
    color: var(--text-a);
    position: fixed;
    z-index: 12000;
    height: 2rem;
    width: 100%;
    top: 0;
}

.HeaderTop-content {
    justify-content: space-between;
    max-width: var(--body-a);
    box-sizing: border-box;
    width: inherit;
}

.HeaderTop-price,
.HeaderTop-network {
    margin-left: 2rem;
}

.HeaderTop-network svg {
    margin-right: 0.5rem;
}

.HeaderTop-location{
    cursor: pointer;
}

.HeaderTop-location img {
    height: 0.75rem;
}

.HeaderTop-location span:nth-child(2) {
    background: var(--border-b);
    height: 0.75rem;
    margin: 0 1rem;
    width: 1px;
}

@media (max-width: 480px) {
    .HeaderTop {
        border-bottom: 1px solid var(--border-a);
        height: 2.5rem;
    }

    .HeaderTop-price {
        display: none;
    }

    .HeaderTop-content {
        padding: 0 0.5rem;
        max-width: 100%;
    }
}


@media (min-width: 481px) and (max-width: 767px) {}


@media (min-width: 768px) and (max-width: 1024px) {}


@media (min-width: 1025px) and (max-width: 1440px) {}


@media (min-width: 1441px) {}
</style>