<template>
    <div class="card">
        <ToastComp ref="toastRef" />

        <DialogComp ref="editDialogRef" v-model="editDialog" title="Edit book">
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-settings2-icon lucide-settings-2">
                    <path d="M14 17H5" />
                    <path d="M19 7h-9" />
                    <circle cx="17" cy="17" r="3" />
                    <circle cx="7" cy="7" r="3" />
                </svg>
            </template>
            <template #content>
                <div class="edit-form">
                    <InputSwitch v-model="stopPurchases" label="Stop purchases" />
                    <InputSwitch v-model="purchaseLimit" label="Purchase limit" />

                    <InputInteger v-model="purchaseLimitValue" label="Purchase limit value" :min="0" :max="999999"
                        placeholder="Ready" @valid="purchaseLimitValueValid = $event.valid" v-if="purchaseLimit" />

                    <InputInteger v-model="readyStock" label="Ready stock" :min="0" :max="999999" placeholder="Ready"
                        @valid="readyStockValid = $event.valid" />
                    <InputInteger v-model="keepingStock" label="Keeping stock" :min="0" :max="999999"
                        placeholder="Keeping" @valid="keepingStockValid = $event.valid" />


                    <div class="edit-form-bottom">
                        <ButtonSolid label="Cancel" size="mini" @click="editDialog = false" outlined />
                        <ButtonSolid label="Save" size="mini" @click="onEditBook" style="margin-left: 1rem;"
                            :loading="loading" />
                    </div>
                </div>
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
                    :hasNextPage="hasNextPage" :hasPrevPage="hasPrevPage" :range="range" :page="page" :count="bookCount" actions
                    images @onPrev="handleOnPrev" @onNext="handleOnNext" :columnWidths="{
                        image: '6rem',
                        id: '8rem',
                        product_sku: '8rem',
                        product_name: '16rem',
                        sold_count: '4rem',
                        blocked_stock: '4rem',
                        ready_stock: '4rem',
                        keeping_stock: '4rem',
                        purchase_limit_value: '4rem',
                        stop_purchases: '4rem',
                        created_at: '4rem',
                        actions: '4rem'
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

                    <template #actions="{ item }">

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

const tabIndex = ref(0)

const columns = ref([
    { label: "ID", field: "id" },
    { label: "Sku", field: "product_sku" },
    { label: "Name", field: "product_name" },
    { label: "Sold", field: "sold_count" },
    { label: "Blocked", field: "blocked_stock" },
    { label: "Ready", field: "ready_stock" },
    { label: "Keeping", field: "keeping_stock" },
    { label: "BuyLimit", field: "purchase_limit_value" },
    { label: "Paused", field: "stop_purchases" },
    { label: "Date", field: "created_at" }
])

const dottedMenuOptions = ref([
    { label: "Edit this book.", value: "edit" }
])

const toastRef = ref(null);

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

const range = computed(() => {
    const start = (page.value - 1) * limit.value + 1
    const end = start + books.value.length - 1
    return `${start} - ${end} of ${bookCount.value}`
})

const { $gatewayClient } = useNuxtApp()

const getBooksError = ref(null)

const fetchBooks = async (getBooksVariable) => {
    if (import.meta.server) return;

    const GET_BOOKS_QUERY = gql`
  query GetBooks($getBooksVariable: GetBooksInput!) {
    getBooks(getBooksInput: $getBooksVariable) {
      books {
        id
        keeping_stock
        ready_stock
        blocked_stock
        purchase_limit
        purchase_limit_value
        stop_purchases
        sold_count
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

const bookId = ref(null)

const stopPurchases = ref(false)

const purchaseLimit = ref(false)
const purchaseLimitValue = ref(null)

const readyStock = ref(null)
const readyStockValid = ref(false)

const keepingStock = ref(null)
const keepingStockValid = ref(false)

const handleDottedMenu = (event, value) => {
    if (event === 'edit') {
        bookId.value = value.id
        stopPurchases.value = value.stop_purchases
        purchaseLimit.value = value.purchase_limit
        purchaseLimitValue.value = value.purchase_limit_value
        readyStock.value = value.ready_stock
        keepingStock.value = value.keeping_stock
        editDialogRef.value?.open?.()
    }
}

const onEditBook = async () => {
    if (import.meta.server) return;

    const EDIT_BOOK_MUTATION = gql`
      mutation EditBook($editBookVariable: EditBookInput!) {
        editBook(editBookInput: $editBookVariable) {
          success
          message
        }
      }
`
    try {
        loading.value = true

        const { data } = await $gatewayClient.mutate({
            mutation: EDIT_BOOK_MUTATION,
            variables: {
                "editBookVariable": {
                    "id": bookId.value,
                    "stop_purchases": stopPurchases.value,
                    "purchase_limit": purchaseLimit.value,
                    "purchase_limit_value": purchaseLimitValue.value,
                    "ready_stock": readyStock.value,
                    "keeping_stock": keepingStock.value
                }
            },
        });
        editDialogRef.value?.close?.()
        displayMessage(data.editBook.message, 'success', 10_000)
    } catch (err) {
        console.error('EditBook:', err);
        displayMessage(err, 'error', 30_000)
    } finally {
        loading.value = false
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

.edit-form {
    gap: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
}

.edit-form-bottom {
    display: flex;
    justify-content: flex-end;
}
</style>