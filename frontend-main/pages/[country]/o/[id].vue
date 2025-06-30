<template>
    <div class="OrderPage flex">

        <ToastComp ref="toastRef" />

        <!--DIALOG NOTES-->

        <div class="OrderPage-body">

            <OrderNav v-model="currentNav" />

            <div class="OrderPage-grid" v-if="orderData">

                <OrderSummary v-if="currentNav === 0" />




                <!--               
                <ProductComp v-if="currentNav === 1" />

                <TransactionsComp v-if="currentNav === 2" />
 -->

                <div class="panel">
                    <!--
                    <template v-if="getCurrentSeller || getCurrentUser">
                        <ChatComp v-if="orderData" />
                    </template>

<AddressComp v-if="orderData" />
-->
                </div>
            </div>


        </div>
    </div>
</template>

<script setup>
import { gql } from 'graphql-tag'

const route = useRoute();

const order = useOrderStore()

const orderData = computed(()=> order.order)

const { $gatewayClient } = useNuxtApp()

const toastRef = ref(null);

const currentNav = ref(0);

let subscription1;

onMounted(() => {
    watchToast()
    fetchBook()
});

onBeforeUnmount(() => {
    removeSubscriptions()
})

async function fetchBook() {

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
            contract_address
            contract_params
            contract_state
            contract_price
            contract_fee
            contract_units
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
            order.setOrder(data.getOrder)
        },
        error(err) {
            order.showToast(err, 'error', 10_000)
        }
    })
}

function removeSubscriptions() {
    subscription1?.unsubscribe()
}

function watchToast() {
    watch(() => order.toastMessage, ({ message, type, duration }) => toastRef.value?.showToast(message, type, duration));
}


/*
import gql from 'graphql-tag';
import UserPad from "@/views/order/UserPad.vue";
//import TransactionsComp from "@/views/order/TransactionsComp.vue";
//import ProductComp from "@/views/order/ProductComp.vue";
import FinishedICon from "@/views/order/FinishedIcon.vue";
//import ChatComp from "@/views/order/ChatComp.vue";
//import AddressComp from "@/views/order/AddressComp.vue";

import { Buffer } from 'buffer';

//const { copyToClipboard, convertDate, formatCurrency, convertLovelaceToUSD, convertLovelaceToADA, reduceByLength } = inject('utils');


const route = useRoute();
const router = useRouter();



const notesDialog = ref(false);

const displayNotesDialog = (e) => {
    notesDialog.value = e
}

const orderTitle = computed(
    () => {
        let scheme = {
            buyer: "Preparing your package, Time Remaining ",
            seller: "Prepare the product, Time Remaining ",
            finished: "Order Finished",
            completed: "Order Completed"
        };


        if (statusLog.value === 'pending') {
            scheme.seller = "Please Verify, Time Remaining "
        }

        if (statusLog.value === 'locking') {
            scheme.seller = "Prepare the package, Time Remaining "
        }

        if (statusLog.value === 'shipping') {
            scheme.seller = "Waiting for Delivery, Time Remaining "
            scheme.buyer = "The Package is Arriving, Time Remaining "
        }

        return scheme
    }

)

const timeline = ref([
    {
        number: 1,
        title: "Created",
        subtitle: {
            buyer: "The seller has been notified to prepare your package.",
            seller: `Please verify the payment and click the "Accept" button.`
        },
        completed: true,
        type: "box",
        template: "created",
        line: true
    },
    {
        number: 2,
        title: "Shipping",
        subtitle: {
            buyer: "Use the tracking number to check your shipment.",
            seller: `Dispatch the package and press the "Dispatched" button.`
        },
        completed: false,
        type: "box",
        template: "shipping",
        line: true
    },
    {
        number: 3,
        title: "Finished",
        subtitle: {
            buyer: "Please confirm that the exact product was delivered.",
            seller: "Accept the order and dispatch the product."
        },
        completed: false,
        type: "button",
        template: "received",
        line: false
    }
])

const queryVariablesRef = ref({
    "getOrderVariable": {
        "id": null
    },
})

const queryEnabled = ref(false)

const { result: getOrderResult, onError: onGetOrderError } = useQuery(gql`
query ($getOrderVariable: GetOrderInput!) {
    getOrder(getOrderInput: $getOrderVariable) {
        order {
            id
            finished
            scanned_at
            status_log
            buyer_username
            ada_price
            contract_address
            contract_state
            contract_price
            contract_fee
            contract_units
            product_id
            product_name
            product_price
            product_sku
            product_model
            product_brand
            product_features
            product_bullet_list
            product_discount
            product_discount_value
            product_media_url
            product_image_path
            product_video_path
            product_image_set
            product_video_set
            watch_until
            pending_until
            shipping_until
            pending_tx
            pending_block
            returned_tx
            returned_block
            locking_tx
            locking_block
            canceled_tx
            canceled_block
            shipping_tx
            shipping_block
            appealed_tx
            appealed_block
            received_tx
            received_block
            collected_tx
            collected_block
            seller_username
            seller_verified
            seller_trade_terms
            seller_avatar_base
            seller_avatar_path
        }
        
        shipping
        address
        session
    }
}
`,
    () => (queryVariablesRef.value),
    () => ({
        enabled: queryEnabled.value,
        clientId: 'gateway',
        pollInterval: 10_000
    })
);


const updateQueryVariables = (id) => {
    queryVariablesRef.value = {
        getOrderVariable: {
            id
        }
    }
}

const pendingTx = ref(null);

const unwatchRoute = watch(
    () => route,
    ({ params, query }) => {
        if (params.id) {
            queryEnabled.value = true;
            updateQueryVariables(params.id)
        }

        if (query.tx) {
            pendingTx.value = query.tx;
        }
    },
    { immediate: true }
);

const orderData = ref(null);

const statusLog = ref("created");

const orderPayment = ref(null);

const createdStep = computed(() => {
    if (orderData.value?.pending_block) {
        return true
    }

    return false
});


const shippingStep = computed(() => {
    if (orderData.value?.shipping_block) {
        return true
    }

    return false
});


const contractFiat = ref(0);

const contractPrice = ref(0);

const shippingData = ref(null);

const deliveryDate = ref('None');

const isFinished = ref(false);

const shippingStatus = computed(() => {
    const state = orderData.value?.contract_state;

    if (state === 0) {
        return "pending"
    }

    if (state === 1) {
        return "preparing the package"
    }

    if (state === 2) {
        return "package shipped"
    }

    if (state === 3) {
        return "package received"
    }

    if (state === 4) {
        return "package received"
    }

    return "-"
});

const unwatchOrder = watch(getOrderResult, value => {
    if (value) {
        setOrderData(value.getOrder);

        const ORDER = value.getOrder.order;

        orderData.value = ORDER;

        const SHIPPING = value.getOrder.shipping;

        if (SHIPPING) {
            shippingData.value = JSON.parse(Buffer.from(SHIPPING, 'base64').toString("utf-8"))

            deliveryDate.value = convertDate(shippingData.value.date, 0);
        }

        isFinished.value = ORDER.finished;

        statusLog.value = ORDER.status_log;

        orderPayment.value = getPaymentStatus(ORDER.pending_block)

        contractPrice.value = convertLovelaceToADA(ORDER.contract_price);

        pendingTx.value = ORDER.pending_tx || pendingTx.value;

        contractFiat.value = convertLovelaceToUSD(ORDER.contract_price, ORDER.ada_price)

        globalTimestamp.value = getTimestamp(ORDER);


    }
}, { immediate: true })


////////////////////////////////////////////////////////////////

const globalTimestamp = ref(Date.now());

const globalTimeLeft = ref(globalTimestamp.value - Date.now());

const globalCountdown = computed(() => {
    if (globalTimeLeft.value <= 0) return "00:00";

    const totalSeconds = Math.floor(globalTimeLeft.value / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');

    return formatTime(`${minutes}:${seconds}`);
});

let globalInterval;

const updateGlobalCountdown = () => {
    globalTimeLeft.value = globalTimestamp.value - Date.now();
};

function formatTime(input) {
    let [minutes, seconds] = input.split(":").map(Number);

    const hours = Math.floor(minutes / 60);

    const days = Math.floor(hours / 24);

    const remainingHours = hours % 24;

    minutes = minutes % 60;

    minutes += Math.floor(seconds / 60);

    seconds = seconds % 60;

    minutes = Math.min(minutes, 99);

    return `${days}d : ${remainingHours}h : ${minutes}m : ${seconds}s`;
}

////////////////////////////////////////////////////////////////


//////////////////////////////////////////////

const getPaymentStatus = (pending_block) => {
    if (!pending_block) {
        return {
            label: "unconfirmed",
            template: "loading",
            color: "var(--red-a)"
        }
    }

    const now = Math.floor(Date.now() / 1000);
    const diff = now - pending_block;
    const minutes = Math.floor(diff / 60);

    if (minutes <= 15) {
        return {
            label: "confirming",
            template: "icon",
            icon: "pi pi-eye",
            color: "var(--orange-a)"
        }
    }


    if (minutes >= 15) {
        return {
            label: "confirmed",
            template: "icon",
            icon: "pi pi-eye",
            color: "var(--green-a)"
        }
    }

}

const getTimestamp = (order) => {
    if (order.contract_state === null) {
        return order.watch_until
    }

    if (order.contract_state === 0) {
        return order.pending_until
    }

    if (order.contract_state === -1) {
        return Date.now()
    }

    if (order.contract_state === 1) {
        return order.shipping_until
    }

    if (order.contract_state === 2) {
        return shippingData.value.date
    }

    if (order.contract_state === 3) {
        return Date.now()
    }

    if (order.contract_state === -3) {
        return Date.now()
    }
}

const openExplorer = () => {
    window.open(`https://${NETWORK}.cexplorer.io/tx/${pendingTx.value}`, '_blank');
}

const openWebsite = (website) => {
    window.open(website, '_blank');
}

/////////////////////////////////////////////

onMounted(() => {
    updateGlobalCountdown();
    globalInterval = setInterval(updateGlobalCountdown, 1000);
});

onBeforeUnmount(() => {
    unwatchOrder()
    unwatchRoute()
})

onUnmounted(() => {
    clearInterval(globalInterval);
});
*/
</script>

<style lang="css" scoped>
.notes {
    overflow: hidden;
    word-break: break-word;
}

.OrderPage {
    background: var(--background-a);
    justify-content: center;
}

.OrderPage-body {
    max-width: var(--body-a);
    min-height: 100vh;
    margin-top: 1rem;
    padding: 2rem;
    width: 100%;
}

.OrderPage-grid {
    grid-template-columns: 1fr 300px;
    margin-top: 1rem;
    display: grid;
}

</style>