<template>
  <div class="InputTextarea">
    <label for="note">Note</label>
    <textarea id="note" v-model="noteText" rows="5" cols="40" placeholder="Write your note here..."></textarea>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const noteText = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
});
</script>


<style scoped>
.InputTextarea {
  display: flex;
  flex-direction: column;
}

label {
  justify-content: space-between;
  font-size: var(--text-size-0);
  margin-bottom: 0.75rem;
  align-items: center;
  display: flex;
}

textarea {
  padding: 1rem;
  outline: none;
  resize: vertical;
  font-size: var(--text-size-1);
  border-radius: var(--radius-b);
  background: var(--background-b);
  border: 1px solid var(--border-b);
}
</style>
