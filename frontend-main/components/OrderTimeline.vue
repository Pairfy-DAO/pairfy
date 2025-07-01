<template>
    <div class="OrderTimeline">
        <div class="OrderTimeline-item" v-for="(item, index) in timeline" :key="index">
     
            <div class="OrderTimeline-left">
                <div class="timeline-box">
                    <div class="timeline-diamond">
                        <template v-if="item.template === 'created'">
                            <span v-if="!order.pending_block">{{ item.number }}</span>
                            <span v-else>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="lucide lucide-check-icon lucide-check">
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            </span>
                        </template>
                        <template v-if="item.template === 'shipping'">
                            <span v-if="!order.shipping_block">{{ item.number }}</span>
                            <span v-else>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="lucide lucide-check-icon lucide-check">
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            </span>
                        </template>
                        <template v-if="item.template === 'received'">
                            <span v-if="!order.finished">{{ item.number }}</span>
                            <span v-else>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="lucide lucide-check-icon lucide-check">
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            </span>
                        </template>
                    </div>
                </div>
                <div class="timeline-line" :class="{ disabled: !item.line }" />
            </div>

            <div class="OrderTimeline-right">
                <div class="timeline-title">
                    {{ item.title }}
                </div>
                <div class="timeline-subtitle" v-if="item.subtitle">
                    {{ item.subtitle }}
                </div>
                <div class="OrderTimeline-content"
                    :class="{ box: item.type === 'box', button: item.type === 'button' }">

                    <template v-if="item.template === 'created'">
                        <div class="template">
                            <div class="template-item">
                                <span>Status</span>
                                <span :class="{ red: ['returned', 'appealed', 'canceled'].includes(orderData.status) }">
                                    {{ orderData.status }}
                                </span>
                            </div>
                            <div class="template-item">
                                <span>USD Amount</span>
                                <span>{{ formatUSD(orderData.contract_quote) }} USD</span>
                            </div>
                            <div class="template-item">
                                <span>Asset Amount</span>
                                <span>{{ orderData.contract_quote }} {{ orderData.asset_name }}</span>
                            </div>
                            <div class="template-item">
                                <span>Asset Price</span>
                                <span>{{ orderData.asset_price }} {{ orderData.asset_name }}</span>
                            </div>
                            <div class="template-item">
                                <span>Quantity</span>
                                <span>{{ orderData.contract_units }}</span>
                            </div>
                            <div class="template-item">
                                <span>Payment</span>
                                <span>
                                    <div class="payment flex" @click="openExplorer">
                                        <div class="payment-label" :style="{ color: orderPayment.color }">
                                            {{ orderPayment.label }}
                                        </div>

                                        <div class="payment-symbol flex" :style="{ color: orderPayment.color }">
                                            <div v-if="orderPayment.template === 'loading'" class="payment-loader"
                                                :class="{
                                                    warn: orderPayment.label === 'confirming',
                                                    danger: orderPayment.label === 'unconfirmed'
                                                }" />

                                            <div v-if="orderPayment.template === 'icon'">
                                                <i :class="orderPayment.icon" />
                                            </div>
                                        </div>
                                    </div>
                                </span>
                            </div>
                        </div>
                    </template>


                    <template v-if="item.template === 'shipping'">
                        <div class="template">
                            <div class="template-item">
                                <span>Status</span>
                                <span>{{ shippingStatus }}</span>
                            </div>
                            <div class="template-item">
                                <span>Delivery date</span>
                                <span>{{ deliveryDate }}</span>
                            </div>
                            <div class="template-item">
                                <span>Guide</span>
                                <span class="guide flex" v-if="shippingData">
                                    <div class="flex" @click="displayNotesDialog(true)">
                                        <i class="pi pi-envelope" />
                                    </div>
                                    <div class="flex" @click="openWebsite(shippingData.website)">
                                        <i class="pi pi-globe" />
                                    </div>
                                    <div class="flex" style="padding-right: initial; cursor: initial;"> {{
                                        shippingData.guide }}
                                    </div>
                                </span>
                                <span v-else>None</span>
                            </div>
                        </div>
                    </template>

                    <template v-if="item.template === 'received'">
                        x
                    </template>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { formatUSD } from '@/utils/utils'

const order = useOrderStore()
const orderData = computed(() => order.order)

const totalUSD = computed(() => orderData.value.contract_price * orderData.value.asset_price)

const orderPayment = ref({
    label: "unconfirmed",
    template: "loading",
    color: "var(--red-a)"
});
const contractPrice = ref(0);
const shippingData = ref(null);
const deliveryDate = ref('None');


const shippingStatus = computed(() => {
    const state = orderData.value.contract_state;

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

const timeline = ref([
    {
        number: 1,
        title: "Created",
        subtitle: "The seller has been notified to prepare your package.",
        completed: true,
        type: "box",
        template: "created",
        line: true
    },
    {
        number: 2,
        title: "Shipping",
        subtitle: "Use the tracking number to check your shipment.",
        completed: false,
        type: "box",
        template: "shipping",
        line: true
    },
    {
        number: 3,
        title: "Finished",
        subtitle: "Please confirm that the exact product was delivered.",
        completed: false,
        type: "button",
        template: "received",
        line: false
    }
])

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


const openExplorer = () => {
    if (!import.meta.client) return

    const cardanoNetwork = useRuntimeConfig().public.cardanoNetwork;

    window.open(`https://${cardanoNetwork}.cexplorer.io/tx/${order.pendingTx}`, '_blank');
}

</script>

<style lang="css" scoped>
.OrderTimeline {
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

.OrderTimeline-item {
    display: flex;
    width: inherit;
}

.OrderTimeline-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 1rem;
}

.OrderTimeline-right {
    width: inherit;
}

.timeline-box {
    width: inherit;
    min-height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.timeline-line {
    width: 2px;
    height: 100%;
    background: var(--border-a);
}

.timeline-line.disabled {
    background: transparent;
}

.OrderTimeline-body {
    display: flex;
    flex-direction: column;
    width: inherit;
}

.timeline-title {
    display: flex;
    min-height: 50px;
    font-weight: 600;
    align-items: center;
    font-size: var(--text-size-2);
}

.timeline-subtitle {
    font-size: var(--text-size-1);
    margin-bottom: 1rem;
}

.OrderTimeline-content {
    border: 1px solid var(--border-a);
    border-radius: var(--radius-c);
    width: inherit;
}

.OrderTimeline-content.button {
    border: initial
}

.timeline-diamond {
    width: 20px;
    height: 20px;
    background: var(--border-a);
    transform: rotate(45deg);
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    border-radius: 4px;
}

.timeline-diamond span {
    font-size: var(--text-size-1);
    transform: rotate(-45deg);
    color: var(--text-a);
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
}

.timeline-diamond span i {
    font-size: 10px;
}

.template {
    display: block;
    padding: 1rem;
}

.template-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 2.5rem;
    text-transform: capitalize;
}

.template-item span {
    font-weight: 500;
    font-size: var(--text-size-2);
}

.template-item span:nth-child(1) {
    color: var(--text-b);
}


.guide div {
    height: 36px;
    padding: 0 0.5rem;
    cursor: pointer;
}

.payment {
    background: inherit;
    border-radius: 20px;
    padding-right: 1rem;
    overflow: hidden;
    cursor: pointer;
    outline: 1px solid var(--border-a);
}

.payment-label {
    font-size: var(--text-size-1);
    font-weight: 600;
    border-right: 1px solid var(--border-a);
    padding: 0 1rem;
    margin-right: 0.75rem;
}

.payment-label.unconfirmed {
    color: var(--red-a);
}

.payment-label.confirmed {
    color: var(--green-a);
}

.payment-symbol {
    justify-content: center;
    margin-left: 1px;
}

.payment-loader {
    width: 1rem;
    height: 1rem;
    border: 2px solid transparent;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    margin-left: 1px;
}

.payment-loader.warn {
    border: 2px solid var(--orange-a);
    border-bottom-color: transparent;
}

.payment-loader.danger {
    border: 2px solid var(--red-a);
    border-bottom-color: transparent;
}


@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>