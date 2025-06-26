<template>
    <div class="card">
        <ToastComp ref="toastRef" />

        <div class="grid">

            <!--GRID-ROW-->

            <div class="grid-row">
                <div class="grid-title">
                    <span>Edit</span>
                    <TipComp text="Edit the details of your product below." position="right">
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
                        placeholder="e.g. Wireless Headphones" @valid="productNameValid = $event.valid" />
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

                        <template #selected="{ option }">
                            <span class="flex">
                                <img class="flag" :src="`/flags/${option.code?.toLowerCase()}.svg`" alt="" />
                                <span style="margin-left: 0.5rem; "> {{ option.label }}</span>
                            </span>
                        </template>


                        <template #option="{ option }">
                            <span class="flex">
                                <img class="big-flag" :src="`/flags/${option.code?.toLowerCase()}.svg`" alt="" />
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
                    <EditorComp v-model="productDescription" :htmlContent="productDescriptionHTML"
                        @valid="onEditorChange" />
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

                <UploadImagesEdit v-model="productImages" @valid="onImagesChange" />
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
                        <template #selected="{ option }">
                            <span>{{ option.label }}</span>
                        </template>

                        <template #option="{ option }">
                            <span>{{ option.label }}</span>
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
                    Save changes to apply updates to your product.
                </div>

                <div class="grid-item">
                    <ButtonSolid label="Save" @click="onApplyChanges" :loading="loading" />
                </div>
            </div>


        </div>
    </div>
</template>

<script setup>
import categoryList from '@/assets/json/categories.json'
import countryList from '@/assets/json/countries.json'
import { gql } from 'graphql-tag'

const route = useRoute()

const toastRef = ref(null);

const categories = computed(() =>
    Object.values(categoryList).map(category => ({
        label: category.label,
        code: category.code,
    }))
)

const loading = ref(false)

const countries = ref(countryList)

const productData = ref(null)

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

const productImages = ref([])
const productImagesValid = ref(false)
const productImagesPosition = ref([])

const onImagesChange = (event) => {
    console.log(productImages.value.map((e) => {
        return {
            id: e.id,
            local: e.local
        }
    }))

    productImagesPosition.value = event.value.positions
    productImagesValid.value = event.valid
}

const productDiscount = ref({
    enabled: false,
    price: productPrice.value,
    discount: 0
})

watch(productPrice, (newPrice) => {
    productDiscount.value.price = newPrice
})

const { $productClient } = useNuxtApp()

const getProductError = ref(null)

const GET_PRODUCT_QUERY = gql`
  query GetProduct($getProductVariable: GetProductInput!) {
    getProduct(getProductInput: $getProductVariable) {
        product {
          id
          group_id
          media_group_id
          media_position
          status
          moderated
          thumbnail_url
          name
          price
          sku
          model
          brand
          description
          category
          bullet_list
          color
          condition_
          country
          origin
          city
          postal
          discount
          discount_value
          discount_percent
          created_at
        }

        media {
          id  
          media_group_id  
          product_id  
          mime_type  
          position  
          alt_text  
          resolutions  
          created_at  
          updated_at  
        }
          
    }
  }
`;

watch(
    () => route.query.id,
    (id) => fetchProduct(id)
    , { immediate: true })

onMounted(() => {
    if (getProductError.value) {
        console.error('Error fetching the product:', getProductError.value)
        displayMessage('The product could not be loaded. Please try again later.' + getProductError.value, 'error', 10_000)
    }
})

const EDIT_PRODUCT_MUTATION = gql`
  mutation($editProductVariable: EditProductInput!) {
    editProduct(editProductInput: $editProductVariable) {
      success
      message
    }
  }
`

async function onApplyChanges() {
    if (import.meta.server) return;

    loading.value = true

    if (!isValidParams()) {
        const paramErrorMessage = `Some required details are missing. Please ensure all mandatory fields — such as product images, category, and description — are properly filled out before submitting.`
        loading.value = false
        return displayMessage(paramErrorMessage, 'error', 30_000)
    }

    try {
        const MEDIA = {
            mediaGroupId: productData.value.media_group_id,
            fileIds: [...productImages.value.map((e) => e.id)]
        };

        const localImages = productImages.value.filter(item => item.local === true);

        if (localImages.length) {

            const uploadMedia = await useUpdateMedia(localImages, MEDIA.mediaGroupId)

            if (!uploadMedia || !uploadMedia.success) {
                return displayMessage('Image uploadMedia failed. Please try again.', 'error', 30_000)
            }

            MEDIA.fileIds = replaceOldIdsWithNew(
                MEDIA.fileIds,
                uploadMedia.data.old_ids,
                uploadMedia.data.file_ids
            );
        }

        const editProductVariable = {
            id: productData.value.id,
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
            media_group_id: MEDIA.mediaGroupId,
            file_ids: MEDIA.fileIds
        }

        try {
            const { data } = await $productClient.mutate({
                mutation: EDIT_PRODUCT_MUTATION,
                variables: {
                    editProductVariable
                }
            })

            displayMessage(data?.editProduct.message, 'success', 10_000)
        } catch (err) {
            console.error('Error editing the product:', err)
            displayMessage(err, 'error', 30_000)
        }
    } catch (err) {
        console.error('Error during product creation:', err)
        displayMessage(err?.message || 'Product creation failed.', 'error', 30_000)
    } finally {
        loading.value = false
    }
}

async function fetchProduct(id) {
    if (import.meta.server) return;

    try {
        const { data } = await $productClient.query({
            query: GET_PRODUCT_QUERY,
            variables: {
                getProductVariable: {
                    id
                }
            },
            fetchPolicy: 'no-cache'
        })

        const product = data.getProduct.product
        const media = data.getProduct.media

        productData.value = product
        productName.value = product.name
        productPrice.value = product.price
        productSku.value = product.sku
        productModel.value = product.model
        productBrand.value = product.brand
        productOrigin.value = product.origin
        productCity.value = product.city
        productPostal.value = product.postal
        productImages.value = media
        productDescriptionHTML.value = product.description.html
        productBulletlist.value = product.bullet_list
        productCategory.value = product.category
        productCondition.value = product.condition_
        productColor.value = product.color

        productDiscount.value.enabled = product.discount
        productDiscount.value.discount = product.discount_percent


    } catch (err) {
        console.log(err)
        getProductError.value = err
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

function replaceOldIdsWithNew(media, oldIds, fileIds) {
    const replacementMap = new Map();

    oldIds.forEach((oldId, i) => {
        replacementMap.set(oldId, fileIds[i]);
    });

    console.log("replacement", Array.from(replacementMap));

    return media.map(id =>
        replacementMap.has(id) ? replacementMap.get(id) : id
    );
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
    max-width: 1100px;
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
    border-radius: var(--radius-b);
    box-shadow: var(--shadow-a);
    margin-bottom: 1rem;
    padding: 1.5rem;
}

@media (max-width: 768px) {
    .grid {
        grid-template-columns: 1fr;
    }
}

.flag {
    width: 1rem;
}

.big-flag {
    width: 1.5rem;
}
</style>