<template>
    <ButtonSolid :label="label" :disabled="disabled" :loading="loading" @click="onClick" />
</template>

<script setup>
import { gql } from '@apollo/client/core'

const { $gatewayClient } = useNuxtApp()

const orderStore = useOrderStore()
const walletStore = useWalletStore()

const label = computed(() => 'Collect')

const loading = ref(false)

const disabled = computed(() => {
    const now = Date.now()

    const appealUntil = orderStore.shipping?.public?.appeal_until

    const rule1 = orderStore.state === 2 && now > Number(appealUntil)

    const rule2 = orderStore.state === 3

    if (!rule1 && !rule2) {
        return true
    }

    if (loading.value === true) {
        return true
    }

    return false
})

const onClick = async () => {
    if (!import.meta.client) return;

    const COLLECT_ENDPOINT_MUTATION = gql`
      mutation($collectEndpointVariable: CollectEndpointInput!) {
        collectEndpoint(collectEndpointInput: $collectEndpointVariable) {
          success
          data {
            cbor
          }
        }
      }
        
`

    try {
        loading.value = true

        const { data } = await $gatewayClient.mutate({
            mutation: COLLECT_ENDPOINT_MUTATION,
            variables: {
                collectEndpointVariable: {
                    order_id: orderStore.order.id
                }
            },
        });

        const response = data.collectEndpoint;

        const txHash = await walletStore.balanceTx(response.data.cbor)

        console.log(txHash)

        orderStore.showToast(`The transaction has been sent to the network. TxHash: ${txHash}`, 'success', 10_000)

        await sleep(30_000)

        loading.value = false
    } catch (err) {
        console.error('collectEndpoint:', err);
        orderStore.showToast(err, 'error', 10_000)
        loading.value = false
    }

}
</script>

<style lang="css" scoped></style>