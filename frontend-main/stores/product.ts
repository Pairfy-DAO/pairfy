export const useProductStore = defineStore("product", () => {
  type ToastType = "success" | "error" | "info" | "default";

  type ToastMessage = {
    message: string;
    type: ToastType;
    duration: number;
  };

  const product = ref(null);
  const media = ref([]);

  const cardanoDialog = ref(true);
  const price = ref<number | null>(null);

  const toastMessage = ref<ToastMessage | null>(null);

  const showToast = (message: string, type: ToastType, duration: number) => {
    toastMessage.value = {
      message,
      type,
      duration,
    };
  };

  function showCardanoDialog(value: boolean) {
    cardanoDialog.value = value;
  }

  function setProductData(data: any) {
    const { product: productData, media: mediaData } = data;

    product.value = productData;
    media.value = mediaData;
    price.value = productData.discount ? productData.discount_value : productData.price;
  }

  function clear() {
    product.value = null;
    media.value = [];
  }

  return {
    product,
    media,
    clear,
    setProductData,
    toastMessage,
    showCardanoDialog,
    cardanoDialog,
    showToast,
    price,
  };
});
