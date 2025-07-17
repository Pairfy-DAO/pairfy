<template>
    <ButtonSolid :label="label" :disabled="disabled" :loading="loading" @click="onClick" />
</template>

<script setup>
import { gql } from '@apollo/client/core'

const { $gatewayClient } = useNuxtApp()

const orderStore = useOrderStore()
const walletStore = useWalletStore()

const label = computed(() => `Accept ${orderStore.countdown}`)

const loading = ref(false)

const disabled = computed(() => {
    if (orderStore.countdown === '00:00') {
        return true
    }

    if (orderStore.state !== 0) {
        return true
    }

    if (loading.value === true) {
        return true
    }

    return false
})

const onClick = async () => {
    if (!import.meta.client) return;

    const LOCKING_ENDPOINT_MUTATION = gql`
      mutation($lockingEndpointVariable: LockingEndpointInput!) {
        lockingEndpoint(lockingEndpointInput: $lockingEndpointVariable) {
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
            mutation: LOCKING_ENDPOINT_MUTATION,
            variables: {
                lockingEndpointVariable: {
                    order_id: orderStore.order.id
                }
            },
        });

        const response = data.lockingEndpoint;

        const txHash = await walletStore.balanceTx(response.data.cbor)

        console.log(txHash)

        orderStore.showToast(`The transaction has been sent to the network. TxHash: ${txHash}`, 'success', 10_000)
        
        await sleep(120_000)
        
        loading.value = false
    } catch (err) {
        console.error('lockingEndpoint:', err);
        orderStore.showToast(err, 'error', 10_000)
        loading.value = false
    } 

}
</script>

<style lang="css" scoped></style>