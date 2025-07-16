<template>
  <div class="DispatchView">
    <form @submit.prevent="submitForm">

      <div class="form-group">
        <label for="date">Delivery date</label>
        <input type="datetime-local" id="date" v-model="form.dateInput" @change="convertToTimestamp" />
      </div>


      <div class="form-group">
        <label for="guide">Guide number</label>
        <input type="text" id="guide" v-model="form.guide" maxlength="30" />
        <span v-if="errors.guide" class="error">{{ errors.guide }}</span>
      </div>


      <div class="form-group">
        <label for="website">Website</label>
        <input type="text" id="website" v-model="form.website" maxlength="150" />
        <span v-if="errors.website" class="error">{{ errors.website }}</span>
      </div>


      <div class="form-group">
        <label for="notes">Notes</label>
        <textarea id="notes" v-model="form.notes" maxlength="100"></textarea>
        <span v-if="errors.notes" class="error">{{ errors.notes }}</span>
      </div>

      <div class="flex end">
        <ButtonSolid label="Submit" size="mini" />
      </div>
    </form>
  </div>
</template>

<script setup>
import { z } from "zod";

const orderStore = useOrderStore()

const form = reactive({
  dateInput: '',
  date: null,
  guide: '',
  website: '',
  notes: ''
})

const errors = reactive({
  guide: '',
  website: '',
  notes: ''
})

function convertToTimestamp() {
  const dt = new Date(form.dateInput)
  form.date = isNaN(dt.getTime()) ? null : dt.getTime()
}

const shippingSchema = z.object({
  date: z.number().int().nonnegative(),
  guide: z.string().min(1).max(30),
  website: z.string().min(1).max(150),
  notes: z.string().min(1).max(100),
});

function validateForm() {
  errors.guide = form.guide.length > 30 ? 'Máximo 30 caracteres' : ''
  errors.website = form.website.length > 150 ? 'Máximo 150 caracteres' : ''
  errors.notes = form.notes.length > 100 ? 'Máximo 100 caracteres' : ''
  return !(errors.guide || errors.website || errors.notes)
}

function submitForm() {
  try {
    if(!validateForm()){
      return
    }

    const result = shippingSchema.safeParse(form);

    if (!result.success) {
      console.error("Validation error:", result.error.issues);
      throw new Error(`Invalid params ${JSON.stringify(z.treeifyError(result.error))}`)
    }

  } catch (err) {
    orderStore.showToast(err, 'error', 10_000)
  }
}
</script>

<style scoped>
.DispatchView {
  width: 325px;
  padding: 1.5rem;
  padding-top: 0rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.75rem;
}

input[type="text"],
input[type="datetime-local"],
textarea {
  width: 100%;
  box-sizing: border-box;
  padding: var(--input-padding);
  border-radius: var(--radius-a);
  border: 1px solid var(--border-b);
}

textarea {
  resize: vertical;
}

.error {
  display: block;
  color: red;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}
</style>