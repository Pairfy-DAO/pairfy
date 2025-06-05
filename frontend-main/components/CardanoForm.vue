<template>
    <div class="CardanoForm">

        <div class="CardanoForm-body">
            <!-- Left Form -->
            <div class="CardanoForm-left">

                <div class="CardanoForm-head">
                    <img src="@/assets/icon/list.svg" alt="">
                    <div>
                        <span class="title">Purchase Order</span>
                        <span class="legend">Confirm your order and proceed to payment</span>
                    </div>
                </div>

                <!-- Steps -->
                <StepperComp :steps="['Details Shipment', 'Package Shipping']" :activeStep="0" />

                <div class="CardanoForm-section">
                    <div class="subtitle">
                        <span>Shipment Information</span>
                    </div>

                    <div class="form-group">
                        <div class="form-item">
                            <InputSelect v-model="orderUnits" :options="orderUnitOptions" label="Total Units"
                                @valid="orderUnitsValid = $event.valid" id="order-units-select" placeholder="Quantity">
                                <template #option="{ option }">
                                    <span class="flex">
                                        <span>{{ option.label }}</span>
                                    </span>
                                </template>
                            </InputSelect>
                        </div>

                        <div class="form-item">
                            <InputSelect v-model="orderPayment" :options="orderPaymentOptions" label="Payment in"
                                @valid="orderPaymentValid = $event.valid" id="order-payment-select"
                                placeholder="Assets">
                                <template #option="{ option }">
                                    <span class="flex">
                                        <span>{{ option.label }}</span>
                                    </span>
                                </template>
                            </InputSelect>
                        </div>
                    </div>

                    <div class="form-item">
                        <InputName label="Receiver Alias" />
                    </div>

                    <div class="form-item">
                        <label>Note</label>
                        <textarea rows="3" v-model="store.note" placeholder=""></textarea>
                    </div>
                </div>

                <div class="CardanoForm-section">
                    <div class="subtitle flex">
                        <span> Encrypted Address (AES-256)
                        </span>
                    </div>

                    <div class="form-item">
                        <InputName label="Address" placeholder="1234 Brickell Avenue, Suite 500, Miami, FL 33131" />
                    </div>

                    <div class="form-item">
                        <InputName label="Password" placeholder="Passphrase" />
                    </div>
                </div>

                <div class="CardanoForm-section">
                    <div class="subtitle">
                        Shipment preference
                    </div>
                    <div class="form-item">
                        <div class="shipment-grid" styl>
                            <button class="btn">Fedex</button>
                            <button class="btn">US Postal Service</button>
                            <button class="btn">DHL</button>
                            <button class="btn">UPS</button>
                        </div>
                    </div>
                </div>

            </div>
            <!-- Right Panel -->
            <div class="CardanoForm-right">
                <div class="CardanoForm-summary">
                    <div class="subtitle">
                        <span>Other information</span>
                    </div>

                    <div class="summary-top">
                        <label for="delivery-date">Delivery date</label>
                        <p id="delivery-date">{{ store.date }}</p>

                        <label for="receiver">Receiver alias</label>
                        <p id="receiver">{{ store.assignTo }}</p>

                        <label for="address">Address</label>
                        <p id="address">{{ selectedAddressDetails }}</p>

                        <label for="payment">Payment in</label>
                        <p id="payment">ADA</p>

                        <DividerComp margin="1rem 0" />

                        <label for="note">Note</label>

                        <p class="note" id="note">
                            All purchases are covered by a guarantee in case of non-delivery or different
                            specifications.
                            However, you should review the specifications before paying.
                        </p>

                        <DividerComp margin="1rem 0" />
                    </div>
                </div>


                <div class="summary-bottom">
                    <div>
                        <span class="label">Subtotal:</span>
                        <span class="value">$422,000.50</span>
                    </div>
                    <div>
                        <span class="label">Total Qty:</span>
                        <span class="value">2</span>
                    </div>
                    <div>
                        <span class="label">Fee:</span>
                        <span class="value">0.1</span>
                    </div>

                    <DividerComp margin="1rem 0" />

                    <div class="total">
                        <span class="label">Total:</span>
                        <span class="value">$422,548.50</span>
                    </div>
                </div>

            </div>
        </div>

        <div class="CardanoForm-actions">
            <a class="link flex" href="https://x.com/home" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-info-icon lucide-info">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                </svg>
                <span> Learn how local encryption works.</span>
            </a>
            <button class="btn">Cancel</button>
            <button class="btn primary">Next</button>
        </div>
    </div>
</template>

<script setup lang="ts">
const orderUnits = ref(null);
const orderUnitsValid = ref(false)
const orderUnitOptions = computed(() => {
    return Array.from({ length: 10 }, (_, i) => ({
        label: String(i + 1),
        value: String(i + 1)
    }))
})


const orderPayment = ref(null)
const orderPaymentValid = ref(false)
const orderPaymentOptions = computed(() => [
    { label: 'ADA', value: 'ada' }
])

const store = reactive({
    date: '2024/08/24',
    assignTo: 'Homer Simpson',
    paymentTerms: 'Cash',
    note: '',
    selectedAddress: 'Central Warehouse',
    addresses: [
        {
            label: 'Central Warehouse',
            details: '1234 Brickell Avenue, Suite 500, Miami, FL 33131'
        }
    ]
})

const selectedAddressDetails = computed(() => {
    const found = store.addresses.find(a => a.label === store.selectedAddress)
    return found?.details || ''
})
</script>

<style scoped>
.CardanoForm {
    flex-direction: column;
    box-sizing: border-box;
    padding: 1.5rem;
    padding-bottom: 0;
    min-width: 300px;
    max-width: 50vw;
    padding-top: 0;
    display: flex;
    gap: 1rem;
}

.CardanoForm-head {
    display: flex;
    align-items: center;
}

.CardanoForm-head div {
    display: flex;
    margin-left: 0.5rem;
    flex-direction: column;
}

.CardanoForm-head .title {
    font-size: var(--text-size-4);
    font-weight: 700;
}

.form-group {}

.legend {
    font-size: var(--text-size-1);
    color: var(--text-b);
    margin-top: 0.25rem;
}


.subtitle {
    font-size: var(--text-size-2);
    font-weight: 700;
}

.link {
    font-size: var(--text-size-0);
    text-decoration: none;
    color: var(--text-b);
    margin-left: 0.5rem;
    font-weight: 400;
}

.link span {
    margin-left: 0.5rem;
}

.CardanoForm-body {
    flex-direction: row;
    flex-wrap: wrap;
    display: flex;
    gap: 1.5rem;
}

.CardanoForm-left {
    flex: 2;
    gap: 1rem;
    display: flex;
    flex-direction: column;
}

.form-group {
    display: flex;
    gap: 1rem;
}

.form-item {
    flex-direction: column;
    margin-top: 1rem;
    display: flex;
    flex: 1;
}

.form-item label {
    font-weight: 600;
    margin-bottom: 1rem;
    font-size: var(--text-size-0);
}

textarea,
input,
select {
    padding: 8px;
    border-radius: 6px;
    border: 1px solid var(--border-b);
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
    background: var(--background-b);
}

.link-btn {
    background: none;
    border: none;
    color: var(--primary-a);
    font-size: 13px;
    cursor: pointer;
    margin-top: 4px;
    align-self: flex-start;
}

.shipment-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.btn {
    padding: 0.6rem 1rem;
    border: 1px solid var(--primary-a);
    background: #fff;
    color: var(--primary-a);
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
}

.btn.primary {
    background: var(--primary-a);
    color: white;
    border: none;
}

.CardanoForm-right {
    flex: 1;
    display: flex;
    overflow: hidden;
    min-width: 300px;
    flex-direction: column;
    font-size: var(--text-size-1);
    border-radius: var(--radius-c);
    background: var(--background-b);
    border: 1px solid var(--border-a);
}

.CardanoForm-summary {
    padding: 1.5rem;
}

.CardanoForm-actions {
    justify-content: flex-end;
    padding-bottom: 1rem;
    align-items: center;
    display: flex;
    gap: 1rem;
}

.summary-top {
    margin-top: 1rem;
}

.summary-top label {
    font-size: var(--text-size-0);
    color: var(--text-a);
    font-weight: 600;
}

.summary-top p {
    line-height: 1.5rem;
    color: var(--text-b);
    font-weight: 400;
    margin: 0.5rem 0;
}

.summary-bottom {
    box-shadow: 0 -10px 20px rgba(0, 0, 0, 0.05);
    border-top-right-radius: var(--radius-d);
    border-top-left-radius: var(--radius-d);
    background: var(--background-a);
    margin-top: auto;
    padding: 1.5rem;
}

.note {
    font-size: var(--text-size-0);
    line-height: 1.25rem !important;
    color: var(--text-b);
    text-align: justify;
    font-weight: 400;
    display: flex;
    width: 100%;
}

.summary-bottom div {
    display: flex;
    padding: 0.5rem 0;
    justify-content: space-between;
}

.summary-bottom .label {
    font-weight: 500;
}

.summary-bottom .value {
    font-weight: 600;
}

.summary-bottom .total {
    font-weight: 700;
}
</style>