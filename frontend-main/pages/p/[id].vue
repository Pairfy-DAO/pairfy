<template>
  <div class="product-page">
    <ToastComp ref="toastRef" />

    <DialogComp ref="dialogRef">
      <p>Contenido del diálogo</p>
    </DialogComp>


    <div class="container" v-if="product">
      <div class="left-column">
        <ProductMedia />
        <DividerComp />
        <ProductBullet />
        <DividerComp />
        <ProductDescription />
      </div>


      <div class="right-column">
        <div class="fixed-box">
          <div class="right-scroll" ref="rightScrollRef">

            <div class="product-brand">
              {{ product.brand }}
            </div>

            <div class="product-name">
              {{ product.name }}
            </div>

            <div class="product-sku">
              <span>SKU {{ product.sku }}</span>
            </div>

            <div class="product-rating">
              <span>4.3</span>
              <RatingComp :rating="4" />
              <span>(384)</span>
            </div>

            <div class="subtitle">
              Model. <span>Check variations.</span>
            </div>

            <ProductModel v-for="n in 1" :key="n" :id="product.id" :model="product.model"
              :condition="product.condition_" :color="product.color" :price="product.price" :discount="product.discount"
              :discount_percent="product.discount_percent" :discount_value="product.discount_value" />

            <div class="subtitle">
              Finish. <span>Choose your network.</span>
            </div>

            <BuyButton @click="openChildDialog">
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
import Lenis from 'lenis'
import { gql } from 'graphql-tag'

const route = useRoute();

const productStore = useProductStore()
const product = computed(() => productStore.product)
const media = computed(() => productStore.media)

const toastRef = ref(null);

const dialogRef = ref(null);

let lenis = null

let frameId;

const rightScrollRef = ref(null)

const syncScroll = () => {
  if (rightScrollRef.value) {
    rightScrollRef.value.scrollTop = window.scrollY
  }
}

useLenisMultiple([rightScrollRef])

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

const loading = ref(true)

const getProductError = ref(null)

let pollIntervalId = null

async function fetchProduct() {
  try {
    const { data } = await $apollo.query({
      query: GET_PRODUCT_QUERY,
      variables: {
        getProductVariable: {
          id: route.params.id
        }
      },
      fetchPolicy: 'no-cache'
    })

    productStore.setProductData(data.getProduct)
  } catch (err) {
    getProductError.value = err
    showGetProductError()
  } finally {
    loading.value = false
  }
}

function fetchProductPolling() {
  pollIntervalId = setInterval(fetchProduct, 30_000)
}

function clearIntervals() {
  clearInterval(pollIntervalId)
}

function addLenis() {
  lenis = new Lenis({
    smooth: true,
  })

  const raf = (time) => {
    lenis?.raf(time)
    frameId = requestAnimationFrame(raf)
  }

  frameId = requestAnimationFrame(raf)
}

function removeLenis() {
  if (frameId) cancelAnimationFrame(frameId)
  lenis?.destroy()
}

function displayMessage(message, type, duration) {
  toastRef.value?.showToast(message, type, duration)
}
function openChildDialog() {
  dialogRef.value?.open();
}

function addScrollListener() {
  window.addEventListener('scroll', syncScroll)
}

function removeScrollListener() {
  window.removeEventListener('scroll', syncScroll)
}

function showGetProductError() {
  if (getProductError.value) displayMessage(getProductError.value, 'error')
}


onMounted(() => {
  fetchProduct()
  addLenis()
  addScrollListener()
  showGetProductError()
  fetchProductPolling()
})

onBeforeUnmount(() => {
  removeLenis()
  removeScrollListener()
  clearIntervals()
})
</script>

<style scoped>
.product-page {
  width: 100%;
  display: flex;
  padding-top: 10rem;
  justify-content: center;
}

.container {
  display: grid;
  width: inherit;
  box-sizing: border-box;
  max-width: var(--body-a);
  grid-template-columns: 1fr 350px;
}

.left-column {
  width: inherit;
  box-sizing: border-box;
}

.right-column {
  width: 350px;
  box-sizing: border-box;
}


.fixed-box {
  top: 10rem;
  right: 6rem;
  height: 100vh;
  width: inherit;
  z-index: 11000;
  position: fixed;
  overflow: hidden;
  box-sizing: border-box;
}

.right-scroll {
  height: 100%;
  overflow-y: auto;
}

.right-scroll {
  overflow-y: auto;
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE 10+ */
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
  height: 200px;
}

.subtitle {
  font-size: var(--text-size-4);
  margin-bottom: 2rem;
  margin-top: 2rem;
  font-weight: 600;
}

.subtitle span {
  color: var(--text-a);
}

.product-name {
  font-size: var(--text-size-4);
  margin-top: 0.5rem;
  line-height: 2rem;
  font-weight: 400;
}

.product-rating {
  display: flex;
  margin-top: 1rem;
  align-items: center;
  font-size: var(--text-size-1);
}

.product-rating span {
  font-weight: 400;
}

.product-rating span:nth-child(1) {
  margin-right: 0.5rem;
  font-weight: 600;
}

.product-rating span:nth-child(3) {
  margin-left: 0.5rem;
}

.product-sku {
  color: var(--text-b);
  align-items: center;
  margin-top: 1rem;
  display: flex;
}

.product-brand {
  font-size: var(--text-size-2);
  font-weight: 700;
}

.product-sku div {
  width: 1px;
  height: 10px;
  margin: auto 0.5rem;
  background: var(--text-b);
}
</style>
