<template>
  <div class="datatable">

    <div class="header flex">
      <div class="header-left">
        <div class="search flex">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-search">
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
          <input v-model="searchQuery" type="text" placeholder="Search" class="p-2 border rounded w-full mb-3" />
        </div>
      </div>

      <div class="header-right flex">
        <div class="pagination flex">
          <span>{{ page }}</span>
          <span>{{ range }}</span>
        </div>

        <ButtonRounded @click="prevPage" :disabled="!hasPrevPage">
          <template #content>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-chevron-left">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </template>
        </ButtonRounded>

        <ButtonRounded @click="nextPage" :disabled="!hasNextPage">
          <template #content>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-chevron-right">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </template>
        </ButtonRounded>
      </div>
    </div>

    <!-- Tabla -->
    <table class="table">
      <thead>
        <tr class="columns">
          <th class="column" v-if="images" />
          <th class="column" v-for="column in columns" :key="column.field" @click="sortBy(column.field)">
            <div class="box">
              <span class="label">{{ column.label }}</span>
              <div class="sort">
                <span class="arrow up" :class="{ enabled: sortOrder === 1 && sortField === column.field }" />
                <span class="arrow down" :class="{ enabled: sortOrder === -1 && sortField === column.field }" />
              </div>
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr class="rows" v-for="item in filteredItems" :key="item.id">
          <td class="image" :style="{ width: columnWidths['image'] || 'auto', maxWidth: columnWidths['image'] || 'fit-content' }" v-if="images">
            <slot name="image" :item="item" />
          </td>

          <td class="row" v-for="column in columns" :key="column.field"
            :style="{ width: columnWidths[column.field] || 'auto', maxWidth: columnWidths[column.field] || 'fit-content' }">
            <slot :name="`col-${column.field}`" :value="item[column.field]" :item="item">
              {{ item[column.field] }}
            </slot>
          </td>

          <td class="row" :style="{ width: columnWidths['actions'] || 'auto', maxWidth: columnWidths['actions'] || 'fit-content' }" v-if="actions">
            <slot name="actions" :item="item" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"

const props = defineProps({
  items: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  limit: { type: Number, default: 16 },
  count: { type: Number, default: 0 },
  images: { type: Boolean, default: false },
  actions: { type: Boolean, default: false },
  columnWidths: { type: Object, default: () => ({}) },
  range: { type: String, default: "" },
  page: { type: Number, default: 1 },
  hasNextPage: { type: Boolean, default: false },
  hasPrevPage: { type: Boolean, default: false }
})

const page = computed(() => `Page ${props.page}`)

const hasPrevPage = computed(() => props.hasPrevPage)
const hasNextPage = computed(() => props.hasNextPage)

const emit = defineEmits(["onPrev", "onNext"])

const searchQuery = ref("")
const sortField = ref(null)
const sortOrder = ref(0)

const filteredItems = computed(() => {
  return props.items
    .filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (!sortField.value) return 0
      return sortOrder.value * (a[sortField.value] > b[sortField.value] ? 1 : -1)
    })
})

const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value *= -1
  } else {
    sortField.value = field
    sortOrder.value = 1
  }
}

const prevPage = () => {
  if (filteredItems.value.length) {
    emit("onPrev", filteredItems.value[0])
  }
}

const nextPage = () => {
  if (filteredItems.value.length) {
    emit("onNext", filteredItems.value[filteredItems.value.length - 1])
  }
}
</script>

<style scoped>
.datatable {
  border: 1px solid var(--border-a);
  background: var(--background-a);
  transition: var(--transition-a);
  border-radius: var(--radius-a);
  font-size: var(--text-size-1);
  box-sizing: border-box;
  flex-direction: column;
  color: var(--text-a);
  min-height: 100vh;
  overflow: hidden;
  padding: 0.5rem;
  width: 100%;
}

.header {
  border-bottom: 1px solid var(--border-a);
  justify-content: space-between;
  box-sizing: border-box;
  width: inherit;
  padding: 1rem;
}

.header-left {
  width: 50%;
}

.header-right {
  width: 50%;
}

.pagination {
  font-size: var(--text-size-0);
  color: var(--text-b);
  white-space: nowrap;
  margin-left: auto;
}

.search {
  border-radius: var(--input-radius);
  border: 1px solid var(--border-a);
  background: var(--background-b);
  transition: var(--transition-a);
  padding: 0 0.75rem;
  width: 50%;
}

.search:hover {
  border: 1px solid var(--primary-a);
}

.search input {
  background: transparent;
  padding: var(--input-padding);
  min-width: 300px;
  width: inherit;
  border: none;
  outline: none;
}

.search input::placeholder {
  color: var(--text-b);
  opacity: var(--placeholder-opacity);
  font-size: var(--text-size-1);
}

.column {
  border-right: 1px solid var(--border-a);
  padding: 1rem 0.5rem;
  text-align: left;
  cursor: pointer;
}

.arrow {
  width: 0;
  height: 0;
  border-left: 3px solid transparent;
  border-right: 3px solid transparent;
  border-radius: 3px;
  margin: 1px;
  margin-left: 0.5rem;
}

.arrow.up.enabled {
  border-bottom: 3px solid currentColor;
}

.arrow.down.enabled {
  border-top: 3px solid currentColor;
}

.arrow.up {
  border-bottom: 3px solid rgba(0, 0, 0, 0.3);
}

.arrow.down {
  border-top: 3px solid rgba(0, 0, 0, 0.3);
}

.table {
  border-bottom: 1px solid var(--border-a);
  font-size: var(--text-size-0);
  border-collapse: collapse;
  border-spacing: 0rem;
  width: inherit;
  padding: 1rem;
}

.box {
  display: flex;
  align-items: center;
}

.label {
  margin-right: auto;
}

.sort {
  display: flex;
  flex-direction: column;
}

.row {
  padding: 1rem;
  max-width: 15rem;
  text-align: left;
  overflow-wrap: break-word;
  border-right: 1px solid var(--border-a);
}

.row.hidden {
  display: none;
}

.rows {
  border-top: 1px solid var(--border-a);
}

tbody tr:nth-child(odd) {
  background: var(--background-a);
}

tbody tr:nth-child(even) {
  background: var(--background-a);
}

.pagination {
  margin-right: 1rem;
}

.pagination span {
  margin: 0 0.5rem;
}

.image {}
</style>