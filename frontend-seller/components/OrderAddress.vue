<template>
    <div class="OrderAddress">

        <div class="OrderAddress-body">
            <button @click="onShow">Show</button>
        </div>
    </div>
</template>

<script setup>
import { decryptMessageWithPrivateKey, decryptAESGCM, decompress } from '@pairfy/common-f';
import { z } from 'zod';
import DOMPurify from 'dompurify';

const orderStore = useOrderStore()

const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/

const metadataSchema = z.array(
    z.object({
        label: z.literal("674"),
        json_metadata: z.object({
            msg: z
                .array(
                    z
                        .string()
                        .max(100, { message: "Each chunk must be at most 100 characters long." })
                        .refine((str) => base64Regex.test(str), {
                            message: "The chunk is not a valid base64 string.",
                        })
                )
                .nonempty({ message: "msg must not be empty." })
        })
    })
)

const sanitizedString = z
    .string()
    .min(1, "Wrong format")
    .max(300, "Wrong format")
    .transform((val) => DOMPurify.sanitize(val.trim(), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    }));

const addressSchema = z.strictObject({
    r: sanitizedString,
    n: sanitizedString.optional(),
    a: sanitizedString,
    p: sanitizedString.optional(),
});

const onShow = async () => {
    try {
        if (!orderStore.address) {
            throw new Error('Empty address')
        }

        const validation1 = metadataSchema.safeParse(JSON.parse(orderStore.address))

        if (!validation1.success) {
            throw new Error(`Invalid metadata format ${z.treeifyError(validation1.error)}`)
        }

        const unchunked = validation1.data[0].json_metadata.msg.join('')

        const privateKeyB64 = await decryptAESGCM(orderStore.encryptedPrivateKey, 'Password123@')

        const compressed = decryptMessageWithPrivateKey(privateKeyB64, unchunked)

        const decompressed = decompress(compressed)

        const validation2 = addressSchema.safeParse(JSON.parse(decompressed))

        if (!validation2.success) {
            throw new Error(`Invalid metadata format ${z.treeifyError(validation2.error)}`)
        } 
        
        console.log(validation2.data)

    } catch (err) {
        console.error(err)
    }
}
</script>

<style lang="css" scoped>
.OrderAddress {
    width: 100%;
}

.OrderAddress-body {
    width: 428px;
    height: 142px;
    padding: 1rem;
    margin-top: 1rem;
    overflow: hidden;
    margin-left: auto;
    box-sizing: border-box;
    border-radius: var(--radius-d);
    transition: var(--transition-a);
    border: 2px solid var(--border-a);
}
</style>