<template>
    <DialogComp v-model="dialogView" @update:modelValue="dialogView = $event" :modalClose="true">
        <DispatchView />
    </DialogComp>

    <ButtonSolid :label="label" :disabled="disabled" :loading="loading" @click="onClick" />
</template>

<script setup>
import { gql } from '@apollo/client/core'

const { $gatewayClient } = useNuxtApp()

const orderStore = useOrderStore()
const walletStore = useWalletStore()

const label = computed(() => 'Dispatch')

const loading = ref(false)

const dialogView = ref(true)

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

const onSubmit = async () => {
    if (!import.meta.client) return;

    const SHIPPING_ENDPOINT_MUTATION = gql`
      mutation($shippingEndpointVariable: ShippingEndpointInput!) {
        shippingEndpoint(shippingEndpointInput: $shippingEndpointVariable) {
          success
          data {
            cbor
          }
        }
      }
        
`

    try {
        loading.value = true

        const deliveryDate = Date.now() + 1000

        const scheme = {
            order_id: orderStore.order.id,
            date: deliveryDate.toString(),
            guide: '8787878',
            website: 'http',
            notes: 'notes',
        }

        const { data } = await $gatewayClient.mutate({
            mutation: SHIPPING_ENDPOINT_MUTATION,
            variables: {
                shippingEndpointVariable: scheme
            },
        });

        const response = data.shippingEndpoint;

        const txHash = await walletStore.balanceTx(response.data.cbor)

        console.log(txHash)

        orderStore.showToast(`The transaction has been sent to the network. TxHash: ${txHash}`, 'success', 10_000)

        await sleep(10_000)

        loading.value = false
    } catch (err) {
        console.error('shippingEndpoint:', err);
        orderStore.showToast(err, 'error', 10_000)
        loading.value = false
    }

}
</script>

<style lang="css" scoped></style>