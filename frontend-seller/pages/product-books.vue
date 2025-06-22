<template>
    <div class="card">
        <ToastComp ref="toastRef" />

        <DialogComp ref="editDialogRef" v-model="editDialog" title="Edit book">
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-cog-icon lucide-folder-cog"><path d="M10.3 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.98a2 2 0 0 1 1.69.9l.66 1.2A2 2 0 0 0 12 6h8a2 2 0 0 1 2 2v3.3"/><path d="m14.305 19.53.923-.382"/><path d="m15.228 16.852-.923-.383"/><path d="m16.852 15.228-.383-.923"/><path d="m16.852 20.772-.383.924"/><path d="m19.148 15.228.383-.923"/><path d="m19.53 21.696-.382-.924"/><path d="m20.772 16.852.924-.383"/><path d="m20.772 19.148.924.383"/><circle cx="18" cy="18" r="3"/></svg>
            </template>
            <template #content>
            
            </template>
        </DialogComp>

        <FolderComp :tabs="['Books', 'Statistics']" v-model="tabIndex">

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
                <!----------------CONTENT START---------------->
                <div v-if="!books.length"></div>

                <TableComp v-if="books.length" :columns="columns" :items="books" :limit="limit"
                    :hasNextPage="hasNextPage" :hasPrevPage="hasPrevPage" :range="range" :page="page" :count="bookCount"
                    :images="true" @onPrev="handleOnPrev" @onNext="handleOnNext" :columnWidths="{
                        image: '6rem',
                        id: '8rem',
                        product_sku: '8rem',
                        product_name: '16rem',
                        sold: '4rem',
                        blocked_stock: '4rem',
                        ready_stock: '4rem',
                        keeping_stock: '4rem',
                        buy_limit: '4rem',
                        paused: '4rem',
                        created_at: '4rem',
                        action: '4rem'
                    }">

                    <template #image="{ item }">
                        <ImageComp :src="getImageSrc(item)" :image-style="{ width: '4rem' }" />
                    </template>

                    <template #col-id="{ value }">
                        {{ value }}
                    </template>

                    <template #col-product_sku="{ value }">
                        {{ value }}
                    </template>

                    <template #col-buy_limit="{ value, item }">
                        {{ !!value }}
                    </template>

                    <template #col-paused="{ value, item }">
                        {{ value }}
                    </template>

                    <template #col-created_at="{ value }">
                        {{ formatDateYYMMDD(value) }}
                    </template>

                    <template #action="{ item }">

                        <div class="flex center">
                            <DottedMenu :options="dottedMenuOptions" :value="item" @onSelected="handleDottedMenu" />
                        </div>

                    </template>
                </TableComp>
                <!----------------CONTENT END---------------->
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

const books = ref([])
const nextCursor = ref(null)
const loading = ref(false)
const page = ref(1)
const limit = ref(16)
const bookCount = ref(0)
const hasNextPage = ref(false)
const hasPrevPage = ref(false)

const editDialogRef = ref(null)
const editDialog = ref(false)

const dottedMenuOptions = ref([
    { label: "Edit this book", value: "edit" }
])

const columns = ref([
    { label: "ID", field: "id" },
    { label: "Sku", field: "product_sku" },
    { label: "Name", field: "product_name" },
    { label: "Sold", field: "sold" },
    { label: "Blocked", field: "blocked_stock" },
    { label: "Ready", field: "ready_stock" },
    { label: "Keeping", field: "keeping_stock" },
    { label: "BuyLimit", field: "buy_limit" },
    { label: "Paused", field: "paused" },
    { label: "Date", field: "created_at" }
])

const range = computed(() => {
    const start = (page.value - 1) * limit.value + 1
    const end = start + books.value.length - 1
    return `${start} - ${end} of ${bookCount.value}`
})

const { $gatewayClient } = useNuxtApp()

const getBooksError = ref(null)

const GET_BOOKS_QUERY = gql`
  query GetBooks($getBooksVariable: GetBooksInput!) {
    getBooks(getBooksInput: $getBooksVariable) {
      books {
        id
        keeping_stock
        ready_stock
        blocked_stock
        buy_limit
        paused
        sold
        created_at
        product_name
        product_sku
        thumbnail_url
      }
      nextCursor
      hasPrevMore
      hasNextMore
      totalCount
    }
  }
`

const fetchBooks = async (getBooksVariable) => {
    if (import.meta.server) return;

    try {
        const { data } = await $gatewayClient.query({
            query: GET_BOOKS_QUERY,
            variables: {
                getBooksVariable
            },
            fetchPolicy: 'no-cache'
        })

        const bookList = data.getBooks;

        books.value = bookList.books
        nextCursor.value = bookList.nextCursor
        bookCount.value = bookList.totalCount
        hasPrevPage.value = bookList.hasPrevMore
        hasNextPage.value = bookList.hasNextMore

    } catch (err) {
        console.log(err)
        getBooksError.value = err
    }
}

fetchBooks({})

onMounted(() => {
    if (getBooksError.value) {
        console.error('Error fetching the books:', getBooksError.value)
        displayMessage('The books could not be loaded. Please try again later.' + getBooksError.value, 'error', 10_000)
    }
})

const handleOnNext = async (item) => {
    if (!hasNextPage.value) return
    const cursor = `${item.created_at}_${item.id}`
    await fetchBooks({ cursor })
    page.value += 1
}

const handleOnPrev = async (item) => {
    if (!hasPrevPage.value) return
    const reverseCursor = `${item.created_at}_${item.id}`
    await fetchBooks({ reverseCursor })
    if (page.value > 1) page.value -= 1
}

function handleDottedMenu(event, value) {
    if (event === 'edit') {
        editDialogRef.value?.open?.()
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
    padding: 0.1rem;
    padding-top: 1rem;
}
</style>