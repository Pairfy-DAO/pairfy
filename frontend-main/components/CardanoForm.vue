<template>
    <div class="CardanoForm">

        <div class="CardanoForm-body">
            <!-- Left Form -->
            <div class="CardanoForm-left">

                <div class="CardanoForm-head">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-clipboard-icon lucide-clipboard">
                        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    </svg>
                    <div class="titles">
                        <span class="title">Purchase Order</span>
                        <span class="legend">Effortlessly import products and update your inventory.</span>
                    </div>
                </div>

                <!-- Steps -->
                <StepperComp :steps="['Details Shipment', 'Package Shipping']" :activeStep="0" />


                <div class="details">
                    <div class="subtitle">
                        <span>Order Summary</span>
                    </div>
                    <div class="row-2">
                        <div class="field-group">
                            <label>Expected delivery date</label>
                            <input type="date" v-model="store.date" readonly />
                        </div>
                        <div class="field-group">
                            <label>Receiver alias</label>
                            <select v-model="store.assignTo">
                                <option>Name</option>
                            </select>
                        </div>
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
                    <label>Shipment</label>
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
                <div class="subtitle">
                    <span>Order Summary</span>
                </div>
                <p><strong>Delivery date:</strong> {{ store.date }}</p>
                <p><strong>Assign to:</strong> {{ store.assignTo }}</p>
                <p><strong>Payment:</strong> ADA</p>
                <p><strong>Address:</strong> {{ selectedAddressDetails }}</p>

                <p class="note">Specifications listed in this purchase order. If there are any discrepancies or issues,
                    contact us immediately before processing the order.</p>

                <h5>Products</h5>
                <p class="empty">The product list is empty for now</p>

                <div class="summary">
                    <p><strong>Subtotal:</strong> $422,000.50</p>
                    <p><strong>Total Qty:</strong> 2</p>
                    <p><strong>Tax:</strong> 10%</p>
                    <p><strong>Total:</strong> $422,548.50</p>
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
    date: '2024-08-24',
    assignTo: 'Alias',
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

const steps = ['Details Shipment', 'Package Shipping']
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
    margin-left: 1rem;
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

.CardanoForm-head svg {
    width: 3rem;
}

.row-2 {
    display: flex;
    gap: 1rem;
}

.field-group {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.field-group label {
    font-size: var(--text-size-1);
    line-height: 2rem;
    font-weight: 500;
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
    padding: 1rem;
    min-width: 250px;
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
</style>