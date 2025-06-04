<template>
    <div class="stepper flex">
        <div v-for="(step, index) in steps" :key="index" class="step flex">
            <div class="circle" :class="{ active: index === currentStep }">
                {{ index + 1 }}
            </div>

            <div class="label" :class="{ active: index === currentStep }">
                {{ step }}
            </div>


            <div class="connector" v-if="index !== steps.length - 1" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const steps = ['Details Shipment', 'Order Processing', 'Package Shipping']
const currentStep = ref(0)
</script>

<style scoped>
.stepper {
    justify-content: space-between;
    font-size: var(--text-size-1);
    margin: 1rem 0;
}

.step {
    position: relative;
    text-align: center;
    flex: 1;
}

/* Línea decorativa entre círculos */
.connector {
    width: 100%;
    height: 2px;
    margin: 0 1rem;
    min-width: 2rem;
    background: var(--border-a);
}

.connector.completed {
    background: var(--primary-a);
}

.circle { 
    width: 1.5rem;
    display: flex;
    height: 1.5rem;
    font-weight: 500;
    min-width: 1.5rem;
    border-radius: 50%;
    align-items: center;
    color: var(--text-b);
    justify-content: center;

    border: 1px solid var(--border-a);
}

.circle.active {
    background: var(--primary-a);
    color: var(--text-w);
}

.label {
    white-space: nowrap;
    margin-left: 0.5rem;
    color: var(--text-b);
}

.label.active {
    font-weight: bold;
    color: var(--text-a);
}
</style>