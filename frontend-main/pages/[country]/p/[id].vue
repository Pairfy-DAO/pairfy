<template>
  <div class="product-page">
    <ToastComp ref="toastRef" />

    <DialogComp v-model="product.cardanoDialog" @update:modelValue="product.cardanoDialog = $event">
      <CardanoForm />
    </DialogComp>

    <div class="container" v-if="productData">
      <div class="left-column">
        <ProductMedia />
        <DividerComp />
        <ProductBullet />
        <DividerComp />
        <ProductDescription />
        <DividerComp invisible />
      </div>

      <div class="center-column">
        <div class="trigger" ref="rightPanelTrigger" />
      </div>

      <div class="right-column">

        <div class="fixed-box" :class="{ fixed: isRightPanelFixed }">
          <div class="right-scroll" :class="{ fixed: isRightPanelFixed }" ref="rightScrollRef">

            <div class="product-brand">
              {{ productData.brand }}
            </div>

            <div class="product-name">
              {{ productData.name }}
            </div>

            <div class="product-sku">
              <span>SKU {{ productData.sku }}</span>
            </div>

            <div class="product-rating">
              <RatingComp :rating="4" />
              <span>4.3</span>
              <span>(384 reviews)</span>
            </div>

            <div class="product-price">
              <span>{{ formatUSD(productData.discount ? productData.discount_value : productData.price) }}</span>
              <span>USD</span>
            </div>

            <div class="subtitle">
              Model. <span>Check variations.</span>
            </div>

            <ProductModel v-for="n in 1" :key="n" :id="productData.id" :model="productData.model"
              :condition="productData.condition_" :color="productData.color" :price="productData.price"
              :discount="productData.discount" :discount_percent="productData.discount_percent"
              :discount_value="productData.discount_value" />

            <div class="subtitle">
              Finish. <span>Choose your network.</span>
            </div>

            <BuyButton @click="product.showCardanoDialog(true)">
              <template #icon>
                <img class="icon" src="@/assets/icon/cardano.svg" alt="">
              </template>
              Cardano Network
            </BuyButton>

            <BuyButton style="margin-top: 1rem;">
              <template #icon>
                <img class="icon" src="@/assets/icon/midnight.svg" alt="">
              </template>
              Midnight Network
            </BuyButton>

            <div class="busy-box" />

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gql } from 'graphql-tag'
import { useIntersectionObserver } from '@vueuse/core'

const route = useRoute();

const product = useProductStore()

const productData = computed(() => product.product)

const toastRef = ref(null);

const isRightPanelFixed = ref(false)
const rightPanelTrigger = ref(null)

let observer;

const rightScrollRef = ref(null)

const syncScroll = () => {
  if (rightScrollRef.value) {
    rightScrollRef.value.scrollTop = window.scrollY
  }
}

useLenis()
useLenisMultiple([rightScrollRef])

/////////////////////////////////

const GET_PRODUCT_QUERY = gql`
  query GetProduct($getProductVariable: GetProductInput!) {
    getProduct(getProductInput: $getProductVariable) {
      product {
        id
        group_id
        media_group_id
        media_position
        status
        moderated
        thumbnail_url
        name
        price
        sku
        model
        brand
        description
        category
        bullet_list
        color
        condition_
        country
        origin
        city
        postal
        discount
        discount_value
        discount_percent
        created_at
      }

      media {
        id
        media_group_id
        product_id
        mime_type
        position
        alt_text
        resolutions {
          large
        }
        created_at
        updated_at
      }
    }
  }
`;

const { $apollo } = useNuxtApp()

const productId = ref(null);

const getProductError = ref(null)

let pollIntervalId = null

watch(
  () => route.params.id,
  (id) => {
    productId.value = id
    fetchProduct()
  },
  { immediate: true }
)

onMounted(() => {
  watchToast()
  observeTrigger()
  addScrollListener()
  showGetProductError()
  fetchProductPolling()
})

onBeforeUnmount(() => {
  deleteObserver()
  removeScrollListener()
  clearIntervals()
})

async function fetchProduct() {
  try {
    const { data } = await $apollo.query({
      query: GET_PRODUCT_QUERY,
      variables: {
        getProductVariable: {
          id: productId.value
        }
      },
      fetchPolicy: 'no-cache'
    })

    product.setProductData(data.getProduct)
  } catch (err) {
    getProductError.value = err
  }
}


function watchToast() {
  watch(() => product.toastMessage, ({ message, type, duration }) => toastRef.value?.showToast(message, type, duration));
}

function observeTrigger() {
  const { stop } = useIntersectionObserver(
    rightPanelTrigger,
    ([entry]) => {
      isRightPanelFixed.value = !entry.isIntersecting
    },
    {
      threshold: 0.1
    })

  observer = stop
}

function deleteObserver() {
  if (observer) {
    observer()
    observer = null
  }
}

function fetchProductPolling() {
  pollIntervalId = setInterval(fetchProduct, 30_000)
}

function clearIntervals() {
  clearInterval(pollIntervalId)
}

function addScrollListener() {
  window.addEventListener('scroll', syncScroll)
}

function removeScrollListener() {
  window.removeEventListener('scroll', syncScroll)
}

function showGetProductError() {
  if (getProductError.value) product.showToast(getProductError.value, 'error', 10_000)
}
</script>

<style scoped>
.product-page {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.container {
  display: grid;
  width: inherit;
  margin-top: 3rem;
  box-sizing: border-box;
  max-width: var(--body-a);
  grid-template-columns: 4fr 2rem 1fr;
}

.left-column {
  width: inherit;
  box-sizing: border-box;
  border-radius: var(--radius-b);
  background: var(--background-a);
}

.center-column {
  width: inherit;
}

.right-column {
  width: 24rem;
  box-sizing: border-box;
  border-radius: var(--radius-b);
  background: var(--background-a);
  border: 1px solid var(--border-a);
}

.trigger {
  height: 1px;
  width: 100%;
}

.fixed-box {
  height: 100vh;
  width: inherit;
  z-index: 10000;
  overflow: hidden;
  position: sticky;
  box-sizing: border-box;
  transform: translateY(0rem);
  transition: transform 0.6s ease-in-out;
}

.fixed-box.fixed {
  top: 0rem;
  position: fixed;
  transform: translateY(2rem);
  transition: transform 0.3s ease-in-out;
}

.right-scroll {
  height: 100%;
  padding: 1.5rem;
  padding-top: 2rem;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  transition: var(--transition-a);
}

.right-scroll.fixed {
 
}

.right-scroll::-webkit-scrollbar {
  display: none;
  /* Safari y Chrome */
}

.product-section {
  margin-bottom: 40px;
}

.test-image {
  width: 100%;
}

.icon {
  width: 2rem;
  height: 2rem;
  object-fit: contain;
}

.busy-box {
  height: 150px;
}

.subtitle {
  font-size: var(--text-size-3);
  margin-bottom: 2rem;
  margin-top: 2rem;
  font-weight: 600;
}

.subtitle span {
  color: var(--text-a);
}

.product-brand {
  font-size: var(--text-size-2);
  color: var(--text-a);
  font-weight: 700;
}

.product-name {
  font-size: var(--text-size-5);
  line-height: 2.25rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

.product-price {
  font-size: var(--text-size-6);
  font-weight: 700;
  margin-top: 2rem;
}

.product-price span:nth-child(2) {
  margin-left: 0.5rem;
}

.product-rating {
  display: flex;
  margin-top: 1rem;
  align-items: center;
  color: var(--blue-b);
  font-size: var(--text-size-1);
}

.product-rating span:nth-child(2) {
  margin-left: 0.25rem;
  font-weight: 700;
}

.product-rating span:nth-child(3) {
  font-size: var(--text-size-0);
  margin-left: 0.25rem;
}

.product-sku {
  color: var(--text-b);
  align-items: center;
  margin-top: 1rem;
  display: flex;
}

.product-sku div {
  width: 1px;
  height: 10px;
  margin: auto 0.5rem;
  background: var(--text-b);
}
</style>
