<template>
    <div class="OrderSummary">
        <div class="OrderSummary-title flex">
            <template v-if="!order.finished">
                <div>
                    {{ orderTitle }}
                </div>
                <span>{{ globalCountdown }}</span>
            </template>

            <template v-else="order.finished">
                <div>
                    {{ orderTitle }}
                </div>

                <FinishedIcon />
            </template>
        </div>

        <div class="OrderSummary-subtitle">
            OrderId
            <div>
                <span>{{ truncateText(orderData.id, 20) }}</span>
            </div>
            <button class="copy-button" @click="copyToClipboard(orderData.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-copy-icon lucide-copy">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
            </button>
            <button class="copy-button" @click="openExplorer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-globe-icon lucide-globe">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                </svg>
            </button>
        </div>


        <div class="OrderSummary-subtitle">
            Contract Address
            <div>
                <span> {{ truncateText(orderData.contract_address, 20) }}</span>
            </div>
            <button class="copy-button flex" @click="copyToClipboard(orderData.contract_address)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-copy-icon lucide-copy">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
            </button>
        </div>

        <DividerComp />

        <OrderTimeline />
    </div>
</template>

<script setup>
import { truncateText } from '@/utils/utils'

const order = useOrderStore()
const orderData = computed(() => order.order)

const orderTitle = computed(
    () => {
        let title = "Preparing your package, Time Remaining"

        if (order.state === 0) {
            title = "Preparing your package, Time Remaining"
        }

        if (order.state === 1) {
            title = "Prepare the package, Time Remaining "
        }

        if (order.state === 2) {
            title = "The Package is Arriving, Time Remaining "
        }

        if (order.state === 3) {
            title = "The Package is Arriving, Time Remaining "
        }

        return title
    }
)

const pendingTx = ref(null)

const globalTimestamp = ref(Date.now());

const globalTimeLeft = ref(globalTimestamp.value - Date.now());

const globalCountdown = computed(() => {
    if (globalTimeLeft.value <= 0) return "00:00";

    const totalSeconds = Math.floor(globalTimeLeft.value / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');

    return formatTime(`${minutes}:${seconds}`);
});

function formatTime(value) {
    let [minutes, seconds] = value.split(":").map(Number);

    const hours = Math.floor(minutes / 60);

    const days = Math.floor(hours / 24);

    const remainingHours = hours % 24;

    minutes = minutes % 60;

    minutes += Math.floor(seconds / 60);

    seconds = seconds % 60;

    minutes = Math.min(minutes, 99);

    return `${days}d : ${remainingHours}h : ${minutes}m : ${seconds}s`;
}

const openExplorer = () => {
    if (!import.meta.client) return

    const cardanoNetwork = useRuntimeConfig().public.cardanoNetwork;

    window.open(`https://${cardanoNetwork}.cexplorer.io/tx/${pendingTx.value}`, '_blank');
}

</script>

<style lang="css" scoped>
.OrderSummary {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.OrderSummary-title {
    font-size: var(--text-size-3);
    font-weight: 600;
    line-height: 3rem;
    position: relative;
}

.OrderSummary-title span {
    color: var(--primary-a);
    font-weight: 700;
    margin-left: 0.5rem
}

.OrderSummary-subtitle {
    font-size: var(--text-size-1);
    color: var(--text-a);
    align-items: center;
    line-height: 2.5rem;
    display: flex;
}

.OrderSummary-subtitle span {
    color: var(--text-b);
    margin-left: 0.5rem;
}

.OrderSummary-subtitle button {
    background: transparent;
    border: none;
    cursor: pointer;
}

.OrderSummary-subtitle button i {
    font-size: var(--text-size-1);
    color: var(--text-a);
}

.copy-button:hover {
    display: flex;
    align-items: center;
    color: var(--primary-c);
}
</style>