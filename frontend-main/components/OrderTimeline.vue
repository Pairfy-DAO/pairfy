<template>
    <div class="timeline">
        <div class="timeline-item" v-for="item in timeline" :key="item">
            <div class="timeline-pipe">
                <div class="timeline-pipe-box">
                    <div class="diamond">
                        <template v-if="item.template === 'created'">
                            <span v-if="!createdStep">{{ item.number }}</span>
                            <span v-else>
                                <i class="pi pi-check" />
                            </span>
                        </template>
                        <template v-if="item.template === 'shipping'">
                            <span v-if="!shippingStep">{{ item.number }}</span>
                            <span v-else>
                                <i class="pi pi-check" />
                            </span>
                        </template>
                        <template v-if="item.template === 'received'">
                            <span v-if="!order.finished">{{ item.number }}</span>
                            <span v-else>
                                <i class="pi pi-check" />
                            </span>
                        </template>

                    </div>
                </div>
                <div class="timeline-pipe-line" :class="{ disabled: !item.line }" />
            </div>
            <div class="timeline-OrderPage">
                <div class="timeline-title flex">
                    {{ item.title }}
                </div>

                <div v-if="item.subtitle" class="timeline-subtitle flex">

                    {{ item.subtitle.buyer }}

                </div>

                <div class="timeline-content" :class="{ box: item.type === 'box', button: item.type === 'button' }">

                    <template v-if="item.template === 'created'">
                        <div class="created">
                            <div class="created-item">
                                <span>Status</span>
                                <span :class="{ red: ['returned', 'appealed', 'canceled'].includes(order.status) }">
                                    {{ order.status }}
                                </span>
                            </div>
                            <div class="created-item">
                                <span>Fiat Amount</span>
                                <span>{{ formatUSD(contractFiat) }} USD</span>
                            </div>
                            <div class="created-item">
                                <span>Asset Amount</span>
                                <span>{{ contractPrice }} ADA</span>
                            </div>
                            <div class="created-item">
                                <span>Asset Price</span>
                                <span>{{ orderData.asset_price }} ADA</span>
                            </div>
                            <div class="created-item">
                                <span>Quantity</span>
                                <span>{{ orderData.contract_units }}</span>
                            </div>
                            <div class="created-item">
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
                        <div class="created">
                            <div class="created-item">
                                <span>Status</span>
                                <span>{{ shippingStatus }}</span>
                            </div>
                            <div class="created-item">
                                <span>Delivery date</span>
                                <span>{{ deliveryDate }}</span>
                            </div>
                            <div class="created-item">
                                <span>Guide</span>
                                <span class="guide flex" v-if="shippingData">
                                    <div class="flex" @click="displayNotesDialog(true)">
                                        <i class="pi pi-envelope" />
                                    </div>
                                    <div class="flex" @click="openWebsite(shippingData.website)"
                                        >
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

const contractFiat = ref(0);
const orderPayment = ref({
            label: "unconfirmed",
            template: "loading",
            color: "var(--red-a)"
        });
const contractPrice = ref(0);
const shippingData = ref(null);
const deliveryDate = ref('None');
const shippingStep = computed(() => {
    if (orderData.value?.shipping_block) {
        return true
    }

    return false
});
const createdStep = computed(() => {
    if (orderData.value?.pending_block) {
        return true
    }

    return false
});

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
</script>

<style lang="css" scoped>
.timeline {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

.timeline-item {
    display: flex;
    width: 100%;
}

.timeline-pipe {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 1rem;
}

.timeline-pipe-box {
    width: inherit;
    min-height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.timeline-pipe-line {
    width: 2px;
    height: 100%;
    background: var(--border-a);
}

.timeline-pipe-line.disabled {
    background: transparent;
}

.timeline-body {
    display: flex;
    flex-direction: column;
    width: inherit;
}

.timeline-title {
    min-height: 50px;
    font-weight: 600;
    font-size: var(--text-size-2);
}

.timeline-subtitle {
    font-size: var(--text-size-1);
    margin-bottom: 1rem;
}

.timeline-content {
    border: 1px solid var(--border-a);
    border-radius: 12px;
    height: 100%;
    width: inherit;
}

.timeline-content.button {
    border: initial
}

.diamond {
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

.diamond span {
    transform: rotate(-45deg);
    font-size: var(--text-size-1);
    font-weight: 600;
    color: var(--text-a);
}

.diamond span i {
    font-size: 10px;
}

.created {
    display: block;
    padding: 1rem;
}

.created-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 2.5rem;
    text-transform: capitalize;
}

.created-item span {
    font-weight: 500;
    font-size: var(--text-size-2);
}

.created-item span:nth-child(1) {
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