<template>
    <div class="OrderPage">

        <ToastComp ref="toastRef" />

        <div class="OrderPage-body">

            <OrderNav v-model="currentNav" />

            <div class="OrderPage-grid" v-if="orderData">
                <OrderSummary v-if="currentNav === 0" />
                <OrderProduct v-if="currentNav === 1" />
                <OrderTxs v-if="currentNav === 2" />
                <OrderPanel />
            </div>

        </div>
    </div>
</template>

<script setup>
import { gql } from 'graphql-tag'

const route = useRoute();

const orderStore = useOrderStore()
const orderData = computed(() => orderStore.order)

const { $gatewayClient } = useNuxtApp()

const toastRef = ref(null);
const currentNav = ref(0);

let subscription1;

const fetchOrder = async () => {

    const GET_ORDER_QUERY = gql`
query ($getOrderVariable: GetOrderInput!) {
    getOrder(getOrderInput: $getOrderVariable) {
       order {
            id
            type
            status
            finished
            completed
            country
            buyer_pubkeyhash
            buyer_address
            buyer_wallet
            buyer_username
            seller_id
            seller_pubkeyhash
            seller_address
            seller_wallet
            seller_username
            rsa_version
            product_id
            product_snapshot
            contract_address
            contract_params
            contract_state
            contract_price
            contract_quote
            contract_fee
            contract_units
            asset_name
            asset_price
            watch_until
            pending_until
            shipping_until
            expire_until
            pending_tx
            pending_block
            pending_metadata
            returned_tx
            returned_block
            returned_metadata
            locking_tx
            locking_block
            locking_metadata
            canceled_tx
            canceled_block
            canceled_metadata
            shipping_tx
            shipping_block
            shipping_metadata
            appealed_tx
            appealed_block
            appealed_metadata
            received_tx
            received_block
            received_metadata
            collected_tx
            collected_block
            collected_metadata
            scanned_at
            created_at
            updated_at
            schema_v
       }

       product
       address
       shipping
       session
       encrypted_private_key
    }
}

`;

    const observable = $gatewayClient.watchQuery({
        query: GET_ORDER_QUERY,
        variables: {
            getOrderVariable: {
                id: route.params.id
            }
        },
        fetchPolicy: 'no-cache',
        pollInterval: 30_000,
    })

    subscription1 = observable.subscribe({
        next({ data }) {
            orderStore.setOrder(data.getOrder)
            orderStore.pendingTx = route.query?.tx || data.getOrder.order.pending_tx
        },
        error(err) {
            console.log(err)
            orderStore.showToast(err, 'error', 10_000)
        }
    })
}

function removeSubscriptions() {
    subscription1?.unsubscribe()
}

function watchToast() {
    watch(() => orderStore.toastMessage, ({ message, type, duration }) => toastRef.value?.showToast(message, type, duration));
}

onMounted(() => {
    watchToast()
    fetchOrder()
});

onBeforeUnmount(() => {
    removeSubscriptions()
})
</script>

<style lang="css" scoped>
.OrderPage {
    border: 1px solid var(--border-a);
    background: var(--background-a);
    border-radius: var(--radius-c);
    justify-content: center;
    margin: 0.5rem;
    display: flex;
}

.OrderPage-body {

    box-sizing: border-box;
    min-height: 100vh;
    padding: 2rem;
    width: 100%;
}

.OrderPage-grid {
    grid-template-columns: 1fr 600px;
    margin-top: 1rem;
    display: grid;
}
</style>