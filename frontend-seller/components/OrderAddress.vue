<template>
    <div class="OrderAddress">

        <div class="OrderAddress-body">
            {{ orderStore.address }}
            <button @click="onShow">Show</button>
        </div>
    </div>
</template>

<script setup>
import { z } from 'zod';
import { decryptMessageWithPrivateKey, decompress } from '@pairfy/common-f';
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
    n: sanitizedString,
    a: sanitizedString,
    p: sanitizedString,
});

const onShow = async () => {
    try {

        const parsedData = JSON.parse(orderStore.address);

        const result = metadataSchema.safeParse(parsedData)

        if (!result.success) {
            console.error("Validation failed:", result.error.treeifyError())
        } else {
            const encrypted = result.data[0].json_metadata.msg.join('')

            console.log(encrypted)

            const privateKeyB64 = await decryptAESGCM(orderStore.encryptedPrivateKey, 'Password123@')

            console.log(privateKeyB64)

            const decriptedAddress = await decryptMessageWithPrivateKey(privateKeyB64, encrypted)

            console.log(decriptedAddress)

            const decompressed = decompress(decriptedAddress)

            console.log(JSON.parse(decompressed))

            const verifyFormat = addressSchema.safeParse(JSON.parse(decompressed))

            if (!verifyFormat.success) {

                console.error("Validation failed:", z.treeifyError(verifyFormat.error))
            } else {
                console.log(verifyFormat.data)
            }
        }
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