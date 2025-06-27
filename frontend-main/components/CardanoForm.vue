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
                            <InputSelect v-model="orderUnits" :options="orderUnitOptions" label="Quantity"
                                @valid="orderUnitsValid = $event.valid" id="order-units-select" placeholder="Units">
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
                        <InputName v-model="orderName" @valid="orderNameValid = $event.valid" label="Receiver Alias" />
                    </div>

                    <div class="form-item">
                        <InputTextarea v-model="orderNote" />
                    </div>
                </div>

                <div class="CardanoForm-section">
                    <div class="subtitle flex">
                        <span> Encrypt Address (RSA-256)
                        </span>
                    </div>

                    <div class="form-item">
                        <InputAddress v-model="orderAddress" @valid="orderAddressValid = $event.valid" />
                    </div>

                    <div class="form-item">
                        <InputPassword v-model="orderPassword" @valid="orderPasswordValid = $event.valid"
                            placeholder="Password" />
                    </div>
                </div>

                <div class="CardanoForm-section">
                    <div class="subtitle">
                        Shipment preference
                    </div>
                    <div class="form-item">
                        <InputButtonGrid v-model="orderProvider" />
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
            <button class="btn" @click="product.cardanoDialog = false">Cancel</button>
            <button class="btn primary" @click="onSubmit">Next</button>
        </div>
    </div>
</template>

<script setup>
import { gql } from 'graphql-tag'
import { chunkMetadata } from '@/utils/utils';

const product = useProductStore()

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

const orderName = ref(null)
const orderNameValid = ref(false)

const orderNote = ref(null)


const orderAddress = ref(null)
const orderAddressValid = ref(true)


const orderPassword = ref(null)
const orderPasswordValid = ref(false)


const orderProvider = ref(null)


function isValidParams() {
    const values = [orderUnitsValid.value, orderPaymentValid.value, orderNameValid.value, orderAddressValid.value, orderPasswordValid.value]

    return !values.includes(false)
}

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

const loading = ref(false)

const { $gatewayClient } = useNuxtApp()

const wallet = useWalletStore()

const onSubmit = async () => {
    if (import.meta.server) return;

    const PENDING_ENDPOINT_MUTATION = gql`
mutation PendingEndpoint($pendingEndpointVariable: PendingEndpointInput!) {
    pendingEndpoint(pendingEndpointInput: $pendingEndpointVariable) {
       success
       data {
        order
        cbor
        spk
       }
    }
}

`
    try {
        loading.value = true

        const { data } = await $gatewayClient.mutate({
            mutation: PENDING_ENDPOINT_MUTATION,
            variables: {
                "pendingEndpointVariable": {
                    "product_id": "PRD-250625-R6C5J9X",
                    "order_units": 1
                }
            },
        });

        console.log(data.pendingEndpoint)

        const metadata = "ENjL13Eh1jDItRGphNXAGO0osY9xShmKypd22nP7AHYiNwsaGmOloYuYOEG8CE2/Hx0lGyG/+tSs9e6M27FmbBjuwke1iVGHF93dfjkCKDflcvkoWaYfTUD0hPgJemvtYn0//tZWAWITG+I1Ym6JG8ssB40hEIzozF9FgqYK46U3e8o3BWnMBjeTMrHVnVq7T/JiZali2XlUUM9QLoizTz9pYamZm3SkrOpYyK5rFK8D8ntcqn0umbsh2gS7TxxT+NP6DHne5qwt1hsUryxYOo9Kp7dOA9ZEF62JRBgtq1MjEVLkKOO5jCn/GYzPiJfP2DbCrSKp4y4LM0l1ZkFzUw=="
        const chuncked = chunkMetadata(metadata, 64)

        const submit = await wallet.balanceTx(data.pendingEndpoint.data.cbor, chuncked)

        console.log(submit)

        product.showToast('order', 'success', 10_000)
    } catch (err) {
        console.error('pendingEndpoint:', err);
        product.showToast(err, 'error', 10_000)
    } finally {
        loading.value = false
    }
}


const testTX = async () => {
    try {
        const cbor = '84aa00d9010281825820c3506eda1728a8794e2007e104cc38fc419bab09f9f2f8f7940bf5eda41b2759010182a300581d705cde3f3cdb382d9f85a4a32539c45a63ec2dc605e59eb10a69f02a9601821a00989680a1581cf335bf5e0a4a73e37b7c0235f3750ac6b4e675cea3d58b7be1ed7460a14b746872656164746f6b656e01028201d81848d8799f00d87a80ff82583900a239e6c2bbd6a9f3249d65afef89c28e1471ed07c529ec06848cc1415502e5c34c37200c2ae9757cf8d9ee36370f7b778ad835377a0c47a51b00000002398db87d021a00032b66031a05ae513409a1581cf335bf5e0a4a73e37b7c0235f3750ac6b4e675cea3d58b7be1ed7460a14b746872656164746f6b656e010b5820dc1b5548c633a0ee88c60295d83c12ae19b771c1d93ddd1a662eeefe743275f20dd9010281825820c3506eda1728a8794e2007e104cc38fc419bab09f9f2f8f7940bf5eda41b2759010ed9010281581ca239e6c2bbd6a9f3249d65afef89c28e1471ed07c529ec06848cc1411082583900a239e6c2bbd6a9f3249d65afef89c28e1471ed07c529ec06848cc1415502e5c34c37200c2ae9757cf8d9ee36370f7b778ad835377a0c47a51b000000023a0af5e3111a001e8480a20581840100d879808219aa501a00d8d16e07d90102815902015901fe01010033332323232323232232223225333007323232323253323300d3001300e3754004264646464a666022600a0022a66602860266ea801c0085854ccc044c00c00454ccc050c04cdd50038010b0b18089baa006132323232533301630190021323253330153009301637540162a66602a6012602c6ea8c8cc004004018894ccc0680045300103d87a80001332253330193375e603c60366ea80080584cdd2a40006603a00497ae0133004004001301c001301d00113253330163008002100114a066e3c00804c5854ccc054cdc3800a4002266e3c00804c5281bad3016002375c60280022c602e00264a666024600860266ea800452f5bded8c026eacc05cc050dd500099198008009bab3017301830183018301800322533301600114c0103d87a80001323332225333017337220140062a66602e66e3c02800c4cdd2a4000660366e980092f5c02980103d87a8000133006006001375c602a0026eacc058004c068008c060004dd6180a80098089baa006370e90011bae3012300f37540046e1d20001630103011003300f002300e002300e0013009375400229309b2b1bad001375c002ae6955ceaab9e5573eae815d0aba24c010c4b746872656164746f6b656e004c0127d8799f5820c3506eda1728a8794e2007e104cc38fc419bab09f9f2f8f7940bf5eda41b275901ff004c01091b00000197af55e80d0001f5f6'

        const submit = await wallet.balanceTx(cbor)

        console.log(submit)
    } catch (err) {
        product.showToast(err, 'error', 10_000)
    }
}
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
    line-height: 2rem;
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