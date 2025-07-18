<template>
    <DialogComp v-model="dialogView" @update:modelValue="dialogView = $event" :modalClose="false">
        <DispatchView  @loading="(e) => loading = e" />
    </DialogComp>

    <ButtonSolid :label="label" :disabled="disabled" :loading="loading" @click="onClick" />
</template>

<script setup>
const orderStore = useOrderStore()

const label = computed(() => 'Dispatch')

const dialogView = ref(true)

const loading = ref(false)

const disabled = computed(() => {
    if (orderStore.countdown === '00:00') {
        return true
    }

    if (orderStore.state !== 1) {
        return true
    }

    if (loading.value === true) {
        return true
    }

    return false
})

const onClick = () => {
    dialogView.value = !dialogView.value
}


</script>

<style lang="css" scoped></style>