<template>
  <div class="p-ProductDiscountComp">
    <label class="title-text">{{ label }}</label>


    <div class="discount-toggle">
      <label class="switch">
        <input type="checkbox" v-model="enabled" />
        <span class="slider" />
      </label>
    </div>

    <Transition name="fade">
      <div v-if="enabled" class="input-group">
        <label for="discount" class="label-small">Discount (%)</label>
        <input id="discount" type="number" inputmode="numeric" min="1" max="100" step="1"
          v-model.number="discountPercent" class="discount-input" placeholder="25" @input="onInput"/>
      </div>
    </Transition>

    <div v-if="enabled" class="final-price">
      New price:
      <span class="final-price-value">${{ discountedPrice.toFixed(2) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: { type: String, default: 'Enabled' },
  modelValue: {
    type: Object as () => { enabled: boolean; price: number | null; discount: number },
    required: true
  },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: { enabled: boolean; price: number | null; discount: number }): void
}>()

const enabled = ref(props.modelValue.enabled)
const discountPercent = ref(props.modelValue.discount)


const originalPrice = computed({
  get: () => props.modelValue.price,
  set: (val) => {
    emit('update:modelValue', {
      enabled: enabled.value,
      price: val,
      discount: discountPercent.value
    })
  }
})

watch([enabled, discountPercent], () => {
  emit('update:modelValue', {
    enabled: enabled.value,
    price: originalPrice.value,
    discount: discountPercent.value,
  })
})

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  let value = parseInt(target.value)

  if (isNaN(value)) {
    value = 0
  } else if (value < 0) {
    value = 0
  } else if (value > 100) {
    value = 100
  }

  discountPercent.value = value
  target.value = value.toString()
}

function applyDiscount(price: number, percentage: number): number {
  if (typeof price !== 'number' || !Number.isInteger(price) || price < 0) {
    return 0
  }

  if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
    return price
  }

  const discount = (price * percentage) / 100;
  return Math.floor(price - discount);
}


const normalizedPrice = computed(() => {
  return originalPrice.value ?? 0
})

const discountedPrice = computed(() => {
  if (!enabled.value || discountPercent.value === 0) return normalizedPrice.value
  return applyDiscount(normalizedPrice.value, discountPercent.value)
})
</script>


<style scoped>
.p-ProductDiscountComp {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.title-text {
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.discount-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 26px;
  transition: 0.3s;
}

.slider::before {
  content: "";
  position: absolute;
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}

.switch input:checked+.slider {
  background-color: var(--primary-a, #2563eb);
}

.switch input:checked+.slider::before {
  transform: translateX(22px);
}

.input-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.label-small {
  font-size: var(--text-size-1);
  font-weight: 500;
  margin: 0.75rem 0;
}

.price-input,
.discount-input {
  border: 1px solid var(--border-a, #ccc);
  border-radius: var(--input-radius);
  background: var(--background-a);
  font-size: var(--text-size-1);
  padding: var(--input-padding);
  box-sizing: border-box;
  outline: none;
  width: 100%;
}

.price-input:hover,
.discount-input:hover{
  border: 1px solid var(--primary-a);
}

.final-price {
  font-size: var(--text-size-1);
  color: var(--text-b);
  margin-top: 0.75rem;
  font-weight: 500;
}

.final-price-value {
  color: var(--primary-a, #2563eb);
  margin-left: 0.25rem;
  color: var(--text-a);
  font-weight: 700;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.9);
}
</style>
