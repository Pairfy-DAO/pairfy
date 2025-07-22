<template>
    <div class="card">
        <ToastComp ref="toastRef" />

        <FolderComp :tabs="['Products', 'Statistics']" v-model="tabIndex">

            <template #icon-0>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-inbox-icon lucide-inbox">
                    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                    <path
                        d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                </svg>
            </template>

            <template #icon-1>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-chart-no-axes-column-icon lucide-chart-no-axes-column">
                    <line x1="18" x2="18" y1="20" y2="10" />
                    <line x1="12" x2="12" y1="20" y2="4" />
                    <line x1="6" x2="6" y1="20" y2="14" />
                </svg>
            </template>

            <template #content="{ index }">
                <!----------------CONTENT---------------->
                <div v-if="!products.length"></div>

                <TableComp v-if="products.length" :columns="columns" :items="products" :limit="limit"
                    :hasNextPage="hasNextPage" :hasPrevPage="hasPrevPage" :range="range" :page="page"
                    :count="productCount" images actions @onPrev="handleOnPrev" @onNext="handleOnNext" :columnWidths="{
                        image: '6rem',
                        id: '10rem',
                        sku: '8rem',
                        price: '6rem',
                        model: '8rem',
                        discount: '4rem',
                        category: '10rem',
                        created_at: '6rem',
                        moderated: '4rem',
                        actions: '4rem'
                    }">

                    <template #image="{ item }">
                        <ImageComp :src="getImageSrc(item)" :image-style="{ width: '4rem' }" />
                    </template>

                    <template #col-id="{ value }">
                        {{ value }}
                    </template>

                    <template #col-sku="{ value }">
                        {{ value }}
                    </template>

                    <template #col-price="{ value, item }">
                        <span>{{ `${item.discount ? item.discount_value : value}` }}</span>
                    </template>

                    <template #col-category="{ value }">
                        <span style="text-transform: lowercase;">{{ value }}</span>
                    </template>

                    <template #col-discount="{ value, item }">
                        <span>
                            {{ `${item.discount ? '-' + item.discount_percent + '%' : 'N/a'}` }}
                        </span>
                    </template>

                    <template #col-created_at="{ value }">
                        {{ formatDateYYMMDD(value) }}
                    </template>

                    <template #actions="{ item }">

                        <div class="flex center">
                            <DottedMenu :options="dottedMenuOptions" :value="item" @onSelected="handleDottedMenu" />
                        </div>

                    </template>
                </TableComp>
                <!----------------CONTENT---------------->
            </template>

        </FolderComp>
    </div>
</template>

<script setup>
import placeholderImage from '@/assets/placeholder/image.svg'
import { formatDateYYMMDD } from "@/utils/utils"
import { gql } from 'graphql-tag'

const router = useRouter()

const toastRef = ref(null);

const tabIndex = ref(0)

definePageMeta({
    key: () => `products-tab-${tabIndex.value}`
})

const products = ref([])
const nextCursor = ref(null)
const loading = ref(false)
const page = ref(1)
const limit = ref(16)
const productCount = ref(0)
const hasNextPage = ref(false)
const hasPrevPage = ref(false)

const dottedMenuOptions = ref([
    { label: "Edit this product.", value: "edit" },
    { label: "Open product page.", value: "open" },
    { label: "Delete this product.", value: "delete" }
])

const columns = ref([
    { label: "ID", field: "id" },
    { label: "Sku", field: "sku" },
    { label: "Name", field: "name" },
    { label: "Price", field: "price" },
    { label: "Model", field: "model" },
    { label: "Discount", field: "discount" },
    { label: "Category", field: "category" },
    { label: "Moderated", field: "moderated" },
    { label: "Date", field: "created_at" }
])

const range = computed(() => {
    const start = (page.value - 1) * limit.value + 1
    const end = start + products.value.length - 1
    return `${start} - ${end} of ${productCount.value}`
})

const { $productClient } = useNuxtApp()
const getProductsError = ref(null)

const GET_PRODUCTS_QUERY = gql`
  query GetProducts($getProductsVariable: GetProductsInput!) {
    getProducts(getProductsInput: $getProductsVariable) {
      products {
        id
        status
        moderated
        thumbnail_url
        country
        name
        price
        sku
        model
        brand
        category
        condition_
        discount
        discount_value
        discount_percent
        created_at
      }
      nextCursor
      hasPrevMore
      hasNextMore
      totalCount
    }
  }
`

async function fetchProducts(getProductsVariable) {
    if (import.meta.server) return;

    try {
        const { data } = await $productClient.query({
            query: GET_PRODUCTS_QUERY,
            variables: {
                getProductsVariable
            },
            fetchPolicy: 'no-cache'
        })

        const productList = data.getProducts;

        products.value = productList.products
        nextCursor.value = productList.nextCursor
        productCount.value = productList.totalCount
        hasPrevPage.value = productList.hasPrevMore
        hasNextPage.value = productList.hasNextMore

    } catch (err) {
        console.log(err)
        getProductsError.value = err
    }
}

fetchProducts({})

onMounted(() => {
    if (getProductsError.value) {
        console.error('Error fetching the products:', getProductsError.value)
        displayMessage('The products could not be loaded. Please try again later.' + getProductsError.value, 'error', 10_000)
    }
})

const handleOnNext = async (item) => {
    if (!hasNextPage.value) return
    const cursor = `${item.created_at}_${item.id}`
    await fetchProducts({ cursor })
    page.value += 1
}

const handleOnPrev = async (item) => {
    if (!hasPrevPage.value) return
    const reverseCursor = `${item.created_at}_${item.id}`
    await fetchProducts({ reverseCursor })
    if (page.value > 1) page.value -= 1
}

const handleDottedMenu = async (event, value) => {
    if (event === 'delete') {
        await onDeleteProduct(value.id)
        return;
    }

    if (event === 'edit') {
        router.push({ name: 'edit-product', query: { id: value.id } })
    }

    if (event === 'open') {
        const pairfyBase = useRuntimeConfig().public.pairfyBase
        
        console.log(puseRuntimeConfig().public)
        
        window.open(`https://${pairfyBase}/${value.country.toLowerCase()}/p/${value.id}`, '_blank')
    }

}
const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($deleteProductVariable: DeleteProductInput!) {
    deleteProduct(deleteProductInput: $deleteProductVariable) {
      success
      message
    }
  }
`

async function onDeleteProduct(productId) {
    if (import.meta.server) return;

    try {
        const { data } = await $productClient.mutate({
            mutation: DELETE_PRODUCT_MUTATION,
            variables: {
                deleteProductVariable: {
                    id: productId
                }
            }
        })

        const response = data.deleteProduct
        displayMessage(response.message, 'success', 10_000)
    } catch (err) {
        console.error('onDeleteProductError: ', err)
        displayMessage(err.message, 'error', 10_000)
    }
}

function displayMessage(message, type, duration) {
    toastRef.value?.showToast(message, type, duration)
}

function getImageSrc(item) {
    return item.thumbnail_url ? useMediaUrl(item.thumbnail_url) : placeholderImage
}


</script>



<style lang="css" scoped>
.card {
    background-image: var(--gradient-a);
    border: 1px solid var(--border-a);
    border-radius: var(--radius-c);
    margin: 0.5rem;
    padding: 0.5rem;
}
</style>