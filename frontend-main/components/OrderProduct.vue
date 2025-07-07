<template>
    <div class="product-summary">

        <div class="product-image">
            <img :src="getImageSrc(product.thumbnail_url)" :alt="product.name" />
        </div>


        <div class="product-details">
            <h2 class="product-title">{{ product.name }}</h2>
            <p class="product-meta">{{ product.brand }} • Modelo: {{ product.model }}</p>

            <ul class="product-bullets">
                <li v-for="(bullet, index) in product.bullet_list" :key="index">
                    {{ bullet }}
                </li>
            </ul>

            <div class="product-bottom">
                <div class="product-price">
                    <span class="price-discounted">${{ discountedPrice }}</span>
                    <span class="price-original" v-if="product.discount_value" >
                        ${{ product.price.toFixed(2) }}
                    </span>
                    <div class="discount-label" v-if="product.discount_percent">
                        {{ product.discount_percent }}% de descuento
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import placeholderImage from '@/assets/icon/image.svg'

const orderStore = useOrderStore()

const product = computed(() => orderStore.product)

const discountedPrice = computed(() => product.value.discount ? product.value.discount_value : product.value.price)

function getImageSrc(item) {
    return item ? useMediaUrl(item) : placeholderImage
}
</script>

<style scoped>
.product-summary {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    padding: 20px;
    max-width: 900px;
    gap: 20px;
}

@media (min-width: 768px) {
    .product-summary {
        flex-direction: row;
    }
}

.product-image img {
    width: 100%;
    max-width: 260px;
    border-radius: 10px;
    object-fit: cover;
}

.product-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.product-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 6px;
    color: #222;
}

.product-meta {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 12px;
}

.product-bullets {
    list-style: disc inside;
    margin: 0 0 16px;
    padding: 0;
    color: #444;
    font-size: 0.95rem;
}

.product-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
}

.product-price {
    display: flex;
    flex-direction: column;
}

.price-discounted {
    font-size: 1.4rem;
    font-weight: bold;
    color: #2e7d32;
}

.price-original {
    text-decoration: line-through;
    font-size: 0.9rem;
    color: #999;
    margin-top: 4px;
}

.discount-label {
    font-size: 0.8rem;
    color: #f44336;
    margin-top: 2px;
}
</style>