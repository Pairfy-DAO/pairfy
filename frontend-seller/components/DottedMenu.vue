<template>
    <div class="menu">
        <ButtonRounded @click="onClick" ref="overlayRef">
            <template #content>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-vertical-icon lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </template>
        </ButtonRounded>
        <div class="overlay" v-if="visible">
            <div class="overlay-item flex" v-for="item in props.options" :key="item.label"
                @click="onSelected(item.value)">
                {{ item.label }}
            </div>
        </div>
    </div>
</template>

<script setup>
import ButtonRounded from '@/components/ButtonRounded.vue';
import { onClickOutside } from "@vueuse/core";

const props = defineProps(['options', 'value'])

const emit = defineEmits(['onSelected']);

const visible = ref(false);

const onClick = () => {
    visible.value = !visible.value
}

const overlayRef = ref(null);

onClickOutside(overlayRef, () => {
    visible.value = false;
});

const onSelected = (value) => {

    emit('onSelected', value, props.value)
}
</script>

<style lang="css" scoped>
.menu {
    position: relative;
}

.overlay {
    border: 1px solid var(--border-a);
    background: var(--background-a);
    box-shadow: var(--shadow-c);
    position: absolute;
    min-width: 100px;
    right: 0;
    z-index: 2;
    top: 40px;
    border-radius: 6px;
}

.overlay-item {
    padding: 1rem;
    cursor: pointer;
    white-space: nowrap;
    font-weight: 500;
    font-size: var(--text-size-0);
}

.overlay-item:hover {
    background: var(--background-b);
}
</style>