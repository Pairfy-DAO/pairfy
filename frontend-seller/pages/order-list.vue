<template>
    <div class="card">
        <ToastComp ref="toastRef" />

        <!--CONTENT-->

        <FolderComp :tabs="['Orders']" v-model="tabIndex">

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

                <!----------------TABLET START---------------->

                <div v-if="!orders.length"></div>

                <TableComp v-if="orders.length" :columns="columns" :items="orders" :limit="limit"
                    :hasNextPage="hasNextPage" :hasPrevPage="hasPrevPage" :range="range" :page="page" :count="bookCount"
                    actions @onPrev="handleOnPrev" @onNext="handleOnNext" :columnWidths="{
                        id: '8rem',
                        type: '2rem',
                        status: '2rem',
                        seller_wallet: '2rem',
                        seller_address: '8rem',
                        seller_rsa_version: '2rem',
                        contract_price: '4rem',
                        contract_units: '2rem',
                        asset_name: '2rem',
                        created_at: '4rem',
                        actions: '2rem',
                    }">

                    <template #col-id="{ value }">
                        {{ truncateText(value, 30) }}
                    </template>

                    <template #col-seller_address="{ value }">
                        {{ truncateText(value, 30) }}
                    </template>

                    <template #col-contract_price="{ value, item }">
                        {{ formatAssetQuantity(item.asset_name, value) }}
                    </template>

                    <template #col-created_at="{ value }">
                        {{ formatCompleteDate(value) }}
                    </template>

                    <template #actions="{ item }">

                        <div class="flex center">
                            <DottedMenu :options="dottedMenuOptions" :value="item" @onSelected="handleDottedMenu" />
                        </div>

                    </template>

                </TableComp>
                <!----------------TABLET END---------------->
            </template>

        </FolderComp>

        <!--CONTENT END-->
    </div>
</template>

<script setup>
import { formatCompleteDate } from "@/utils/utils"
import { gql } from 'graphql-tag'

const { $gatewayClient } = useNuxtApp()

const router = useRouter()

const tabIndex = ref(0)

const toastRef = ref(null);

const columns = ref([
    { label: "Id", field: "id" },
    { label: "Type", field: "type" },
    { label: "Status", field: "status" },
    { label: "Wallet", field: "seller_wallet" },
    { label: "Address", field: "seller_address" },
    { label: "Rsa", field: "seller_rsa_version" },
    { label: "Price", field: "contract_price" },
    { label: "Units", field: "contract_units" },
    { label: "Asset", field: "asset_name" },
    { label: "Date", field: "created_at" }
])

const dottedMenuOptions = ref([
    { label: "Open", value: "open" }
])

const handleDottedMenu = (event, value) => {
    if (event === 'open') {
        router.push({
            name: 'order-id',
            params: {
                id: value.id
            }
        })
    }
}

const orders = ref([])
const nextCursor = ref(null)
const page = ref(1)
const limit = ref(16)
const bookCount = ref(0)
const hasNextPage = ref(false)
const hasPrevPage = ref(false)

const range = computed(() => {
    const start = (page.value - 1) * limit.value + 1
    const end = start + orders.value.length - 1
    return `${start} - ${end} of ${bookCount.value}`
})

const initialFetchError = ref(null)

let subscription1;

const fetchOrders = async (getOrdersVariable) => {
    if (!import.meta.client) return;

    const GET_ORDERS_QUERY = gql`
query GetOrders($getOrdersVariable: GetOrdersInput!) {
    getOrders(getOrdersInput: $getOrdersVariable) {
        orders {
            id
            type
            status
            finished
            completed
            created_at
            seller_address
            seller_wallet
            seller_rsa_version
            product_id
            product_snapshot
            contract_state
            contract_price
            contract_quote
            contract_fee
            contract_units
            asset_name
            asset_price
            created_at
        }
        nextCursor
        totalCount
        hasPrevMore
        hasNextMore
    }
}
    
`
    const observable = await $gatewayClient.watchQuery({
        query: GET_ORDERS_QUERY,
        variables: {
            getOrdersVariable
        },
        fetchPolicy: 'no-cache',
        pollInterval: 60_000
    })

    subscription1 = observable.subscribe({
        next({ data }) {
            const result = data.getOrders;

            orders.value = result.orders
            nextCursor.value = result.nextCursor
            bookCount.value = result.totalCount
            hasPrevPage.value = result.hasPrevMore
            hasNextPage.value = result.hasNextMore
        },
        error(err) {
            console.log(err)
            initialFetchError.value = err
            displayMessage(err, 'error', 10_000)
        }
    })

}

const handleOnNext = async (item) => {
    if (!hasNextPage.value) return
    const cursor = `${item.created_at}_${item.id}`
    await fetchOrders({ cursor })
    page.value += 1
}

const handleOnPrev = async (item) => {
    if (!hasPrevPage.value) return
    const reverseCursor = `${item.created_at}_${item.id}`
    await fetchOrders({ reverseCursor })
    if (page.value > 1) page.value -= 1
}

function displayMessage(message, type, duration) {
    toastRef.value?.showToast(message, type, duration)
}

onMounted(() => {
    fetchOrders({})

    if (initialFetchError.value) {
        console.error('Error fetching the orders:', initialFetchError.value)
        displayMessage('The orders could not be loaded. Please try again later.' + initialFetchError.value, 'error', 10_000)
    }
})

onBeforeUnmount(() => {
    subscription1?.unsubscribe()
})

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