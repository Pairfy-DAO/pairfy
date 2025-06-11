<template>
    <div class="card">
        <ToastComp ref="toastRef" />

        <div class="grid">

            <!--GRID-ROW-->

            <div class="grid-row">
                <div class="grid-title">
                    <span>Create</span>
                    <TipComp text="Fill in the fields with information about your product." position="right">
                        <span class="flex" style="margin-left: 0.5rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-circle-help-icon lucide-circle-help">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <path d="M12 17h.01" />
                            </svg>
                        </span>
                    </TipComp>
                </div>
                <div class="grid-subtitle">
                    Fill in the details to publish a new product.
                </div>
                <div class="grid-item">
                    <InputProductName v-model="productName" id="create-product-name"
                        @valid="productNameValid = $event.valid" />
                </div>
                <div class="grid-item">
                    <InputProductPrice v-model="productPrice" id="create-product-price"
                        @valid="productPriceValid = $event.valid" />
                    <InputProductSku v-model="productSku" id="create-product-sku"
                        @valid="productSkuValid = $event.valid" />
                </div>
                <div class="grid-item">
                    <InputProductModel v-model="productModel" id="create-product-model"
                        @valid="productModelValid = $event.valid" />
                    <InputProductBrand v-model="productBrand" id="create-product-brand"
                        @valid="productBrandValid = $event.valid" />
                </div>
            </div>

            <!--GRID-ROW-->

            <div class="grid-row">
                <div class="grid-title">
                    <span>Origin</span>

                    <TipComp
                        text="National or international location from where the supplier or seller ships the product to the buyer."
                        position="right">
                        <span class="flex" style="margin-left: 0.5rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-circle-help-icon lucide-circle-help">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <path d="M12 17h.01" />
                            </svg>
                        </span>
                    </TipComp>
                </div>
                <div class="grid-subtitle">
                    Data required for calculating shipping time.
                </div>

                <div class="grid-item">
                    <InputSelect v-model="productOrigin" label="Country" :options="countries"
                        @valid="productOriginValid = $event.valid">
                        <template #option="{ option }">
                            <span class="flex">
                                <img :src="`/flags/${option.code?.toLowerCase()}.svg`" alt="" class="flag" />
                                <span style="margin-left: 0.5rem; "> {{ option.label }}</span>
                            </span>
                        </template>
                    </InputSelect>

                    <InputProductCity v-model="productCity" id="create-product-city"
                        @valid="productCityValid = $event.valid" />
                </div>
                <div class="grid-item">
                    <InputProductPostal v-model="productPostal" id="create-product-postal"
                        @valid="productPostalValid = $event.valid" />
                </div>
            </div>

            <!--GRID-ROW-->

            <div class="grid-row">
                <div class="grid-title">
                    <span>Description</span>

                    <TipComp text="Provide as input everything you know about the product." position="right">
                        <span class="flex" style="margin-left: 0.5rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-circle-help-icon lucide-circle-help">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <path d="M12 17h.01" />
                            </svg>
                        </span>
                    </TipComp>
                </div>
                <div class="grid-subtitle">
                    Create a product description using the AI tool.
                </div>
                <div class="grid-item">
                    <EditorComp v-model="productDescription" @valid="onEditorChange" />
                </div>
            </div>

            <!--GRID-ROW-->

            <div class="grid-row">
                <div class="grid-title">
                    <span>Features</span>

                    <TipComp text="List displayed at the top of the product page." position="right">
                        <span class="flex" style="margin-left: 0.5rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-circle-help-icon lucide-circle-help">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <path d="M12 17h.01" />
                            </svg>
                        </span>
                    </TipComp>

                </div>
                <div class="grid-subtitle">
                    List of characteristics that are displayed with priority.
                </div>
                <div class="grid-item">
                    <InputProductBullet v-model="productBulletlist" @valid="productBulletlistValid = $event.valid" />
                </div>
            </div>

            <!--GRID-ROW-->

            <div class="grid-row">
                <div class="grid-title">
                    <span>Upload Images</span>

                    <TipComp text="Upload product images and select the main image." position="right">
                        <span class="flex" style="margin-left: 0.5rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-circle-help-icon lucide-circle-help">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <path d="M12 17h.01" />
                            </svg>
                        </span>
                    </TipComp>
                </div>
                <div class="grid-subtitle">
                    Please upload product images — maximum size: 5 MB, recommended dimensions: 500×500 pixels.
                </div>
                <UploadImagesLocal v-model="productImages" @valid="onImagesChange" />
            </div>

            <!--GRID-ROW-->

            <div class="grid-row">
                <div class="grid-title">
                    <span>Upload Video</span>

                    <TipComp text="Upload a video to showcase your product." position="right">
                        <span class="flex" style="margin-left: 0.5rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-circle-help-icon lucide-circle-help">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <path d="M12 17h.01" />
                            </svg>
                        </span>
                    </TipComp>

                </div>
                <div class="grid-subtitle">
                    Optionally, upload a single video highlighting the product’s features.
                </div>
            </div>

            <!--GRID-ROW-->

            <div class="grid-row">
                <div class="grid-title">
                    <span>Details</span>

                    <TipComp text="Configure product details." position="right">
                        <span class="flex" style="margin-left: 0.5rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-circle-help-icon lucide-circle-help">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <path d="M12 17h.01" />
                            </svg>
                        </span>
                    </TipComp>
                </div>
                <div class="grid-subtitle">
                    Configure product details.
                </div>

                <div class="grid-item">
                    <InputSelect v-model="productCategory" :options="categories" label="Category"
                        @valid="productCategoryValid = $event.valid">
                        <template #option="{ option }">
                            <span class="flex">
                                <span>{{ option.label }}</span>
                            </span>
                        </template>
                    </InputSelect>

                    <InputProductCondition v-model="productCondition" @valid="productConditionValid = $event.valid" />
                </div>

                <div class="grid-item">
                    <InputProductColor v-model="productColor" @valid="productColorValid = $event.valid" />
                </div>
            </div>

            <!--GRID-ROW-->

            <div class="grid-row">
                <div class="grid-title">
                    <span>Discount</span>

                    <TipComp text="Discount" position="right">
                        <span class="flex" style="margin-left: 0.5rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-circle-help-icon lucide-circle-help">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <path d="M12 17h.01" />
                            </svg>
                        </span>
                    </TipComp>
                </div>

                <div class="grid-subtitle">
                    Apply a percentage discount to the price.
                </div>

                <div class="grid-item">
                    <InputProductDiscount v-model="productDiscount" />
                </div>
            </div>

            <!--GRID-ROW-->

            <div class="grid-row">
                <div class="grid-title">
                    Publication
                </div>
                <div class="grid-subtitle">
                    Publish your product.
                </div>

                <div class="grid-item">
                    <ButtonSolid label="Publish" @click="onCreateProduct" :loading="loading" />
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import categoryList from '@/assets/json/categories.json'
import countryList from '@/assets/json/countries.json'
import { gql } from 'graphql-tag'

const toastRef = ref(null);

const categories = computed(() =>
    Object.values(categoryList).map(category => ({
        label: category.label,
        code: category.code,
    }))
)

const loading = ref(false)

const countries = ref(countryList)

const productName = ref(null)
const productNameValid = ref(false)

const productPrice = ref(null)
const productPriceValid = ref(false)

const productSku = ref(null)
const productSkuValid = ref(false)

const productModel = ref(null)
const productModelValid = ref(false)

const productBrand = ref(null)
const productBrandValid = ref(false)

const productOrigin = ref(null)
const productOriginValid = ref(false)

const productCity = ref(null)
const productCityValid = ref(false)

const productPostal = ref(null)
const productPostalValid = ref(false)

const productDescription = ref(null)
const productDescriptionHTML = ref(null)
const productDescriptionValid = ref(false)

const onEditorChange = (event) => {
    productDescriptionValid.value = event.valid
    productDescriptionHTML.value = event.value
}

const productBulletlist = ref([])
const productBulletlistValid = ref(false)

const productCategory = ref(null)
const productCategoryValid = ref(false)

const productCondition = ref(null)
const productConditionValid = ref(false)

const productColor = ref('#000000')
const productColorValid = ref(false)

const productDiscount = ref({
    enabled: false,
    price: productPrice.value,
    discount: 0,
})

watch(productPrice, (newPrice) => {
    productDiscount.value.price = newPrice
})

const productImages = ref([])
const productImagesValid = ref(false)
const productImagesPosition = ref([])

const onImagesChange = (event) => {
    /* TEST

    const areEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) {
            return false;
        }

        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }

        return true;
    };

    console.log("imagesCoherence", areEqual(productImages.value.map((e) => e.id), event.value.positions))
 */

    productImagesPosition.value = event.value.positions
    productImagesValid.value = event.valid
}

const { $productClient } = useNuxtApp()

const CREATE_PRODUCT_MUTATION = gql`
  mutation($createProductVariable: CreateProductInput!) {
    createProduct(createProductInput: $createProductVariable) {
      success
      message
      data {
        product_id
      }
    }
  }
`

const onCreateProduct = async () => {
    if (import.meta.server) return;

    loading.value = true

    if (!isValidParams()) {
        const paramErrorMessage = `Some required details are missing. Please ensure all mandatory fields — such as product images, category, and description — are properly filled out before submitting.`
        loading.value = false
        return displayMessage(paramErrorMessage, 'error', 30_000)
    }

    try {

        const uploadMedia = await useUploadMedia(productImages.value)

        if (!uploadMedia || !uploadMedia.success) {
            return displayMessage('Image upload failed. Please try again.', 'error', 30_000)
            
        }

        const createProductVariable = {
            name: productName.value,
            price: productPrice.value,
            sku: productSku.value,
            model: productModel.value,
            brand: productBrand.value,
            description: productDescriptionHTML.value,
            category: productCategory.value,
            bullet_list: productBulletlist.value,
            color: productColor.value,
            condition_: productCondition.value,
            origin: productOrigin.value,
            city: productCity.value,
            postal: productPostal.value,
            discount: productDiscount.value.enabled,
            discount_percent: productDiscount.value.discount,
            media_group_id: uploadMedia.data.media_group_id,
            file_ids: uploadMedia.data.file_ids,
        }

        try {
            const { data } = await $productClient.mutate({
                mutation: CREATE_PRODUCT_MUTATION,
                variables: {
                    createProductVariable
                }
            })

            displayMessage(data?.createProduct.message, 'success', 30_000)
        } catch (err) {
            console.error('Error creating the product:', err)
            displayMessage(err, 'error', 30_000)
        }

    } catch (err) {
        console.error('Error during product creation:', err)
        displayMessage(err?.message || 'Product creation failed.', 'error', 30_000)
    } finally {
        loading.value = false
    }
}

function isValidParams() {
    const params = [
        productNameValid.value,
        productPriceValid.value,
        productSkuValid.value,
        productModelValid.value,
        productBrandValid.value,
        productOriginValid.value,
        productCityValid.value,
        productPostalValid.value,
        productDescriptionValid.value,
        productImagesValid.value,
        productBulletlistValid.value,
        productCategoryValid.value,
        productConditionValid.value,
        productColorValid.value
    ]

    console.log(params)

    return !params.includes(false)
}

function displayMessage(message, type, duration) {
    toastRef.value?.showToast(message, type, duration)
}

</script>

<style lang="css" scoped>
.card {
    width: 100%;
    display: flex;
    padding-top: 1rem;
    justify-content: center;
}

.grid {
    grid-template-columns: 1fr;
    max-width: 70%;
    width: inherit;
    display: grid;
    gap: 0rem;
}

.grid-title {
    font-size: var(--text-size-3);
    align-items: center;
    font-weight: bold;
    display: flex;
}

.grid-subtitle {
    font-size: var(--text-size-1);
    color: var(--text-b);
    margin-bottom: 2rem;
    margin-top: 0.5rem;
}

.grid-item {
    align-items: center;
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
}

.grid-row {
    background: var(--background-a);
    border-radius: var(--radius-a);
    box-shadow: var(--shadow-a);
    margin-bottom: 1rem;
    padding: 1.5rem;
}

@media (max-width: 768px) {
    .grid {
        grid-template-columns: 1fr;
    }
}
</style>