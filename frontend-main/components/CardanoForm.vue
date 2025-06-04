<template>
    <div class="CardanoForm">

        <div class="CardanoForm-body">
            <!-- Left Form -->
            <div class="CardanoForm-left">

                <div class="CardanoForm-head">
                    <img src="@/assets/icon/list.svg" alt="">
                    <div class="titles">
                        <span class="title">Purchase Order</span>
                        <span class="legend">Effortlessly import products and update your inventory.</span>
                    </div>
                </div>

                <!-- Steps -->
                <StepperComp :steps="['Details Shipment', 'Package Shipping']" :activeStep="0" />


                <div class="details">
                    <div class="subtitle">
                        <span>Shipment Information</span>
                    </div>

                    <div class="row-2">
                        <div class="field-group">
                            <label>Units</label>
                            <select v-model="store.paymentTerms">
                                <option>1</option>
                            </select>
                        </div>

                        <div class="field-group">
                            <label>Payment</label>
                            <select v-model="store.paymentTerms">
                                <option>ADA</option>
                            </select>
                        </div>
                    </div>


                    <div class="row-2">
                        <div class="field-group">
                            <label>Receiver alias</label>
                            <select v-model="store.assignTo">
                                <option>Name</option>
                            </select>
                        </div>
                    </div>


                    <div class="field-group">
                        <label>Note</label>
                        <textarea rows="3" v-model="store.note" placeholder="Please review all items..."></textarea>
                    </div>
                </div>



                <div class="field-group">
                    <div class="subtitle">
                        Encrypted Address (AES-256)
                    </div>
                    <div class="address-grid">
                        <div v-for="(addr, idx) in store.addresses" :key="idx" class="address-card">
                            <input type="radio" :id="addr.label" :value="addr.label" v-model="store.selectedAddress" />
                            <label :for="addr.label">
                                <strong>{{ addr.label }}</strong><br />
                                <small>{{ addr.details }}</small>
                            </label>
                        </div>
                    </div>
                    <button class="link-btn">+ Add Address</button>
                </div>

                <div class="field-group">
                    <div class="subtitle">
                        Shipment
                    </div>
                    <div class="shipment-grid">
                        <button class="btn">Fedex</button>
                        <button class="btn">US Postal Service</button>
                        <button class="btn">DHL</button>
                        <button class="btn">UPS</button>
                    </div>
                </div>
            </div>

            <!-- Right Panel -->
            <div class="CardanoForm-right">

                <div class="summary-head">

                    <div class="subtitle">
                        <span>Other information</span>
                    </div>

                    <div class="summary-top">
                        <label for="delivery-date">Delivery date</label>
                        <p id="delivery-date">{{ store.date }}</p>

                        <label for="receiver">Receiver alias</label>
                        <p id="receiver">{{ store.assignTo }}</p>

                        <label for="payment">Payment</label>
                        <p id="payment">ADA</p>

                        <label for="address">Address</label>
                        <p id="address">{{ selectedAddressDetails }}</p>
                    </div>
                    <DividerComp />

                    <label for="note">Note</label>
                    <p id="note">aaa</p>

                    <DividerComp />
                </div>

                <div class="summary">
                    <div class="summary-row">
                        <span class="label">Subtotal:</span>
                        <span class="value">$422,000.50</span>
                    </div>
                    <div class="summary-row">
                        <span class="label">Total Qty:</span>
                        <span class="value">2</span>
                    </div>
                    <div class="summary-row">
                        <span class="label">Tax:</span>
                        <span class="value">10%</span>
                    </div>

                    <DividerComp margin="1rem 0" />

                    <div class="summary-row total">
                        <span class="label">Total:</span>
                        <span class="value">$422,548.50</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="actions">
            <button class="btn">Cancel</button>
            <button class="btn primary">Next</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'

const store = reactive({
    date: '2024/08/24',
    assignTo: 'Homer Simpson',
    paymentTerms: 'Cash',
    note: '',
    selectedAddress: 'Central Warehouse',
    addresses: [
        {
            label: 'Central Warehouse',
            details: '123 Maple Street, Apt 4B, Springfield, IL 62704'
        },
        {
            label: 'European Warehouse',
            details: '654 Logistics Ln, Hamburg 20457, Germany'
        },
        {
            label: 'Northern Warehouse',
            details: '321 Commerce St, Toronto, ON M5J 2N8'
        },
        {
            label: 'Western Warehouse',
            details: '98 Sunset Blvd, Los Angeles, CA 90001'
        }
    ]
})

const selectedAddressDetails = computed(() => {
    const found = store.addresses.find(a => a.label === store.selectedAddress)
    return found?.details || ''
})

const steps = ['Details Shipment', 'Order processing', 'Package Shipping']
const currentStep = ref(1)
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

.titles {
    display: flex;
    margin-left: 0.5rem;
    flex-direction: column;
}

.legend {
    font-size: var(--text-size-1);
    color: var(--text-b);
    margin-top: 0.25rem;
}

.title {
    font-size: var(--text-size-4);
    font-weight: 700;
}

.subtitle {
    font-size: var(--text-size-2);
    margin-bottom: 1rem;
    font-weight: 700;
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

.row-2 {
    display: flex;
    gap: 1rem;
}

.field-group {
    flex-direction: column;
    display: flex;
    flex: 1;
}

.field-group label {
    font-weight: 600;
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-size: var(--text-size-0);
}

textarea,
input,
select {
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
    background: var(--background-b);
}

.address-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.address-card {
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 8px;
    font-size: 13px;
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
    gap: 8px;
}

.btn {
    padding: 8px 14px;
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
    min-width: 250px;
    flex-direction: column;
    font-size: var(--text-size-1);
    border-radius: var(--radius-c);
    background: var(--background-b);
    border: 1px solid var(--border-a);
}

.note {
    font-size: 12px;
    color: #555;
    margin-top: 8px;
}

.empty {
    font-style: italic;
    color: #888;
    margin-top: 8px;
}

.summary-head {
    padding: 1rem;
}

.summary p {
    margin: 4px 0;
}

.actions {
    justify-content: flex-end;
    padding-bottom: 1rem;
    align-items: center;
    display: flex;
    gap: 1rem;
}

.summary {
    background: var(--background-a);
    box-shadow: 0 -10px 20px rgba(0, 0, 0, 0.05);
    margin-top: auto;
    padding: 1.5rem;
}

.summary-top label {
    font-size: var(--text-size-0);
    font-weight: 500;
    color: var(--text-b);
}

.summary-top p {
    font-weight: 500;
}









.order-summary {
    max-width: 400px;
    padding: 20px;
    margin: 40px auto;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1);
}

.summary-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
}

.summary-row:last-child {
    border-bottom: none;
}

.label {
    font-weight: 500;
}

.value {
    font-weight: 600;
}

.total {
    font-weight: 700;
}
</style>